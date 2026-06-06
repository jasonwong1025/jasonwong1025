import { prefersReducedMotion } from "../core/reduced-motion.js";

export function initStack() {
  const stack = document.querySelector("[data-stack]");
  if (!stack) return;

  const nav = stack.querySelector("[data-stack-nav]");
  const cards = () => [...stack.querySelectorAll("[data-stack-card]")];
  const chips = () => [...stack.querySelectorAll("[data-stack-chip]")];

  if (!nav) return;

  const reduced = prefersReducedMotion();
  let activeCategory = "all";

  function setFocus(category) {
    activeCategory = category;

    nav.querySelectorAll("[data-stack-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.stackFilter === category);
    });

    const items = cards();

    if (reduced) {
      items.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("is-dimmed", !match && category !== "all");
        card.classList.toggle("is-focused", match && category !== "all");
      });
      return;
    }

    items.forEach((card) => {
      const match = category === "all" || card.dataset.category === category;
      const focused = match && category !== "all";

      gsap.to(card, {
        opacity: category === "all" || match ? 1 : 0.35,
        scale: focused ? 1.03 : 1,
        y: focused ? -6 : 0,
        duration: 0.45,
        ease: "power2.out",
      });

      card.classList.toggle("is-focused", focused);
      card.classList.toggle("is-dimmed", !match && category !== "all");
    });
  }

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-stack-filter]");
    if (!btn) return;

    const next = btn.dataset.stackFilter;
    if (next === activeCategory && next !== "all") {
      setFocus("all");
      return;
    }

    setFocus(next);
  });

  cards().forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (reduced || activeCategory !== "all") return;

      cards().forEach((other) => {
        if (other === card) return;
        gsap.to(other, { opacity: 0.55, scale: 0.98, duration: 0.35, ease: "power2.out" });
      });

      gsap.to(card, { y: -8, scale: 1.02, duration: 0.4, ease: "back.out(1.6)" });
    });

    card.addEventListener("mouseleave", () => {
      if (reduced || activeCategory !== "all") return;

      cards().forEach((other) => {
        gsap.to(other, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power2.out" });
      });
    });

    card.addEventListener("click", () => {
      const category = card.dataset.category;
      setFocus(activeCategory === category ? "all" : category);
    });
  });

  chips().forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      if (reduced) return;
      gsap.to(chip, { y: -3, scale: 1.05, duration: 0.3, ease: "back.out(2)" });
    });

    chip.addEventListener("mouseleave", () => {
      if (reduced) return;
      gsap.to(chip, { y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
    });
  });
}
