const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const dropdowns = [...document.querySelectorAll("[data-dropdown]")];

const closeDropdowns = (except = null) => {
  dropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
  });
};

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector("[data-dropdown-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const willOpen = !dropdown.classList.contains("is-open");
    closeDropdowns(willOpen ? dropdown : null);
    dropdown.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
  });

  dropdown.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    dropdown.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    nav.classList.toggle("is-open", willOpen);
    if (!willOpen) closeDropdowns();
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    closeDropdowns();
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest("[data-dropdown]")) closeDropdowns();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !nav?.classList.contains("is-open")) return;
  nav.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  closeDropdowns();
  menuToggle?.focus();
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 })
  : null;

document.querySelectorAll(".reveal").forEach((node) => {
  if (revealObserver) revealObserver.observe(node);
  else node.classList.add("is-visible");
});

const leadForm = document.querySelector("[data-lead-form]");

if (leadForm) {
  const status = leadForm.querySelector("[data-form-status]");
  const requiredFields = [...leadForm.querySelectorAll("[data-required]")];

  const setFieldError = (field, message = "") => {
    const error = leadForm.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => setFieldError(field));
    field.addEventListener("change", () => setFieldError(field));
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (leadForm.elements.website?.value) return;

    let valid = true;
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        setFieldError(field, "Please complete this field.");
        valid = false;
      } else {
        setFieldError(field);
      }
    });

    const contact = leadForm.querySelector("#contact");
    if (contact?.value && !contact.value.includes("@") && contact.value.replace(/\D/g, "").length < 10) {
      setFieldError(contact, "Enter a valid email address or 10-digit phone number.");
      valid = false;
    }

    const zip = leadForm.querySelector("#zip");
    if (zip?.value && !/^\d{5}$/.test(zip.value)) {
      setFieldError(zip, "Enter a 5-digit ZIP code.");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Please review the highlighted fields.";
      status.classList.add("form-status--error", "is-visible");
      requiredFields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    status.textContent = "Test mode: the request was validated in this browser but was not transmitted or stored. Connect a verified operator and form destination before launch.";
    status.classList.add("form-status--success", "is-visible");
  });
}
