import { prefersReducedMotion } from "../core/reduced-motion.js";

const REVEAL_PRESETS = {
  up: { y: 72, opacity: 0, rotation: 2 },
  down: { y: -56, opacity: 0 },
  left: { x: -96, opacity: 0, rotation: -3 },
  right: { x: 96, opacity: 0, rotation: 3 },
  scale: { scale: 0.72, opacity: 0, y: 40 },
  clip: { clipPath: "inset(100% 0 0 0)", opacity: 0, y: 24 },
  blur: { y: 48, opacity: 0, filter: "blur(16px)" },
};

function revealPreset(el) {
  const key = el.dataset.reveal?.trim();
  if (!key || key === "true") return REVEAL_PRESETS.up;
  return REVEAL_PRESETS[key] || REVEAL_PRESETS.up;
}

/** Richer scroll-triggered reveals — supports data-reveal="left|right|scale|clip|blur" */
export function initScrollRevealVariants() {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    const from = revealPreset(el);
    const vars = {
      ...from,
      duration: 1,
      ease: from.clipPath ? "power4.inOut" : "power4.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    };

    if (from.clipPath) vars.clearProps = "clipPath";
    if (from.filter) vars.clearProps = "filter";
    if (from.rotation) vars.clearProps = "rotation";

    gsap.from(el, vars);
  });

  gsap.utils.toArray("[data-reveal-stagger]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal-item]");
    const direction = group.dataset.revealStagger || "up";
    const from = REVEAL_PRESETS[direction] || REVEAL_PRESETS.up;

    gsap.from(items, {
      ...from,
      duration: 0.85,
      stagger: { amount: 0.55, from: "start" },
      ease: direction === "scale" ? "back.out(1.8)" : "power4.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: group,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      ...(from.clipPath ? { clearProps: "clipPath" } : {}),
      ...(from.filter ? { clearProps: "filter" } : {}),
      ...(from.rotation ? { clearProps: "rotation" } : {}),
    });
  });
}

function initAmbientParallax() {
  gsap.to(".glow-orb--warm", {
    y: -320,
    x: 180,
    scale: 1.25,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
    },
  });

  gsap.to(".glow-orb--cool", {
    y: 260,
    x: -160,
    scale: 1.2,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  gsap.to(".grid-bg", {
    y: 160,
    scale: 1.08,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
    },
  });
}

function initHeroScrollExit() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  gsap.to("[data-hero] .hero__visual", {
    y: 220,
    opacity: 0,
    scale: 0.72,
    rotation: 8,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "70% top",
      scrub: 0.5,
    },
  });

  gsap.to("[data-hero] .hero__title", {
    y: -140,
    opacity: 0,
    scale: 0.88,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "60% top",
      scrub: 0.4,
    },
  });

  gsap.to("[data-hero] .hero__desc, [data-hero] .hero__actions, [data-hero] .hero__meta", {
    y: -80,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "20% top",
      end: "75% top",
      scrub: 0.5,
    },
  });
}

function initSectionScrub() {
  document.querySelectorAll("[data-scroll-section]").forEach((section) => {
    gsap.fromTo(
      section,
      { y: 80, opacity: 0.35, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 98%",
          end: "top 45%",
          scrub: 0.4,
        },
      }
    );
  });
}

function injectDrawLine(el) {
  if (el.querySelector(".scroll-draw-line")) return el.querySelector(".scroll-draw-line");
  const line = document.createElement("span");
  line.className = "scroll-draw-line";
  line.setAttribute("aria-hidden", "true");
  el.prepend(line);
  return line;
}

function initDrawLines() {
  document.querySelectorAll("[data-scroll-line]").forEach((el) => {
    const line = injectDrawLine(el);
    gsap.from(line, {
      scaleX: 0,
      duration: 0.9,
      ease: "power4.inOut",
      immediateRender: false,
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initMarqueeReveal() {
  const marquee = document.querySelector("[data-scroll-marquee]");
  if (!marquee) return;

  gsap.from(marquee, {
    clipPath: "inset(0 100% 0 0)",
    scale: 0.92,
    opacity: 0,
    duration: 0.85,
    ease: "power4.inOut",
    immediateRender: false,
    clearProps: "clipPath",
    scrollTrigger: {
      trigger: marquee,
      start: "top 95%",
      toggleActions: "play none none none",
    },
  });

  gsap.from(marquee.querySelectorAll(".marquee__item"), {
    y: 48,
    x: -24,
    opacity: 0,
    duration: 0.55,
    stagger: 0.025,
    ease: "back.out(1.7)",
    immediateRender: false,
    scrollTrigger: {
      trigger: marquee,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(marquee, {
    y: -30,
    ease: "none",
    scrollTrigger: {
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8,
    },
  });
}

function initStackScroll() {
  const nav = document.querySelector("[data-stack-nav]");
  const bento = document.querySelector("[data-stack-bento]");
  if (!nav) return;

  gsap.from(nav.querySelectorAll(".stack__filter"), {
    x: -64,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: "back.out(1.6)",
    immediateRender: false,
    scrollTrigger: {
      trigger: nav,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });

  if (bento) {
    gsap.fromTo(
      bento,
      { y: 60, opacity: 0.4 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: bento,
          start: "top 95%",
          end: "top 50%",
          scrub: 0.5,
        },
      }
    );
  }
}

function initFeaturedBatch() {
  ScrollTrigger.batch(".featured__row", {
    interval: 0.06,
    batchMax: 2,
    start: "top 92%",
    onEnter: (batch) => {
      gsap.from(batch, {
        x: (i) => (i % 2 === 0 ? -80 : 80),
        y: 40,
        opacity: 0,
        scale: 0.92,
        rotation: (i) => (i % 2 === 0 ? -2 : 2),
        duration: 0.9,
        stagger: 0.14,
        ease: "power4.out",
        overwrite: true,
      });
    },
  });

  document.querySelectorAll(".featured__row").forEach((row) => {
    gsap.fromTo(
      row,
      { opacity: 0.85 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: row,
          start: "top bottom",
          end: "center center",
          scrub: 0.6,
        },
      }
    );
  });
}

function initSectionTitleScrub() {
  document.querySelectorAll(".section__title").forEach((title) => {
    if (title.closest("[data-home-header]")) return;

    gsap.fromTo(
      title,
      { y: 80, scale: 0.88, opacity: 0.3 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "top 95%",
          end: "top 50%",
          scrub: 0.35,
        },
      }
    );
  });
}

function initCtaScrub() {
  const cta = document.querySelector(".cta-strip");
  if (!cta) return;

  gsap.fromTo(
    cta,
    { scale: 0.86, opacity: 0.25, y: 60 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: cta,
        start: "top 98%",
        end: "top 45%",
        scrub: 0.35,
      },
    }
  );

  const title = cta.querySelector(".cta-strip__title");
  if (title) {
    gsap.fromTo(
      title,
      { letterSpacing: "0.08em", scale: 1.08 },
      {
        letterSpacing: "-0.03em",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: cta,
          start: "top 90%",
          end: "top 50%",
          scrub: 0.4,
        },
      }
    );
  }
}

export function initHomeScrollTransitions() {
  if (prefersReducedMotion()) return;

  initAmbientParallax();
  initHeroScrollExit();
  initSectionScrub();
  initDrawLines();
  initMarqueeReveal();
  initStackScroll();
  initFeaturedBatch();
  initSectionTitleScrub();
  initCtaScrub();
}
