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
    
    // Smooth scroll pour anciennes versions de navigateurs (optionnel)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });
  