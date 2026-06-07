import { prefersReducedMotion } from "../core/reduced-motion.js";

/** Wrap text nodes in spans for staggered word/line animation. Skips [data-no-split] subtrees. */
export function splitText(el, className = "split-word") {
  if (!el || el.dataset.split) return [];

  const spans = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.parentElement?.closest("[data-no-split]")) return NodeFilter.FILTER_REJECT;
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const parts = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = className;
      span.textContent = part;
      frag.appendChild(span);
      spans.push(span);
    });

    node.parentNode.replaceChild(frag, node);
  });

  el.dataset.split = "true";
  return spans;
}

export function prepareHomeText() {
  const desc = document.querySelector("[data-hero-desc]");
  if (desc) splitText(desc);

  document.querySelectorAll("[data-split-lines]").forEach((el) => {
    el.dataset.split = "true";
    const text = el.textContent.trim();
    el.textContent = "";
    text.split("\n").forEach((line, i, arr) => {
      const wrap = document.createElement("span");
      wrap.className = "split-line";
      wrap.innerHTML = `<span class="split-line__inner">${line}</span>`;
      el.appendChild(wrap);
      if (i < arr.length - 1) el.appendChild(document.createElement("br"));
    });
  });
}

function initMagneticButtons() {
  document.querySelectorAll("[data-hero-actions] .btn, .cta-strip .btn").forEach((btn) => {
    const strength = btn.classList.contains("btn--fill") ? 0.55 : 0.38;

    btn.addEventListener("mousemove", (e) => {
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * strength;
      const y = (e.clientY - top - height / 2) * strength;
      gsap.to(btn, { x, y, duration: 0.35, ease: "power3.out" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" });
    });

    btn.addEventListener("mousedown", () => {
      gsap.to(btn, { scale: 0.9, duration: 0.1, ease: "power3.in" });
    });

    btn.addEventListener("mouseup", () => {
      gsap.to(btn, { scale: 1, duration: 0.4, ease: "back.out(2.5)" });
    });
  });
}

function initLinkLines() {
  document.querySelectorAll(".link-line").forEach((link) => {
    if (link.querySelector(".link-line__bar")) return;

    const bar = document.createElement("span");
    bar.className = "link-line__bar";
    bar.setAttribute("aria-hidden", "true");
    link.appendChild(bar);

    link.addEventListener("mouseenter", () => {
      gsap.fromTo(bar, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.35, ease: "power4.out" });
      gsap.to(link, { x: 8, scale: 1.04, duration: 0.3, ease: "back.out(2)" });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(bar, { scaleX: 0, duration: 0.25, ease: "power3.in" });
      gsap.to(link, { x: 0, scale: 1, duration: 0.35, ease: "power3.out" });
    });
  });
}

function initHomeIntro() {
  const section = document.querySelector("[data-home-intro]");
  if (!section) return;

  gsap.from(section.querySelectorAll("[data-home-intro-item]"), {
    y: 24,
    opacity: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

function initHomeHeaders() {
  document.querySelectorAll("[data-home-header]").forEach((header) => {
    const items = header.querySelectorAll("[data-home-header-item]");
    gsap.from(items, {
      y: 56,
      x: -24,
      opacity: 0,
      scale: 0.92,
      duration: 0.85,
      stagger: 0.12,
      ease: "power4.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: header,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initFeaturedRows() {
  document.querySelectorAll(".featured__row").forEach((row) => {
    const arrow = row.querySelector(".featured__arrow");
    const tags = row.querySelectorAll(".featured__tag");
    const index = row.querySelector(".featured__index");
    const name = row.querySelector(".featured__name");

    row.addEventListener("mouseenter", () => {
      gsap.to(row, { x: 14, scale: 1.01, duration: 0.4, ease: "power3.out" });
      if (arrow) gsap.to(arrow, { x: 14, y: -14, scale: 1.25, rotation: 12, duration: 0.4, ease: "back.out(2.2)" });
      if (name) gsap.to(name, { letterSpacing: "0.04em", x: 6, duration: 0.35, ease: "power3.out" });
      if (index) gsap.to(index, { color: "var(--accent)", scale: 1.15, duration: 0.3, ease: "back.out(2.5)" });
      if (tags.length) {
        gsap.fromTo(
          tags,
          { y: 12, opacity: 0.3, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.3, ease: "back.out(1.8)" }
        );
      }
    });

    row.addEventListener("mouseleave", () => {
      gsap.to(row, { x: 0, scale: 1, duration: 0.5, ease: "power3.out" });
      if (arrow) gsap.to(arrow, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.45, ease: "power3.out" });
      if (name) gsap.to(name, { letterSpacing: "-0.03em", x: 0, duration: 0.4, ease: "power3.out" });
      if (index) gsap.to(index, { color: "var(--text-dim)", scale: 1, duration: 0.35, ease: "power3.out" });
    });
  });
}

function initHeroMicro() {
  const tag = document.querySelector("[data-hero-eyebrow] .tag");
  if (tag) {
    gsap.to(tag, {
      opacity: 0.65,
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  document.querySelectorAll("[data-hero-meta] a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, { y: -3, duration: 0.35, ease: "back.out(2)" });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(link, { y: 0, duration: 0.4, ease: "power2.out" });
    });
  });

  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  gsap.to("[data-hero] .hero__title-accent", {
    filter: "drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 50%, transparent))",
    duration: 2.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  const typewriter = document.querySelector("[data-typewriter]");
  if (typewriter) {
    gsap.to(typewriter, {
      color: "var(--accent)",
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  gsap.to("[data-hero] .hero__content", {
    y: -100,
    scale: 0.96,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}

function initCtaStrip() {
  const cta = document.querySelector(".cta-strip .container");
  if (!cta) return;

  const title = cta.querySelector(".cta-strip__title");
  if (title) {
    gsap.from(title, {
      y: 56,
      opacity: 0,
      scale: 0.88,
      duration: 0.9,
      ease: "power4.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: cta,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  }

  gsap.from(cta.querySelectorAll(".cta-strip__desc, .cta-strip__actions"), {
    y: 40,
    opacity: 0,
    x: -20,
    duration: 0.7,
    stagger: 0.14,
    ease: "back.out(1.6)",
    immediateRender: false,
    scrollTrigger: {
      trigger: cta,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
}

export function initHomeInteractions() {
  if (prefersReducedMotion()) return;

  initMagneticButtons();
  initLinkLines();
  initHomeIntro();
  initHomeHeaders();
  initFeaturedRows();
  initHeroMicro();
  initCtaStrip();
}
