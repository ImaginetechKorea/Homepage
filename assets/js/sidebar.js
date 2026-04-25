(function () {
    let tooltipElement = null;

    function getBodyExpandedClass() {
        return document.body && document.body.id === 'body-pd' ? 'body-pd' : 'menu-expanded';
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
        if (!navbar || navbar.classList.contains('expander') || window.innerWidth <= 576) {
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
        toggle.addEventListener('click', () => {
            const navList = navbar.querySelector('.nav__list');
            const isMobile = window.innerWidth <= 576;

            if (isMobile && navList) {
                navList.classList.toggle('show');
            } else {
                navbar.classList.toggle('expander');
                document.body.classList.toggle(getBodyExpandedClass());
            }

            hideTooltip();
        });
    }

    function bindActiveLinks(navbar) {
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

                const navList = navbar.querySelector('.nav__list');
                if (window.innerWidth <= 576 && navList) {
                    navList.classList.remove('show');
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedSidebar);
    } else {
        initSharedSidebar();
    }

    window.initSharedSidebar = initSharedSidebar;
})();