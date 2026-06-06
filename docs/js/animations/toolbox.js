import { prefersReducedMotion } from "../core/reduced-motion.js";

export function initToolbox() {
  const toolbox = document.querySelector("[data-toolbox]");
  if (!toolbox) return;

  const filterBar = toolbox.querySelector("[data-toolbox-filter]");
  const grid = toolbox.querySelector("[data-toolbox-grid]");
  const countEl = toolbox.querySelector("[data-toolbox-count]");
  const chips = () => [...toolbox.querySelectorAll("[data-toolbox-chip]")];

  if (!filterBar || !grid) return;

  const reduced = prefersReducedMotion();
  const originalOrder = chips();

  function updateCount(filter) {
    if (!countEl) return;
    const total = originalOrder.length;
    const visible =
      filter === "all" ? total : originalOrder.filter((c) => c.dataset.category === filter).length;
    countEl.textContent =
      filter === "all"
        ? `${total} technologies across ${filterBar.querySelectorAll("[data-filter]").length - 1} areas`
        : `Showing ${visible} of ${total}`;
  }

  function applyLayout(filter) {
    const visible =
      filter === "all"
        ? originalOrder
        : originalOrder.filter((chip) => chip.dataset.category === filter);

    visible.forEach((chip) => {
      chip.hidden = false;
      grid.appendChild(chip);
    });

    const hidden = originalOrder.filter((chip) => !visible.includes(chip));

    hidden.forEach((chip) => {
      chip.hidden = true;
      grid.appendChild(chip);
    });

    return { visible, hidden };
  }

  function setFilter(filter) {
    filterBar.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });

    const items = chips();
    items.forEach((chip) => gsap.killTweensOf(chip));

    const { visible, hidden } = applyLayout(filter);

    hidden.forEach((chip) => gsap.set(chip, { clearProps: "all" }));

    if (reduced) {
      updateCount(filter);
      return;
    }

    gsap.set(visible, { clearProps: "all" });

    gsap.fromTo(
      visible,
      { opacity: 0, scale: 0.88, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.5)",
      }
    );

    updateCount(filter);
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn || btn.classList.contains("is-active")) return;
    setFilter(btn.dataset.filter);
  });

  chips().forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      if (reduced || chip.hidden) return;
      gsap.to(chip, { y: -5, scale: 1.06, duration: 0.35, ease: "back.out(2)" });
    });

    chip.addEventListener("mouseleave", () => {
      if (reduced) return;
      gsap.to(chip, { y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
    });

    chip.addEventListener("click", () => {
      if (reduced) return;
      gsap.fromTo(chip, { scale: 1.1 }, { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.45)" });
    });
  });

  updateCount("all");
}
