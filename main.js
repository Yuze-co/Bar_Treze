/* =========================================================
   BARTREZE — main.js
   Solo comportamiento: el contenido vive en el HTML (SEO).
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: fondo sólido al hacer scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById("burgerBtn");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function toggleMobileNav() {
    var isOpen = mobileNav.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
  burger.addEventListener("click", toggleMobileNav);
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------- Reveal al hacer scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Parallax sutil del hero ---------- */
  var heroImg = document.getElementById("heroImg");
  if (heroImg && !reduceMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = "scale(1.08) translateY(" + y * 0.12 + "px)";
        }
      },
      { passive: true }
    );
  }

  /* ---------- Día / noche: transición ligada al scroll ---------- */
  var dnSection = document.getElementById("daynight");
  var dnNight = document.getElementById("dnNight");
  var dnOrb = document.getElementById("dnOrb");
  var wordDay = document.querySelector(".dn-word-day");
  var wordNight = document.querySelector(".dn-word-night");

  function updateDayNight() {
    if (!dnSection) return;
    var rect = dnSection.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if (total <= 0) return;
    var progress = (-rect.top) / total;
    progress = Math.max(0, Math.min(1, progress));

    dnNight.style.opacity = progress;
    wordDay.style.opacity = 1 - progress;
    wordNight.style.opacity = progress;

    // El "sol" recorre un pequeño arco y se convierte en "luna" (color) al final
    var arcX = 10 + progress * 78; // % horizontal
    var arcY = 68 - Math.sin(progress * Math.PI) * 46; // % vertical (arco)
    dnOrb.style.left = arcX + "%";
    dnOrb.style.top = arcY + "%";

    if (progress > 0.55) {
      dnOrb.style.background = "#EDEBE4";
      dnOrb.style.boxShadow = "0 0 34px 8px rgba(237,235,228,.45)";
    } else {
      dnOrb.style.background = "";
      dnOrb.style.boxShadow = "";
    }
  }
  updateDayNight();
  window.addEventListener("scroll", updateDayNight, { passive: true });
  window.addEventListener("resize", updateDayNight);

  /* ---------- Lightbox de galería ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var galleryItems = document.querySelectorAll(".masonry-item");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }
  galleryItems.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var full = btn.getAttribute("data-full");
      var img = btn.querySelector("img");
      openLightbox(full, img ? img.alt : "");
    });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Cerrar menú móvil al pasar a escritorio ---------- */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) closeMobileNav();
  });
})();
