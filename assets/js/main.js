/* GOOGLE FONTS - Assuming this is in your CSS or loaded elsewhere */
/* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); */

/* Show/Hide Navbar */
const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId),
          navbar = document.getElementById(navbarId),
          bodypadding = document.getElementById(bodyId)

    if (toggle && navbar && bodypadding) {
        toggle.addEventListener('click', () => {
            navbar.classList.toggle('expander');
            bodypadding.classList.toggle('body-pd');
            // If you want tooltips to disappear immediately when expanding
            hideTooltip();
        })
    }
}
showMenu('nav-toggle', 'navbar', 'body-pd');

/* Link Active State */
const linkColor = document.querySelectorAll('.nav__link');
function colorLink() {
    linkColor.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
}
linkColor.forEach(l => l.addEventListener('click', colorLink));

/* Collapse Submenu */
const linkCollapse = document.getElementsByClassName('collapse__link');
var i;
for (i = 0; i < linkCollapse.length; i++) {
    linkCollapse[i].addEventListener('click', function() {
        const collapseMenu = this.nextElementSibling;
        collapseMenu.classList.toggle('showCollapse');
        const rotate = collapseMenu.previousElementSibling;
        rotate.classList.toggle('rotate');
    });
}

// --- Tooltip Functionality ---
let tooltipElement = null; // Variable to hold the single tooltip element

// Function to create the tooltip element if it doesn't exist
function createTooltipElement() {
    if (!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'nav-tooltip'; // Use the CSS class you provided
        tooltipElement.style.position = 'fixed'; // Use fixed positioning relative to viewport
        tooltipElement.style.display = 'none';   // Hidden by default
        tooltipElement.style.opacity = '0';      // Start transparent for fade effect
        tooltipElement.style.transition = 'opacity 0.2s ease, top 0.1s ease'; // Smooth transitions
        document.body.appendChild(tooltipElement);
    }
}

// Function to show the tooltip
function showTooltip(event, text) {
    const iconElement = event.currentTarget; // The icon that triggered the event
    const navbar = document.getElementById('navbar');

    // Only show tooltip if navbar is collapsed
    if (!navbar.classList.contains('expander')) {
        createTooltipElement(); // Ensure the tooltip element exists

        tooltipElement.textContent = text; // Set the text

        // Calculate position
        const iconRect = iconElement.getBoundingClientRect(); // Get icon's position and size
        const tooltipRect = tooltipElement.getBoundingClientRect(); // Get tooltip's current size (may be 0 if hidden)

        // Position tooltip vertically centered next to the icon
        // Adjust the '15' for desired horizontal gap from the icon
        const topPos = iconRect.top + (iconRect.height / 2) - (tooltipElement.offsetHeight / 2);
        const leftPos = iconRect.right + 15; // Position to the right of the icon

        tooltipElement.style.top = `${topPos}px`;
        tooltipElement.style.left = `${leftPos}px`;
        tooltipElement.style.display = 'block'; // Make it take space

        // Use a tiny timeout to allow 'display: block' to apply before starting the fade-in transition
        setTimeout(() => {
            tooltipElement.style.opacity = '1';
        }, 10);
    }
}

// Function to hide the tooltip
function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.style.opacity = '0';
        // Wait for the fade-out transition to finish before setting display to none
        setTimeout(() => {
            // Check if it's still supposed to be hidden (user might have hovered back quickly)
            if (tooltipElement.style.opacity === '0') {
                 tooltipElement.style.display = 'none';
            }
        }, 200); // Match the transition duration (0.2s)
    }
}

// Add tooltip event listeners within DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // --- Page Loading Functionality ---
    const menuLinks = document.querySelectorAll('.nav__link:not(.collapse), .collapse__sublink');
    const contentAreaH1 = document.querySelector('#content-area h1');
    const contentContainer = document.getElementById('content-container');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagePath = this.getAttribute('data-page');
            if (pagePath) {
                loadContent(pagePath);
                // Update title (handle potential missing span for sublinks)
                const nameSpan = this.querySelector('.nav_name');
                const pageTitle = nameSpan ? nameSpan.textContent : this.textContent.trim(); // Use textContent for sublinks
                if (contentAreaH1) {
                    contentAreaH1.textContent = pageTitle;
                }
            }
        });
    });

    // Initial page load (Dashboard)
    const initialPage = './article/main.html';
    loadContent(initialPage);
    if (contentAreaH1) {
        // Find the Dashboard link to set the initial title correctly
        const dashboardLink = document.querySelector(`.nav__link[data-page="${initialPage}"] .nav_name`);
        if (dashboardLink) {
            contentAreaH1.textContent = dashboardLink.textContent;
        } else {
             contentAreaH1.textContent = 'Dashboard'; // Fallback
        }
    }

    // --- Attach Tooltip Listeners ---
    const navIcons = document.querySelectorAll('.nav__icon');
    navIcons.forEach(icon => {
        const parentLink = icon.closest('.nav__link'); // Find the parent link
        if (parentLink) {
            const nameSpan = parentLink.querySelector('.nav_name');
            if (nameSpan) {
                const tooltipText = nameSpan.textContent.trim();
                icon.addEventListener('mouseenter', (event) => showTooltip(event, tooltipText));
                icon.addEventListener('mouseleave', hideTooltip);
            }
        }
    });
}); // End DOMContentLoaded

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied to clipboard: ${text}`);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
}

// --- Content Loading Function ---
function loadContent(pagePath) {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) {
        console.error('Error: Content container not found');
        return;
    }

    console.log('Fetching content from:', pagePath);
    contentContainer.innerHTML = '<div class="loading">Loading...</div>'; // Optional loading indicator

    fetch(pagePath)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Page not found (Status: ${response.status})`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Page content loaded successfully.');
            contentContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading page content:', error);
            contentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Error loading content</h2>
                    <p>${error.message}</p>
                    <p>Please check if the page exists and the path is correct: ${pagePath}</p>
                </div>
            `;
        });
}

 
// <!-- Matrix Code Rain with 5-Second Duration -->
// Canvas setup
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to match screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define code fragments (split the provided code into words and symbols)
const codeFragments = [
    "TITLE", "=FOR", "DEBUG", "//", "FOR", "DEBUG",
    "//", "A", "#RFLAG", "//", "JC", "NRST",
    "//", "BE", "NETWORK", "TITLE", "=",
    "//////////////////////////",
    "////", "CHECK", "RESET", "FLAG", "ON",
    "/////////////////////////",
    "A", "#RFLAG;", "JCN", "NRST;", "//", "NOT", "RESET", "OF", "OUTPUT",
    "//Reset", "Flag(RFLAG)가", "ON이면", "출력", "OUT은", "0.0으로", "Clear한다.",
    "L", "0.000000e+000;", "JU", "ROUT;", "//", "ACCUMULATOR", "값을", "출력",
    "NETWORK", "TITLE", "=",
    "///////////////////////////",
    "////", "CHECK", "PRESET", "FLAG", "ON",
    "//////////////////////////",
    "NRST:", "A", "#PFLAG;", "JCN", "NPRE;", "//", "NOT", "PRESET",
    "//", "PRESET", "Flag(PFLAG)가", "ON되면", "출력", "OUT은", "Preset", "값", "PVAL으로", "Setting", "한다.",
    "L", "#PVAL;", "JU", "ROUT;"
];

// Calculate font size and number of columns
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize) - 1;

// Arrays to store the position and properties of each column
const drops = [];         // Y-positions
const wordIndices = [];   // Which word is currently being displayed
const speeds = [];        // How fast each column falls
const speedRatio = 5; // Speed ratio for the falling effect
// Initialize arrays
for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
    wordIndices[i] = Math.floor(Math.random() * codeFragments.length);
    speeds[i] = (0.5 + Math.random() * 1.5)/speedRatio; // Different speeds for each column
}

// Variables to store animation and timer IDs
let animationId;
let timerId;

// Animation function
function draw() {  
    // Adjust this value to control the rainflow effect
    const rainflowEffect = 0.1; 
    // Semi-transparent black overlay to create fading effect
    ctx.fillStyle = `rgba(0, 0, 0, ${rainflowEffect})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.font = fontSize + 'px monospace';

    // Draw words for each column
    for (let i = 0; i < drops.length; i++) {
        // Get current word for this column
        const wordIdx = wordIndices[i];
        const text = codeFragments[wordIdx];
        
        // Calculate position
        const x = i * fontSize;
        const y = Math.floor(drops[i]) * fontSize;
        
        // Only draw if within screen bounds
        if (y > 0 && y < canvas.height) {
            // Occasionally highlight words in white
            if (Math.random() > 0.95) {
                ctx.fillStyle = '#FFF'; // White highlight
            } else {
                ctx.fillStyle = '#0F0'; // Default matrix green
            }
            ctx.fillText(text, x, y);
        }

        // Reset when word reaches bottom of screen
        if (y > canvas.height) {
            drops[i] = 0;
            wordIndices[i] = Math.floor(Math.random() * codeFragments.length);
            speeds[i] = (0.5 + Math.random() * 1.5) /speedRatio; // Reset speed
        }
        
        // Increment Y position based on speed
        drops[i] += speeds[i];
        
        // Occasionally change the word
        if (Math.random() > 0.98) {
            wordIndices[i] = Math.floor(Math.random() * codeFragments.length);
        }
    }

    // Request next animation frame
    animationId = requestAnimationFrame(draw);
}

// Function to stop the matrix effect
function stopMatrix() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
              
        // Clear and remove the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove(); // canvas 삭제
        
        // Change background color (optional)
        document.body.style.backgroundColor = 'white';
        
        // Change text color (optional)
        const contentContainer = document.getElementById('content-container');
        if(contentContainer) {
            contentContainer.style.color = 'black';
        }
        
        // Load the main content again
        loadContent('./article/main.html');
    }
    
    // Clear timer
    if (timerId) {
        clearTimeout(timerId);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate number of columns
    const newColumns = Math.floor(canvas.width / fontSize) - 1;
    
    // Adjust array sizes
    while (drops.length < newColumns) {
        drops.push(Math.random() * canvas.height / fontSize * -1);
        wordIndices.push(Math.floor(Math.random() * codeFragments.length));
        speeds.push(0.5 + Math.random() * 1.5);
    }
    drops.length = newColumns;
    wordIndices.length = newColumns;
    speeds.length = newColumns;
});

// Start animation when page loads
animationId = requestAnimationFrame(draw);

// Stop animation after 5 seconds
timerId = setTimeout(stopMatrix, 5000);
