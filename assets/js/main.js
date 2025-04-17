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
    const initialPage = './article/dashboard.html';
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