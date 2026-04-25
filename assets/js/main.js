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
    
    // Setup video performance optimization
    setupVideoPerformanceOptimization();
    
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
            
            // Re-setup video optimization for newly loaded content
            setTimeout(() => {
                setupVideoPerformanceOptimization();
            }, 100);
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

// Industrial tech theme particles - Enhanced with performance control
const particles = [];
let particleCount = window.innerWidth <= 768 ? 80 : 150; // Increased particle count
const connectionDistance = 150; // Increased connection distance
let isVideoPlaying = false;
let performanceMode = false;

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
        // 3D movement with slight randomization
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        this.vz += (Math.random() - 0.5) * 0.1;
        
        // Limit velocity
        this.vx = Math.max(-2, Math.min(2, this.vx));
        this.vy = Math.max(-2, Math.min(2, this.vy));
        this.vz = Math.max(-3, Math.min(3, this.vz));
        
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
        
        // Occasional velocity changes for more organic movement
        if (Math.random() < 0.005) {
            this.vx += (Math.random() - 0.5) * 0.5;
            this.vy += (Math.random() - 0.5) * 0.5;
        }
    }
    
    draw() {
        // Calculate size based on depth (3D perspective)
        const perspective = 500 / this.z;
        const size = this.baseSize * perspective;
        const alpha = this.opacity * perspective;
        
        // Pulsing effect
        const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
        
        // Varied industrial colors
        const colorVariant = Math.sin(Date.now() * 0.001 + this.pulseOffset) * 0.5 + 0.5;
        const r = Math.floor(70 + colorVariant * 130);  // Steel blue variations
        const g = Math.floor(100 + colorVariant * 149);
        const b = Math.floor(180 + colorVariant * 57);
        
        // Industrial blue-gray gradient with color variations
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, size * 3
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * pulse})`);
        gradient.addColorStop(0.7, `rgba(${Math.floor(r*0.7)}, ${Math.floor(g*0.7)}, ${Math.floor(b*0.7)}, ${alpha * pulse * 0.5})`);
        gradient.addColorStop(1, `rgba(47, 79, 79, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright spot with cyber cyan accent
        if (Math.random() < 0.1) {
            ctx.fillStyle = `rgba(0, 188, 212, ${alpha * pulse * 0.8})`;
        } else {
            ctx.fillStyle = `rgba(176, 196, 222, ${alpha * pulse * 0.8})`;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles with performance awareness
function initializeParticles() {
    particles.length = 0; // Clear existing particles
    const currentParticleCount = performanceMode ? Math.floor(particleCount * 0.3) : particleCount;
    
    for (let i = 0; i < currentParticleCount; i++) {
        particles.push(new Particle());
    }
}

// Detect video playback and adjust performance
function setupVideoPerformanceOptimization() {
    // Monitor video elements
    const videos = document.querySelectorAll('video[data-performance-optimized]');
    
    videos.forEach(video => {
        video.addEventListener('play', () => {
            isVideoPlaying = true;
            performanceMode = true;
            console.log('Video playing - enabling performance mode');
            initializeParticles(); // Reduce particles
        });
        
        video.addEventListener('pause', () => {
            isVideoPlaying = false;
            performanceMode = false;
            console.log('Video paused - disabling performance mode');
            initializeParticles(); // Restore particles
        });
        
        video.addEventListener('ended', () => {
            isVideoPlaying = false;
            performanceMode = false;
            console.log('Video ended - disabling performance mode');
            initializeParticles(); // Restore particles
        });
    });
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Draw connections between nearby particles with enhanced effects and performance optimization
function drawConnections() {
    const maxConnections = performanceMode ? 50 : 200; // Limit connections in performance mode
    let connectionCount = 0;
    
    for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
        for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * (performanceMode ? 0.2 : 0.4);
                const pulse = performanceMode ? 1 : Math.sin(Date.now() * 0.002 + distance * 0.01) * 0.3 + 0.7;
                
                // Reduced cyber cyan connections in performance mode
                const cyanChance = performanceMode ? 0.02 : 0.05;
                if (Math.random() < cyanChance) {
                    ctx.strokeStyle = `rgba(0, 188, 212, ${opacity * pulse})`;
                    ctx.lineWidth = 1.5;
                } else {
                    ctx.strokeStyle = `rgba(119, 136, 153, ${opacity * pulse})`;
                    ctx.lineWidth = 1;
                }
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                
                connectionCount++;
            }
        }
    }
}

// Grid background for industrial feel with pulsing effect
function drawIndustrialGrid(intensity = 0.1) {
    const gridSize = 50;
    ctx.strokeStyle = `rgba(70, 130, 180, ${intensity})`;
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
    
    // Add some random glitch lines
    if (Math.random() < 0.01) {
        const glitchY = Math.random() * canvas.height;
        ctx.strokeStyle = `rgba(0, 188, 212, ${Math.random() * 0.3})`;
        ctx.lineWidth = Math.random() * 3;
        ctx.beginPath();
        ctx.moveTo(0, glitchY);
        ctx.lineTo(canvas.width, glitchY);
        ctx.stroke();
    }
}

// Variables to store animation and timer IDs
let animationId;
let timerId;

// Main animation function with enhanced effects and performance optimization
function drawIndustrialParticles() {
    // Performance-aware frame skipping
    const frameSkip = performanceMode ? 2 : 1;
    const currentFrame = Date.now();
    
    if (performanceMode && currentFrame % frameSkip !== 0) {
        animationId = requestAnimationFrame(drawIndustrialParticles);
        return;
    }
    
    // Clear canvas with dark industrial background with slight trail effect
    const trailAlpha = performanceMode ? 0.15 : 0.08;
    ctx.fillStyle = `rgba(15, 20, 25, ${trailAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw industrial grid with subtle pulsing (reduced in performance mode)
    if (!performanceMode || currentFrame % 3 === 0) {
        const pulseIntensity = Math.sin(Date.now() * 0.001) * 0.05 + 0.1;
        drawIndustrialGrid(pulseIntensity * (performanceMode ? 0.5 : 1));
    }
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections (reduce frequency in performance mode)
    if (!performanceMode || currentFrame % 2 === 0) {
        drawConnections();
    }
    
    // Add scanning line effect (disabled in performance mode)
    if (!performanceMode) {
        const scanY = (Date.now() * 0.1) % canvas.height;
        ctx.strokeStyle = 'rgba(0, 188, 212, 0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();
    }
    
    // Continue animation loop FOREVER
    animationId = requestAnimationFrame(drawIndustrialParticles);
}

function stopIndustrialMatrix() {
    // This function is no longer used - matrix animation continues forever
    // Kept for compatibility but matrix will never stop
    console.log('Matrix animation continues forever - this function is disabled');
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

// Start 3D particle animation when page loads and keep it running FOREVER
animationId = requestAnimationFrame(drawIndustrialParticles);

// Load main content after 2 seconds but KEEP the matrix animation running
setTimeout(() => {
    loadContent('./article/main.html');
    
    // Additional video optimization after content load
    setTimeout(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Enable hardware acceleration
            video.style.transform = 'translateZ(0)';
            video.style.willChange = 'transform';
            video.style.backfaceVisibility = 'hidden';
            
            // Optimize playback
            video.preload = 'auto';
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            
            console.log('Video optimization applied');
        });
    }, 500);
}, 2000);

// Ensure animation never stops - restart if it somehow gets cancelled
setInterval(() => {
    if (!animationId) {
        console.log('Restarting matrix animation');
        animationId = requestAnimationFrame(drawIndustrialParticles);
    }
    
    // Memory management for performance
    if (performanceMode && particles.length > particleCount * 0.3) {
        console.log('Reducing particles for video performance');
        particles.length = Math.floor(particleCount * 0.3);
    } else if (!performanceMode && particles.length < particleCount) {
        const missing = particleCount - particles.length;
        for (let i = 0; i < missing; i++) {
            particles.push(new Particle());
        }
    }
}, 1000);

// Add mouse interaction to particles
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Attract particles to mouse
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.vx += dx * 0.0001;
            particle.vy += dy * 0.0001;
        }
    });
});
