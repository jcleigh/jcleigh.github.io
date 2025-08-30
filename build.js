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

// Ensure wp8-mobile.css is copied to public directory
const wp8StylesSrc = path.join(__dirname, 'public', 'wp8-mobile.css');
const wp8StylesDest = path.join(publicDir, 'wp8-mobile.css');
if (fs.existsSync(wp8StylesSrc)) {
  fs.copyFileSync(wp8StylesSrc, wp8StylesDest);
}

// Copy jordan.png portrait image to public directory
const jordanSrc = path.join(__dirname, 'assets', 'images', 'jordan.png');
const jordanDest = path.join(publicDir, 'jordan.png');
if (fs.existsSync(jordanSrc)) {
  fs.copyFileSync(jordanSrc, jordanDest);
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
      <link rel="stylesheet" href="wp8-mobile.css">
    </head>

    <body>
      <div id="info" class="window main-window">
        <div id="title-bar-info" class="title-bar">
          <div class="title-bar-text"><img src="help_book_big-1.png" height="12px"/> Information</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close" disabled></button>
          </div>
        </div>
        <div class="window-body info-window-body">
          <img src="jordan.png" alt="Jordan Cleigh portrait" class="portrait-image">
          <div class="info-text">
            <p>Name: Jordan Cleigh</p>
            <p>Occupation: Staff Software Engineer @ <a href="https://fmgsuite.com" target="_blank">FMG</a></p>
            <p>Topics: Technology, Software Engineering, Music Production</p>
          </div>
        </div>
        <div class="status-bar">
          <p class="status-bar-field"><a href="https://linkedin.com/in/jcleigh" target="_blank">LinkedIn</a></p>
          <p class="status-bar-field"><a href="https://github.com/jcleigh" target="_blank">GitHub</a></p>
          <p class="status-bar-field">Attributions</p> <!-- TODO: make a popup for icon and css attributions -->
        </div>
      </div>

      <div id="talks" class="window main-window">
        <div id="title-bar-talks" class="title-bar">
          <div class="title-bar-text"><img src="users-1.png" height="12px"/> Public Speaking</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize" disabled></button>
            <button aria-label="Close" disabled></button>
          </div>
        </div>
        <div class="window-body">
          <p class="post-header">I am available for public speaking engagements. DM me on <a href="https://linkedin.com/in/jcleigh" target="_blank">LinkedIn</a> for inquiries.</p>
          <p class="post-header">View my talks:</p>
          <ul>
            <li><a href="https://github.com/jcleigh/talks" target="_blank">See all talks on GitHub</a></li>
          </ul>
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
          <div class="start-menu-item" onclick="toggleTheme()">
            <span class="start-menu-icon">📱</span>
            <span class="start-menu-text">Windows Phone 8 Mode</span>
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

      <!-- Windows Phone 8 Mobile Experience -->
      <div class="wp8-mobile-container">
        <!-- Status Bar -->
        <div class="wp8-status-bar">
          <span class="wp8-carrier">jcleigh.dev</span>
          <span class="wp8-time" id="wp8-clock"></span>
        </div>

        <!-- Header -->
        <div class="wp8-header">
          <h1 class="wp8-title">jordan</h1>
          <p class="wp8-subtitle">staff software engineer</p>
        </div>

        <!-- Tiles Container -->
        <div class="wp8-tiles-container">
          <!-- Profile and Info Tiles -->
          <div class="wp8-tiles">
            <div class="wp8-tile wp8-tile-wide wp8-profile-tile">
              <img src="jordan.png" alt="Jordan Cleigh" class="wp8-profile-image">
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">Jordan Cleigh</h3>
                <p class="wp8-tile-subtitle">Technology, Software Engineering, Music</p>
              </div>
            </div>

            <a href="https://fmgsuite.com" target="_blank" class="wp8-tile wp8-tile-small wp8-tile-blue">
              <div class="wp8-tile-icon">🏢</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">FMG</h3>
                <p class="wp8-tile-subtitle">Work</p>
              </div>
            </a>

            <a href="https://linkedin.com/in/jcleigh" target="_blank" class="wp8-tile wp8-tile-small wp8-tile-teal">
              <div class="wp8-tile-icon">💼</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">LinkedIn</h3>
              </div>
            </a>

            <a href="https://github.com/jcleigh" target="_blank" class="wp8-tile wp8-tile-small wp8-tile-purple">
              <div class="wp8-tile-icon">💻</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">GitHub</h3>
              </div>
            </a>

            <a href="https://github.com/jcleigh/talks" target="_blank" class="wp8-tile wp8-tile-small wp8-tile-yellow">
              <div class="wp8-tile-icon">🎤</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">Public Speaking</h3>
                <p class="wp8-tile-subtitle">Talks & Slides</p>
              </div>
            </a>

            <div class="wp8-tile wp8-tile-small wp8-tile-green">
              <div class="wp8-tile-content">
                <p class="wp8-tile-count">${posts.length}</p>
                <h3 class="wp8-tile-title">Posts</h3>
              </div>
            </div>

            <!-- Theme Toggle Tile -->
            <button class="wp8-tile wp8-tile-small wp8-tile-orange" onclick="toggleTheme()">
              <div class="wp8-tile-icon">🪟</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">Windows 98</h3>
                <p class="wp8-tile-subtitle">Switch theme</p>
              </div>
            </button>
          </div>

          <!-- Posts Section -->
          <div class="wp8-header" style="padding: 10px 0;">
            <h2 class="wp8-title" style="font-size: 32px;">recent posts</h2>
          </div>

          <div class="wp8-tiles">
            ${posts.map(post => {
              const postDate = new Date(post.date);
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const formattedDate = monthNames[postDate.getMonth()] + " " + postDate.getDate();
              
              // Create a plain text version of the content for the subtitle
              const plainContent = post.content.replace(/<[^>]*>/g, '').substring(0, 50) + '...';
              
              return `<button class="wp8-tile wp8-tile-wide wp8-post-tile wp8-post-button" data-title="${post.title}" data-content="${post.content.replace(/<[^>]*>/g, '').replace(/"/g, '&quot;')}">
              <div class="wp8-post-date">${formattedDate}</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">${post.title}</h3>
                <p class="wp8-tile-subtitle">${plainContent}</p>
              </div>
            </button>`;
            }).join('\n            ')}
          </div>
        </div>
      </div>

      <!-- WP8 Post Modal -->
      <div id="wp8-modal" class="wp8-modal">
        <div class="wp8-modal-header">
          <h2 id="wp8-modal-title" class="wp8-modal-title"></h2>
          <button class="wp8-modal-close" onclick="closeWP8Post()">✕</button>
        </div>
        <div id="wp8-modal-content" class="wp8-modal-content"></div>
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
          makeDraggable(document.getElementById('talks'));
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

          // Initialize theme
          initializeTheme();

          // Add event listeners for WP8 post buttons
          document.querySelectorAll('.wp8-post-button').forEach(button => {
            button.addEventListener('click', (e) => {
              const title = e.currentTarget.getAttribute('data-title');
              const content = e.currentTarget.getAttribute('data-content');
              openWP8Post(title, content);
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
          
          createAppWindow('Calculator', calculatorHTML, '350px', '220px', '🧮');
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
          // Create a custom window structure for Notepad with menu bar outside window-body
          appWindowCounter++;
          const windowId = 'app-window-' + appWindowCounter;
          
          const notepadWindow = document.createElement('div');
          notepadWindow.id = windowId;
          notepadWindow.className = 'window main-window';
          notepadWindow.style.top = (50 + (appWindowCounter * 30)) + 'px';
          notepadWindow.style.left = (50 + (appWindowCounter * 30)) + 'px';
          notepadWindow.style.width = '500px';
          notepadWindow.style.height = '500px';
          notepadWindow.style.zIndex = 500 + appWindowCounter;
          
          notepadWindow.innerHTML = 
            '<div class="title-bar">' +
              '<div class="title-bar-text"><span style="font-size: 12px;">📝</span> Notepad</div>' +
              '<div class="title-bar-controls">' +
                '<button aria-label="Minimize"></button>' +
                '<button aria-label="Maximize"></button>' +
                '<button aria-label="Close"></button>' +
              '</div>' +
            '</div>' +
            '<div class="notepad-menubar" style="background: #c0c0c0; border-bottom: 1px solid #808080; padding: 2px 4px; font-size: 11px; position: relative; height: 18px; margin-top: 18px;">' +
              '<span class="notepad-menu" onmouseenter="showNotepadMenu(this, &quot;file&quot;)" onmouseleave="hideNotepadMenu()">File</span>' +
              '<span class="notepad-menu" onmouseenter="showNotepadMenu(this, &quot;edit&quot;)" onmouseleave="hideNotepadMenu()">Edit</span>' +
              '<div id="notepad-file-menu" class="notepad-dropdown" style="display: none; position: absolute; top: 100%; left: 4px; background: #c0c0c0; border: 1px outset #c0c0c0; min-width: 80px; z-index: 1000;">' +
                '<div class="notepad-menu-item" onclick="saveNote(); hideNotepadMenu();">Save</div>' +
              '</div>' +
              '<div id="notepad-edit-menu" class="notepad-dropdown" style="display: none; position: absolute; top: 100%; left: 36px; background: #c0c0c0; border: 1px outset #c0c0c0; min-width: 80px; z-index: 1000;">' +
                '<div class="notepad-menu-item" onclick="clearNote(); hideNotepadMenu();">Clear</div>' +
              '</div>' +
            '</div>' +
            '<div class="window-body" style="height: calc(100% - 48px); padding: 4px;">' +
              '<textarea id="notepad-text" style="width: 100%; height: 100%; border: 1px inset #c0c0c0; font-family: monospace; padding: 5px; resize: none; box-sizing: border-box;" placeholder="Start typing..."></textarea>' +
            '</div>' +
            '<style>' +
              '.notepad-menu { padding: 2px 8px; cursor: pointer; border: 1px solid transparent; margin-right: 2px; }' +
              '.notepad-menu:hover { background: #316ac5; color: white; border: 1px solid #316ac5; }' +
              '.notepad-menu-item { padding: 2px 16px; cursor: pointer; }' +
              '.notepad-menu-item:hover { background: #316ac5; color: white; }' +
            '</style>';
          
          document.body.appendChild(notepadWindow);
          makeDraggable(notepadWindow);
          
          const minimizeBtn = notepadWindow.querySelector('button[aria-label="Minimize"]');
          const maximizeBtn = notepadWindow.querySelector('button[aria-label="Maximize"]');
          const closeBtn = notepadWindow.querySelector('button[aria-label="Close"]');
          
          minimizeBtn.addEventListener('click', () => minimizeWindow(notepadWindow));
          maximizeBtn.addEventListener('click', (e) => {
            notepadWindow.classList.toggle('maximized');
            e.target.setAttribute('aria-label', 
              notepadWindow.classList.contains('maximized') ? 'Restore' : 'Maximize'
            );
          });
          closeBtn.addEventListener('click', () => notepadWindow.remove());
          
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

        function showNotepadMenu(menuElement, menuType) {
          // Hide all menus first
          hideNotepadMenu();
          
          // Show the specific menu
          const menuId = 'notepad-' + menuType + '-menu';
          const menu = document.getElementById(menuId);
          if (menu) {
            menu.style.display = 'block';
          }
        }

        function hideNotepadMenu() {
          const fileMenu = document.getElementById('notepad-file-menu');
          const editMenu = document.getElementById('notepad-edit-menu');
          if (fileMenu) fileMenu.style.display = 'none';
          if (editMenu) editMenu.style.display = 'none';
        }

        // Windows Phone 8 Functions
        function toggleTheme() {
          const body = document.body;
          const isWP8Mode = body.classList.contains('wp8-mode');
          
          if (isWP8Mode) {
            // Switch back to Windows 98 mode
            body.classList.remove('wp8-mode');
            localStorage.setItem('theme', 'windows98');
          } else {
            // Switch to Windows Phone 8 mode
            body.classList.add('wp8-mode');
            localStorage.setItem('theme', 'wp8');
          }
          
          // Close start menu if open
          const startMenu = document.getElementById('start-menu');
          if (startMenu) {
            startMenu.style.display = 'none';
          }
          
          // Update WP8 clock
          updateWP8Clock();
        }

        function openWP8Post(title, content) {
          const modal = document.getElementById('wp8-modal');
          const modalTitle = document.getElementById('wp8-modal-title');
          const modalContent = document.getElementById('wp8-modal-content');
          
          modalTitle.textContent = title;
          modalContent.innerHTML = '<p>' + content.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>') + '</p>';
          modal.style.display = 'block';
        }

        function closeWP8Post() {
          const modal = document.getElementById('wp8-modal');
          modal.style.display = 'none';
        }

        function updateWP8Clock() {
          const wp8Clock = document.getElementById('wp8-clock');
          if (wp8Clock) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
              hour12: true, 
              hour: 'numeric', 
              minute: '2-digit'
            });
            wp8Clock.textContent = timeString;
          }
        }

        // Check for saved theme preference and auto-detect mobile
        function initializeTheme() {
          const savedTheme = localStorage.getItem('theme');
          const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // Auto-switch to WP8 on mobile, unless user has explicitly chosen Windows 98
          if ((isMobile && savedTheme !== 'windows98') || savedTheme === 'wp8') {
            document.body.classList.add('wp8-mode');
          }
          
          // Update WP8 clock
          updateWP8Clock();
          // Update WP8 clock every minute
          setInterval(updateWP8Clock, 60000);
        }

      </script>
    </body>

    </html>
  `;
  fs.writeFileSync(path.join(publicDir, 'index.html'), homeHtml, 'utf-8');

});
