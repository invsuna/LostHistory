# PowerShell script to update header and footer includes in all HTML files

# Path to the pages directory
$pagesDir = Join-Path -Path $PSScriptRoot -ChildPath "pages"

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "*.html" -Recurse -File

# Header and footer include content
$headerInclude = '    <!--#include virtual="../header.html" -->'
$footerInclude = '    <!--#include virtual="../footer.html" -->'
$scriptInclude = '    <script src="../../js/main.js"></script>'

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if header and footer includes already exist
    if ($content -notmatch '<!--#include virtual="\.\./header\.html" -->' -or 
        $content -notmatch '<!--#include virtual="\.\./footer\.html" -->') {
        
        Write-Host "Updating includes in $($file.FullName)"
        
        # Insert header after opening body tag
        $content = $content -replace '(?<=<body[^>]*>)\s*', "`n$headerInclude`n`n"
        
        # Insert footer before closing body tag
        $content = $content -replace '\s*(?=</body>)', "`n`n$footerInclude`n"
        
        # Add script include if not present
        if ($content -notmatch '<script.*src="\.\./js/main\.js">') {
            $content = $content -replace '(?=</body>)', "`n$scriptInclude`n"
        }
        
        # Save the updated content
        Set-Content -Path $file.FullName -Value $content -NoNewline
    } else {
        Write-Host "Skipping $($file.FullName) - already has includes"
    }
}

Write-Host "All files have been processed."
