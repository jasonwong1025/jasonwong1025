import { SITE, TURNSTILE, WEB3FORMS } from "../config.js";

const SUBMIT_LABEL = 'Send message <span class="btn__arrow">→</span>';

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-contact-submit]");
  const widgetHost = form.querySelector("[data-turnstile]");
  const statusEl = form.querySelector("[data-turnstile-status]");
  if (!submitBtn || !widgetHost) return;

  let verified = false;
  let sending = false;
  let widgetId = null;
  let mounted = false;

  function setStatus(message, tone = "") {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("contact-form__status--success", "contact-form__status--error");
    if (tone) statusEl.classList.add(`contact-form__status--${tone}`);
  }

  function setSubmitEnabled(enabled) {
    verified = enabled;
    if (!sending) {
      submitBtn.disabled = !enabled;
      submitBtn.setAttribute("aria-disabled", String(!enabled));
    }
    if (enabled) setStatus("");
  }

  setSubmitEnabled(false);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!verified) {
      setStatus("Complete the security check above before sending.", "error");
      return;
    }
    if (sending) return;

    if (!WEB3FORMS.accessKey) {
      setStatus(`Form not set up yet — email ${SITE.email} directly.`, "error");
      return;
    }

    if (form.elements.namedItem("botcheck")?.checked) return;

    const name = form.elements.namedItem("name")?.value?.trim();
    const email = form.elements.namedItem("email")?.value?.trim();
    const message = form.elements.namedItem("message")?.value?.trim();
    if (!name || !email || !message) return;

    sending = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-disabled", "true");
    submitBtn.innerHTML = "Sending…";
    setStatus("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS.accessKey,
          subject: `Portfolio message from ${name}`,
          from_name: name,
          name,
          email,
          replyto: email,
          message,
          botcheck: "",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Send failed");
      }

      form.reset();
      setSubmitEnabled(false);
      if (widgetId !== null) window.turnstile.reset(widgetId);
      setStatus("Message sent — I'll get back to you soon.", "success");
    } catch {
      setStatus(`Could not send. Try ${SITE.email} directly.`, "error");
      submitBtn.disabled = false;
      submitBtn.setAttribute("aria-disabled", "false");
    } finally {
      sending = false;
      submitBtn.innerHTML = SUBMIT_LABEL;
      if (!verified) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-disabled", "true");
      }
    }
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
        setStatus("Verification failed to load. Refresh the page or email directly.", "error");
      },
      "expired-callback": () => {
        setSubmitEnabled(false);
        setStatus("Verification expired. Please complete the check again.", "error");
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
          `Verification could not load. Refresh the page or email ${SITE.email} directly.`,
          "error"
        );
      }
    }, 100);
  }

  bootTurnstile();
}
