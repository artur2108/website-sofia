document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initThemeToggle();
  initMobileMenu();
  initReadingProgress();
  initCarousel();
  initContactForm();
  initDownloadSimulation();
});

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
