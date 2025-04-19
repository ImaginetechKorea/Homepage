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
for (let i = 0; i < linkCollapse.length; i++) {
    linkCollapse[i].addEventListener('click', function() {
        const collapseMenu = this.nextElementSibling;
        collapseMenu.classList.toggle('showCollapse');
        const rotate = collapseMenu.previousElementSibling;
        rotate.classList.toggle('rotate');
    });
}

// --- Tooltip Functionality ---
let tooltipElement = null;
function createTooltipElement() {
    if (!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'nav-tooltip';
        tooltipElement.style.position = 'fixed';
        tooltipElement.style.display = 'none';
        tooltipElement.style.opacity = '0';
        tooltipElement.style.transition = 'opacity 0.2s ease, top 0.1s ease';
        document.body.appendChild(tooltipElement);
    }
}
function showTooltip(event, text) {
    const iconElement = event.currentTarget;
    const navbar = document.getElementById('navbar');
    if (!navbar.classList.contains('expander')) {
        createTooltipElement();
        tooltipElement.textContent = text;
        const iconRect = iconElement.getBoundingClientRect();
        const topPos = iconRect.top + (iconRect.height / 2) - (tooltipElement.offsetHeight / 2);
        const leftPos = iconRect.right + 15;
        tooltipElement.style.top = `${topPos}px`;
        tooltipElement.style.left = `${leftPos}px`;
        tooltipElement.style.display = 'block';
        setTimeout(() => {
            tooltipElement.style.opacity = '1';
        }, 10);
    }
}
function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (tooltipElement.style.opacity === '0') {
                tooltipElement.style.display = 'none';
            }
        }, 200);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.nav__link:not(.collapse), .collapse__sublink');
    const contentAreaH1 = document.querySelector('#content-area h1');
    const contentContainer = document.getElementById('content-container');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pagePath = this.getAttribute('data-page');
            if (pagePath) {
                loadContent(pagePath);
                const nameSpan = this.querySelector('.nav_name');
                const pageTitle = nameSpan ? nameSpan.textContent : this.textContent.trim();
                if (contentAreaH1) {
                    contentAreaH1.textContent = pageTitle;
                }
            }
        });
    });

    const initialPage = './article/Main.html';
    loadContent(initialPage);
    if (contentAreaH1) {
        const dashboardLink = document.querySelector(`.nav__link[data-page="${initialPage}"] .nav_name`);
        contentAreaH1.textContent = dashboardLink ? dashboardLink.textContent : 'Dashboard';
    }

    const navIcons = document.querySelectorAll('.nav__icon');
    navIcons.forEach(icon => {
        const parentLink = icon.closest('.nav__link');
        if (parentLink) {
            const nameSpan = parentLink.querySelector('.nav_name');
            if (nameSpan) {
                const tooltipText = nameSpan.textContent.trim();
                icon.addEventListener('mouseenter', (event) => showTooltip(event, tooltipText));
                icon.addEventListener('mouseleave', hideTooltip);
            }
        }
    });
});

function loadContent(pagePath) {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) {
        console.error('Error: Content container not found');
        return;
    }

    console.log('Fetching content from:', pagePath);
    contentContainer.innerHTML = '<div class="loading">Loading...</div>';

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
