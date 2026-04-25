(function () {
    let tooltipElement = null;
    let mobileMenuOverlay = null;

    function isMobileViewport() {
        const screenWidth = window.screen && typeof window.screen.width === 'number'
            ? window.screen.width
            : window.innerWidth;

        return Math.min(window.innerWidth, screenWidth) <= 768;
    }

    function getBodyExpandedClass() {
        return document.body && document.body.id === 'body-pd' ? 'body-pd' : 'menu-expanded';
    }

    function createMobileMenuOverlay() {
        if (mobileMenuOverlay || !document.body) {
            return mobileMenuOverlay;
        }

        mobileMenuOverlay = document.createElement('button');
        mobileMenuOverlay.type = 'button';
        mobileMenuOverlay.className = 'nav-overlay';
        mobileMenuOverlay.setAttribute('aria-label', 'Close navigation menu');
        mobileMenuOverlay.hidden = true;
        document.body.appendChild(mobileMenuOverlay);
        return mobileMenuOverlay;
    }

    function setMobileMenuState(navbar, toggle, isOpen) {
        const navList = navbar ? navbar.querySelector('.nav__list') : null;
        const overlay = createMobileMenuOverlay();
        if (!navList || !document.body) {
            return;
        }

        navList.classList.toggle('show', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        if (overlay) {
            overlay.hidden = !isOpen;
            overlay.classList.toggle('show', isOpen);
        }

        if (toggle) {
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    }

    function closeMobileMenu(navbar, toggle) {
        setMobileMenuState(navbar, toggle, false);
    }

    function createTooltipElement() {
        if (tooltipElement || !document.body) {
            return tooltipElement;
        }

        tooltipElement = document.createElement('div');
        tooltipElement.className = 'nav-tooltip';
        tooltipElement.style.display = 'none';
        tooltipElement.style.opacity = '0';
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    function hideTooltip() {
        if (!tooltipElement) {
            return;
        }

        tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (tooltipElement && tooltipElement.style.opacity === '0') {
                tooltipElement.style.display = 'none';
            }
        }, 200);
    }

    function showTooltip(event) {
        const navbar = document.getElementById('navbar');
        if (!navbar || navbar.classList.contains('expander') || isMobileViewport()) {
            return;
        }

        const parentLink = event.currentTarget.closest('.nav__link');
        const nameSpan = parentLink ? parentLink.querySelector('.nav_name') : null;
        const tooltipText = nameSpan ? nameSpan.textContent.trim() : '';
        if (!tooltipText) {
            return;
        }

        const tooltip = createTooltipElement();
        if (!tooltip) {
            return;
        }

        const iconRect = event.currentTarget.getBoundingClientRect();
        tooltip.textContent = tooltipText;
        tooltip.style.display = 'block';

        const topPos = iconRect.top + (iconRect.height * 0.5) - (tooltip.offsetHeight * 0.5);
        const leftPos = iconRect.right + 14;

        tooltip.style.top = `${topPos}px`;
        tooltip.style.left = `${leftPos}px`;

        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
    }

    function bindSidebarToggle(navbar, toggle) {
        if (toggle.dataset.sidebarBound === 'true') {
            return;
        }

        toggle.dataset.sidebarBound = 'true';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', () => {
            const navList = navbar.querySelector('.nav__list');
            const isMobile = isMobileViewport();

            if (isMobile && navList) {
                setMobileMenuState(navbar, toggle, !navList.classList.contains('show'));
            } else {
                navbar.classList.toggle('expander');
                document.body.classList.toggle(getBodyExpandedClass());
            }

            hideTooltip();
        });
    }

    function bindActiveLinks(navbar) {
        const toggle = document.getElementById('nav-toggle');

        document.querySelectorAll('.nav__link').forEach((link) => {
            if (link.dataset.sidebarActiveBound === 'true') {
                return;
            }

            link.dataset.sidebarActiveBound = 'true';
            link.addEventListener('click', () => {
                document.querySelectorAll('.nav__link.active').forEach((activeLink) => {
                    activeLink.classList.remove('active');
                });
                link.classList.add('active');

                if (isMobileViewport()) {
                    closeMobileMenu(navbar, toggle);
                }

                hideTooltip();
            });
        });
    }

    function bindCollapseLinks() {
        document.querySelectorAll('.collapse__link').forEach((link) => {
            if (link.dataset.sidebarCollapseBound === 'true') {
                return;
            }

            link.dataset.sidebarCollapseBound = 'true';
            link.addEventListener('click', function () {
                const collapseMenu = this.nextElementSibling;
                if (!collapseMenu) {
                    return;
                }

                collapseMenu.classList.toggle('showCollapse');
                this.classList.toggle('rotate');
            });
        });
    }

    function bindTooltips() {
        document.querySelectorAll('.nav__icon').forEach((icon) => {
            if (icon.dataset.sidebarTooltipBound === 'true') {
                return;
            }

            icon.dataset.sidebarTooltipBound = 'true';
            icon.addEventListener('mouseenter', showTooltip);
            icon.addEventListener('mouseleave', hideTooltip);
        });
    }

    function bindMobileMenuDismiss(navbar, toggle) {
        if (document.body.dataset.sidebarDismissBound === 'true') {
            return;
        }

        document.body.dataset.sidebarDismissBound = 'true';
        const overlay = createMobileMenuOverlay();

        if (overlay) {
            overlay.addEventListener('click', () => {
                closeMobileMenu(navbar, toggle);
            });
        }

        document.addEventListener('click', (event) => {
            if (!isMobileViewport()) {
                return;
            }

            const navList = navbar.querySelector('.nav__list');
            if (!navList || !navList.classList.contains('show')) {
                return;
            }

            if (navbar.contains(event.target)) {
                return;
            }

            closeMobileMenu(navbar, toggle);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isMobileViewport()) {
                closeMobileMenu(navbar, toggle);
            }
        });

        window.addEventListener('resize', () => {
            if (!isMobileViewport()) {
                closeMobileMenu(navbar, toggle);
            }
        });
    }

    function initSharedSidebar() {
        const navbar = document.getElementById('navbar');
        const toggle = document.getElementById('nav-toggle');

        if (!navbar || !toggle || !document.body) {
            return;
        }

        bindSidebarToggle(navbar, toggle);
        bindActiveLinks(navbar);
        bindCollapseLinks();
        bindTooltips();
        bindMobileMenuDismiss(navbar, toggle);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedSidebar);
    } else {
        initSharedSidebar();
    }

    window.initSharedSidebar = initSharedSidebar;
})();