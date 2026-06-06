import { prefersReducedMotion } from "../core/reduced-motion.js";

/** Force all page content visible — safety net when animations fail. */
export function ensureVisible() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  document.querySelector("[data-intro]")?.remove();
  clearHiddenStyles();
}

export function clearHiddenStyles() {
  document.querySelectorAll("[data-reveal], [data-home-reveal]").forEach((el) => {
    el.style.opacity = "";
    el.style.transform = "";
  });

  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  hero.classList.add("hero--ready");
  hero.querySelectorAll(
    "[data-hero-eyebrow], [data-hero-desc], [data-hero-actions] > *, [data-hero-meta] > *, [data-hero-scroll], .hero__title-line"
  ).forEach((el) => {
    el.style.opacity = "";
    el.style.transform = "";
  });
}

export function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero || prefersReducedMotion()) {
    hero?.classList.add("hero--ready");
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from("[data-hero] [data-hero-eyebrow]", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    immediateRender: false,
  })
    .from(
      "[data-hero] .hero__title-line",
      { yPercent: 100, duration: 0.9, stagger: 0.1, immediateRender: false },
      "-=0.35"
    )
    .from(
      "[data-hero] [data-hero-desc]",
      { y: 20, opacity: 0, duration: 0.6, immediateRender: false },
      "-=0.4"
    )
    .from(
      "[data-hero] [data-hero-actions] > *",
      { y: 16, opacity: 0, duration: 0.45, stagger: 0.08, immediateRender: false },
      "-=0.35"
    )
    .from(
      "[data-hero] [data-hero-meta] > *",
      { y: 12, opacity: 0, duration: 0.45, stagger: 0.06, immediateRender: false },
      "-=0.3"
    )
    .from(
      "[data-hero] [data-hero-scroll]",
      { opacity: 0, duration: 0.5, immediateRender: false },
      "-=0.2"
    )
    .call(() => hero.classList.add("hero--ready"));

  const scrollLine = hero.querySelector("[data-hero-scroll-line]");
  if (scrollLine) {
    gsap.to(scrollLine, {
      scaleX: 1.4,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "left center",
    });
  }
}

export function initMarquees() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll("[data-marquee]").forEach((marquee) => {
    const track = marquee.querySelector(".marquee__track");
    if (!track || track.children.length === 0) return;

    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marquee.appendChild(clone);

    const width = track.scrollWidth;
    if (width <= 0) return;

    gsap.to([track, clone], {
      x: -width,
      duration: width / 60,
      ease: "none",
      repeat: -1,
    });
  });
}

export function initHomeSections() {
  if (prefersReducedMotion()) return;

  gsap.utils.toArray("[data-home-reveal]").forEach((el, i) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      delay: 0.2 + i * 0.06,
      ease: "power3.out",
      immediateRender: false,
    });
  });
}
