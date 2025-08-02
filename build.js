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

// Ensure styles.css is copied to public directory
const stylesSrc = path.join(__dirname, 'styles.css');
const stylesDest = path.join(publicDir, 'styles.css');
fs.copyFileSync(stylesSrc, stylesDest);

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
    const htmlContent = marked.parse(content);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <link rel="stylesheet" href="/98.css">
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
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

    posts.push({ title: data.title, date: data.date, file: file.replace('.md', '.html'), content: htmlContent });
  });

  // Generate home page
  const homeHtml = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>jcleigh's blog</title>
      <link rel="stylesheet" href="/98.css">
      <link rel="stylesheet" href="styles.css">
    </head>

    <body>
      <div id="info" class="window main-window">
        <div id="title-bar" class="title-bar">
          <div class="title-bar-text"><img src="help_book_big-1.png" height="12px"/> Information</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close" disabled></button>
          </div>
        </div>
        <div class="window-body">
          <p>Name: Jordan Cleigh</p>
          <p>Occupation: Staff Software Engineer @ <a href="https://fmgsuite.com" target="_blank">FMG</a></p>
          <p>Topics: Technology, Software Engineering, Music Production</p>
        </div>
        <div class="status-bar">
          <p class="status-bar-field"><a href="https://linkedin.com/in/jcleigh" target="_blank">LinkedIn</a></p>
          <p class="status-bar-field"><a href="https://github.com/jcleigh" target="_blank">GitHub</a></p>
          <p class="status-bar-field">Attributions</p> <!-- TODO: make a popup for icon and css attributions -->
        </div>
      </div>

      <div id="posts" class="window main-window">
        <div id="title-bar" class="title-bar">
          <div class="title-bar-text"><img src="directory_open_cabinet-0.png" height="12px"/> Posts</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close" disabled></button>
          </div>
        </div>
        <div class="window-body">
          <marquee>This blog is currently under construction. Please check back later for real content.</marquee>
          <p class="post-header">Recent Posts:</p>
          <ul>
            ${posts.map(post => `<li><a href="#" class="post-link" data-title="${post.title}" data-content="${encodeURIComponent(post.content)}">${post.title}</a> - ${post.date}</li>`).join('\r\n            ')}
          </ul>
        </div>
      </div>

      <div id="post-content" class="window main-window">
        <div class="title-bar">
          <div class="title-bar-text"><img src="notepad-0.png" height="12px"/> <span id="post-title">About</span></div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" onclick="document.getElementById('post-content').style.display='none'"></button>
          </div>
        </div>
        <div class="window-body" id="post-body">
          <p>Welcome to my blog! Here you will find posts about technology, software engineering, and music production. Stay tuned for more updates!</p>
        </div>
      </div>

      <!-- Windows 98 Taskbar -->
      <div id="taskbar">
        <button id="start-button">
          <span style="font-size: 12px;">🪟</span>
          Start
        </button>
        <div id="taskbar-buttons">
          <!-- Minimized windows will appear here -->
        </div>
        <div id="system-tray">
          <span id="clock"></span>
        </div>
      </div>

      <script>
        function makeDraggable(element) {
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          const titleBar = element.querySelector('.title-bar');
          if (titleBar) {
            titleBar.onmousedown = dragMouseDown;
          }

          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Calculate new position
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // Constrain to viewport bounds and avoid taskbar
            const taskbarHeight = 32; // Taskbar height + small margin
            const maxTop = window.innerHeight - element.offsetHeight - taskbarHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            
            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
          }

          function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
          }
        }

        let postWindowCounter = 0;
        
        function createPostWindow(title, content) {
          postWindowCounter++;
          const windowId = 'post-window-' + postWindowCounter;
          
          // Create the new window element
          const postWindow = document.createElement('div');
          postWindow.id = windowId;
          postWindow.className = 'window main-window';
          postWindow.style.top = (10 + (postWindowCounter * 30)) + 'px';
          postWindow.style.left = (426 + (postWindowCounter * 30)) + 'px';
          postWindow.style.width = '800px';
          postWindow.style.height = '600px';
          
          postWindow.innerHTML = 
            '<div class="title-bar">' +
              '<div class="title-bar-text"><img src="notepad-0.png" height="12px"/> <span>' + title + '</span></div>' +
              '<div class="title-bar-controls">' +
                '<button aria-label="Minimize"></button>' +
                '<button aria-label="Maximize"></button>' +
                '<button aria-label="Close"></button>' +
              '</div>' +
            '</div>' +
            '<div class="window-body">' +
              content +
            '</div>';
          
          // Add to body
          document.body.appendChild(postWindow);
          
          // Make draggable
          makeDraggable(postWindow);
          
          // Add event listeners for controls
          const minimizeBtn = postWindow.querySelector('button[aria-label="Minimize"]');
          const maximizeBtn = postWindow.querySelector('button[aria-label="Maximize"]');
          const closeBtn = postWindow.querySelector('button[aria-label="Close"]');
          
          minimizeBtn.addEventListener('click', () => minimizeWindow(postWindow));
          
          maximizeBtn.addEventListener('click', (e) => {
            postWindow.classList.toggle('maximized');
            if (postWindow.classList.contains('maximized')) {
              e.target.setAttribute('aria-label', 'Restore');
            } else {
              e.target.setAttribute('aria-label', 'Maximize');
            }
          });
          
          closeBtn.addEventListener('click', () => {
            postWindow.remove();
          });
          
          return postWindow;
        }

        function minimizeWindow(windowElement) {
          // Hide the window
          windowElement.style.display = 'none';
          
          // Get window info
          const titleElement = windowElement.querySelector('.title-bar-text');
          const windowTitle = titleElement ? titleElement.textContent.trim() : 'Window';
          const windowId = windowElement.id;
          
          // Get the icon from the title bar
          const iconElement = titleElement ? titleElement.querySelector('img') : null;
          const iconSrc = iconElement ? iconElement.src : null;
          
          // Create taskbar button
          const taskbarButtons = document.getElementById('taskbar-buttons');
          const taskbarButton = document.createElement('button');
          taskbarButton.className = 'taskbar-button';
          
          // Add icon if available
          if (iconSrc) {
            const iconImg = document.createElement('img');
            iconImg.src = iconSrc;
            iconImg.height = 12;
            iconImg.style.marginRight = '4px';
            taskbarButton.appendChild(iconImg);
          }
          
          // Add text content
          const textSpan = document.createElement('span');
          textSpan.textContent = windowTitle;
          taskbarButton.appendChild(textSpan);
          
          taskbarButton.setAttribute('data-window-id', windowId);
          taskbarButton.onclick = () => restoreWindow(windowId);
          
          taskbarButtons.appendChild(taskbarButton);
        }

        function restoreWindow(windowId) {
          // Show the window
          const windowElement = document.getElementById(windowId);
          if (windowElement) {
            windowElement.style.display = 'block';
          }
          
          // Remove taskbar button
          const taskbarButton = document.querySelector('[data-window-id="' + windowId + '"]');
          if (taskbarButton) {
            taskbarButton.remove();
          }
        }

        function updateClock() {
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit'
          });
          document.getElementById('clock').textContent = timeString;
        }

        document.addEventListener('DOMContentLoaded', () => {
          makeDraggable(document.getElementById('info'));
          makeDraggable(document.getElementById('posts'));
          makeDraggable(document.getElementById('post-content'));

          // Update clock immediately and then every minute
          updateClock();
          setInterval(updateClock, 60000);

          document.querySelectorAll('.post-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const content = decodeURIComponent(e.target.getAttribute('data-content'));
              const title = e.target.getAttribute('data-title');
              createPostWindow(title, content);
            });
          });

          document.querySelectorAll('.title-bar-controls button[aria-label="Minimize"]').forEach(button => {
            button.addEventListener('click', (e) => {
              const windowElement = e.target.closest('.window');
              if (windowElement) {
                minimizeWindow(windowElement);
              }
            });
          });

          document.querySelectorAll('.title-bar-controls button[aria-label="Maximize"]').forEach(button => {
            button.addEventListener('click', (e) => {
              const windowElement = e.target.closest('.window');
              windowElement.classList.toggle('maximized');
              if (windowElement.classList.contains('maximized')) {
                e.target.setAttribute('aria-label', 'Restore');
              } else {
                e.target.setAttribute('aria-label', 'Maximize');
              }
            });
          });

        });
      </script>
    </body>

    </html>
  `;
  fs.writeFileSync(path.join(publicDir, 'index.html'), homeHtml, 'utf-8');

});
