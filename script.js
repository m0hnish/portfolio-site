// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Check for saved theme preference or system preference
function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// Scroll-triggered fade-in for sections
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.project-card, .yt-card, .about-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add visible state styles
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);

// Stagger animation for grid items
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.project-card, .yt-card, .about-card');
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
        card.classList.add('visible');
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.portfolio-grid, .yt-carousel, .about-grid').forEach(grid => {
  gridObserver.observe(grid);
});

// YouTube Carousel Arrows
const carousel = document.querySelector('.yt-carousel');
const arrowLeft = document.querySelector('.yt-arrow--left');
const arrowRight = document.querySelector('.yt-arrow--right');

if (carousel && arrowLeft && arrowRight) {
  const scrollAmount = 340;

  function updateArrows() {
    arrowLeft.classList.toggle('hidden', carousel.scrollLeft <= 0);
    arrowRight.classList.toggle('hidden',
      carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1
    );
  }

  arrowLeft.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  arrowRight.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', updateArrows);
  updateArrows();
}
