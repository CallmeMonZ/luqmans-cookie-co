// Luqman's Cookie Co. — small progressive enhancements. The page works without this file.
(function () {
  'use strict';

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Fade-in on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Feedback form (Formspree via fetch, falls back to normal POST) ----------
  var form = document.querySelector('.feedback-form');
  if (!form || !window.fetch) return;

  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  function setStatus(message, type) {
    status.textContent = message;
    status.className = 'form-status' + (type ? ' is-' + type : '');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      setStatus("The feedback form isn't connected yet. Please check back soon!", 'error');
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';
    setStatus('', '');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        setStatus('Thank you! Your feedback has been sent.', 'success');
      })
      .catch(function () {
        setStatus('Sorry, something went wrong. Please try again.', 'error');
      })
      .then(function () {
        button.disabled = false;
        button.textContent = 'Send feedback';
      });
  });
})();
