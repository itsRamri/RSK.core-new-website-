/**
 * RSK Portfolio - Main App Controller
 * Theme Picker, Navigation, Counters, Skill Meters & Scroll Reveal
 */

function initThemePicker() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('rsk-portfolio-theme') || 'cyan';

  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      setTheme(color);
      localStorage.setItem('rsk-portfolio-theme', color);
    });
  });

  function setTheme(color) {
    document.body.setAttribute('data-theme', color);
    themeBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-color') === color);
    });
  }
}

function initNavbarAndScroll() {
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header && header.classList.add('scrolled');
    } else {
      header && header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  }, { passive: true });

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

function initSkillMetersAndFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar-fill');
        if (bar) {
          const progress = bar.getAttribute('data-progress');
          bar.style.width = progress;
        }
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const speed = target / 35;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.about-stats-grid') || document.querySelector('.hero-bottom-metrics-row');
  if (statsSection) observer.observe(statsSection);
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  revealElements.forEach(el => observer.observe(el));

  // Safety fallback: reveal all elements so nothing is ever hidden permanently
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('revealed'));
  }, 1200);
}

function initResumeModal() {
  const openBtn = document.getElementById('open-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-close-btn');
  const overlay = document.getElementById('resume-overlay');
  const printBtn = document.getElementById('download-print-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('active'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (overlay && modal) {
    overlay.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function initAllMain() {
  initThemePicker();
  initNavbarAndScroll();
  initSkillMetersAndFilter();
  initCounters();
  initScrollReveal();
  initResumeModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllMain);
} else {
  initAllMain();
}
