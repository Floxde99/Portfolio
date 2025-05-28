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

document.addEventListener('DOMContentLoaded', function() {
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('light-theme')) {
      // Basculer vers le thème sombre
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      // Basculer vers le thème clair
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Ajouter l'écouteur d'événement au bouton
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Vérifier si l'utilisateur a déjà une préférence stockée
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
  
  // Si aucune préférence n'est stockée, utiliser le thème sombre par défaut
  // (Pas besoin de code ici car ton site est déjà en mode sombre par défaut)
});

// Initialisation du carrousel
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  
  let currentIndex = 0;
  let slideWidth = 0;
  let slidesPerView = 1;
  let totalSlides = slides.length;
  let indicators = [];
  
  // Fonction pour initialiser les dimensions
  function initCarousel() {
    // Déterminer combien de slides afficher par vue
    slidesPerView = window.innerWidth >= 1024 ? 2 : 1;
    slideWidth = track.clientWidth / slidesPerView;
    
    // Appliquer la largeur aux slides
    slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
    });
    
    // Créer les indicateurs
    indicatorsContainer.innerHTML = '';
    indicators = [];
    
    const totalGroups = Math.ceil(totalSlides / slidesPerView);
    
    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement('button');
      dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'hover:bg-gray-400', 'transition-colors');
      dot.setAttribute('aria-label', `Voir projet ${i + 1}`);
      
      dot.addEventListener('click', () => {
        goToSlide(i * slidesPerView);
      });
      
      indicatorsContainer.appendChild(dot);
      indicators.push(dot);
    }
    
    // Réinitialiser la position
    goToSlide(0);
  }
  
  // Fonction pour changer de slide
  function goToSlide(index) {
    if (index < 0) {
      index = 0;
    } else if (index > totalSlides - slidesPerView) {
      index = totalSlides - slidesPerView;
    }
    
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // Mettre à jour les indicateurs
    const activeGroup = Math.floor(currentIndex / slidesPerView);
    indicators.forEach((dot, i) => {
      if (i === activeGroup) {
        dot.classList.remove('bg-gray-300');
        dot.classList.add('bg-[var(--color-accent)]', 'scale-125');
      } else {
        dot.classList.add('bg-gray-300');
        dot.classList.remove('bg-[var(--color-accent)]', 'scale-125');
      }
    });
    
    // Activer/désactiver les boutons selon la position
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= totalSlides - slidesPerView;
    
    prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
    nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
  }
  
  // Navigation
  prevButton.addEventListener('click', () => {
    goToSlide(currentIndex - slidesPerView);
  });
  
  nextButton.addEventListener('click', () => {
    goToSlide(currentIndex + slidesPerView);
  });
  
  // Initialiser le carrousel
  initCarousel();
  
  // Réinitialiser lors du redimensionnement
  window.addEventListener('resize', initCarousel);
  
  // Ajouter le swipe pour mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const container = document.querySelector('.carousel-container');
  
  container.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  container.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe à gauche
      goToSlide(currentIndex + slidesPerView);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe à droite
      goToSlide(currentIndex - slidesPerView);
    }
  }
});
