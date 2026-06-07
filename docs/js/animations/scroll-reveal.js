import { prefersReducedMotion } from "../core/reduced-motion.js";

/** @deprecated Use initScrollRevealVariants for richer presets; kept for non-home pages. */
export function initScrollReveal() {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  gsap.utils.toArray("[data-reveal-stagger]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal-item]");
    gsap.from(items, {
      y: 28,
      opacity: 0,
      scale: 0.88,
      duration: 0.65,
      stagger: { amount: 0.45, from: "random" },
      ease: "back.out(1.4)",
      immediateRender: false,
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });
}

export function initPageHead() {
  if (prefersReducedMotion()) return;

  const head = document.querySelector("[data-page-head]");
  if (!head) return;

  const tl = gsap.timeline({ defaults: { immediateRender: false } });
  tl.from("[data-page-label]", { y: 20, opacity: 0, duration: 0.6 })
    .from("[data-page-title]", { y: 48, opacity: 0, duration: 0.85, ease: "power4.out" }, "-=0.25")
    .from("[data-page-desc]", { y: 20, opacity: 0, duration: 0.65 }, "-=0.4");
}

export function initWorkHover() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll(".work-item").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      gsap.to(row, { x: 4, duration: 0.4, ease: "power2.out" });
    });
    row.addEventListener("mouseleave", () => {
      gsap.to(row, { x: 0, duration: 0.5, ease: "power2.out" });
    });
  });
}

export function initContactLinks() {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray(".contact-link").forEach((link, i) => {
    gsap.from(link, {
      x: -24,
      opacity: 0,
      duration: 0.55,
      delay: i * 0.05,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: link,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  });
}
