import { useEffect } from 'react';

/**
 * Custom hook to reveal elements with [data-reveal] attribute on scroll
 * with robust threshold, rootMargin, dynamic re-observation, and fallback timeout.
 */
export const useScrollReveal = (deps = []) => {
  useEffect(() => {
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
    }, { threshold: 0, rootMargin: '120px 0px 50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    const timer = setTimeout(() => {
      revealElements.forEach(el => el.classList.add('revealed'));
    }, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, deps);
};
