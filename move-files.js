const fs = require('fs');
const path = require('path');

// Files to move
const filesToMove = {
    // HTML files
    'index.html': 'public/index.html',
    'login.html': 'public/login.html',
    'register.html': 'public/register.html',
    'admin.html': 'public/admin.html',
    'todays_deals.html': 'public/todays_deals.html',
    
    // CSS files
    'style.css': 'public/css/style.css',
    'auth.css': 'public/css/auth.css',
    'admin.css': 'public/css/admin.css',
    'todays_deals.css': 'public/css/todays_deals.css',
    
    // JS files
    'script.js': 'public/js/script.js',
    'auth.js': 'public/js/auth.js',
    'admin.js': 'public/js/admin.js',
    
    // Images
    'amazon_logo.png': 'public/images/amazon_logo.png',
    'logo2.png': 'public/images/logo2.png',
    'hero-image.jpg': 'public/images/hero-image.jpg',
    'box1-image.jpg': 'public/images/box1-image.jpg',
    'box2-image.jpg': 'public/images/box2-image.jpg',
    'box3-image.jpg': 'public/images/box3-image.jpg',
    'box4-image.jpg': 'public/images/box4-image.jpg',
    'box5-image.jpg': 'public/images/box5-image.jpg',
    'box6-image.jpg': 'public/images/box6-image.jpg',
    'box7-image.jpg': 'public/images/box7-image.jpg',
    'box8-image.jpg': 'public/images/box8-image.jpg',
    'memorialdaysale.png': 'public/images/memorialdaysale.png',
    'Td1.jpg': 'public/images/Td1.jpg',
    'td2.jpg': 'public/images/td2.jpg',
    'td3.jpg': 'public/images/td3.jpg',
    'td4.jpg': 'public/images/td4.jpg',
    'td5.jpg': 'public/images/td5.jpg',
    'td6.jpg': 'public/images/td6.jpg',
    'td7.jpg': 'public/images/td7.jpg',
    'td8.jpg': 'public/images/td8.jpg',
    'td9.jpg': 'public/images/td9.jpg',
    'td10.jpg': 'public/images/td10.jpg',
    'td11.jpg': 'public/images/td11.jpg',
    'td12.jpg': 'public/images/td12.jpg',
    'td13.jpg': 'public/images/td13.jpg',
    'td14.jpg': 'public/images/td14.jpg',
    'td15.jpg': 'public/images/td15.jpg',
    'td16.jpg': 'public/images/td16.jpg',
    'td17.jpg': 'public/images/td17.jpg',
    'td18.jpg': 'public/images/td18.jpg',
    'td19.jpg': 'public/images/td19.jpg',
    'td20.jpg': 'public/images/td20.jpg'
};

// Function to copy a file
function copyFile(source, destination) {
    try {
        // Create destination directory if it doesn't exist
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(source, destination);
        console.log(`Copied ${source} to ${destination}`);
    } catch (err) {
        console.error(`Error copying ${source} to ${destination}: ${err.message}`);
    }
}

// Copy all files
for (const [source, destination] of Object.entries(filesToMove)) {
    if (fs.existsSync(source)) {
        copyFile(source, destination);
    } else {
        console.warn(`Source file ${source} does not exist`);
    }
}

console.log('File copying complete');

// Update HTML files to reference the new file paths
const htmlFiles = [
    'public/index.html',
    'public/login.html',
    'public/register.html',
    'public/admin.html',
    'public/todays_deals.html'
];

const cssJsUpdates = [
    { from: 'style.css', to: 'css/style.css' },
    { from: 'auth.css', to: 'css/auth.css' },
    { from: 'admin.css', to: 'css/admin.css' },
    { from: 'todays_deals.css', to: 'css/todays_deals.css' },
    { from: 'script.js', to: 'js/script.js' },
    { from: 'auth.js', to: 'js/auth.js' },
    { from: 'admin.js', to: 'js/admin.js' }
];

// Update image paths in HTML and CSS files
const imageUpdates = [
    { from: 'amazon_logo.png', to: 'images/amazon_logo.png' },
    { from: 'logo2.png', to: 'images/logo2.png' },
    { from: 'hero-image.jpg', to: 'images/hero-image.jpg' },
    { from: 'box1-image.jpg', to: 'images/box1-image.jpg' },
    { from: 'box2-image.jpg', to: 'images/box2-image.jpg' },
    { from: 'box3-image.jpg', to: 'images/box3-image.jpg' },
    { from: 'box4-image.jpg', to: 'images/box4-image.jpg' },
    { from: 'box5-image.jpg', to: 'images/box5-image.jpg' },
    { from: 'box6-image.jpg', to: 'images/box6-image.jpg' },
    { from: 'box7-image.jpg', to: 'images/box7-image.jpg' },
    { from: 'box8-image.jpg', to: 'images/box8-image.jpg' },
    { from: 'memorialdaysale.png', to: 'images/memorialdaysale.png' },
    { from: 'Td1.jpg', to: 'images/Td1.jpg' },
    { from: 'td2.jpg', to: 'images/td2.jpg' },
    { from: 'td3.jpg', to: 'images/td3.jpg' },
    { from: 'td4.jpg', to: 'images/td4.jpg' },
    { from: 'td5.jpg', to: 'images/td5.jpg' },
    { from: 'td6.jpg', to: 'images/td6.jpg' },
    { from: 'td7.jpg', to: 'images/td7.jpg' },
    { from: 'td8.jpg', to: 'images/td8.jpg' },
    { from: 'td9.jpg', to: 'images/td9.jpg' },
    { from: 'td10.jpg', to: 'images/td10.jpg' },
    { from: 'td11.jpg', to: 'images/td11.jpg' },
    { from: 'td12.jpg', to: 'images/td12.jpg' },
    { from: 'td13.jpg', to: 'images/td13.jpg' },
    { from: 'td14.jpg', to: 'images/td14.jpg' },
    { from: 'td15.jpg', to: 'images/td15.jpg' },
    { from: 'td16.jpg', to: 'images/td16.jpg' },
    { from: 'td17.jpg', to: 'images/td17.jpg' },
    { from: 'td18.jpg', to: 'images/td18.jpg' },
    { from: 'td19.jpg', to: 'images/td19.jpg' },
    { from: 'td20.jpg', to: 'images/td20.jpg' }
];

// Function to update file paths in a file
function updateFilePaths(filePath, updates) {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`File ${filePath} does not exist`);
            return;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        updates.forEach(update => {
            const regex = new RegExp(`(["'])${update.from}(["'])`, 'g');
            if (content.match(regex)) {
                content = content.replace(regex, `$1${update.to}$2`);
                updated = true;
            }
        });
        
        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated paths in ${filePath}`);
        }
    } catch (err) {
        console.error(`Error updating paths in ${filePath}: ${err.message}`);
    }
}

// Update paths in HTML files
htmlFiles.forEach(htmlFile => {
    updateFilePaths(htmlFile, [...cssJsUpdates, ...imageUpdates]);
});

// Update paths in CSS files
const cssFiles = [
    'public/css/style.css',
    'public/css/auth.css',
    'public/css/admin.css',
    'public/css/todays_deals.css'
];

cssFiles.forEach(cssFile => {
    updateFilePaths(cssFile, imageUpdates);
});

console.log('Path updates complete');

// Update links between HTML files
const htmlLinkUpdates = [
    { from: 'index.html', to: 'index.html' },
    { from: 'login.html', to: 'login.html' },
    { from: 'register.html', to: 'register.html' },
    { from: 'admin.html', to: 'admin.html' },
    { from: 'todays_deals.html', to: 'todays_deals.html' }
];

htmlFiles.forEach(htmlFile => {
    updateFilePaths(htmlFile, htmlLinkUpdates);
});

console.log('HTML link updates complete'); 