/* Ersel Kınık — scroll motion.
   Everything here is progressive: without it the page is fully readable. */
(function () {
  'use strict';

  var root = document.documentElement;
  window.__siteReady = true;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-reveal], [data-fan]'));

  /* 1. Reveal on scroll: cards are dealt onto the table as they enter the screen. */
  function revealAll() {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* 2. Parallax: the hero cards drift a little slower than the page. */
  var fan = document.querySelector('[data-fan]');
  if (fan && !reduceMotion) {
    var ticking = false;
    var update = function () {
      var shift = Math.min(window.scrollY * 0.1, 60);
      fan.style.setProperty('--parallax', shift.toFixed(1) + 'px');
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  root.classList.add('motion-ready');
})();
