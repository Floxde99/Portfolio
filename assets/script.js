// script.js
// Ajoute l'effet "fade-in" aux projets lors du scroll
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
    
    // Fade-in sur les compétences
    const skills = document.querySelectorAll('.skill-item');
    skills.forEach(item => observer.observe(item));
    
    // Smooth scroll pour anciennes versions de navigateurs (optionnel)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
    
    // Menu burger responsive
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
      // Ferme le menu après clic sur un lien
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }
    
    // Ajoute l'effet "fade-in" aux titres de section
    document.querySelectorAll('.section').forEach(section => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      observer.observe(section);
    });
});

// Ajoute dans script.js
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if(loader) loader.style.opacity = 0;
  setTimeout(() => loader && loader.remove(), 500);
});
