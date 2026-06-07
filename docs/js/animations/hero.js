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
  const descWords = hero.querySelectorAll("[data-hero-desc] .split-word");

  tl.from("[data-hero] [data-hero-eyebrow]", {
    y: 40,
    opacity: 0,
    scale: 0.9,
    duration: 0.65,
    ease: "back.out(1.7)",
    immediateRender: false,
  })
    .from(
      "[data-hero] .hero__title-line",
      {
        yPercent: 130,
        rotationX: -28,
        transformOrigin: "50% 100%",
        duration: 0.85,
        stagger: 0.14,
        ease: "power4.out",
        immediateRender: false,
      },
      "-=0.3"
    )
    .from(
      "[data-hero] .hero__title-accent",
      { scale: 0.75, duration: 0.7, ease: "back.out(2)", immediateRender: false },
      "-=0.5"
    );

  if (descWords.length) {
    tl.from(
      descWords,
      { y: 36, opacity: 0, rotation: 3, duration: 0.4, stagger: 0.012, ease: "power4.out", immediateRender: false },
      "-=0.4"
    ).from(
      "[data-hero] .hero__typewriter",
      { y: 16, opacity: 0, duration: 0.45, ease: "power3.out", immediateRender: false },
      "-=0.15"
    );
  } else {
    tl.from(
      "[data-hero] [data-hero-desc]",
      { y: 36, opacity: 0, duration: 0.55, immediateRender: false },
      "-=0.4"
    );
  }

  tl.from(
    "[data-hero] [data-hero-actions] > *",
    { y: 32, opacity: 0, scale: 0.85, duration: 0.55, stagger: 0.1, ease: "back.out(1.8)", immediateRender: false },
    "-=0.25"
  )
    .from(
      "[data-hero] [data-hero-meta] > *",
      { y: 24, opacity: 0, x: -12, duration: 0.5, stagger: 0.08, ease: "power4.out", immediateRender: false },
      "-=0.22"
    )
    .from(
      "[data-hero] [data-hero-scroll]",
      { opacity: 0, y: 20, duration: 0.45, immediateRender: false },
      "-=0.15"
    )
    .call(() => hero.classList.add("hero--ready"));

  const scrollLine = hero.querySelector("[data-hero-scroll-line]");
  if (scrollLine) {
    gsap.to(scrollLine, {
      scaleX: 2,
      duration: 1,
      ease: "power2.inOut",
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
  /* Scroll-triggered home section motion lives in home-interactions.js */
}
