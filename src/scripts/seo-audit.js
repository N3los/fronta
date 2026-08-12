import { promises as fs } from "node:fs";
import path from "node:path";

const projectDirectory = path.resolve(import.meta.dirname, "../..");
const distDirectory = path.join(projectDirectory, "dist");
const expectedOrigin = "https://fronta.hr";
const errors = [];

const report = (condition, message) => {
  if (!condition) errors.push(message);
};

const read = (filePath) => fs.readFile(filePath, "utf8");

const attribute = (html, tagPattern, name) => {
  const tag = html.match(tagPattern)?.[0];
  return tag?.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
};

const metaContent = (html, key, value) => {
  const tags = html.match(/<meta\s+[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) =>
    attribute(candidate, /<meta\s+[^>]*>/i, key) === value
  );
  return tag ? attribute(tag, /<meta\s+[^>]*>/i, "content") : undefined;
};

const linkHref = (html, rel, hreflang) => {
  const tags = html.match(/<link\s+[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => {
    if (attribute(candidate, /<link\s+[^>]*>/i, "rel") !== rel) return false;
    return hreflang
      ? attribute(candidate, /<link\s+[^>]*>/i, "hreflang") === hreflang
      : true;
  });
  return tag ? attribute(tag, /<link\s+[^>]*>/i, "href") : undefined;
};

const sitemapFiles = (await fs.readdir(distDirectory))
  .filter((name) => /^sitemap-\d+\.xml$/.test(name));

report(sitemapFiles.length > 0, "No generated sitemap URL file was found.");

const sitemapXml = (
  await Promise.all(sitemapFiles.map((name) => read(path.join(distDirectory, name))))
).join("\n");
const urls = [...sitemapXml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)]
  .map((match) => match[1]);

report(urls.length > 0, "The generated sitemap contains no URLs.");
report(
  urls.every((url) => url.startsWith(`${expectedOrigin}/`)),
  "The sitemap contains a URL outside the production origin."
);
report(
  urls.every((url) => !/\/(?:hr\/)?contact\/$/.test(new URL(url).pathname)),
  "The sitemap contains a redirect-only contact URL."
);
report(
  sitemapXml.includes('hreflang="en"') && sitemapXml.includes('hreflang="hr"'),
  "The sitemap is missing localized EN/HR alternate links."
);

const titles = new Map();
const descriptions = new Map();

for (const url of urls) {
  const pathname = new URL(url).pathname;
  const relativePath = pathname === "/"
    ? "index.html"
    : path.join(...pathname.split("/").filter(Boolean), "index.html");
  const htmlPath = path.join(distDirectory, relativePath);

  let html;
  try {
    html = await read(htmlPath);
  } catch {
    errors.push(`Sitemap URL has no generated HTML file: ${url}`);
    continue;
  }

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = metaContent(html, "name", "description");
  const googleVerification = metaContent(html, "name", "google-site-verification");
  const canonical = linkHref(html, "canonical");
  const robots = metaContent(html, "name", "robots");
  const ogImage = metaContent(html, "property", "og:image");
  const jsonLdBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const internalLinks = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//"));

  report(Boolean(title), `${url} is missing a title.`);
  report(!title || title.length <= 65, `${url} has a title longer than 65 characters.`);
  report(Boolean(description), `${url} is missing a meta description.`);
  report(Boolean(googleVerification), `${url} is missing Google Search Console verification.`);
  report(!description || description.length <= 170, `${url} has a meta description longer than 170 characters.`);
  report(h1Count === 1, `${url} should contain exactly one H1, found ${h1Count}.`);
  report(canonical === url, `${url} has an incorrect canonical URL: ${canonical ?? "missing"}`);
  report(Boolean(robots) && !robots.includes("noindex"), `${url} is not explicitly indexable.`);
  report(linkHref(html, "alternate", "en")?.startsWith(expectedOrigin), `${url} is missing its EN hreflang.`);
  report(linkHref(html, "alternate", "hr")?.startsWith(expectedOrigin), `${url} is missing its HR hreflang.`);
  report(linkHref(html, "alternate", "x-default")?.startsWith(expectedOrigin), `${url} is missing x-default hreflang.`);
  report(ogImage?.startsWith(expectedOrigin), `${url} is missing an absolute Open Graph image.`);
  report(jsonLdBlocks.length > 0, `${url} is missing JSON-LD structured data.`);
  report(!html.includes("localhost:"), `${url} contains a localhost reference.`);
  report(!html.includes(`${expectedOrigin}/2026/`), `${url} contains a former staging URL.`);

  for (const href of internalLinks) {
    const linkedPath = href.split(/[?#]/, 1)[0];
    const lastSegment = linkedPath.split("/").filter(Boolean).at(-1) ?? "";
    const looksLikeFile = lastSegment.includes(".");
    report(
      looksLikeFile || linkedPath.endsWith("/"),
      `${url} links to a non-canonical internal path: ${href}`
    );
  }

  for (const [, json] of jsonLdBlocks) {
    try {
      JSON.parse(json);
    } catch {
      errors.push(`${url} contains invalid JSON-LD.`);
    }
  }

  if (title) {
    const previous = titles.get(title);
    report(!previous, `${url} and ${previous} use the same title: ${title}`);
    titles.set(title, url);
  }

  if (description) {
    const previous = descriptions.get(description);
    report(!previous, `${url} and ${previous} use the same meta description.`);
    descriptions.set(description, url);
  }
}

const robotsText = await read(path.join(distDirectory, "robots.txt"));
report(
  robotsText.includes(`Sitemap: ${expectedOrigin}/sitemap-index.xml`),
  "robots.txt does not advertise the production sitemap."
);

try {
  const socialImage = await fs.stat(path.join(distDirectory, "og-default.png"));
  report(socialImage.size > 10_000, "The default social image appears to be empty or invalid.");
} catch {
  errors.push("The default social image is missing from the production build.");
}

for (const icon of ["favicon-32.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  try {
    const iconFile = await fs.stat(path.join(distDirectory, icon));
    report(iconFile.size > 500, `${icon} appears to be empty or invalid.`);
  } catch {
    errors.push(`${icon} is missing from the production build.`);
  }
}

const manifest = JSON.parse(await read(path.join(distDirectory, "site.webmanifest")));
const manifestIcons = new Set(manifest.icons?.map((icon) => icon.src));
report(manifestIcons.has("/icon-192.png"), "The web manifest is missing icon-192.png.");
report(manifestIcons.has("/icon-512.png"), "The web manifest is missing icon-512.png.");

if (errors.length > 0) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO audit passed for ${urls.length} production URLs.`);
