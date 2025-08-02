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
        <link rel="stylesheet" href="https://unpkg.com/98.css@0.1.0/dist/98.css">
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
      <link rel="stylesheet" href="https://unpkg.com/98.css">
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

      <!-- Start Menu -->
      <div id="start-menu" style="display: none;">
        <div class="start-menu-header">
          <span class="start-menu-title">jcleigh.dev</span>
        </div>
        <div class="start-menu-items">
          <div class="start-menu-item" onclick="openCalculator()">
            <span class="start-menu-icon">🧮</span>
            <span class="start-menu-text">Calculator</span>
          </div>
          <div class="start-menu-item" onclick="openNotepad()">
            <span class="start-menu-icon">📝</span>
            <span class="start-menu-text">Notepad</span>
          </div>
          <div class="start-menu-separator"></div>
          <div class="start-menu-item" onclick="window.location.reload()">
            <span class="start-menu-icon">🔄</span>
            <span class="start-menu-text">Refresh</span>
          </div>
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

          // Start menu functionality
          const startButton = document.getElementById('start-button');
          const startMenu = document.getElementById('start-menu');
          
          startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = startMenu.style.display !== 'none';
            startMenu.style.display = isVisible ? 'none' : 'block';
          });

          // Close start menu when clicking elsewhere
          document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startButton) {
              startMenu.style.display = 'none';
            }
          });

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

        // Application functions
        let appWindowCounter = 0;

        function createAppWindow(title, content, width = '400px', height = '300px', icon = '📄') {
          appWindowCounter++;
          const windowId = 'app-window-' + appWindowCounter;
          
          const appWindow = document.createElement('div');
          appWindow.id = windowId;
          appWindow.className = 'window main-window';
          appWindow.style.top = (50 + (appWindowCounter * 30)) + 'px';
          appWindow.style.left = (50 + (appWindowCounter * 30)) + 'px';
          appWindow.style.width = width;
          appWindow.style.height = height;
          appWindow.style.zIndex = 500 + appWindowCounter;
          
          appWindow.innerHTML = 
            '<div class="title-bar">' +
              '<div class="title-bar-text"><span style="font-size: 12px;">' + icon + '</span> ' + title + '</div>' +
              '<div class="title-bar-controls">' +
                '<button aria-label="Minimize"></button>' +
                '<button aria-label="Maximize"></button>' +
                '<button aria-label="Close"></button>' +
              '</div>' +
            '</div>' +
            '<div class="window-body">' +
              content +
            '</div>';
          
          document.body.appendChild(appWindow);
          makeDraggable(appWindow);
          
          const minimizeBtn = appWindow.querySelector('button[aria-label="Minimize"]');
          const maximizeBtn = appWindow.querySelector('button[aria-label="Maximize"]');
          const closeBtn = appWindow.querySelector('button[aria-label="Close"]');
          
          minimizeBtn.addEventListener('click', () => minimizeWindow(appWindow));
          maximizeBtn.addEventListener('click', (e) => {
            appWindow.classList.toggle('maximized');
            e.target.setAttribute('aria-label', 
              appWindow.classList.contains('maximized') ? 'Restore' : 'Maximize'
            );
          });
          closeBtn.addEventListener('click', () => appWindow.remove());
          
          return appWindow;
        }

        function openCalculator() {
          const calculatorHTML = 
            '<div style="text-align: center; padding: 10px;">' +
              '<div id="calc-display" style="background: black; color: lime; font-family: monospace; font-size: 18px; padding: 8px; margin-bottom: 10px; text-align: right; border: 2px inset #c0c0c0;">0</div>' +
              '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;">' +
                '<button onclick="clearCalc()" style="grid-column: span 2;">Clear</button>' +
                '<button onclick="calcOperation(&quot;/&quot;)">/</button>' +
                '<button onclick="calcOperation(&quot;*&quot;)">*</button>' +
                '<button onclick="calcNumber(&quot;7&quot;)">7</button>' +
                '<button onclick="calcNumber(&quot;8&quot;)">8</button>' +
                '<button onclick="calcNumber(&quot;9&quot;)">9</button>' +
                '<button onclick="calcOperation(&quot;-&quot;)">-</button>' +
                '<button onclick="calcNumber(&quot;4&quot;)">4</button>' +
                '<button onclick="calcNumber(&quot;5&quot;)">5</button>' +
                '<button onclick="calcNumber(&quot;6&quot;)">6</button>' +
                '<button onclick="calcOperation(&quot;+&quot;)">+</button>' +
                '<button onclick="calcNumber(&quot;1&quot;)">1</button>' +
                '<button onclick="calcNumber(&quot;2&quot;)">2</button>' +
                '<button onclick="calcNumber(&quot;3&quot;)">3</button>' +
                '<button onclick="calcEquals()" style="grid-row: span 2; writing-mode: vertical-lr;">=</button>' +
                '<button onclick="calcNumber(&quot;0&quot;)" style="grid-column: span 2;">0</button>' +
                '<button onclick="calcNumber(&quot;.&quot;)">.</button>' +
              '</div>' +
            '</div>';
          
          createAppWindow('Calculator', calculatorHTML, '300px', '320px', '🧮');
          document.getElementById('start-menu').style.display = 'none';
        }

        let calcValue = '0';
        let calcOperator = null;
        let calcPrevious = null;
        let calcWaitingForOperand = false;

        function updateCalcDisplay() {
          const display = document.getElementById('calc-display');
          if (display) display.textContent = calcValue;
        }

        function calcNumber(num) {
          if (calcWaitingForOperand) {
            calcValue = num;
            calcWaitingForOperand = false;
          } else {
            calcValue = calcValue === '0' ? num : calcValue + num;
          }
          updateCalcDisplay();
        }

        function calcOperation(op) {
          if (calcPrevious === null) {
            calcPrevious = calcValue;
          } else if (calcOperator) {
            const result = calculate();
            calcValue = String(result);
            calcPrevious = calcValue;
            updateCalcDisplay();
          }
          calcWaitingForOperand = true;
          calcOperator = op;
        }

        function calcEquals() {
          if (calcPrevious !== null && calcOperator) {
            calcValue = String(calculate());
            calcPrevious = null;
            calcOperator = null;
            calcWaitingForOperand = true;
            updateCalcDisplay();
          }
        }

        function clearCalc() {
          calcValue = '0';
          calcOperator = null;
          calcPrevious = null;
          calcWaitingForOperand = false;
          updateCalcDisplay();
        }

        function calculate() {
          const prev = parseFloat(calcPrevious);
          const current = parseFloat(calcValue);
          
          switch (calcOperator) {
            case '+': return prev + current;
            case '-': return prev - current;
            case '*': return prev * current;
            case '/': return current !== 0 ? prev / current : 0;
            default: return current;
          }
        }

        function openNotepad() {
          const notepadHTML = 
            '<div style="height: 100%; display: flex; flex-direction: column;">' +
              '<div style="background: #c0c0c0; border-bottom: 1px solid #808080; padding: 2px;">' +
                '<button onclick="saveNote()" style="font-size: 10px; margin-right: 5px;">Save</button>' +
                '<button onclick="clearNote()" style="font-size: 10px;">Clear</button>' +
              '</div>' +
              '<textarea id="notepad-text" style="flex: 1; border: 1px inset #c0c0c0; font-family: monospace; padding: 5px; resize: none;" placeholder="Start typing..."></textarea>' +
            '</div>';
          
          createAppWindow('Notepad', notepadHTML, '500px', '500px', '📝');
          document.getElementById('start-menu').style.display = 'none';
        }

        function saveNote() {
          const text = document.getElementById('notepad-text').value;
          if (text.trim()) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'note.txt';
            a.click();
            URL.revokeObjectURL(url);
          }
        }

        function clearNote() {
          const notepad = document.getElementById('notepad-text');
          if (notepad) notepad.value = '';
        }

      </script>
    </body>

    </html>
  `;
  fs.writeFileSync(path.join(publicDir, 'index.html'), homeHtml, 'utf-8');

});
