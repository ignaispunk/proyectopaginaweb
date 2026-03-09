/* ═══════════════════════════════════════════════════
   HQR Ingeniería — Main JavaScript
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM Elements ───
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const navLinks = document.querySelectorAll('.header__link');
  const sections = document.querySelectorAll('section[id]');

  // ─── Mobile Nav Overlay ───
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // ─── Sticky Header ───
  function handleScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Mobile Menu ───
  function openMenu() {
    nav.classList.add('open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function () {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  // ─── Active Navigation ───
  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ─── Scroll Animations (Intersection Observer) ───
  var animElements = document.querySelectorAll('.anim-fade-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ─── Contact Form ───
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    var inputs = contactForm.querySelectorAll('.form__input');
    inputs.forEach(function (input) {
      input.classList.remove('error');
    });

    // Validate
    var nombre = contactForm.querySelector('#nombre');
    var email = contactForm.querySelector('#email');
    var mensaje = contactForm.querySelector('#mensaje');
    var isValid = true;

    if (!nombre.value.trim()) {
      nombre.classList.add('error');
      isValid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      isValid = false;
    }

    if (!mensaje.value.trim()) {
      mensaje.classList.add('error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate send
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(function () {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        'Enviar Mensaje <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      formSuccess.classList.add('visible');

      setTimeout(function () {
        formSuccess.classList.remove('visible');
      }, 5000);
    }, 1200);
  });

  // ─── Remove error state on input ───
  document.querySelectorAll('.form__input').forEach(function (input) {
    input.addEventListener('input', function () {
      this.classList.remove('error');
    });
  });
})();
