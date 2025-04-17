// ���� �ڵ� ���� (�޴� Ȯ��/���, Ȱ�� ��ũ, ���� �޴� ���)
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

// ���� ���� �ڵ� �߰� (������ ������ �帰 �ڵ�)
// ...

// ������ �ε� ��� �߰�
document.addEventListener('DOMContentLoaded', function() {
  // ��� �޴� ��ũ ����
  const menuLinks = document.querySelectorAll('.nav__link:not(.collapse), .collapse__sublink');
  
  // �� ��ũ�� Ŭ�� �̺�Ʈ �߰�
  menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault(); // �⺻ ��ũ ���� ����
          
          // ������ ��� ��������
          const pagePath = this.getAttribute('data-page');
          if (pagePath) {
              loadContent(pagePath);
              
              // ���� ������Ʈ
              const pageTitle = this.querySelector('.nav_name') ? 
                  this.querySelector('.nav_name').textContent : 
                  this.textContent;
                  
              document.querySelector('#content-area h1').textContent = pageTitle;
          }
      });
  });
  
  // �ʱ� ������ �ε� (��ú���)
  loadContent('./article/dashboard.html');
});

function loadContent(pagePath) {
    console.log('Fetching content from:', pagePath); // ��û ��� �α�
   /* fetch(pagePath) */
   fetch(pagePath)
        .then(response => {
            console.log('Response status:', response.status); // ���� ���� �α�
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            console.log('Page content loaded successfully.'); // ���� �α�
            document.getElementById('content-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error); // ���� �α�
            document.getElementById('content-container').innerHTML = `
                <div class="error-message">
                    <h2>Error loading content</h2>
                    <p>${error.message}</p>
                    <p>Please check if the page exists: ${pagePath}</p>
                </div>
            `;
        });
}