import * as ftp from "basic-ftp";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable, Writable } from "node:stream";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "../..");
const localDirectory = path.join(projectDirectory, "dist");
const manifestName = ".fronta-deploy-manifest.json";
const args = new Set(process.argv.slice(2));
const targetArg = [...args].find((arg) => arg.startsWith("--target="));
const target = targetArg?.split("=")[1];
const dryRun = args.has("--dry-run");
const productionConfirmed = args.has("--confirm-production");

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_REMOTE_PATH,
  FTP_PRODUCTION_PATH,
} = process.env;

const normalizeRemotePath = (value) => {
  const normalized = `/${String(value ?? "").trim().replaceAll("\\", "/")}`
    .replace(/\/{2,}/g, "/")
    .replace(/\/$/, "");
  return normalized || "/";
};

const stagingPath = normalizeRemotePath(FTP_REMOTE_PATH);
const inferredProductionPath = path.posix.basename(stagingPath) === "2026"
  ? path.posix.dirname(stagingPath)
  : undefined;
const productionPath = FTP_PRODUCTION_PATH
  ? normalizeRemotePath(FTP_PRODUCTION_PATH)
  : inferredProductionPath;
const remoteDirectory = target === "production" ? productionPath : stagingPath;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_PATH) {
  console.error("Missing FTP connection settings in .env. Deployment aborted.");
  process.exit(1);
}

if (!target || !["staging", "production"].includes(target)) {
  console.error("Choose an explicit deploy target: --target=staging or --target=production.");
  process.exit(1);
}

if (!remoteDirectory || remoteDirectory === "/") {
  console.error("The resolved remote target is missing or unsafe. Deployment aborted.");
  process.exit(1);
}

if (target === "production" && !dryRun && !productionConfirmed) {
  console.error("Production deployment requires --confirm-production.");
  process.exit(1);
}

async function walk(directory, root = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolutePath, root));
    } else if (entry.isFile()) {
      files.push({
        absolutePath,
        relativePath: path.relative(root, absolutePath).replaceAll(path.sep, "/"),
      });
    }
  }

  return files;
}

async function hashFile(filePath) {
  const contents = await fs.readFile(filePath);
  return {
    sha256: createHash("sha256").update(contents).digest("hex"),
    size: contents.byteLength,
  };
}

async function createManifest(files) {
  const manifest = { version: 1, files: {} };

  for (const file of files) {
    manifest.files[file.relativePath] = await hashFile(file.absolutePath);
  }

  return manifest;
}

async function downloadToBuffer(client, remotePath) {
  const chunks = [];
  const destination = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });

  await client.downloadTo(destination, remotePath);
  return Buffer.concat(chunks);
}

async function readRemoteManifest(client) {
  try {
    const contents = await downloadToBuffer(
      client,
      path.posix.join(remoteDirectory, manifestName),
    );
    const manifest = JSON.parse(contents.toString("utf8"));
    return manifest?.version === 1 && manifest.files ? manifest : undefined;
  } catch (error) {
    if (Number(error?.code) === 550) return undefined;
    throw error;
  }
}

function getUploadOrder(relativePath) {
  if (relativePath.startsWith("_astro/")) return 10;
  if (["robots.txt", "sitemap-index.xml", ".htaccess"].includes(relativePath)) return 50;
  if (!relativePath.endsWith(".html") && !relativePath.startsWith("sitemap-")) return 20;
  if (relativePath.endsWith("/index.html")) return 30;
  if (relativePath === "index.html") return 40;
  return 35;
}

async function createRollbackSnapshot(client, filesToUpload) {
  const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const backupDirectory = path.join(projectDirectory, ".deploy-backups", timestamp);
  let backedUp = 0;

  for (const file of filesToUpload) {
    const remotePath = path.posix.join(remoteDirectory, file.relativePath);
    const localPath = path.join(backupDirectory, ...file.relativePath.split("/"));

    try {
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await client.downloadTo(localPath, remotePath);
      backedUp += 1;
    } catch (error) {
      if (Number(error?.code) !== 550) throw error;
      await fs.rm(localPath, { force: true });
    }
  }

  if (backedUp === 0) {
    await fs.rm(backupDirectory, { recursive: true, force: true });
    return undefined;
  }

  return { backupDirectory, backedUp };
}

async function deploy() {
  const client = new ftp.Client(30_000);
  client.ftp.verbose = false;

  try {
    const localFiles = await walk(localDirectory);
    const localManifest = await createManifest(localFiles);

    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false,
    });

    const remoteManifest = await readRemoteManifest(client);
    const filesToUpload = localFiles
      .filter((file) => remoteManifest?.files?.[file.relativePath]?.sha256 !== localManifest.files[file.relativePath].sha256)
      .sort((a, b) => getUploadOrder(a.relativePath) - getUploadOrder(b.relativePath));
    const trackedFilesNoLongerLocal = Object.keys(remoteManifest?.files ?? {})
      .filter((relativePath) => !localManifest.files[relativePath]);
    const trackedFilesToDelete = target === "staging" ? trackedFilesNoLongerLocal : [];
    const rootEntries = await client.list(remoteDirectory);

    console.log(`Target: ${target}`);
    console.log(`Remote directory: ${remoteDirectory}`);
    console.log(`Local files: ${localFiles.length}`);
    console.log(`Files to upload: ${filesToUpload.length}`);
    console.log(`Previously tracked files to delete: ${trackedFilesToDelete.length}`);

    if (target === "production") {
      console.log("Production deletion policy: disabled. Existing files and directories are preserved.");
    }

    if (!remoteManifest) {
      console.log("No previous deployment manifest found. Existing untracked files will be preserved.");
    }

    console.log(`Existing top-level entries: ${rootEntries.map((entry) => entry.name).join(", ") || "none"}`);

    if (dryRun) {
      console.log("Dry run complete. No remote files were changed.");
      return;
    }

    const rollback = await createRollbackSnapshot(client, filesToUpload);
    if (rollback) {
      console.log(`Rollback snapshot: ${rollback.backedUp} file(s) saved to ${rollback.backupDirectory}`);
    }

    for (const file of filesToUpload) {
      const remotePath = path.posix.join(remoteDirectory, file.relativePath);
      await client.ensureDir(path.posix.dirname(remotePath));
      await client.uploadFrom(file.absolutePath, remotePath);
    }

    for (const relativePath of trackedFilesToDelete) {
      await client.remove(path.posix.join(remoteDirectory, relativePath), true);
    }

    await client.ensureDir(remoteDirectory);
    await client.uploadFrom(
      Readable.from([`${JSON.stringify(localManifest, null, 2)}\n`]),
      path.posix.join(remoteDirectory, manifestName),
    );

    console.log(`Deployment complete: https://fronta.hr${target === "staging" ? "/2026/" : "/"}`);
  } catch (error) {
    console.error("Deployment failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

deploy();
