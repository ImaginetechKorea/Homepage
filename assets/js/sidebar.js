// 즉시 실행 함수로 스코프 보호
(function () { // 즉시 실행 함수
    let tooltipElement = null; // 툴팁 요소 변수
    let mobileMenuOverlay = null; // 모바일 메뉴 오버레이 변수

    // 모바일 뷰포트인지 확인하는 함수
    function isMobileViewport() {
        const screenWidth = window.screen && typeof window.screen.width === 'number' // 화면 너비 가져오기
            ? window.screen.width // screen.width가 있으면 사용
            : window.innerWidth; // 없으면 window.innerWidth 사용

        return Math.min(window.innerWidth, screenWidth) <= 768; // 768px 이하이면 모바일로 간주
    }

    // body에 적용할 확장 클래스명 반환
    function getBodyExpandedClass() {
        return document.body && document.body.id === 'body-pd' ? 'body-pd' : 'menu-expanded'; // body id에 따라 클래스 결정
    }

    // 모바일 메뉴 오버레이 생성 함수
    function createMobileMenuOverlay() {
        if (mobileMenuOverlay || !document.body) { // 이미 있거나 body 없으면 반환
            return mobileMenuOverlay; // 기존 오버레이 반환
        }

        mobileMenuOverlay = document.createElement('button'); // 버튼 요소 생성
        mobileMenuOverlay.type = 'button'; // 타입 지정
        mobileMenuOverlay.className = 'nav-overlay'; // 클래스 지정
        mobileMenuOverlay.setAttribute('aria-label', 'Close navigation menu'); // 접근성 라벨
        mobileMenuOverlay.hidden = true; // 처음엔 숨김
        document.body.appendChild(mobileMenuOverlay); // body에 추가
        return mobileMenuOverlay; // 오버레이 반환
    }

    // 모바일 메뉴 열기/닫기 상태 설정 함수
    function setMobileMenuState(navbar, toggle, isOpen) {
        const navList = navbar ? navbar.querySelector('.nav__list') : null; // 네비 리스트 찾기
        const overlay = createMobileMenuOverlay(); // 오버레이 생성
        if (!navList || !document.body) { // 요소 없으면 종료
            return;
        }

        navList.classList.toggle('show', isOpen); // 메뉴 보이기/숨기기
        document.body.classList.toggle('menu-open', isOpen); // body에 메뉴 오픈 클래스 토글

        if (overlay) { // 오버레이 표시/숨김
            overlay.hidden = !isOpen;
            overlay.classList.toggle('show', isOpen);
        }

        if (toggle) { // 햄버거 버튼 aria-expanded 속성 변경
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    }

    // 모바일 메뉴 닫기 함수
    function closeMobileMenu(navbar, toggle) {
        setMobileMenuState(navbar, toggle, false); // 메뉴 닫기
    }

    // 툴팁 요소 생성 함수
    function createTooltipElement() {
        if (tooltipElement || !document.body) { // 이미 있거나 body 없으면 반환
            return tooltipElement;
        }

        tooltipElement = document.createElement('div'); // div 생성
        tooltipElement.className = 'nav-tooltip'; // 클래스 지정
        tooltipElement.style.display = 'none'; // 처음엔 숨김
        tooltipElement.style.opacity = '0'; // 투명도 0
        document.body.appendChild(tooltipElement); // body에 추가
        return tooltipElement; // 반환
    }

    // 툴팁 숨기기 함수
    function hideTooltip() {
        if (!tooltipElement) { // 툴팁 없으면 종료
            return;
        }

        tooltipElement.style.opacity = '0'; // 투명도 0
        setTimeout(() => { // 200ms 후 숨김
            if (tooltipElement && tooltipElement.style.opacity === '0') {
                tooltipElement.style.display = 'none';
            }
        }, 200);
    }

    // 툴팁 보여주기 함수
    function showTooltip(event) {
        const navbar = document.getElementById('navbar'); // 네비바 가져오기
        if (!navbar || navbar.classList.contains('expander') || isMobileViewport()) { // 확장/모바일이면 종료
            return;
        }

        const parentLink = event.currentTarget.closest('.nav__link'); // 부모 링크 찾기
        const nameSpan = parentLink ? parentLink.querySelector('.nav_name') : null; // 이름 span 찾기
        const tooltipText = nameSpan ? nameSpan.textContent.trim() : ''; // 텍스트 추출
        if (!tooltipText) { // 텍스트 없으면 종료
            return;
        }

        const tooltip = createTooltipElement(); // 툴팁 요소 생성
        if (!tooltip) { // 없으면 종료
            return;
        }

        const iconRect = event.currentTarget.getBoundingClientRect(); // 아이콘 위치
        tooltip.textContent = tooltipText; // 툴팁 텍스트 설정
        tooltip.style.display = 'block'; // 보이기

        const topPos = iconRect.top + (iconRect.height * 0.5) - (tooltip.offsetHeight * 0.5); // 세로 위치 계산
        const leftPos = iconRect.right + 14; // 가로 위치 계산

        tooltip.style.top = `${topPos}px`; // top 위치 지정
        tooltip.style.left = `${leftPos}px`; // left 위치 지정

        requestAnimationFrame(() => { // 애니메이션 프레임에 투명도 1
            tooltip.style.opacity = '1';
        });
    }

    // 사이드바 토글 버튼 바인딩 함수
    function bindSidebarToggle(navbar, toggle) {
        if (toggle.dataset.sidebarBound === 'true') { // 이미 바인딩 됐으면 종료
            return;
        }

        toggle.dataset.sidebarBound = 'true'; // 바인딩 표시
        toggle.setAttribute('aria-label', 'Toggle navigation menu'); // 접근성 라벨
        toggle.setAttribute('aria-expanded', 'false'); // 확장 여부
        toggle.addEventListener('click', () => { // 클릭 이벤트
            const navList = navbar.querySelector('.nav__list'); // 네비 리스트
            const isMobile = isMobileViewport(); // 모바일 여부

            if (isMobile && navList) { // 모바일이면 메뉴 열기/닫기
                setMobileMenuState(navbar, toggle, !navList.classList.contains('show'));
            } else { // PC면 사이드바 확장/축소
                navbar.classList.toggle('expander');
                document.body.classList.toggle(getBodyExpandedClass());
            }

            hideTooltip(); // 툴팁 숨기기
        });
    }

    // 활성 링크 바인딩 함수
    function bindActiveLinks(navbar) {
        const toggle = document.getElementById('nav-toggle'); // 토글 버튼

        document.querySelectorAll('.nav__link').forEach((link) => { // 모든 링크 반복
            if (link.dataset.sidebarActiveBound === 'true') { // 이미 바인딩 됐으면 종료
                return;
            }

            link.dataset.sidebarActiveBound = 'true'; // 바인딩 표시
            link.addEventListener('click', () => { // 클릭 이벤트
                document.querySelectorAll('.nav__link.active').forEach((activeLink) => {
                    activeLink.classList.remove('active'); // 기존 active 해제
                });
                link.classList.add('active'); // 현재 링크 active

                if (isMobileViewport()) { // 모바일이면 메뉴 닫기
                    closeMobileMenu(navbar, toggle);
                }

                hideTooltip(); // 툴팁 숨기기
            });
        });
    }

    // 서브 메뉴(접기) 바인딩 함수
    function bindCollapseLinks() {
        document.querySelectorAll('.collapse__link').forEach((link) => { // 모든 접기 링크 반복
            if (link.dataset.sidebarCollapseBound === 'true') { // 이미 바인딩 됐으면 종료
                return;
            }

            link.dataset.sidebarCollapseBound = 'true'; // 바인딩 표시
            link.addEventListener('click', function () { // 클릭 이벤트
                const collapseMenu = this.nextElementSibling; // 다음 요소(서브 메뉴)
                if (!collapseMenu) { // 없으면 종료
                    return;
                }

                collapseMenu.classList.toggle('showCollapse'); // 서브 메뉴 열기/닫기
                this.classList.toggle('rotate'); // 아이콘 회전
            });
        });
    }

    // 툴팁 바인딩 함수
    function bindTooltips() {
        document.querySelectorAll('.nav__icon').forEach((icon) => { // 모든 아이콘 반복
            if (icon.dataset.sidebarTooltipBound === 'true') { // 이미 바인딩 됐으면 종료
                return;
            }

            icon.dataset.sidebarTooltipBound = 'true'; // 바인딩 표시
            icon.addEventListener('mouseenter', showTooltip); // 마우스 진입 시 툴팁
            icon.addEventListener('mouseleave', hideTooltip); // 마우스 나갈 때 툴팁 숨김
        });
    }

    // 모바일 메뉴 닫기(오버레이, 바깥 클릭 등) 바인딩 함수
    function bindMobileMenuDismiss(navbar, toggle) {
        if (document.body.dataset.sidebarDismissBound === 'true') { // 이미 바인딩 됐으면 종료
            return;
        }

        document.body.dataset.sidebarDismissBound = 'true'; // 바인딩 표시
        const overlay = createMobileMenuOverlay(); // 오버레이 생성

        if (overlay) { // 오버레이 클릭 시 메뉴 닫기
            overlay.addEventListener('click', () => {
                closeMobileMenu(navbar, toggle);
            });
        }

        document.addEventListener('click', (event) => { // 문서 클릭 시
            if (!isMobileViewport()) { // 모바일 아니면 무시
                return;
            }

            const navList = navbar.querySelector('.nav__list'); // 네비 리스트
            if (!navList || !navList.classList.contains('show')) { // 메뉴 안 열려있으면 무시
                return;
            }

            if (navbar.contains(event.target)) { // 네비바 내부 클릭이면 무시
                return;
            }

            closeMobileMenu(navbar, toggle); // 메뉴 닫기
        });

        document.addEventListener('keydown', (event) => { // 키보드 이벤트
            if (event.key === 'Escape' && isMobileViewport()) { // ESC 누르면 닫기
                closeMobileMenu(navbar, toggle);
            }
        });

        window.addEventListener('resize', () => { // 창 크기 변경 시
            if (!isMobileViewport()) { // 모바일 아니면 닫기
                closeMobileMenu(navbar, toggle);
            }
        });
    }

    // 사이드바 초기화 함수
    function initSharedSidebar() {
        const navbar = document.getElementById('navbar'); // 네비바 요소
        const toggle = document.getElementById('nav-toggle'); // 토글 버튼

        if (!navbar || !toggle || !document.body) { // 요소 없으면 종료
            return;
        }

        bindSidebarToggle(navbar, toggle); // 토글 바인딩
        bindActiveLinks(navbar); // 활성 링크 바인딩
        bindCollapseLinks(); // 접기 바인딩
        bindTooltips(); // 툴팁 바인딩
        bindMobileMenuDismiss(navbar, toggle); // 모바일 닫기 바인딩
    }

    // DOMContentLoaded 시 초기화 함수 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedSidebar); // 로딩 중이면 이벤트로 실행
    } else {
        initSharedSidebar(); // 이미 로드됐으면 바로 실행
    }

    window.initSharedSidebar = initSharedSidebar; // 전역 함수로 등록
})(); // 즉시 실행 함수 끝