/* GOOGLE FONTS - Assuming this is in your CSS or loaded elsewhere */
/* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); */

/* Show/Hide Navbar */
const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId),
          navbar = document.getElementById(navbarId),
          bodypadding = document.getElementById(bodyId)

    if (toggle && navbar && bodypadding) {
        toggle.addEventListener('click', () => {
            // 모바일 화면 감지
            const isMobile = window.innerWidth <= 576;
            
            if (isMobile) {
                // 모바일에서는 nav__list 토글
                const navList = navbar.querySelector('.nav__list');
                if (navList) {
                    navList.classList.toggle('show');
                }
            } else {
                // 데스크톱에서는 기존 방식
                navbar.classList.toggle('expander');
                bodypadding.classList.toggle('body-pd');
            }
            
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
    // Force CSS animations to restart and stay active
    forceCyberAnimations();
    
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
                
                // 모바일에서 메뉴 클릭 시 메뉴 자동 닫기
                const isMobile = window.innerWidth <= 576;
                if (isMobile) {
                    const navbar = document.getElementById('navbar');
                    const navList = navbar.querySelector('.nav__list');
                    if (navList && navList.classList.contains('show')) {
                        navList.classList.remove('show');
                    }
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

// Force cyber animations to stay active and restart if needed
function forceCyberAnimations() {
    const navbar = document.querySelector('.l-navbar');
    const navLinks = document.querySelectorAll('.nav__link');
    const activeLinks = document.querySelectorAll('.nav__link.active');
    
    // Force all animations to run
    document.documentElement.style.setProperty('--animation-state', 'running');
    document.documentElement.style.setProperty('--animation-duration', '3s');
    
    if (navbar) {
        // Force navbar glow animation with inline styles
        navbar.style.animation = 'navbarGlow 5s ease-in-out infinite';
        navbar.style.animationPlayState = 'running';
        navbar.style.animationFillMode = 'both';
        navbar.style.willChange = 'background, box-shadow';
    }
    
    // Ensure all nav links have proper animation setup
    navLinks.forEach((link, index) => {
        link.style.setProperty('--index', index);
        link.style.animationPlayState = 'running';
        
        // Force pseudo-element animations via class manipulation
        link.classList.add('cyber-active');
    });
    
    // Force active link glow animation
    activeLinks.forEach(activeLink => {
        activeLink.style.animation = 'activeGlow 2s ease-in-out infinite';
        activeLink.style.animationPlayState = 'running';
        activeLink.style.animationFillMode = 'both';
    });
    
    console.log('Cyber animations forcefully activated');
}

// Use requestAnimationFrame for continuous monitoring
function monitorAnimations() {
    const navbar = document.querySelector('.l-navbar');
    const activeLinks = document.querySelectorAll('.nav__link.active');
    
    if (navbar) {
        // Check if animation is paused and restart
        const computedStyle = window.getComputedStyle(navbar);
        if (computedStyle.animationPlayState === 'paused') {
            navbar.style.animationPlayState = 'running';
        }
    }
    
    activeLinks.forEach(activeLink => {
        const computedStyle = window.getComputedStyle(activeLink);
        if (computedStyle.animationPlayState === 'paused') {
            activeLink.style.animationPlayState = 'running';
        }
    });
    
    // Continue monitoring
    requestAnimationFrame(monitorAnimations);
}

// Handle visibility changes to restart animations
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page is now visible, restart all animations
        forceCyberAnimations();
        setTimeout(() => {
            forceCyberAnimations();
        }, 100);
    }
});

// Restart animations every 10 seconds to ensure they don't stop
setInterval(() => {
    forceCyberAnimations();
    
    // Force CSS custom property updates
    document.documentElement.style.setProperty('--animation-state', 'paused');
    setTimeout(() => {
        document.documentElement.style.setProperty('--animation-state', 'running');
    }, 50);
}, 5000);

// Start continuous monitoring
requestAnimationFrame(monitorAnimations);

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

 
// 3D Particle System for Industrial Tech Theme
// Canvas setup
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to match screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Industrial tech theme particles
const particles = [];
const particleCount = window.innerWidth <= 768 ? 50 : 100;
const connectionDistance = 120;

// Particle class for 3D-like movement
class Particle {
    constructor() {
        this.reset();
        this.opacity = Math.random() * 0.8 + 0.2;
        this.baseSize = Math.random() * 3 + 1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 500 + 100; // Depth for 3D effect
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 2;
    }
    
    update() {
        // 3D movement
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        if (this.z < 100) this.z = 600;
        if (this.z > 600) this.z = 100;
    }
    
    draw() {
        // Calculate size based on depth (3D perspective)
        const perspective = 500 / this.z;
        const size = this.baseSize * perspective;
        const alpha = this.opacity * perspective;
        
        // Pulsing effect
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
        
        // Industrial blue-gray gradient
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, size * 3
        );
        gradient.addColorStop(0, `rgba(100, 149, 237, ${alpha * pulse})`); // Steel blue
        gradient.addColorStop(0.7, `rgba(70, 130, 180, ${alpha * pulse * 0.5})`); // Steel blue darker
        gradient.addColorStop(1, `rgba(47, 79, 79, 0)`); // Dark slate gray
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright spot
        ctx.fillStyle = `rgba(176, 196, 222, ${alpha * pulse * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Draw connections between nearby particles
function drawConnections() {
    ctx.strokeStyle = 'rgba(119, 136, 153, 0.3)'; // Light slate gray
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.5;
                ctx.strokeStyle = `rgba(119, 136, 153, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Grid background for industrial feel
function drawIndustrialGrid() {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(70, 130, 180, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Variables to store animation and timer IDs
let animationId;
let timerId;

// Main animation function
function drawIndustrialParticles() {
    // Clear canvas with dark industrial background
    ctx.fillStyle = 'rgba(25, 25, 35, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw industrial grid
    drawIndustrialGrid();
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections
    drawConnections();
    
    animationId = requestAnimationFrame(drawIndustrialParticles);
}

function stopIndustrialMatrix() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        
        // Clear canvas and remove
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
        
        // Change background to industrial gradient
        document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)';
        
        const contentContainer = document.getElementById('content-container');
        if (contentContainer) {
            contentContainer.style.color = '#ecf0f1';
        }
        
        // Load main.html
        loadContent('./article/main.html');
    }
    
    if (timerId) {
        clearTimeout(timerId);
    }
}

// Handle window resize for 3D particles
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset particles to new dimensions
    particles.forEach(particle => {
        if (particle.x > canvas.width) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = canvas.height;
    });
    
    // 네비게이션 리사이즈 처리
    const navbar = document.getElementById('navbar');
    const navList = navbar ? navbar.querySelector('.nav__list') : null;
    const isMobile = window.innerWidth <= 576;
    
    if (navList) {
        if (!isMobile && navList.classList.contains('show')) {
            // 데스크톱으로 변경시 모바일 메뉴 상태 초기화
            navList.classList.remove('show');
        }
    }
});

// Start 3D particle animation when page loads
animationId = requestAnimationFrame(drawIndustrialParticles);

// Stop animation after duration (모바일에서는 3초, 데스크톱에서는 5초)
const animationDuration = window.innerWidth <= 768 ? 3000 : 5000;
timerId = setTimeout(stopIndustrialMatrix, animationDuration);
