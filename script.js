// Kunal Dewalwar — Executive Portfolio (single-page)
// Vanilla JS: nav active-state tracking, smooth-scroll, parallax,
// scroll reveal, metric count-up, and contact form handling.

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile nav toggle ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close mobile nav after tapping a link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Active nav link tracking ---------------- */
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    var id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------------- Scroll reveal + metric count-up ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .metric, .timeline');

  function runCountUps(nodes) {
    nodes.forEach(function (node) {
      if (node.dataset.counted) return;
      node.dataset.counted = 'true';
      var raw = node.textContent.trim();
      var match = raw.match(/(-?[\d.]+)/);
      if (!match) return;
      var numStr = match[1];
      var target = parseFloat(numStr);
      var prefix = raw.slice(0, match.index);
      var suffix = raw.slice(match.index + numStr.length);
      var decimals = (numStr.split('.')[1] || '').length;
      var duration = 1200;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = (target * eased).toFixed(decimals);
        node.textContent = prefix + current + suffix;
        if (progress < 1) { requestAnimationFrame(step); } else { node.textContent = raw; }
      }
      requestAnimationFrame(step);
    });
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    runCountUps(document.querySelectorAll('.metric-value'));
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('metric')) {
            runCountUps(entry.target.querySelectorAll('.metric-value'));
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------- Subtle parallax (hero grid + portrait) ---------------- */
  var heroGrid = document.querySelector('.hero-bg-grid');
  var heroPortrait = document.querySelector('.hero-portrait');
  if (!prefersReducedMotion && (heroGrid || heroPortrait)) {
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      if (heroGrid) heroGrid.style.transform = 'translateY(' + (y * 0.15) + 'px)';
      if (heroPortrait && y < window.innerHeight) {
        heroPortrait.style.transform = 'translateY(' + (y * 0.06) + 'px)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var actionUrl = form.getAttribute('action') || '';
    var notConfigured = actionUrl.indexOf('YOUR_FORM_ID') !== -1;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (notConfigured) {
        status.className = 'form-status is-info';
        status.textContent = 'Form endpoint not yet configured — please email dewalwarkunal@gmail.com directly for now. (See README: replace YOUR_FORM_ID in contact.html.)';
        status.style.display = 'block';
        return;
      }

      var data = new FormData(form);
      status.className = 'form-status';
      status.textContent = 'Sending…';
      status.style.display = 'block';

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          status.textContent = 'Thanks — your message has been sent. I\'ll get back to you soon.';
          status.className = 'form-status is-success';
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function () {
        status.textContent = 'Something went wrong sending this. Please email dewalwarkunal@gmail.com directly.';
        status.className = 'form-status is-error';
      });
    });
  }

});
