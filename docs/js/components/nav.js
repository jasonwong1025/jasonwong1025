import { NAV_LINKS, SITE } from "../config.js";

export function initNav(currentPage) {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const toggle = nav.querySelector("[data-nav-toggle]");
  const mobile = nav.querySelector("[data-nav-mobile]");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle?.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  mobile?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  nav.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

export function renderNav(currentPage) {
  const desktopLinks = NAV_LINKS.map(
    ({ href, label, page }) =>
      `<a class="nav__link" href="${href}" data-nav-link data-page="${page}">${label}</a>`
  ).join("");

  const mobileLinks = NAV_LINKS.map(
    ({ href, label, page }) =>
      `<a class="nav__mobile-link" href="${href}" data-nav-link data-page="${page}">${label}</a>`
  ).join("");

  return `
    <header class="nav" data-nav>
      <div class="nav__inner">
        <a class="nav__brand" href="index.html">
          <span class="nav-mascot" aria-hidden="true">
            <img src="${SITE.mascot}" alt="" width="36" height="36" />
          </span>
          <span class="nav__brand-mark">&lt;</span>${SITE.name}<span class="nav__brand-mark">/&gt;</span>
        </a>
        <nav class="nav__links" aria-label="Primary">${desktopLinks}</nav>
        <button class="nav__toggle" type="button" data-nav-toggle aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="nav__mobile" data-nav-mobile aria-label="Mobile">${mobileLinks}</nav>
    </header>
  `;
}
