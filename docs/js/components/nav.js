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

  const themeToggle = `
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme" aria-pressed="false">
      <svg class="theme-toggle__icon theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </svg>
      <svg class="theme-toggle__icon theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  `;

  return `
    <header class="nav" data-nav>
      <div class="nav__inner">
        <a class="nav__brand" href="index.html">
          <span class="nav-mascot" aria-hidden="true">
            <img src="${SITE.mascot}" alt="" width="34" height="34" />
          </span>
          <span class="nav__brand-name">${SITE.name}</span>
        </a>
        <div class="nav__right">
          <nav class="nav__links" aria-label="Primary">${desktopLinks}</nav>
          ${themeToggle}
          <button class="nav__toggle" type="button" data-nav-toggle aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <nav class="nav__mobile" data-nav-mobile aria-label="Mobile">${mobileLinks}</nav>
    </header>
  `;
}
