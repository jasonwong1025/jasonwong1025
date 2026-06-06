import { SITE, TURNSTILE } from "../config.js";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-contact-submit]");
  const widgetHost = form.querySelector("[data-turnstile]");
  const statusEl = form.querySelector("[data-turnstile-status]");
  if (!submitBtn || !widgetHost) return;

  let verified = false;
  let widgetId = null;
  let mounted = false;

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message;
  }

  function setSubmitEnabled(enabled) {
    verified = enabled;
    submitBtn.disabled = !enabled;
    submitBtn.setAttribute("aria-disabled", String(!enabled));
    if (enabled) setStatus("");
  }

  setSubmitEnabled(false);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!verified) {
      setStatus("Complete the security check above before sending.");
      return;
    }

    const name = form.elements.namedItem("name")?.value?.trim();
    const email = form.elements.namedItem("email")?.value?.trim();
    const message = form.elements.namedItem("message")?.value?.trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });

  function mountWidget() {
    if (mounted || !window.turnstile) return;

    mounted = true;
    widgetId = window.turnstile.render(widgetHost, {
      sitekey: TURNSTILE.siteKey,
      theme: "dark",
      callback: () => setSubmitEnabled(true),
      "error-callback": () => {
        setSubmitEnabled(false);
        setStatus("Verification failed to load. Refresh the page or email directly.");
      },
      "expired-callback": () => {
        setSubmitEnabled(false);
        setStatus("Verification expired. Please complete the check again.");
        if (widgetId !== null) window.turnstile.reset(widgetId);
      },
    });
  }

  function bootTurnstile() {
    if (window.turnstile) {
      window.turnstile.ready(mountWidget);
      return;
    }

    let attempts = 0;
    const poll = window.setInterval(() => {
      attempts += 1;

      if (window.turnstile) {
        window.clearInterval(poll);
        window.turnstile.ready(mountWidget);
        return;
      }

      if (attempts >= 100) {
        window.clearInterval(poll);
        setStatus(
          `Verification could not load. Refresh the page or email ${SITE.email} directly.`
        );
      }
    }, 100);
  }

  bootTurnstile();
}
