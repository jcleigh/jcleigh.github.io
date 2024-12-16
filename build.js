const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, 'posts');
const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Function to generate top menu bar
function generateTopMenuBar() {
  return `
    <div class="title-bar">
      <div class="title-bar-text">Menu</div>
      <div class="title-bar-controls">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
      </div>
    </div>
  `;
}

// Read all markdown files from posts directory
fs.readdir(postsDir, (err, files) => {
  if (err) {
    console.error('Error reading posts directory:', err);
    return;
  }

  const posts = [];

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const htmlContent = marked(content);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <link rel="stylesheet" href="https://unpkg.com/98.css@0.1.0/dist/98.css">
      </head>
      <body>
        ${generateTopMenuBar()}
        <div class="window">
          <div class="title-bar">
            <div class="title-bar-text">${data.title}</div>
          </div>
          <div class="window-body">
            <p><em>By ${data.author} on ${data.date}</em></p>
            ${htmlContent}
          </div>
        </div>
      </body>
      </html>
    `;

    const outputFilePath = path.join(publicDir, file.replace('.md', '.html'));
    fs.writeFileSync(outputFilePath, html, 'utf-8');

    posts.push({ title: data.title, date: data.date, file: file.replace('.md', '.html') });
  });

  // Generate home page
  const homeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home</title>
      <link rel="stylesheet" href="https://unpkg.com/98.css@0.1.0/dist/98.css">
    </head>
    <body>
      ${generateTopMenuBar()}
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">Home</div>
        </div>
        <div class="window-body">
          <ul>
            ${posts.map(post => `<li><a href="${post.file}">${post.title}</a> - ${post.date}</li>`).join('')}
          </ul>
          <a href="about.html">About</a>
        </div>
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(publicDir, 'index.html'), homeHtml, 'utf-8');

  // Generate About page
  const aboutHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About</title>
      <link rel="stylesheet" href="https://unpkg.com/98.css@0.1.0/dist/98.css">
    </head>
    <body>
      ${generateTopMenuBar()}
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">About</div>
        </div>
        <div class="window-body">
          <p>This is the About page of the blog.</p>
          <a href="index.html">Home</a>
        </div>
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(publicDir, 'about.html'), aboutHtml, 'utf-8');
});
