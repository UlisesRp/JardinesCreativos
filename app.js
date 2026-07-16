const WHATSAPP_NUMBER = "525523819777";
const WHATSAPP_MESSAGE = "Hola, me gustaría solicitar información y cotizar un proyecto con Jardines Creativos.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = whatsappUrl;
});

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const sections = [...document.querySelectorAll("main section[id], header[id]")];
function updateActiveLink() {
  const currentPosition = window.scrollY + 190;
  let currentId = "inicio";
  sections.forEach((section) => {
    if (section.offsetTop <= currentPosition) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}
window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("revealed"));
}

// Carrusel de proyectos
const carousel = document.querySelector(".carousel");
if (carousel) {
  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();
  let maxIndex = getMaxIndex();
  let autoplay;

  function getCardsPerView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - cardsPerView);
  }

  function getCardWidth() {
    const firstCard = cards[0];
    const cardStyle = window.getComputedStyle(firstCard);
    const gap = parseFloat(window.getComputedStyle(track).gap || 0);
    return firstCard.getBoundingClientRect().width + gap;
  }

  function buildDots() {
    dotsContainer.innerHTML = "";
    const totalPages = Math.max(1, maxIndex + 1);
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir al grupo ${i + 1}`);
      if (i === currentIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll("button");
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx === currentIndex));
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
    prevBtn.style.opacity = currentIndex === 0 ? ".55" : "1";
    nextBtn.style.opacity = currentIndex === maxIndex ? ".55" : "1";
  }

  function updateCarousel() {
    const offset = getCardWidth() * currentIndex;
    track.style.transform = `translateX(-${offset}px)`;
    updateButtons();
    updateDots();
  }

  function recalc() {
    cardsPerView = getCardsPerView();
    maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);
    buildDots();
    updateCarousel();
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateCarousel();
    resetAutoplay();
  });

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(() => {
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }, 4200);
  }

  function stopAutoplay() {
    if (autoplay) clearInterval(autoplay);
  }

  function resetAutoplay() {
    startAutoplay();
  }

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  window.addEventListener("resize", recalc);

  recalc();
  startAutoplay();
}

document.getElementById("year").textContent = new Date().getFullYear();
