const fs = require('fs');
const path = require('path');

// Function to update paths in a file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if not an HTML file
        if (!filePath.endsWith('.html')) return;
        
        console.log(`\nProcessing: ${filePath}`);
        
        // Calculate relative path to root (number of directories to go up)
        const depth = filePath.split(path.sep).indexOf('pages');
        const relativeDepth = filePath.split(path.sep).length - depth - 2;
        const rootPath = '../'.repeat(relativeDepth) || './';
        
        console.log(`  Depth: ${depth}, Relative path to root: ${rootPath}`);
        
        // Update CSS and JS paths
        content = content.replace(/(href|src)="([^"]*)"/g, (match, attr, url) => {
            // Skip external URLs and data URIs
            if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) {
                return match;
            }
            
            // Fix paths that already have ../ or ./
            if (url.startsWith('../') || url.startsWith('./')) {
                return `${attr}="${url}"`;
            }
            
            // Fix paths that start with / or /LostHistory/
            if (url.startsWith('/LostHistory/')) {
                url = url.replace(/^\/LostHistory\//, '');
            } else if (url.startsWith('/')) {
                url = url.substring(1);
            }
            
            // Add root path if not already present
            if (!url.startsWith(rootPath) && !url.startsWith('http')) {
                return `${attr}="${rootPath}${url}"`;
            }
            
            return match;
        });
        
        // Fix include paths
        content = content.replace(/<!--#include virtual="([^"]*)" -->/g, (match, includePath) => {
            if (includePath.startsWith('includes/')) {
                return `<!--#include virtual="${rootPath}${includePath}" -->`;
            }
            return match;
        });
        
        // Fix font paths
        content = content.replace(/url\(['"]?\/LostHistory\//g, 'url(../');
        content = content.replace(/url\(['"]?\//g, 'url(../');
        
        // Save the updated content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Function to process all files in a directory
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

console.log('\nAll pages have been updated with relative paths.');
