const fs = require('fs');
const path = require('path');

// Function to update paths in a file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Calculate relative path to root
        const relativeDepth = filePath.split(path.sep).filter(p => p === 'pages').length + 1;
        const rootPath = '../'.repeat(relativeDepth - 1);
        
        // Update CSS and JS paths
        content = content.replace(/(href|src)="\/(?:LostHistory\/)?(css|js|images|pages)/g, `$1="${rootPath}$2`);
        
        // Update relative paths that might be missing the root
        content = content.replace(/(href|src)="([^"\/])(?![^"\/]*\.(css|js|png|jpg|jpeg|gif|svg|ico))/g, `$1="${rootPath}$2`);
        
        // Update paths that already have ../ but might need more
        content = content.replace(/(href|src)="\.\.\/([^"\/])/g, (match, p1, p2) => {
            return `${p1}="${rootPath}${p2}`;
        });
        
        // Fix header and footer includes
        content = content.replace(/<!--#include virtual="(.*?)" -->/g, (match, includePath) => {
            return `<!--#include virtual="${rootPath}${includePath}" -->`;
        });
        
        // Save the updated content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Function to process all HTML files in a directory
function processDirectory(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    files.forEach(file => {
        const fullPath = path.join(directory, file.name);
        
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.name.endsWith('.html')) {
            updateFile(fullPath);
        }
    });
}

// Start processing from the pages directory
const pagesDir = path.join(__dirname, 'pages');
processDirectory(pagesDir);

console.log('All pages have been updated with relative paths.');
