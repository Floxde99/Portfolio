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
})
});


// Ajoute dans script.js
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if(loader) loader.style.opacity = 0;
  setTimeout(() => loader && loader.remove(), 500);
});

// Dans script.js
document.getElementById('contactForm').addEventListener('submit', function(e) {
  // Empêcher la redirection de page mais soumettre à Netlify
  e.preventDefault();
  
  const notification = document.getElementById('notification');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Envoi en cours...';
  
  // Envoyer le formulaire via l'API Fetch à Netlify
  const formData = new FormData(e.target);
  
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
  .then(() => {
    // Message de succès
    notification.textContent = '✓ Message envoyé avec succès!';
    notification.className = 'notification success';
    e.target.reset(); // Réinitialiser le formulaire
    
    // Effacer la notification après 5 secondes
    setTimeout(() => {
      notification.className = 'notification';
    }, 5000);
  })
  .catch(error => {
    notification.textContent = '✗ Une erreur s\'est produite lors de l\'envoi';
    notification.className = 'notification error';
    
    setTimeout(() => {
      notification.className = 'notification';
    }, 5000);
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Envoyer';
  });
});
