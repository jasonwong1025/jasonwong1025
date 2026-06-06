import { SITE, TURNSTILE } from "../config.js";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-contact-submit]");
  const widgetHost = form.querySelector("[data-turnstile]");
  if (!submitBtn || !widgetHost) return;

  let verified = false;
  let widgetId = null;

  function setSubmitEnabled(enabled) {
    verified = enabled;
    submitBtn.disabled = !enabled;
    submitBtn.setAttribute("aria-disabled", String(!enabled));
  }

  setSubmitEnabled(false);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!verified) return;

    const name = form.elements.namedItem("name")?.value?.trim();
    const email = form.elements.namedItem("email")?.value?.trim();
    const message = form.elements.namedItem("message")?.value?.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });

  function mountWidget() {
    if (!window.turnstile || widgetId !== null) return;

    widgetId = window.turnstile.render(widgetHost, {
      sitekey: TURNSTILE.siteKey,
      theme: "dark",
      callback: () => setSubmitEnabled(true),
      "error-callback": () => setSubmitEnabled(false),
      "expired-callback": () => {
        setSubmitEnabled(false);
        if (widgetId !== null) window.turnstile.reset(widgetId);
      },
    });
  }

  if (window.turnstile) {
    window.turnstile.ready(mountWidget);
    return;
  }

  document
    .querySelector('script[src*="challenges.cloudflare.com/turnstile"]')
    ?.addEventListener("load", () => window.turnstile?.ready(mountWidget));
}
