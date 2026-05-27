document.addEventListener('DOMContentLoaded', async () => {
  // 1. Carregar Header e Footer dinamicamente (compatível com local file:// e GitHub Pages)
  await loadHeaderAndFooter();

  // 2. Inicializar componentes interativos (agora que os elementos já existem no DOM)
  initThemeToggle();
  initMobileMenu();
  initReadingProgress();
  initCarousel();
  initContactForm();
  initDownloadSimulation();
});

/* ==========================================================================
   CARREGAMENTO DINÂMICO DE CABEÇALHO E RODAPÉ (INJEÇÃO DIRETA POR JS COM FETCH)
   ========================================================================== */
async function loadHeaderAndFooter() {
  const headerPlaceholder = document.getElementById('main-header');
  const footerPlaceholder = document.getElementById('main-footer');

  // Cabeçalho HTML padrão (Fallback caso rode localmente via file://)
  const defaultHeaderHTML = `<div class="container header-container">
  <a href="index.html" class="logo" id="logo-brand">
    ARABESCOS
  </a>

  <nav>
    <ul class="nav-menu" id="nav-menu">
      <li><a href="index.html" class="nav-link" id="nav-home">Início</a></li>
      <li><a href="opiniao.html" class="nav-link" id="nav-opiniao">Opinião</a></li>
      <li><a href="artigos.html" class="nav-link" id="nav-artigos">Artigos</a></li>
      <li><a href="sobre-nos.html" class="nav-link" id="nav-about">Quem escreve?</a></li>
      <li class="theme-toggle-container">
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Alternar Tema Claro/Escuro">
          <svg class="sun-icon" viewBox="0 0 24 24">
            <path
              d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.38-.39.38-1.03 0-1.41z" />
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24">
            <path
              d="M12.3 22h-.1c-5.5 0-10-4.5-10-10C2.2 6.8 6.3 2.5 11.5 2c.5-.1 1 .3 1 .8s-.2.9-.7 1.1c-3.6 1.3-6 4.7-6 8.5 0 4.7 3.9 8.5 8.7 8.5 2.5 0 4.8-1.1 6.4-2.9.3-.4.9-.5 1.3-.2s.5.9.2 1.3c-2 2.4-5 3.9-8.1 3.9z" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>

  <button class="mobile-toggle" id="menu-toggle" aria-label="Abrir Menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>`;

  // Rodapé HTML padrão (Fallback caso rode localmente via file://)
  const defaultFooterHTML = `<div class="container footer-grid">
  <div class="footer-brand">
    <a href="index.html" class="footer-logo">ARABESCOS</a>
    <p class="footer-desc">Portfólio de ensaios e crónicas da cadeira de Técnicas de Expressão Jornalística (Online).</p>
  </div>

  <div class="footer-links-widget">
    <h4 class="footer-widget-title">Menu</h4>
    <ul class="footer-links">
      <li><a href="index.html" class="footer-link">Início</a></li>
      <li><a href="opiniao.html" class="footer-link">Opinião</a></li>
      <li><a href="artigos.html" class="footer-link">Artigos</a></li>
      <li><a href="sobre-nos.html" class="footer-link">Quem Escreve</a></li>
    </ul>
  </div>

  <div class="footer-links-widget">
    <h4 class="footer-widget-title">Contacto</h4>
    <ul class="footer-links">
      <li><a href="mailto:sofianazzare@gmail.com" class="footer-link">sofianazzare@gmail.com</a></li>
      <li class="footer-link">Porto, Portugal</li>
    </ul>
  </div>
</div>

<div class="container footer-bottom">
  <div class="footer-copyright">
    &copy; 2026 ARABESCOS. Desenvolvido com amor e integridade.
  </div>
  <ul class="footer-bottom-links">
    <li><a href="#" class="footer-bottom-link">Cookies</a></li>
    <li><a href="https://www.up.pt/flup/pt/" target="_blank" class="footer-bottom-link">FLUP</a></li>
  </ul>
</div>`;

  // Tenta carregar os ficheiros externos dinamicamente se estiver usando um servidor (http/https)
  if (window.location.protocol.startsWith('http')) {
    try {
      const [headerRes, footerRes] = await Promise.all([
        fetch('header.html').then(r => r.ok ? r.text() : null),
        fetch('footer.html').then(r => r.ok ? r.text() : null)
      ]);

      if (headerPlaceholder && headerRes) {
        headerPlaceholder.innerHTML = headerRes;
        setActiveNavLink();
      } else if (headerPlaceholder) {
        headerPlaceholder.innerHTML = defaultHeaderHTML;
        setActiveNavLink();
      }

      if (footerPlaceholder && footerRes) {
        footerPlaceholder.innerHTML = footerRes;
      } else if (footerPlaceholder) {
        footerPlaceholder.innerHTML = defaultFooterHTML;
      }
      return;
    } catch (e) {
      console.warn("Não foi possível carregar header.html ou footer.html dinamicamente via fetch:", e);
    }
  }

  // Se estiver rodando localmente via file:// ou se o fetch falhar:
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = defaultHeaderHTML;
    setActiveNavLink();
  }

  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = defaultFooterHTML;
  }
}

/* Destaque dinâmico do menu ativo baseado no ficheiro atual */
function setActiveNavLink() {
  const path = window.location.pathname;
  const currentPath = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  // Mapear artigos individuais para a sua categoria correspondente
  let activeHref = currentPath;
  if (currentPath === 'artigo-feedly.html' || currentPath === 'artigo-instapaper.html') {
    activeHref = 'opiniao.html';
  } else if (currentPath === 'artigo-politica.html') {
    activeHref = 'artigos.html';
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === activeHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   THEME SWITCHER SYSTEM (LIGHT / DARK)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve previous preference or check system settings
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set theme on body
  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Smooth transition trigger
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close when clicking outside of menu
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ==========================================================================
   READING PROGRESS BAR (ARTICLE DETAILS)
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercentage + '%';
    }
  });
}

/* ==========================================================================
   INTERACTIVE CAROUSEL SLIDER (GUIDES / STEPS)
   ========================================================================== */
function initCarousel() {
  const carousel = document.querySelector('.carousel-container');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  
  let currentIdx = 0;
  const totalSlides = slides.length;

  // Create dot indicators
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ver slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(dot);
  }

  const dots = indicatorsContainer.querySelectorAll('.carousel-dot');

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIdx * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIdx);
    });
  }

  function goToSlide(index) {
    currentIdx = (index + totalSlides) % totalSlides;
    updateCarousel();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIdx - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIdx + 1);
    });
  }

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      // Check if carousel is in viewport
      const rect = carousel.getBoundingClientRect();
      const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (inViewport) goToSlide(currentIdx - 1);
    } else if (e.key === 'ArrowRight') {
      const rect = carousel.getBoundingClientRect();
      const inViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (inViewport) goToSlide(currentIdx + 1);
    }
  });
}

/* ==========================================================================
   PREMIUM CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic fields validation
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simulate sending progress with button loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    setTimeout(() => {
      // Reset form fields
      contactForm.reset();
      
      // Hide form & show beautiful overlay message
      contactForm.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 1500);
  });
}

/* ==========================================================================
   SIMULATED ASSET DOWNLOAD
   ========================================================================== */
function initDownloadSimulation() {
  const downloadBtns = document.querySelectorAll('.btn-download-mock');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const fileName = btn.getAttribute('data-filename') || 'ficheiro';
      
      // Visual feedback of loading
      btn.style.opacity = '0.7';
      btn.innerHTML = 'A descarregar...';
      
      setTimeout(() => {
        btn.style.opacity = '1';
        btn.innerHTML = `DESCARREGADO: ${fileName}`;
        
        // Custom message
        alert(`O ficheiro "${fileName}" foi descarregado com sucesso! (Simulação de transferência)`);
      }, 1200);
    });
  });
}
