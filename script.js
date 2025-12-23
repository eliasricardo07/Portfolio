// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Atualiza o ano no footer
  document.getElementById('y').textContent = new Date().getFullYear();
  
  // 2. Scroll suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Ajuste para o menu fixo
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 3. Otimização de iframes (lazy loading)
  const iframes = document.querySelectorAll('iframe[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const iframeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          // Já está carregando por causa do loading="lazy"
          iframeObserver.unobserve(iframe);
        }
      });
    }, {
      rootMargin: '50px' // Carrega 50px antes de entrar na viewport
    });
    
    iframes.forEach(iframe => {
      iframeObserver.observe(iframe);
    });
  }
  
  // 4. Previne layout shift das imagens
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) {
      // Imagem já carregada
      img.style.opacity = '1';
    } else {
      // Imagem ainda carregando
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
    }
  });
  
  // 5. Menu responsivo para telas muito pequenas
  function setupMobileMenu() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    const brand = document.querySelector('.brand');
    
    if (window.innerWidth <= 600) {
      // Cria botão de menu mobile
      if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        
        menuToggle.addEventListener('click', function() {
          navLinks.classList.toggle('show');
          this.setAttribute('aria-expanded', 
            navLinks.classList.contains('show').toString()
          );
        });
        
        brand.parentNode.insertBefore(menuToggle, brand.nextSibling);
        
        // Estilos para o menu mobile
        const style = document.createElement('style');
        style.textContent = `
          .menu-toggle {
            background: none;
            border: 1px solid var(--border);
            color: var(--fg);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.2rem;
          }
          
          @media (max-width: 600px) {
            .nav-links {
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: rgba(0,0,0,0.95);
              backdrop-filter: blur(10px);
              flex-direction: column;
              padding: 20px;
              gap: 15px;
              display: none;
            }
            
            .nav-links.show {
              display: flex;
            }
            
            .nav-links a {
              width: 100%;
              text-align: center;
              padding: 12px;
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      // Remove menu mobile em telas maiores
      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle) {
        menuToggle.remove();
      }
      navLinks.classList.remove('show');
    }
  }
  
  // Configura menu na carga e no resize
  setupMobileMenu();
  window.addEventListener('resize', setupMobileMenu);
  
  // 6. Melhora performance em scroll
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    document.body.classList.add('scrolling');
    
    scrollTimeout = setTimeout(function() {
      document.body.classList.remove('scrolling');
    }, 100);
  });
  
  // 7. Feedback visual para botões
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    btn.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
});