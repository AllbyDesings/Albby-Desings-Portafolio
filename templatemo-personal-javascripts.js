/*

TemplateMo 593 personal shape
https://templatemo.com/tm-593-personal-shape

*/

// JavaScript Document

// Mobile menu functionality
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "auto";
    mobileMenuToggle.setAttribute(
      "aria-expanded",
      mobileMenu.classList.contains("active") ? "true" : "false",
    );
    mobileMenu.setAttribute(
      "aria-hidden",
      mobileMenu.classList.contains("active") ? "false" : "true",
    );
  });
}

// Close mobile menu when clicking on links
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenuToggle) mobileMenuToggle.classList.remove("active");
    if (mobileMenu) mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
    if (mobileMenuToggle)
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenuToggle || !mobileMenu) return;

  if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }
});

/* ===================================================
   NAVBAR â€” aparece al salir del hero, desaparece al volver
=================================================== */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const heroSection = document.getElementById("home");
  if (!navbar || !heroSection) return;

  let ticking = false;

  function updateNavbar() {
    // Altura real del hero en pÃ­xeles
    const heroBottom =
      heroSection.getBoundingClientRect().bottom + window.scrollY;

    if (window.scrollY >= heroBottom) {
      navbar.classList.add("navbar--visible");
    } else {
      navbar.classList.remove("navbar--visible");
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    },
    { passive: true },
  );

  // Verificar estado inicial por si la pÃ¡gina carga con scroll
  updateNavbar();

  // â”€â”€ Barra deslizante progresiva + relleno CTA â”€â”€
  const navLinksList = navbar.querySelectorAll(".nav-link");
  const navLinksWrap = navbar.querySelector(".nav-links");

  // Crear el indicador dentro del ul
  const indicator = document.createElement("span");
  indicator.className = "nav-indicator";
  navLinksWrap.style.position = "relative";
  navLinksWrap.appendChild(indicator);

  // Secciones que tienen link en el navbar (en orden DOM)
  const sections = Array.from(document.querySelectorAll("section[id]")).filter(
    (s) => navbar.querySelector(`.nav-link[href="#${s.id}"]`),
  );

  // Devuelve el centro X de un link relativo al ul
  function linkCenter(linkEl) {
    const ulRect = navLinksWrap.getBoundingClientRect();
    const r = linkEl.getBoundingClientRect();
    return r.left - ulRect.left + r.width / 2;
  }

  // Posiciona la barra en X dado (centro) y activa/desactiva clases
  function placeIndicator(centerX, isCTA) {
    if (isCTA) {
      indicator.style.opacity = "0";
    } else {
      indicator.style.left = centerX - 18 + "px";
      indicator.style.width = "36px";
      indicator.style.opacity = "1";
    }
  }

  // Actualiza clases .nav-link--active
  function updateActiveClasses(progress, fromIdx, toIdx) {
    // El link "dominante" es el de destino si progress > 0.5, si no el de origen
    const dominantIdx = progress >= 0.5 ? toIdx : fromIdx;
    navLinksList.forEach((link, i) => {
      link.classList.toggle("nav-link--active", i === dominantIdx);
    });
  }

  // Calcula y aplica la posiciÃ³n de la barra segÃºn el scroll
  function updateIndicator() {
    if (!navbar.classList.contains("navbar--visible")) return;

    const scrollY = window.scrollY;
    // Scroll total disponible
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    // Progreso global 0â†’1 con easing â€” avanza lento al inicio, llega al final
    const raw =
      maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;
    const globalProgress = raw * raw; // ease-in cuadrÃ¡tico: lento al inicio, normal al final

    // Cada link ocupa un tramo igual del recorrido total
    const n = navLinksList.length; // nÃºmero de links
    // globalProgress va de 0 a 1, lo mapeamos a 0...(n-1)
    const mapped = globalProgress * (n - 1);
    const fromIdx = Math.min(Math.floor(mapped), n - 2);
    const toIdx = fromIdx + 1;
    const progress = mapped - fromIdx; // 0â†’1 dentro del tramo

    const fromLink = navLinksList[fromIdx];
    const toLink = navLinksList[toIdx];

    // Centro X de cada link
    const fromX = linkCenter(fromLink);
    const toX = linkCenter(toLink);
    const centerX = fromX + (toX - fromX) * progress;

    // Â¿Llegamos al CTA?
    const isCTA =
      (toLink.classList.contains("nav-link--cta") && progress >= 0.5) ||
      (fromLink.classList.contains("nav-link--cta") && progress < 0.5);

    // Clases activas (dominante es el link mÃ¡s cercano)
    const dominantIdx = progress >= 0.5 ? toIdx : fromIdx;
    navLinksList.forEach((link, i) => {
      const active = i === dominantIdx;
      link.classList.toggle("nav-link--active", active);
    });

    placeIndicator(centerX, isCTA);
  }

  // Escuchar scroll con rAF
  let indTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!indTicking) {
        requestAnimationFrame(() => {
          updateIndicator();
          indTicking = false;
        });
        indTicking = true;
      }
    },
    { passive: true },
  );

  // Llamada inicial cuando el navbar aparece
  window.addEventListener("scroll", updateIndicator, {
    passive: true,
    once: true,
  });
})();

/* ===================================================
   TYPEWRITER â€” "DiseÃ±adora y creadora"
=================================================== */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const text = "Diseñadora y creadora";
  let i = 0;
  // PequeÃ±o retardo inicial para que el logo ya haya aparecido
  const delay = 900;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 65);
    }
    // Al terminar de escribir, parpadeo del cursor se queda
  }

  setTimeout(type, delay);
})();

/* ===================================================
   CONTADORES ANIMADOS â€” stats del About
=================================================== */
(function initStats() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  let animated = false;

  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach((el) => {
          const target = parseInt(el.getAttribute("data-target"), 10);
          const duration = 1600; // ms totales de la animaciÃ³n
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easing ease-out cuadratic
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        });
      }
    },
    { threshold: 0.6 },
  );

  // Observamos el contenedor de stats
  const statsContainer = document.querySelector(".about-stats");
  if (statsContainer) statsObserver.observe(statsContainer);
})();

// Scroll animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -80px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

// Portfolio animation
const portfolioObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(
          ".portfolio-item, .portfolio-category-card",
        );

        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("animate");
          }, index * 150);
        });
      }
    });
  },
  { threshold: 0.1 },
);

// Observe elements
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right",
  );

  animatedElements.forEach((el) => observer.observe(el));

  const portfolioSection = document.querySelector(
    ".portfolio-showcase, .portfolio-grid",
  );

  if (portfolioSection) {
    portfolioObserver.observe(portfolioSection);
  }
});

// Portfolio gallery open (buttons)
document.addEventListener("click", (e) => {
  const btn = e.target.closest?.(".portfolio-item[data-gallery]");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-gallery"));
  if (!Number.isFinite(id)) return;
  openGallery(id);
});

// Scroll indicator button
document.addEventListener("click", (e) => {
  const btn = e.target.closest?.("[data-scroll-to]");
  if (!btn) return;
  const sel = btn.getAttribute("data-scroll-to");
  const target = sel ? document.querySelector(sel) : null;
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    const offsetTop = target.offsetTop;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  });
});

// Parallax hero + contacto (ESTRELLAS)
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;

  const heroShapes = document.querySelector(".hero .floating-shapes");

  if (heroShapes) {
    const rate = scrolled * -0.12;
    heroShapes.style.transform = `translateY(${rate}px)`;
  }

  const contactShapes = document.querySelector(".contact-floating-shapes");

  if (contactShapes) {
    const rate2 = scrolled * -0.1;
    contactShapes.style.transform = `translateY(${rate2}px)`;
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// Hover skill tags
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.transform = "translateY(-2px) scale(1.05)";
  });

  tag.addEventListener("mouseleave", () => {
    tag.style.transform = "translateY(0) scale(1)";
  });
});

// Close mobile menu with ESC
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    mobileMenu &&
    mobileMenu.classList.contains("active")
  ) {
    if (mobileMenuToggle) mobileMenuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
    if (mobileMenuToggle)
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }
});

/* =========================
   GALERIA DE PROYECTOS
========================= */

const galleries = {
  1: [
    "images/intento1.webp",
    "images/elegante1.jpg",
    "images/elegante2.jpg",
    "images/elegante3.webp",
  ],

  2: [
    "images/pastelitos.jpg",
    "images/pastelitos2.jpg",
    "images/pastelitos3.jpg",
    "images/pastelitos4.webp",
  ],

  3: ["images/lady1.jpg", "images/lady2.jpg", "images/lady3.jpg"],

  4: ["images/magaz.jpg", "images/magaz2.jpg", "images/magaz3.webp"],

  5: [
    "images/psico1.jpg",
    "images/psico2.jpg",
    "images/psico3.jpg",
    "images/psico4-.webp",
  ],
};

/* â”€â”€â”€ Referencias al nuevo modal â”€â”€â”€ */
let currentGallery = [];
let currentIndex = 0;
let currentGalleryId = 0;
let lastFocusedEl = null;

const galleryModal = document.getElementById("galleryModal");
const galleryImageEl = document.getElementById("galleryImage");
const galleryTitleEl = document.getElementById("galleryTitle");
const galleryThumbsEl = document.getElementById("galleryThumbs");
const galleryCounter = document.getElementById("galleryCounter");
const gmCloseBtn = document.querySelector(".gm-close");

/* TÃ­tulos de cada proyecto */
const galleryTitles = {
  1: "Royalty",
  2: "Happy Cake",
  3: "Lady Midnight",
  4: "Notes",
  5: "Salud",
};

/* Placeholder SVG si la imagen falla */
function placeholderDataUrl(title, idx, total) {
  const safe = String(title || "Proyecto").replace(/[<>&'"]/g, "");
  const label = safe + " Â· " + idx + " / " + total;
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop stop-color="#7B5DA6" offset="0"/>' +
    '<stop stop-color="#F0BBD9" offset="0.55"/>' +
    '<stop stop-color="#FFF0D1" offset="1"/>' +
    '</linearGradient><filter id="bl"><feGaussianBlur stdDeviation="40"/></filter></defs>' +
    '<rect width="1200" height="800" fill="url(#g)"/>' +
    '<circle cx="260" cy="190" r="140" fill="rgba(255,255,255,0.22)" filter="url(#bl)"/>' +
    '<circle cx="980" cy="620" r="170" fill="rgba(255,255,255,0.18)" filter="url(#bl)"/>' +
    '<rect x="120" y="560" width="960" height="160" rx="28" fill="rgba(15,23,42,0.35)"/>' +
    '<text x="160" y="640" font-family="Arial,sans-serif" font-size="56" fill="rgba(255,255,255,0.96)" font-weight="700">' +
    safe +
    "</text>" +
    '<text x="160" y="692" font-family="Arial,sans-serif" font-size="28" fill="rgba(255,255,255,0.90)">' +
    label +
    "</text>" +
    "</svg>";
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* Actualiza la imagen principal y el estado de las miniaturas */
function updateGalleryImage() {
  if (!galleryImageEl) return;

  const title = galleryTitles[currentGalleryId] || "Proyecto";
  const total = currentGallery.length || 1;
  const idx = currentIndex + 1;
  const src = currentGallery[currentIndex];

  /* Imagen principal */
  galleryImageEl.alt = title + " â€” imagen " + idx + " de " + total;
  galleryImageEl.onerror = null;
  galleryImageEl.src = src || placeholderDataUrl(title, idx, total);
  if (src) {
    galleryImageEl.onerror = function () {
      galleryImageEl.onerror = null;
      galleryImageEl.src = placeholderDataUrl(title, idx, total);
    };
  }

  /* Contador */
  if (galleryCounter) galleryCounter.textContent = idx + " de " + total;

  /* Miniaturas: marcar la activa */
  if (galleryThumbsEl) {
    const thumbs = galleryThumbsEl.querySelectorAll(".gm-thumb");
    thumbs.forEach(function (th, i) {
      th.classList.toggle("active", i === currentIndex);
    });
  }
}

/* Construye la fila de miniaturas */
function buildThumbs() {
  if (!galleryThumbsEl) return;
  galleryThumbsEl.innerHTML = "";

  const title = galleryTitles[currentGalleryId] || "Proyecto";

  currentGallery.forEach(function (src, i) {
    const img = document.createElement("img");
    img.className = "gm-thumb";
    img.src = src;
    img.alt = title + " miniatura " + (i + 1);
    img.decoding = "async";
    img.onerror = function () {
      img.style.display = "none";
    };
    img.addEventListener("click", function () {
      currentIndex = i;
      updateGalleryImage();
    });
    galleryThumbsEl.appendChild(img);
  });
}

function openGallery(id) {
  currentGallery = galleries[id] || [];
  currentIndex = 0;
  currentGalleryId = id;

  if (!galleryModal || !galleryImageEl) return;
  lastFocusedEl = document.activeElement;

  /* TÃ­tulo del proyecto en el header */
  if (galleryTitleEl)
    galleryTitleEl.textContent = galleryTitles[id] || "Proyecto";

  /* Construir miniaturas */
  buildThumbs();

  /* Mostrar modal */
  galleryModal.style.display = "flex";
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  updateGalleryImage();

  setTimeout(function () {
    gmCloseBtn && gmCloseBtn.focus();
  }, 50);
}

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.style.display = "none";
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentGallery = [];
  currentIndex = 0;
  currentGalleryId = 0;
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function")
    lastFocusedEl.focus();
}

function nextImage() {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateGalleryImage();
}

function prevImage() {
  if (!currentGallery.length) return;
  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateGalleryImage();
}

/* Cerrar al hacer clic en el backdrop */
document.addEventListener("click", function (e) {
  if (!galleryModal || galleryModal.style.display !== "flex") return;
  if (e.target.classList.contains("gm-backdrop")) closeGallery();
});

// Gallery keyboard support
document.addEventListener("keydown", (e) => {
  if (!galleryModal || galleryModal.style.display !== "flex") return;
  if (e.key === "Escape") return closeGallery();
  if (e.key === "ArrowRight") return nextImage();
  if (e.key === "ArrowLeft") return prevImage();
});

/* =========================
   PORTFOLIO SHOWCASE PREMIUM
========================= */

(function initPortfolioShowcase() {
  const portfolioData = [
    {
      id: "brand",
      name: "Identidad de Marca",
      eyebrow: "Brand systems",
      subtitle: "Logotipos, mockups y universos visuales memorables.",
      cover: "images/intento1.webp",
      projects: [
        {
          id: "royalty",
          title: "Royalty",
          shortDescription: "Marca de ropa masculina premium y elegante.",
          description:
            "Sistema visual para una marca de moda masculina con presencia sofisticada, aplicaciones de papeleria, mockups y piezas listas para comunicacion digital.",
          year: "2026",
          services: ["Branding", "Identidad visual", "Mockups", "Papeleria"],
          tools: ["Photoshop", "Illustrator", "Corel Draw"],
          palette: ["#080708", "#C89B4A", "#E6D8C6", "#F7F4EF"],
          images: [
            "images/intento1.webp",
            "images/elegante1.jpg",
            "images/elegante2.jpg",
            "images/elegante3.webp",
          ],
        },
        {
          id: "lady-midnight",
          title: "Lady Midnight",
          shortDescription: "Identidad editorial con atmosfera nocturna.",
          description:
            "Direccion visual para una marca femenina de tono refinado, con piezas de identidad, textura editorial y aplicaciones sobrias para redes.",
          year: "2026",
          services: ["Logo", "Identidad", "Direccion visual"],
          tools: ["Photoshop", "Illustrator"],
          palette: ["#120B18", "#6E4C8D", "#E2B7CF", "#F3EAF5"],
          images: ["images/lady1.jpg", "images/lady2.jpg", "images/lady3.jpg"],
        },
      ],
    },
    {
      id: "social",
      name: "Redes Sociales",
      eyebrow: "Social media",
      subtitle: "Piezas digitales para marcas que necesitan verse activas.",
      cover: "images/psico1.jpg",
      projects: [
        {
          id: "salud",
          title: "Salud",
          shortDescription: "Contenido visual para bienestar y psicologia.",
          description:
            "Linea grafica para comunicacion de salud y bienestar, con composiciones claras, tonos suaves y recursos visuales pensados para lectura rapida.",
          year: "2026",
          services: ["Social media", "Post carrusel", "Plantillas"],
          tools: ["Photoshop", "Canva", "Illustrator"],
          palette: ["#EEF3F6", "#93B7BE", "#345D65", "#F8D7C4"],
          images: [
            "images/psico1.jpg",
            "images/psico2.jpg",
            "images/psico3.jpg",
            "images/psico4-.webp",
          ],
        },
        {
          id: "happy-cake",
          title: "Happy Cake",
          shortDescription: "Piezas dulces para una marca de reposteria.",
          description:
            "Contenido visual para una marca de reposteria con tono cercano, colores calidos y recursos graficos para promociones, menu y publicaciones.",
          year: "2026",
          services: ["Posts", "Promociones", "Brand content"],
          tools: ["Photoshop", "Canva"],
          palette: ["#F8C8D8", "#FFF2D7", "#D9879A", "#7B4DFF"],
          images: [
            "images/pastelitos.jpg",
            "images/pastelitos2.jpg",
            "images/pastelitos3.jpg",
            "images/pastelitos4.webp",
          ],
        },
      ],
    },
    {
      id: "invitations",
      name: "Invitaciones Digitales",
      eyebrow: "Digital events",
      subtitle: "Invitaciones y piezas especiales con acabado delicado.",
      cover: "images/elegante2.jpg",
      projects: [
        {
          id: "velvette",
          title: "Velvette",
          shortDescription: "Invitacion femenina con presencia moderna.",
          description:
            "Pieza digital para evento con composicion elegante, paleta suave y recursos visuales adaptables a formato movil y publicaciones.",
          year: "2026",
          services: ["Invitacion digital", "Evento", "Social"],
          tools: ["Photoshop", "Canva"],
          palette: ["#2C193A", "#B889FF", "#F0BBD9", "#FFF6FB"],
          images: ["images/elegante2.jpg", "images/elegante1.jpg", "images/elegante3.webp"],
        },
        {
          id: "lumin",
          title: "Lumin",
          shortDescription: "Invitacion limpia con look editorial.",
          description:
            "Diseno digital de invitacion con una estructura minimalista, contraste suave y detalles pensados para lectura clara desde celular.",
          year: "2026",
          services: ["Invitacion", "Arte digital", "Adaptaciones"],
          tools: ["Photoshop", "Illustrator"],
          palette: ["#F7F3EE", "#D4AF37", "#2A1E1C", "#9C6BFF"],
          images: [
            "images/portfolio-website-girl.jpg",
            "images/working-business-women.jpg",
            "images/smiling-girl-computer-desktop.png",
          ],
        },
      ],
    },
    {
      id: "print",
      name: "Diseño Impreso",
      eyebrow: "Print design",
      subtitle: "Piezas impresas con composicion editorial y acabado elegante.",
      cover: "images/magaz2.jpg",
      projects: [
        {
          id: "editorial-notes",
          title: "Editorial Notes",
          shortDescription: "Sistema impreso para presentaciones y papeleria.",
          description:
            "Coleccion de piezas impresas con una estetica editorial refinada, jerarquia limpia y recursos visuales preparados para papeleria, flyers y presentaciones.",
          year: "2026",
          services: ["Editorial", "Papeleria", "Flyers", "Print"],
          tools: ["Photoshop", "Illustrator", "Corel Draw"],
          palette: ["#0B0716", "#BBA27A", "#F4EFE6", "#7B4DFF"],
          images: [
            "images/magaz2.jpg",
            "images/magaz.jpg",
            "images/magaz3.webp",
          ],
        },
        {
          id: "cake-print",
          title: "Sweet Print",
          shortDescription: "Material impreso para marca de reposteria.",
          description:
            "Aplicaciones impresas para una marca dulce y cercana, con piezas promocionales, menu visual y adaptaciones fisicas para atencion al cliente.",
          year: "2026",
          services: ["Menu", "Promocionales", "Papeleria"],
          tools: ["Photoshop", "Canva", "Corel Draw"],
          palette: ["#F8C8D8", "#FFF2D7", "#D9879A", "#4B2F37"],
          images: [
            "images/pastelitos2.jpg",
            "images/pastelitos3.jpg",
            "images/pastelitos4.webp",
          ],
        },
      ],
    },
    {
      id: "creative",
      name: "Diseño Creativo",
      eyebrow: "Visual concepts",
      subtitle: "Composiciones, piezas editoriales y propuestas expresivas.",
      cover: "images/magaz.jpg",
      projects: [
        {
          id: "notes",
          title: "Notes",
          shortDescription: "Concepto editorial y grafica impresa.",
          description:
            "Exploracion de composicion editorial con jerarquias claras, fotografias protagonistas y una estetica limpia para impresos y presentaciones.",
          year: "2026",
          services: ["Editorial", "Print", "Layout"],
          tools: ["Photoshop", "Illustrator", "Corel Draw"],
          palette: ["#111111", "#AA8F66", "#F3EEE7", "#6F6CFF"],
          images: ["images/portada 3.webp", "images/magaz2.jpg", "images/magaz3.webp"],
        },
        {
          id: "workspace",
          title: "Creative Desk",
          shortDescription: "Mood visual para herramientas digitales.",
          description:
            "Seleccion visual enfocada en tecnologia, diseno y flujo creativo para comunicar servicios digitales con una presencia moderna.",
          year: "2026",
          services: ["Direccion visual", "Composicion", "Digital"],
          tools: ["Photoshop", "Illustrator"],
          palette: ["#0B0716", "#7B4DFF", "#E8DDFD", "#F0BBD9"],
          images: [
            "images/portada 1.webp",
            "images/dashboard-interfaces-transparent-displays.jpg",
            "images/curved-display-pinky-girl.jpg",
          ],
        },
        {
          id: "visual-chronicles",
          title: "Crónicas Visuales",
          shortDescription: "Libro visual de composiciones y atmosferas.",
          description:
            "Exploracion editorial de portadas, escenas y recursos graficos con una narrativa visual cinematografica para proyectos creativos.",
          year: "2026",
          services: ["Portadas", "Ilustracion", "Composicion", "Editorial"],
          tools: ["Photoshop", "Illustrator"],
          palette: ["#090014", "#7B4DFF", "#D9C6A5", "#F8F1E6"],
          images: [
            "images/PORTADA 2.webp",
            "images/marketing-strategy-women.jpg",
            "images/curved-display-pinky-girl.jpg",
            "images/computer-desk-stickers.jpg",
          ],
        },
      ],
    },
  ];

  const state = {
    category: null,
    project: null,
    imageIndex: 0,
    lastFocus: null,
    startX: 0,
    isPointerDown: false,
  };

  const focusableSelector =
    'a[href]:not([hidden]), button:not([disabled]):not([hidden]), input:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([tabindex="-1"]):not([hidden])';

  let showcaseEl;
  let modalEl;
  let shellEl;
  let titleEl;
  let kickerEl;
  let subtitleEl;
  let bodyEl;
  let backBtn;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createModal() {
    const existing = document.getElementById("portfolioModal");
    if (existing) return existing;

    const modal = document.createElement("div");
    modal.id = "portfolioModal";
    modal.className = "portfolio-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "pmTitle");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="pm-backdrop" data-portfolio-close></div>
      <article class="pm-shell" tabindex="-1">
        <header class="pm-header">
          <button id="pmBack" class="pm-icon-button pm-back" type="button" aria-label="Volver a proyectos" hidden>
            <span aria-hidden="true">&#8592;</span>
          </button>
          <div class="pm-title-wrap">
            <span id="pmKicker" class="pm-kicker">Portafolio</span>
            <h3 id="pmTitle" class="pm-title">Showcase</h3>
            <p id="pmSubtitle" class="pm-subtitle"></p>
          </div>
          <button id="pmClose" class="pm-icon-button pm-close" type="button" aria-label="Cerrar portafolio" data-portfolio-close>
            <span aria-hidden="true">&#10005;</span>
          </button>
        </header>
        <div id="pmBody" class="pm-body" aria-live="polite"></div>
      </article>`;
    document.body.appendChild(modal);
    return modal;
  }

  function cacheElements() {
    modalEl = createModal();
    shellEl = modalEl.querySelector(".pm-shell");
    titleEl = modalEl.querySelector("#pmTitle");
    kickerEl = modalEl.querySelector("#pmKicker");
    subtitleEl = modalEl.querySelector("#pmSubtitle");
    bodyEl = modalEl.querySelector("#pmBody");
    backBtn = modalEl.querySelector("#pmBack");
  }

  function findCategory(id) {
    return portfolioData.find((category) => category.id === id) || null;
  }

  function getCategoryIndex(category) {
    return portfolioData.findIndex((item) => item.id === category?.id);
  }

  function findProject(category, projectId) {
    return category?.projects.find((project) => project.id === projectId);
  }

  function projectCountLabel(category) {
    const count = category.projects.length;
    return count === 1 ? "1 proyecto" : `${count} proyectos`;
  }

  function preloadImage(src) {
    if (!src) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  }

  function preloadProject(project) {
    preloadImage(project?.images[0]);
    preloadImage(project?.images[1]);
  }

  function renderPortfolioSection() {
    const section = document.getElementById("portfolio");
    if (!section) return;

    const subtitle = section.querySelector(".portfolio-subtitle");
    if (subtitle) {
      subtitle.textContent =
        "Explora cada categoria como una experiencia visual: primero elige el universo creativo, despues entra a los proyectos y revisa cada detalle.";
    }

    const oldGrid = section.querySelector(".portfolio-grid");
    if (oldGrid) oldGrid.setAttribute("aria-hidden", "true");

    showcaseEl = document.getElementById("portfolioShowcase");
    if (!showcaseEl) {
      showcaseEl = document.createElement("div");
      showcaseEl.id = "portfolioShowcase";
      showcaseEl.className = "portfolio-showcase";
      showcaseEl.setAttribute("aria-label", "Categorias del portafolio");
      if (oldGrid) oldGrid.insertAdjacentElement("afterend", showcaseEl);
      else section.querySelector(".container")?.appendChild(showcaseEl);
    }

    showcaseEl.innerHTML = portfolioData
      .map(
        (category, index) => `
          <button class="portfolio-category-card" type="button" data-category="${category.id}" style="--card-delay:${index * 90}ms">
            <span class="pc-card-image">
              <img src="${category.cover}" alt="${escapeHtml(category.name)}" loading="lazy" decoding="async">
            </span>
            <span class="pc-card-shine" aria-hidden="true"></span>
            <span class="pc-card-content">
              <strong>${escapeHtml(category.name)}</strong>
              <em>${projectCountLabel(category)}</em>
            </span>
          </button>`,
      )
      .join("");
  }

  function setModalHeader({ kicker, title, subtitle, showBack }) {
    kickerEl.textContent = kicker;
    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;
    backBtn.hidden = false;
    backBtn.setAttribute(
      "aria-label",
      showBack ? "Volver a proyectos" : "Volver a categorias",
    );
  }

  function openCategory(categoryId) {
    const category = findCategory(categoryId);
    if (!category) return;

    state.category = category;
    state.project = null;
    state.imageIndex = 0;
    state.lastFocus = document.activeElement;

    showCategory(category);
    modalEl.classList.add("is-open");
    modalEl.classList.remove("is-project");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("portfolio-modal-open");
    shellEl.focus();
  }

  function showCategory(category) {
    state.category = category;
    state.project = null;
    state.imageIndex = 0;
    renderCategoryView();
    category.projects.forEach(preloadProject);
  }

  function closePortfolioModal() {
    if (!modalEl.classList.contains("is-open")) return;

    modalEl.classList.add("is-closing");
    modalEl.classList.remove("is-open", "is-project", "is-libro-book");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("portfolio-modal-open");

    window.setTimeout(() => {
      modalEl.classList.remove("is-closing");
      bodyEl.innerHTML = "";
      state.category = null;
      state.project = null;
      state.imageIndex = 0;
    }, 260);

    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
  }

  function renderCategoryView() {
    const category = state.category;
    if (!category) return;

    state.project = null;
    state.imageIndex = 0;
    modalEl.classList.remove("is-project", "is-libro-book");
    setModalHeader({
      kicker: category.eyebrow,
      title: category.name,
      subtitle: "Selecciona un proyecto para ver la presentacion completa.",
      showBack: false,
    });

    if (category.id === "creative") {
      renderCreativeLibraryView(category);
      return;
    }

    const projects = category.projects
      .map(
        (project, index) => `
          <button class="project-card" type="button" data-project="${project.id}" style="--project-delay:${index * 85}ms">
            <span class="project-card-media">
              <img src="${project.images[0]}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">
            </span>
            <span class="project-card-body">
              <span>${escapeHtml(category.name)}</span>
              <strong>${escapeHtml(project.title)}</strong>
              <small>${escapeHtml(project.shortDescription)}</small>
            </span>
          </button>`,
      )
      .join("");

    bodyEl.innerHTML = `
      <section class="category-view">
        <div class="category-copy">
          <p>${escapeHtml(category.subtitle)}</p>
        </div>
        <div class="project-rail-wrap">
          <button class="rail-arrow rail-arrow--prev" type="button" data-category-nav="prev" aria-label="Categoria anterior">&#8249;</button>
          <div class="project-rail" tabindex="0">${projects}</div>
          <button class="rail-arrow rail-arrow--next" type="button" data-category-nav="next" aria-label="Categoria siguiente">&#8250;</button>
        </div>
        <p class="category-hint">Elige un proyecto para comenzar</p>
      </section>`;
    bodyEl.scrollTop = 0;
  }

  function renderCreativeLibraryView(category) {
    const books = category.projects
      .map((project, index) => {
        const accent = project.palette?.[1] || "#7B4DFF";
        const cover = project.images[0];
        return `
          <button class="book-card-3d" type="button" data-creative-book="${project.id}" style="--book-delay:${index * 110}ms; --book-accent:${accent}" aria-label="Abrir libro interactivo ${escapeHtml(project.title)}">
            <span class="book-depth" aria-hidden="true"></span>
            <span class="book-cover">
              <img src="${cover}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">
              <span class="book-cover-shade" aria-hidden="true"></span>
            </span>
            <span class="book-pages-edge" aria-hidden="true"></span>
          </button>`;
      })
      .join("");

    bodyEl.innerHTML = `
      <section class="creative-library-view">
        <div class="creative-library-atmosphere" aria-hidden="true"></div>
        <div class="creative-library-copy">
          <span>Biblioteca editorial</span>
          <p>Selecciona un libro para abrir la experiencia interactiva.</p>
        </div>
        <div class="bookshelf-wrap">
          <button class="rail-arrow rail-arrow--prev" type="button" data-category-nav="prev" aria-label="Categoria anterior">&#8249;</button>
          <div class="bookshelf" role="list" aria-label="Libros de diseño creativo">${books}</div>
          <button class="rail-arrow rail-arrow--next" type="button" data-category-nav="next" aria-label="Categoria siguiente">&#8250;</button>
        </div>
        <p class="category-hint creative-library-hint">Haz clic en un libro para comenzar</p>
      </section>`;
    bodyEl.scrollTop = 0;
  }

  function openCreativeBook(projectId) {
    const project = findProject(state.category, projectId);
    if (!project) return;

    state.project = project;
    state.imageIndex = 0;
    modalEl.classList.add("is-project", "is-libro-book");
    renderLibroBookView(project);
    shellEl.focus();
  }

  function renderLibroBookView(project) {
    setModalHeader({
      kicker: "Biblioteca editorial",
      title: project.title,
      subtitle: "Libro interactivo",
      showBack: true,
    });

    bodyEl.innerHTML = `
      <section class="libro-view" aria-label="Libro interactivo ${escapeHtml(project.title)}">
        <div class="libro-frame-shell">
          <iframe
            class="libro-frame"
            src="libro/embed.html?book=${encodeURIComponent(project.id)}&v=book-cover-3"
            title="Libro interactivo ${escapeHtml(project.title)}"
            loading="eager"
            allow="autoplay"
          ></iframe>
        </div>
      </section>`;
    bodyEl.scrollTop = 0;
  }

  function openProject(projectId) {
    const project = findProject(state.category, projectId);
    if (!project) return;

    state.project = project;
    state.imageIndex = 0;
    modalEl.classList.remove("is-libro-book");
    modalEl.classList.add("is-project");
    renderProjectView();
    shellEl.focus();
    preloadImage(project.images[1]);
  }

  function renderProjectView() {
    const category = state.category;
    const project = state.project;
    if (!category || !project) return;

    setModalHeader({
      kicker: category.name,
      title: project.title,
      subtitle: project.shortDescription,
      showBack: true,
    });

    const palette = project.palette
      .map(
        (color) =>
          `<span class="palette-swatch" style="--swatch:${color}" title="${color}"></span>`,
      )
      .join("");
    const services = project.services
      .map((service) => `<span>${escapeHtml(service)}</span>`)
      .join("");
    const tools = project.tools
      .map((tool) => `<span>${escapeHtml(tool)}</span>`)
      .join("");

    bodyEl.innerHTML = `
      <section class="project-view">
        <div class="project-gallery">
          <div class="carousel-stage" data-swipe-area>
            <button class="carousel-arrow carousel-arrow--prev" type="button" data-image-nav="prev" aria-label="Imagen anterior">&#8249;</button>
            <figure class="main-preview">
              <img id="projectMainImage" src="" alt="" loading="lazy" decoding="async">
            </figure>
            <button class="carousel-arrow carousel-arrow--next" type="button" data-image-nav="next" aria-label="Imagen siguiente">&#8250;</button>
          </div>
          <div class="thumbnail-row" role="list" aria-label="Miniaturas del proyecto"></div>
          <div class="image-counter" aria-live="polite"></div>
        </div>
        <aside class="project-info-panel">
          <span class="info-category">${escapeHtml(category.name)}</span>
          <h4>${escapeHtml(project.title)}</h4>
          <p>${escapeHtml(project.description)}</p>
          <dl class="project-meta">
            <div>
              <dt>Año</dt>
              <dd>${escapeHtml(project.year)}</dd>
            </div>
            <div>
              <dt>Servicios</dt>
              <dd class="tag-list">${services}</dd>
            </div>
            <div>
              <dt>Paleta de colores</dt>
              <dd class="palette-list">${palette}</dd>
            </div>
            <div>
              <dt>Herramientas</dt>
              <dd class="tag-list">${tools}</dd>
            </div>
          </dl>
          <div class="project-actions">
            <a href="#contact" class="project-action project-action--primary" data-portfolio-close>Solicitar proyecto</a>
            <a href="https://www.instagram.com/albby_designs" target="_blank" rel="noopener noreferrer" class="project-action">Instagram</a>
          </div>
        </aside>
      </section>`;

    bodyEl.scrollTop = 0;
    renderThumbnails();
    updateProjectImage();
    requestAnimationFrame(() => {
      bodyEl.scrollTop = 0;
    });
  }

  function renderThumbnails() {
    const row = bodyEl.querySelector(".thumbnail-row");
    if (!state.project || !row) return;

    row.innerHTML = state.project.images
      .map(
        (src, index) => `
          <button class="thumbnail-button" type="button" data-image-index="${index}" role="listitem" aria-label="Ver imagen ${index + 1}">
            <img src="${src}" alt="${escapeHtml(state.project.title)} miniatura ${index + 1}" loading="lazy" decoding="async">
          </button>`,
      )
      .join("");
  }

  function updateProjectImage() {
    const project = state.project;
    if (!project) return;

    const image = bodyEl.querySelector("#projectMainImage");
    const counter = bodyEl.querySelector(".image-counter");
    const src = project.images[state.imageIndex];
    if (!image || !src) return;

    image.classList.remove("is-loaded");
    image.alt = `${project.title} - imagen ${state.imageIndex + 1} de ${project.images.length}`;
    image.onload = () => image.classList.add("is-loaded");
    image.src = src;

    bodyEl.querySelectorAll(".thumbnail-button").forEach((button, index) => {
      const isActive = index === state.imageIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (counter) {
      counter.textContent = `${state.imageIndex + 1} / ${project.images.length}`;
    }

    preloadImage(project.images[(state.imageIndex + 1) % project.images.length]);
  }

  function nextProjectImage() {
    if (!state.project) return;
    state.imageIndex = (state.imageIndex + 1) % state.project.images.length;
    updateProjectImage();
  }

  function prevProjectImage() {
    if (!state.project) return;
    state.imageIndex =
      (state.imageIndex - 1 + state.project.images.length) %
      state.project.images.length;
    updateProjectImage();
  }

  function navigateCategory(direction) {
    if (!state.category) return;
    const currentIndex = getCategoryIndex(state.category);
    if (currentIndex < 0) return;

    const offset = direction === "next" ? 1 : -1;
    const nextIndex =
      (currentIndex + offset + portfolioData.length) % portfolioData.length;
    showCategory(portfolioData[nextIndex]);
    shellEl.focus();
  }

  function handleClick(event) {
    const categoryCard = event.target.closest("[data-category]");
    if (categoryCard && showcaseEl?.contains(categoryCard)) {
      openCategory(categoryCard.dataset.category);
      return;
    }

    const closeTarget = event.target.closest("[data-portfolio-close]");
    if (closeTarget) {
      closePortfolioModal();
      return;
    }

    const creativeBook = event.target.closest("[data-creative-book]");
    if (creativeBook && bodyEl?.contains(creativeBook)) {
      openCreativeBook(creativeBook.dataset.creativeBook);
      return;
    }

    const projectCard = event.target.closest("[data-project]");
    if (projectCard && bodyEl?.contains(projectCard)) {
      openProject(projectCard.dataset.project);
      return;
    }

    const imageNav = event.target.closest("[data-image-nav]");
    if (imageNav) {
      imageNav.dataset.imageNav === "next"
        ? nextProjectImage()
        : prevProjectImage();
      return;
    }

    const thumbnail = event.target.closest("[data-image-index]");
    if (thumbnail) {
      state.imageIndex = Number(thumbnail.dataset.imageIndex);
      updateProjectImage();
      return;
    }

    const categoryNav = event.target.closest("[data-category-nav]");
    if (categoryNav) navigateCategory(categoryNav.dataset.categoryNav);
  }

  function handlePointerDown(event) {
    if (!event.target.closest("[data-swipe-area]")) return;
    state.isPointerDown = true;
    state.startX = event.clientX || event.touches?.[0]?.clientX || 0;
  }

  function handlePointerUp(event) {
    if (!state.isPointerDown) return;
    const endX = event.clientX || event.changedTouches?.[0]?.clientX || 0;
    const delta = endX - state.startX;
    state.isPointerDown = false;
    if (Math.abs(delta) < 45) return;
    delta < 0 ? nextProjectImage() : prevProjectImage();
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || !modalEl.classList.contains("is-open")) return;
    const focusables = Array.from(modalEl.querySelectorAll(focusableSelector));
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleKeydown(event) {
    if (!modalEl.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closePortfolioModal();
      return;
    }
    if (state.project && state.category?.id !== "creative" && event.key === "ArrowRight")
      nextProjectImage();
    if (state.project && state.category?.id !== "creative" && event.key === "ArrowLeft")
      prevProjectImage();
    if (!state.project && event.key === "ArrowRight") navigateCategory("next");
    if (!state.project && event.key === "ArrowLeft") navigateCategory("prev");
    trapFocus(event);
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    renderPortfolioSection();
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    modalEl.addEventListener("pointerdown", handlePointerDown);
    modalEl.addEventListener("pointerup", handlePointerUp);
    modalEl.addEventListener("touchstart", handlePointerDown, { passive: true });
    modalEl.addEventListener("touchend", handlePointerUp, { passive: true });
    backBtn.addEventListener("click", () => {
      if (state.project) renderCategoryView();
      else closePortfolioModal();
    });
  });
})();
