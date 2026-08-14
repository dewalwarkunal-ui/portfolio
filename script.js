// Kunal Dewalwar — Executive Portfolio
// Vanilla JS: navigation, smooth-scroll, parallax, reveal, metric count-up, form handling.

document.addEventListener('DOMContentLoaded', function () {
  // Load the redesign layer after the existing design system so the original
  // visual language is preserved while the new page architecture takes over.
  var redesignStyles = document.createElement('link');
  redesignStyles.rel = 'stylesheet';
  redesignStyles.href = 'redesign.css';
  document.head.appendChild(redesignStyles);

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

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

  var revealEls = document.querySelectorAll('.reveal');
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
        node.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step); else node.textContent = raw;
      }
      requestAnimationFrame(step);
    });
  }

  var metricValues = document.querySelectorAll('.metric-value');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    runCountUps(metricValues);
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('metrics-strip')) runCountUps(entry.target.querySelectorAll('.metric-value'));
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    var metrics = document.querySelector('.metrics-strip');
    if (metrics && !metrics.classList.contains('reveal')) {
      var metricObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCountUps(entry.target.querySelectorAll('.metric-value'));
            metricObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      metricObserver.observe(metrics);
    }
  }

  var heroGrid = document.querySelector('.hero-bg-grid');
  var heroPortrait = document.querySelector('.hero-portrait');
  if (!prefersReducedMotion && (heroGrid || heroPortrait)) {
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      if (heroGrid) heroGrid.style.transform = 'translateY(' + (y * 0.15) + 'px)';
      if (heroPortrait && y < window.innerHeight) heroPortrait.style.transform = 'translateY(' + (y * 0.06) + 'px)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var actionUrl = form.getAttribute('action') || '';
    var notConfigured = actionUrl.indexOf('YOUR_FORM_ID') !== -1;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (notConfigured) {
        status.className = 'form-status is-info';
        status.textContent = 'Form endpoint not yet configured — please email dewalwarkunal@gmail.com directly for now.';
        return;
      }
      var data = new FormData(form);
      status.className = 'form-status';
      status.textContent = 'Sending…';
      status.style.display = 'block';
      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('Form submission failed');
          status.textContent = 'Thanks — your message has been sent. I\'ll get back to you soon.';
          status.className = 'form-status is-success';
          form.reset();
        })
        .catch(function () {
          status.textContent = 'Something went wrong sending this. Please email dewalwarkunal@gmail.com directly.';
          status.className = 'form-status is-error';
        });
    });
  }
});
