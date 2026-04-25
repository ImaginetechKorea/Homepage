function isCompactNavigationMode() {
    const screenWidth = window.screen && typeof window.screen.width === 'number'
        ? window.screen.width
        : window.innerWidth;

    return Math.min(window.innerWidth, screenWidth) <= 768;
}

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
                const isMobile = isCompactNavigationMode();
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

            const parser = new DOMParser();
            const pageDocument = parser.parseFromString(html, 'text/html');
            const pageContent = pageDocument.querySelector('main.page-content') || pageDocument.querySelector('.page-content');
            const resolvedPageUrl = new URL(pagePath, window.location.href);

            if (!pageContent) {
                throw new Error(`Page content container not found in ${pagePath}`);
            }

            contentContainer.innerHTML = pageContent.innerHTML;
            applyEarthScene(pagePath);

            contentContainer.querySelectorAll('[src], [href], [poster]').forEach((element) => {
                ['src', 'href', 'poster'].forEach((attributeName) => {
                    const attributeValue = element.getAttribute(attributeName);
                    if (!attributeValue) {
                        return;
                    }

                    if (
                        attributeValue.startsWith('#') ||
                        attributeValue.startsWith('data:') ||
                        attributeValue.startsWith('javascript:') ||
                        /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(attributeValue)
                    ) {
                        return;
                    }

                    element.setAttribute(attributeName, new URL(attributeValue, resolvedPageUrl).href);
                });
            });
            
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

function setupVideoPerformanceOptimization() {
    const videos = document.querySelectorAll('video[data-performance-optimized], video');

    videos.forEach((video) => {
        if (video.dataset.videoOptimized === 'true') {
            return;
        }

        video.dataset.videoOptimized = 'true';
        video.style.transform = 'translateZ(0)';
        video.style.willChange = 'transform';
        video.style.backfaceVisibility = 'hidden';
        video.preload = 'auto';
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
    });
}

function getEarthSceneOptions(pagePath) {
    return {
        canvasId: 'matrixCanvas',
        texturePath: './image/earth-texture.jpg',
        preset: 'main'
    };
}

function applyEarthScene(pagePath) {
    if (typeof window.initEarthScene !== 'function') {
        return;
    }

    window.initEarthScene(getEarthSceneOptions(pagePath));
}

window.addEventListener('resize', () => {
    const navbar = document.getElementById('navbar');
    const navList = navbar ? navbar.querySelector('.nav__list') : null;

    if (navList && !isCompactNavigationMode()) {
        navList.classList.remove('show');
    }
});

applyEarthScene('./article/main.html');
