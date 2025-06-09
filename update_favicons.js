const fs = require('fs');
const path = require('path');

// Function to update favicon references in HTML files
function updateFavicon(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Pattern to match existing favicon links
        const faviconPattern = /<link[^>]*(rel=["'](?:shortcut )?icon["']|rel=["']apple-touch-icon["'])[^>]*>|<meta[^>]*name=["']theme-color["'][^>]*>|<!-- Favicon -->/g;
        
        // Replace with our favicon include
        const faviconInclude = '    <!-- Favicon -->\n    <!--#include virtual="includes/favicon.html" -->';
        
        // Check if favicon include already exists
        if (content.includes('<!--#include virtual="includes/favicon.html" -->')) {
            console.log(`Skipping ${filePath} - already has favicon include`);
            return;
        }
        
        // Replace existing favicon tags or add if not found
        if (faviconPattern.test(content)) {
            content = content.replace(faviconPattern, '');
            content = content.replace('<head>', '<head>\n' + faviconInclude);
        } else {
            content = content.replace('<head>', '<head>\n' + faviconInclude);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated favicon in ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Find all HTML files
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and other non-essential directories
            if (file !== 'node_modules' && !file.startsWith('.')) {
                processDirectory(fullPath);
            }
        } else if (path.extname(file).toLowerCase() === '.html' && 
                  !file.endsWith('favicon.html') && // Skip the favicon include file
                  !fullPath.includes('node_modules')) {
            updateFavicon(fullPath);
        }
    });
}

// Start processing from the current directory
processDirectory(__dirname);
console.log('Favicon update complete!');
