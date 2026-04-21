import * as ftp from "basic-ftp";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_PATH } = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_REMOTE_PATH) {
    console.error("Missing required environment variables in .env file. Deployment aborted.");
    process.exit(1);
}

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    
    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false
        });
        
        console.log(`Connected to ${FTP_HOST}`);

        // Ensure remote directory exists
        await client.ensureDir(FTP_REMOTE_PATH);
        
        // Clear existing files to ensure a clean sync
        await client.clearWorkingDir();
        
        // Upload the contents of the dist folder
        const localPath = path.join(__dirname, "../../dist");
        console.log(`Uploading from ${localPath} to ${FTP_REMOTE_PATH}...`);
        
        await client.uploadFromDir(localPath);
        
        console.log(`Deployment successful! Site live at https://www.fronta.hr${FTP_REMOTE_PATH.replace('/public_html', '')}/`);
    } catch (err) {
        console.error("Deployment failed:", err);
    } finally {
        client.close();
    }
}

deploy();
