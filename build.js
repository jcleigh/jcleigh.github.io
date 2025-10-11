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

// Ensure professional-theme.css is copied to public directory
const professionalStylesSrc = path.join(__dirname, 'public', 'professional-theme.css');
const professionalStylesDest = path.join(publicDir, 'professional-theme.css');
if (fs.existsSync(professionalStylesSrc)) {
  fs.copyFileSync(professionalStylesSrc, professionalStylesDest);
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

    // Format date as YYYY-MM-DD
    let formattedDate = data.date;
    if (data.date) {
      const d = new Date(data.date);
      if (!isNaN(d)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
    }
    posts.push({ title: data.title, date: formattedDate, file: file.replace('.md', '.html'), content: htmlContent });
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
      <link rel="stylesheet" href="professional-theme.css">
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
          <p class="status-bar-field"><a href="#" id="attributions-link">Attributions</a></p>
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
          <div class="start-menu-item" onclick="cycleTheme()">
            <span class="start-menu-icon">🎨</span>
            <span class="start-menu-text">Switch Theme</span>
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
            <button class="wp8-tile wp8-tile-small wp8-tile-orange" onclick="cycleTheme()">
              <div class="wp8-tile-icon">🎨</div>
              <div class="wp8-tile-content">
                <h3 class="wp8-tile-title">Themes</h3>
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

      <!-- Professional Theme -->
      <div class="professional-container">
        <!-- Navigation -->
        <nav class="professional-nav">
          <div class="professional-nav-content">
            <a href="#" class="professional-logo">jcleigh.dev</a>
            <div class="professional-nav-links">
              <a href="#about">About</a>
              <a href="#speaking">Speaking</a>
              <a href="#blog">Blog</a>
              <a href="#contact">Contact</a>
              <button class="theme-picker" onclick="cycleTheme()">Theme</button>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="professional-hero" id="about">
          <img src="jordan.png" alt="Jordan Cleigh" class="professional-profile-image">
          <h1>Jordan Cleigh</h1>
          <p class="subtitle">Staff Software Engineer & Technical Speaker</p>
          <p class="description">
            Passionate about technology, software engineering, and sharing knowledge through speaking engagements and technical content. 
            I help teams build better software and share insights from the trenches of modern development.
          </p>
          <div class="professional-links">
            <a href="https://linkedin.com/in/jcleigh" target="_blank" class="professional-link">
              💼 LinkedIn
            </a>
            <a href="https://github.com/jcleigh" target="_blank" class="professional-link">
              💻 GitHub
            </a>
            <a href="https://github.com/jcleigh/talks" target="_blank" class="professional-link">
              🎤 View Talks
            </a>
          </div>
        </section>

        <!-- Content -->
        <div class="professional-content">
          <!-- Speaking Section -->
          <section class="professional-section" id="speaking">
            <h2>Speaking Engagements</h2>
            <p>I'm available for technical conferences, meetups, and corporate events. I speak about software engineering, cloud architecture, and developer productivity.</p>
            
            <div class="speaking-item">
              <h4>Available for Speaking Engagements</h4>
              <div class="event-details">DM me on LinkedIn for inquiries</div>
              <p>Topics include: Software Architecture, Cloud Technologies, Developer Experience, Team Leadership, and Technical Best Practices.</p>
            </div>
            
            <div class="professional-cards">
              <div class="professional-card">
                <h3>🎯 Topics I Cover</h3>
                <p>Software Architecture • Cloud Technologies • Developer Experience • Team Leadership • API Design • Performance Optimization</p>
              </div>
              <div class="professional-card">
                <h3>📈 Speaking Experience</h3>
                <p>Conference talks • Technical workshops • Corporate training • Team presentations • Community meetups</p>
                <a href="https://github.com/jcleigh/talks" target="_blank">View all talks and slides →</a>
              </div>
            </div>
          </section>

          <!-- Blog Section -->
          <section class="professional-section" id="blog">
            <h2>Recent Posts</h2>
            ${posts.map(post => {
              const cleanTitle = post.title.replace(/"/g, '&quot;');
              const cleanContent = post.content.replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').replace(/\n/g, ' ');
              return `
            <div class="blog-post" onclick="openProfessionalPost('${cleanTitle}', '${cleanContent}')">
              <h4>${post.title}</h4>
              <div class="post-date">${post.date}</div>
              <p>${post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
            </div>
            `;
            }).join('')}
          </section>

          <!-- Contact Section -->
          <section class="professional-section" id="contact">
            <h2>Let's Connect</h2>
            <div class="professional-cards">
              <div class="professional-card">
                <h3>💼 Professional</h3>
                <p>Staff Software Engineer at <a href="https://fmgsuite.com" target="_blank">FMG</a></p>
                <p>Connect with me on <a href="https://linkedin.com/in/jcleigh" target="_blank">LinkedIn</a> for professional opportunities and speaking inquiries.</p>
              </div>
              <div class="professional-card">
                <h3>🔗 Online Presence</h3>
                <p>Find my code on <a href="https://github.com/jcleigh" target="_blank">GitHub</a></p>
                <p>Speaking materials at <a href="https://github.com/jcleigh/talks" target="_blank">jcleigh/talks</a></p>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <footer class="professional-footer">
          <p>&copy; 2025 Jordan Cleigh. Built with care and attention to detail.</p>
        </footer>
      </div>

      <script>
        // Attributions window handler
        function openAttributionsWindow() {
          var content = '<ul class="attributions-list">'
            + '<li><a href="https://jdan.github.io/98.css/" target="_blank">98.css</a></li>'
            + '<li><a href="https://win98icons.alexmeub.com/" target="_blank">Windows 98 Icons</a></li>'
            + '</ul>'
          createAppWindow('Attributions', content, '350px', '200px', '<img src="help_sheet-1.png" height="12px" style="vertical-align:middle">');
        }
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
          // Attributions link handler
          const attribLink = document.getElementById('attributions-link');
          if (attribLink) {
            attribLink.addEventListener('click', function(e) {
              e.preventDefault();
              openAttributionsWindow();
            });
          }
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

        // Theme cycling function - cycles through professional -> windows98 -> wp8
        function cycleTheme() {
          const body = document.body;
          const currentTheme = getCurrentTheme();
          
          // Remove all theme classes
          body.classList.remove('professional-mode', 'wp8-mode');
          
          let nextTheme;
          switch(currentTheme) {
            case 'professional':
              nextTheme = 'windows98';
              break;
            case 'windows98':
              nextTheme = 'wp8';
              body.classList.add('wp8-mode');
              break;
            case 'wp8':
            default:
              nextTheme = 'professional';
              body.classList.add('professional-mode');
              break;
          }
          
          localStorage.setItem('theme', nextTheme);
          
          // Close start menu if open
          const startMenu = document.getElementById('start-menu');
          if (startMenu) {
            startMenu.style.display = 'none';
          }
          
          // Update WP8 clock
          updateWP8Clock();
        }

        // Legacy toggleTheme function for Windows 98 start menu - now cycles themes
        function toggleTheme() {
          cycleTheme();
        }

        // Get current theme from body classes and localStorage
        function getCurrentTheme() {
          const body = document.body;
          if (body.classList.contains('professional-mode')) {
            return 'professional';
          } else if (body.classList.contains('wp8-mode')) {
            return 'wp8';
          } else {
            return 'windows98';
          }
        }

        // Professional theme post opening
        function openProfessionalPost(title, content) {
          // Create a modal-like overlay for professional theme
          const modal = document.createElement('div');
          modal.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            box-sizing: border-box;
          \`;
          
          const modalContent = document.createElement('div');
          modalContent.style.cssText = \`
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 0.5rem;
            padding: 2rem;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            color: #e0e0e0;
            position: relative;
          \`;
          
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '✕';
          closeBtn.style.cssText = \`
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: #00ffff;
            width: 2rem;
            height: 2rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 1rem;
          \`;
          closeBtn.onclick = () => modal.remove();
          
          const titleEl = document.createElement('h2');
          titleEl.textContent = title;
          titleEl.style.cssText = \`
            color: #ffffff;
            margin: 0 2rem 1rem 0;
            font-size: 1.5rem;
          \`;
          
          const contentEl = document.createElement('div');
          contentEl.style.cssText = \`
            line-height: 1.6;
            color: #b0b0b0;
          \`;
          
          // Convert content to HTML
          const htmlContent = content
            .replace(/\\n\\n/g, '</p><p>')
            .replace(/\\n/g, '<br>')
            .replace(/•/g, '&bull;');
          contentEl.innerHTML = '<p>' + htmlContent + '</p>';
          
          modalContent.appendChild(closeBtn);
          modalContent.appendChild(titleEl);
          modalContent.appendChild(contentEl);
          modal.appendChild(modalContent);
          document.body.appendChild(modal);
          
          // Close on background click
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.remove();
            }
          });
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
          
          // Default to professional theme if no saved preference
          let themeToApply = savedTheme || 'professional';
          
          // Auto-switch to WP8 on mobile for better experience, unless user has explicitly chosen another theme
          if (isMobile && !savedTheme) {
            themeToApply = 'wp8';
          }
          
          // Apply the theme
          const body = document.body;
          body.classList.remove('professional-mode', 'wp8-mode'); // Clear all theme classes
          
          switch(themeToApply) {
            case 'professional':
              body.classList.add('professional-mode');
              break;
            case 'wp8':
              body.classList.add('wp8-mode');
              break;
            case 'windows98':
            default:
              // Windows 98 is the base theme (no additional classes needed)
              break;
          }
          
          // Save the applied theme
          localStorage.setItem('theme', themeToApply);
          
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
