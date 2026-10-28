(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('.ab-reveal');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: 0, rootMargin: '0px 0px -40px 0px'});
  sections.forEach(section => observer.observe(section));
  document.documentElement.classList.add('ab-motion');
})();
