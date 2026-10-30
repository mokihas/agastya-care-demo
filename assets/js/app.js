/**
 * Agastya Care — Studio Demo Scripts
 * Clean, modern vanilla JS for scroll states, drawer navigation,
 * review strip slider, accordions, and appointment modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Sticky Header: Transparent over hero -> Blurred cream bar on scroll
  // --------------------------------------------------------------------------
  const header = document.getElementById('siteHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Overlay & Drawer
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const closeMobileNavBtn = document.getElementById('closeMobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileNav = () => {
    if (!hamburgerBtn || !mobileNavOverlay) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavOverlay.classList.add('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (!hamburgerBtn || !mobileNavOverlay) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavOverlay.classList.remove('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavOverlay.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (closeMobileNavBtn) {
    closeMobileNavBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Smooth Anchor Scrolling & Active Nav Highlighting
  // --------------------------------------------------------------------------
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 120;

    navSections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Horizontal Scroll-Snap Strip Controls (Reviews)
  // --------------------------------------------------------------------------
  const reviewsStrip = document.getElementById('reviewsScrollStrip');
  const prevReviewBtn = document.getElementById('prevReviewBtn');
  const nextReviewBtn = document.getElementById('nextReviewBtn');

  if (reviewsStrip && prevReviewBtn && nextReviewBtn) {
    prevReviewBtn.addEventListener('click', () => {
      reviewsStrip.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextReviewBtn.addEventListener('click', () => {
      reviewsStrip.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Clean Accordion Logic (FAQ)
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        const otherAns = otherItem.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isCurrentlyActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Open first FAQ item by default for demonstration
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBtn = firstItem.querySelector('.faq-question-btn');
    const firstAns = firstItem.querySelector('.faq-answer');
    if (firstItem && firstBtn && firstAns) {
      firstItem.classList.add('active');
      firstBtn.setAttribute('aria-expanded', 'true');
      firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
    }
  }

  // --------------------------------------------------------------------------
  // 6. Scroll Reveal Animations (Respects prefers-reduced-motion)
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-item').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Appointment Modal Handling
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('appointmentModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openModalBtns = document.querySelectorAll('[data-open-modal="appointment"]');
  const modalServiceName = document.getElementById('modalServiceName');
  const quickBookForm = document.getElementById('quickBookForm');

  const openAppointmentModal = (serviceTitle = '') => {
    if (!modalBackdrop) return;
    if (modalServiceName) {
      modalServiceName.textContent = serviceTitle ? `Consultation for: ${serviceTitle}` : 'General Doctor Consultation';
    }
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeAppointmentModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openAppointmentModal(service);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAppointmentModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeAppointmentModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeAppointmentModal();
    }
  });

  if (quickBookForm) {
    quickBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value.trim();
      const patientPhone = document.getElementById('patientPhone').value.trim();
      const patientDate = document.getElementById('patientDate').value.trim();
      const serviceText = modalServiceName ? modalServiceName.textContent : 'General Consultation';

      let message = `Hello Agastya Care, I would like to book a consultation.`;
      if (patientName) message += `\nName: ${patientName}`;
      if (patientPhone) message += `\nPhone: ${patientPhone}`;
      if (patientDate) message += `\nTiming: ${patientDate}`;
      if (serviceText) message += `\n${serviceText}`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917974418885?text=${encodedMsg}`;

      closeAppointmentModal();
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
