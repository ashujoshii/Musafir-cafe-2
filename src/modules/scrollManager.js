import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollManager() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // GSAP Hero Animations
  gsap.from('.hero-content > *', {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out'
  });

  gsap.from('.hero-visual', {
    scale: 0.88,
    opacity: 0,
    duration: 1.4,
    ease: 'power3.out',
    delay: 0.2
  });

  // Menu Category Switcher
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.menu-category-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-category');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach((panel) => {
        if (panel.id === targetCategory) {
          panel.classList.add('active');
          gsap.fromTo(panel.querySelectorAll('.menu-item, .category-hero-card'), 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
          );
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Parallax on Scroll for Floating Mugs
  gsap.utils.toArray('.floating-mug-3d').forEach((mug) => {
    gsap.to(mug, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: mug,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });
}