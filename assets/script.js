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
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value
  };
  
  const notification = document.getElementById('notification');
  
  // Désactiver le bouton pendant l'envoi
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Envoi en cours...';
  
  try {
    const response = await fetch('/.netlify/functions/sendEmail', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Message de succès
      notification.textContent = '✓ Message envoyé avec succès!';
      notification.className = 'notification success';
      e.target.reset(); // Réinitialiser le formulaire
      
      // Effacer la notification après 5 secondes
      setTimeout(() => {
        notification.className = 'notification';
      }, 5000);
    } else {
      // Message d'erreur
      notification.textContent = `✗ Erreur: ${result.error || 'Problème lors de l\'envoi'}`;
      notification.className = 'notification error';
      
      // Effacer la notification après 5 secondes
      setTimeout(() => {
        notification.className = 'notification';
      }, 5000);
    }
  } catch (error) {
    // Message d'erreur pour les exceptions
    notification.textContent = '✗ Une erreur s\'est produite lors de l\'envoi';
    notification.className = 'notification error';
    
    // Effacer la notification après 5 secondes
    setTimeout(() => {
      notification.className = 'notification';
    }, 5000);
  } finally {
    // Réactiver le bouton après l'envoi
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Envoyer';
  }
});
