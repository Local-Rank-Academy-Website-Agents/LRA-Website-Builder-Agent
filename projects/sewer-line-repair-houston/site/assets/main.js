const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    siteNav.classList.toggle("is-open", !open);
  });
}
for (const dropdown of document.querySelectorAll(".dropdown")) {
  const button = dropdown.querySelector(".dropdown-control button");
  if (!button) continue;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    for (const other of document.querySelectorAll(".dropdown.is-open")) {
      if (other !== dropdown) {
        other.classList.remove("is-open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
      }
    }
    button.setAttribute("aria-expanded", String(!open));
    dropdown.classList.toggle("is-open", !open);
  });
}
document.addEventListener("click", (event) => {
  if (event.target.closest(".dropdown")) return;
  for (const dropdown of document.querySelectorAll(".dropdown.is-open")) {
    dropdown.classList.remove("is-open");
    dropdown.querySelector("button")?.setAttribute("aria-expanded", "false");
  }
});
for (const form of document.querySelectorAll("[data-lead-form]")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    let valid = true;
    for (const field of form.querySelectorAll("[required]")) {
      const empty = !field.value.trim();
      field.setAttribute("aria-invalid", String(empty));
      const error = form.querySelector(`[data-error-for="${field.name}"]`);
      if (error) error.textContent = empty ? "This field is required." : "";
      if (empty) valid = false;
    }
    if (form.elements.company?.value) valid = false;
    if (!status) return;
    status.className = `form-status is-visible ${valid ? "form-status--success" : "form-status--error"}`;
    status.textContent = valid ? "Your request details are complete. Lead routing is not connected yet, so nothing was transmitted or retained." : "Please complete the required fields before reviewing the request details.";
    if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
  });
}
