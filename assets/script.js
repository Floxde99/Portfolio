const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initThemeToggle = () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  }
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });
};

const initNav = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
};

const initRevealOnScroll = () => {
  const revealTargets = document.querySelectorAll(".fade-in, .skill-item, .section");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
};

const initContactForm = () => {
  const form = document.getElementById("contactForm");
  const notification = document.getElementById("notification");
  if (!form || !notification) return;

  const showNotification = (message, type) => {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    if (type === "success") {
      notification.setAttribute("role", "status");
      notification.setAttribute("aria-live", "polite");
    } else {
      notification.setAttribute("role", "alert");
      notification.setAttribute("aria-live", "assertive");
    }
    setTimeout(() => {
      notification.className = "notification";
      notification.textContent = "";
      notification.removeAttribute("role");
      notification.removeAttribute("aria-live");
    }, 5000);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";

    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        showNotification("Message envoyé avec succès !", "success");
        form.reset();
      })
      .catch(() => {
        showNotification("Une erreur s'est produite lors de l'envoi.", "error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer";
      });
  });
};

const initCarousel = () => {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevButton = document.querySelector(".carousel-control.prev");
  const nextButton = document.querySelector(".carousel-control.next");
  const indicatorsContainer = document.querySelector(".carousel-indicators");
  const container = document.querySelector(".carousel-container");

  if (!track || !slides.length || !prevButton || !nextButton || !indicatorsContainer || !container) return;

  let currentIndex = 0;
  let slideWidth = 0;
  let slidesPerView = 1;
  let indicators = [];

  const goToSlide = (index) => {
    if (index < 0) {
      index = 0;
    } else if (index > slides.length - slidesPerView) {
      index = slides.length - slidesPerView;
    }

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    const activeGroup = Math.floor(currentIndex / slidesPerView);
    indicators.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeGroup);
      dot.setAttribute("aria-current", i === activeGroup ? "true" : "false");
    });

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= slides.length - slidesPerView;
  };

  const buildIndicators = (totalGroups) => {
    indicatorsContainer.innerHTML = "";
    indicators = [];
    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Voir projet ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i * slidesPerView));
      indicatorsContainer.appendChild(dot);
      indicators.push(dot);
    }
  };

  const initDimensions = () => {
    slidesPerView = window.innerWidth >= 1024 ? 2 : 1;
    slideWidth = container.clientWidth / slidesPerView;

    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });

    buildIndicators(Math.ceil(slides.length / slidesPerView));
    goToSlide(0);
  };

  prevButton.addEventListener("click", () => goToSlide(currentIndex - slidesPerView));
  nextButton.addEventListener("click", () => goToSlide(currentIndex + slidesPerView));

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initDimensions, 150);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      goToSlide(currentIndex + slidesPerView);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      goToSlide(currentIndex - slidesPerView);
    }
  });

  initDimensions();
};

const initLoader = () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.opacity = 0;
  setTimeout(() => loader.remove(), 500);
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNav();
  initSmoothScroll();
  initRevealOnScroll();
  initContactForm();
  initCarousel();
});

window.addEventListener("load", initLoader);
