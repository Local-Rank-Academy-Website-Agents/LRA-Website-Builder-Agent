(() => {
  const script = document.currentScript;
  const siteName = script?.dataset.site || document.title;
  const phone = script?.dataset.phone || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const hasPhone = phoneDigits.length === 10;
  const tel = hasPhone ? `tel:+1${phoneDigits}` : "";
  const endpoint = "https://api.hsforms.com/submissions/v3/integration/submit/247139734/076098ff-c93e-4ecc-8d94-0c40fdec45df";
  const value = (form, name) => String(form.elements[name]?.value || "").trim();
  const selectedText = (form, name) => form.elements[name]?.selectedOptions?.[0]?.textContent?.trim() || value(form, name);
  const showError = (form, field, message = "") => { field.setAttribute("aria-invalid", message ? "true" : "false"); form.querySelector(`[data-error-for="${field.name}"]`)?.replaceChildren(message); form.querySelector(`[data-error-for="${field.id}"]`)?.replaceChildren(message); };
  if (hasPhone) document.querySelectorAll(".nav-cta, .mobile-lead-cta").forEach((link) => { link.href = tel; link.textContent = `Call ${phone}`; });
  document.querySelectorAll(".quick-note, .form-note").forEach((note) => { note.textContent = "Secure requests are sent to HubSpot for lead intake. Do not include payment details, access codes, or other sensitive information."; });
  const footerNav = document.querySelector(".footer-top nav, .footer__intro nav"); if (hasPhone && footerNav && !footerNav.querySelector('[href^="tel:"]')) footerNav.insertAdjacentHTML("afterbegin", `<a href="${tel}">Call ${phone}</a>`);
  document.querySelectorAll("[data-lead-form]").forEach((form) => form.addEventListener("submit", async (event) => {
    event.preventDefault(); event.stopImmediatePropagation(); const status = form.querySelector("[data-form-status], .form-status"); const required = [...form.querySelectorAll("[data-required], [required]")];
    if (status) { status.className = "form-status"; status.textContent = ""; } if (value(form, "website") || value(form, "company")) return;
    let valid = true; required.forEach((field) => { const message = field.value.trim() ? "" : "Please complete this field."; showError(form, field, message); if (message) valid = false; });
    const contact = form.elements.contact; if (contact && contact.value && !contact.value.includes("@") && contact.value.replace(/\D/g, "").length < 10) { showError(form, contact, "Enter a valid email or 10-digit phone number."); valid = false; } const zip = form.elements.zip; if (zip && zip.value && !/^\d{5}$/.test(zip.value)) { showError(form, zip, "Enter a 5-digit ZIP code."); valid = false; }
    if (!valid) { if (status) { status.textContent = "Please review the highlighted fields."; status.classList.add("form-status--error", "is-visible"); } required.find((field) => field.getAttribute("aria-invalid") === "true")?.focus(); return; }
    const submit = form.querySelector('[type="submit"]'); const originalLabel = submit?.textContent; if (submit) { submit.disabled = true; submit.textContent = "Sending…"; }
    const fullName = value(form, "name").split(/\s+/).filter(Boolean); const contactValue = value(form, "contact"); const details = value(form, "details") || value(form, "concern"); const property = selectedText(form, "property"); const leadLocation = value(form, "location") || value(form, "zip"); const service = selectedText(form, "service"); const market = value(form, "market") || value(form, "location") || "Greater Houston";
    const fields = [{ name: "firstname", value: fullName.shift() || "Website lead" }, { name: "lastname", value: fullName.join(" ") }, { name: contactValue.includes("@") ? "email" : "phone", value: contactValue }, { name: "address", value: leadLocation }, { name: "service_needed", value: [siteName, service, property, details].filter(Boolean).join(" | ").slice(0, 1000) }, { name: "service_market", value: [market, leadLocation].filter(Boolean).join(" | ").slice(0, 255) }].filter((field) => field.value);
    try { const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submittedAt: String(Date.now()), fields, context: { pageUri: window.location.href, pageName: `${siteName} service request` } }) }); if (!response.ok) throw new Error(`HubSpot returned ${response.status}`); form.reset(); if (status) { status.textContent = "Thank you. Your request was sent successfully. We’ll be in touch shortly."; status.classList.add("form-status--success", "is-visible"); } }
    catch (error) { console.error("Lead submission failed", error); if (status) { status.textContent = "We couldn’t send your request. Please try again in a few minutes."; status.classList.add("form-status--error", "is-visible"); } }
    finally { if (submit) { submit.disabled = false; submit.textContent = originalLabel; } }
  }, true));
})();
