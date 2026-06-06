import { SITE } from "../config.js";

export function renderCta(page = "home") {
  const revealAttr = page === "home" ? "data-home-reveal" : "data-reveal";

  return `
    <section class="cta-strip">
      <div class="container" ${revealAttr}>
        <h2 class="cta-strip__title">Let's build something</h2>
        <p class="cta-strip__desc">
          Open to collaboration, freelance, and open-source.
          <a class="link-line" href="contact.html">Contact ${SITE.name} →</a>
        </p>
        <div class="cta-strip__actions">
          <a class="btn btn--fill" href="contact.html">Start a conversation <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>
  `;
}
