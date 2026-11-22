/**
 * WELLNESS CENTER — MAIN JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+). Zero dependencies.
 * Handles navigation, mobile menu, timetable filters, gallery lightbox,
 * FAQ accordion, form validation, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Header Scroll & Active Nav State
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top visibility
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active nav item
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Hamburger Menu
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });

    // Close when clicking mobile link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // --------------------------------------------------------------------------
  // 3. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: immediately reveal
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. FAQ Accordion Component
  // --------------------------------------------------------------------------
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Optional: close other open items for cleaner feel
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('is-open')) {
            otherItem.classList.remove('is-open');
            const otherHeader = otherItem.querySelector('.accordion-header');
            const otherBody = otherItem.querySelector('.accordion-body');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherBody) otherBody.style.maxHeight = '0px';
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = '0px';
        } else {
          item.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Interactive Timetable Filters (schedule.html)
  // --------------------------------------------------------------------------
  const scheduleContainer = document.querySelector('.schedule-grid');
  if (scheduleContainer) {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter-group]');
    const scheduleCards = scheduleContainer.querySelectorAll('.schedule-card');
    const emptyNotice = document.querySelector('.schedule-empty-msg');

    const activeFilters = {
      day: 'all',
      category: 'all',
      time: 'all',
      level: 'all'
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.filterGroup;
        const value = btn.dataset.filterValue;

        // Update button active state within group
        document.querySelectorAll(`.filter-btn[data-filter-group="${group}"]`).forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        activeFilters[group] = value;
        applyScheduleFilters();
      });
    });

    const applyScheduleFilters = () => {
      let visibleCount = 0;

      scheduleCards.forEach(card => {
        const cardDay = card.dataset.day || 'all';
        const cardCategory = card.dataset.category || 'all';
        const cardTime = card.dataset.time || 'all';
        const cardLevel = card.dataset.level || 'all';

        const matchesDay = activeFilters.day === 'all' || cardDay === activeFilters.day;
        const matchesCategory = activeFilters.category === 'all' || cardCategory === activeFilters.category;
        const matchesTime = activeFilters.time === 'all' || cardTime === activeFilters.time;
        const matchesLevel = activeFilters.level === 'all' || cardLevel === activeFilters.level;

        if (matchesDay && matchesCategory && matchesTime && matchesLevel) {
          card.style.display = 'grid';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyNotice) {
        emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };
  }

  // --------------------------------------------------------------------------
  // 7. Gallery Category Filters & Lightbox (gallery.html)
  // --------------------------------------------------------------------------
  const galleryGrid = document.querySelector('.gallery-grid');
  const lightboxModal = document.querySelector('.lightbox-modal');

  if (galleryGrid) {
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');

    // Filter functionality
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Lightbox modal logic
    if (lightboxModal) {
      let currentIndex = 0;
      const visibleGalleryItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

      const modalClose = lightboxModal.querySelector('.lightbox-close');
      const modalPrev = lightboxModal.querySelector('.lightbox-prev');
      const modalNext = lightboxModal.querySelector('.lightbox-next');
      const modalCaption = lightboxModal.querySelector('.lightbox-caption');
      const modalMeta = lightboxModal.querySelector('.lightbox-meta');
      const modalPlaceholderArea = lightboxModal.querySelector('.lightbox-image-area');

      const showLightboxItem = (index) => {
        const items = visibleGalleryItems();
        if (!items.length) return;
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        currentIndex = index;

        const currentItem = items[currentIndex];
        const title = currentItem.dataset.title || 'Wellness Space Image';
        const filename = currentItem.dataset.filename || 'wellness-space.jpeg';
        const category = currentItem.dataset.category || 'General';

        if (modalCaption) modalCaption.textContent = title;
        if (modalMeta) modalMeta.textContent = `Category: ${category} • Target File: ${filename}`;

        if (modalPlaceholderArea) {
          modalPlaceholderArea.innerHTML = `
            <div class="placeholder-img ratio-16-9" style="max-height: 60vh;">
              <img src="images/${filename}" alt="${title}" onerror="this.src='assets/images/${filename}';">
              <div class="placeholder-overlay">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span class="placeholder-badge">High Resolution Preview</span>
                <code class="placeholder-filename">images/${filename}</code>
                <span class="placeholder-dimensions">Standard: 1920 × 1080 (16:9)</span>
              </div>
            </div>
          `;
        }
      };

      galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const items = visibleGalleryItems();
          const idx = items.indexOf(item);
          if (idx !== -1) {
            showLightboxItem(idx);
            lightboxModal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
          }
        });
      });

      const closeLightbox = () => {
        lightboxModal.classList.remove('is-open');
        document.body.style.overflow = '';
      };

      modalClose?.addEventListener('click', closeLightbox);
      modalPrev?.addEventListener('click', () => showLightboxItem(currentIndex - 1));
      modalNext?.addEventListener('click', () => showLightboxItem(currentIndex + 1));

      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxItem(currentIndex - 1);
        if (e.key === 'ArrowRight') showLightboxItem(currentIndex + 1);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. Booking Form Validation & Submission (booking.html)
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const feedbackBanner = document.getElementById('bookingFeedback');

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Fields to validate
      const name = document.getElementById('fullName');
      const email = document.getElementById('emailAddress');
      const phone = document.getElementById('phoneNumber');
      const service = document.getElementById('serviceSelect');
      const date = document.getElementById('preferredDate');
      const time = document.getElementById('preferredTime');

      const validateField = (input, condition) => {
        if (!condition) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      };

      // Validation logic
      validateField(name, name.value.trim().length >= 2);
      validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      validateField(phone, /^[\d\s\+\-\(\)]{7,15}$/.test(phone.value.trim()));
      validateField(service, service.value !== '');
      validateField(date, date.value !== '');
      validateField(time, time.value !== '');

      if (isValid) {
        if (feedbackBanner) {
          feedbackBanner.style.display = 'block';
          feedbackBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        bookingForm.reset();
      }
    });

    // Real-time error removal
    bookingForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Contact Form Validation & Submission (contact.html)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactFeedback = document.getElementById('contactFeedback');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const message = document.getElementById('contactMessage');

      const validateField = (input, condition) => {
        if (!condition) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      };

      validateField(name, name.value.trim().length >= 2);
      validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      validateField(phone, /^[\d\s\+\-\(\)]{7,15}$/.test(phone.value.trim()));
      validateField(message, message.value.trim().length >= 10);

      if (isValid) {
        if (contactFeedback) {
          contactFeedback.style.display = 'block';
          contactFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      }
    });

    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Smooth Graceful Image Load Handling
  // --------------------------------------------------------------------------
  const placeholderImages = document.querySelectorAll('.placeholder-img img');
  placeholderImages.forEach(img => {
    const showImage = () => {
      const overlay = img.parentElement.querySelector('.placeholder-overlay');
      if (overlay) overlay.style.display = 'none';
      img.style.display = 'block';
    };

    const hideImage = () => {
      img.style.display = 'none';
      const overlay = img.parentElement.querySelector('.placeholder-overlay');
      if (overlay) overlay.style.display = 'flex';
    };

    // Check if the image has already completed loading
    if (img.complete) {
      if (img.naturalWidth > 0) {
        showImage();
      } else {
        hideImage();
      }
    } else {
      img.addEventListener('load', showImage);
      img.addEventListener('error', hideImage);
    }
  });
});
