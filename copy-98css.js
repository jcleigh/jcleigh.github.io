const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'node_modules', '98.css', 'dist');
const targetDir = path.join(__dirname, 'public');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Files to copy
const filesToCopy = [
  '98.css',
  'ms_sans_serif.woff',
  'ms_sans_serif.woff2',
  'ms_sans_serif_bold.woff',
  'ms_sans_serif_bold.woff2'
];

console.log('Copying 98.css and font files to public directory...');

filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file}`);
  } else {
    console.warn(`Warning: ${file} not found in source directory`);
  }
});

console.log('Copy operation completed.');