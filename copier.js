const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const distPath = './dist';
const tizenPath = './tizen';
const contentModifyTimes = {};

function hasFileChanged(filePath) {
    const currentModifiedTime = fsSync.statSync(filePath).mtime.getTime();
    return currentModifiedTime !== contentModifyTimes[filePath];
}

function hasFolderChanged(folderPath) {
    const currentModifiedTime = fsSync.statSync(folderPath).mtime.getTime();
    return currentModifiedTime !== contentModifyTimes[folderPath];
}

async function copyFile(filePath, targetPath) {
    try {
        if (fsSync.existsSync(targetPath)) {
            await fs.unlink(targetPath);
        }
        await fs.copyFile(filePath, targetPath);
    } catch (error) {
        console.error(`Error copying file ${filePath}:`, error);
    }
}

async function copyFolder(folderPath, targetPath) {
    try {
        if (fsSync.existsSync(targetPath)) {
            await fs.rm(targetPath, { recursive: true, force: true });
        }
        await fs.cp(folderPath, targetPath, { recursive: true });
    } catch (error) {
        console.error(`Error copying folder ${folderPath}:`, error);
    }
}

async function copyContents() {
    let isCopied = false;
    
    try {
        // Check if dist directory exists
        if (!fsSync.existsSync(distPath)) {
            console.log('Dist directory does not exist');
            return;
        }

        // Ensure tizen directory exists
        if (!fsSync.existsSync(tizenPath)) {
            await fs.mkdir(tizenPath, { recursive: true });
        }
        
        const items = await fs.readdir(distPath);
        
        for (const item of items) {
            const itemPath = path.join(distPath, item);
            const stats = await fs.stat(itemPath);
            
            if (stats.isFile() && (!(itemPath in contentModifyTimes) || hasFileChanged(itemPath))) {
                const targetPath = path.join(tizenPath, item);
                await copyFile(itemPath, targetPath);
                contentModifyTimes[itemPath] = stats.mtime.getTime();
                console.log('File copied:', item);
                isCopied = true;
            } else if (stats.isDirectory() && (!(itemPath in contentModifyTimes) || hasFolderChanged(itemPath))) {
                const targetPath = path.join(tizenPath, item);
                await copyFolder(itemPath, targetPath);
                contentModifyTimes[itemPath] = stats.mtime.getTime();
                console.log('Folder copied:', item);
                isCopied = true;
            }
        }
        
        if (isCopied) {
            console.log('All files and folders copied successfully');
        }
    } catch (error) {
        console.error('Error copying contents:', error);
    }
}

async function main() {
    console.log('Starting copy operation...');
    await copyContents();
    console.log('Copy operation completed. Exiting.');
}

if (require.main === module) {
    main();
}

module.exports = { copyContents, copyFile, copyFolder };
