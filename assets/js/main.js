// 기존 코드 유지 (메뉴 확장/축소, 활성 링크, 하위 메뉴 기능)
const showMenu = (toggleId, navbarId, bodyId) => {
  const toggle = document.getElementById(toggleId),
  navbar = document.getElementById(navbarId),
  bodypadding = document.getElementById(bodyId)
  
  if(toggle && navbar) {
      toggle.addEventListener('click', ()=>{
          navbar.classList.toggle('expander');
          bodypadding.classList.toggle('body-pd')
      })
  }
}

showMenu('nav-toggle', 'navbar', 'body-pd')

/* LINK ACTIVE */
const linkColor = document.querySelectorAll('.nav__link')

function colorLink() {
  linkColor.forEach(l=> l.classList.remove('active'))
  this.classList.add('active')
}

linkColor.forEach(l=> l.addEventListener('click', colorLink))

/* COLLAPSE MENU */
const linkCollapse = document.getElementsByClassName('collapse__link')
var i

for(i=0;i<linkCollapse.length;i++) {
  linkCollapse[i].addEventListener('click', function(){
      const collapseMenu = this.nextElementSibling
      collapseMenu.classList.toggle('showCollapse')
      
      const rotate = collapseMenu.previousElementSibling
      rotate.classList.toggle('rotate')
  });
}

// 툴팁 관련 코드 추가 (이전에 제공해 드린 코드)
// ...

// 페이지 로드 기능 추가
document.addEventListener('DOMContentLoaded', function() {
  // 모든 메뉴 링크 선택
  const menuLinks = document.querySelectorAll('.nav__link:not(.collapse), .collapse__sublink');
  
  // 각 링크에 클릭 이벤트 추가
  menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault(); // 기본 링크 동작 방지
          
          // 페이지 경로 가져오기
          const pagePath = this.getAttribute('data-page');
          if (pagePath) {
              loadContent(pagePath);
              
              // 제목 업데이트
              const pageTitle = this.querySelector('.nav_name') ? 
                  this.querySelector('.nav_name').textContent : 
                  this.textContent;
                  
              document.querySelector('#content-area h1').textContent = pageTitle;
          }
      });
  });
  
  // 초기 페이지 로드 (대시보드)
  loadContent('./article/dashboard.html');
});

function loadContent(pagePath) {
    console.log('Fetching content from:', pagePath); // 요청 경로 로그
   /* fetch(pagePath) */
   fetch(pagePath)
        .then(response => {
            console.log('Response status:', response.status); // 응답 상태 로그
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            console.log('Page content loaded successfully.'); // 성공 로그
            document.getElementById('content-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error); // 에러 로그
            document.getElementById('content-container').innerHTML = `
                <div class="error-message">
                    <h2>Error loading content</h2>
                    <p>${error.message}</p>
                    <p>Please check if the page exists: ${pagePath}</p>
                </div>
            `;
        });
}