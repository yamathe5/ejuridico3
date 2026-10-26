(() => {
  "use strict";

  const header = document.getElementById("siteHeader");
  const sentinel = document.querySelector(".top-sentinel");
  const whatsappWidget = document.querySelector(".whatsapp-widget");

  if (header && sentinel && "IntersectionObserver" in window) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle("is-scrolled", !entry.isIntersecting);
    }, { threshold: 0 });
    headerObserver.observe(sentinel);
  } else if (header) {
    header.classList.add("is-scrolled");
  }

  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const processSection = document.querySelector(".process");

  if (processSection) {
    if ("IntersectionObserver" in window) {
      const processObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.18 });
      processObserver.observe(processSection);
    } else {
      processSection.classList.add("is-visible");
    }
  }

  const navLinks = Array.from(document.querySelectorAll(".nav-desktop a[href^='#']"));

  if (navLinks.length && "IntersectionObserver" in window) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-38% 0px -56% 0px", threshold: 0 });

    sections.forEach((section) => navObserver.observe(section));
  }

  const year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (whatsappWidget) {
    const heroSection = document.querySelector(".hero");
    const footerSection = document.querySelector(".site-footer");

    if ("IntersectionObserver" in window && heroSection) {
      let pastHero = false;
      let footerVisible = false;

      const updateWhatsapp = () => {
        whatsappWidget.classList.toggle("is-expanded", pastHero && !footerVisible);
        whatsappWidget.classList.toggle("is-hidden", footerVisible);
      };

      const heroObserver = new IntersectionObserver(([entry]) => {
        pastHero = entry.intersectionRatio <= 0.15;
        updateWhatsapp();
      }, { threshold: [0, 0.15] });
      heroObserver.observe(heroSection);

      if (footerSection) {
        const footerObserver = new IntersectionObserver(([entry]) => {
          footerVisible = entry.isIntersecting;
          updateWhatsapp();
        }, { threshold: 0 });
        footerObserver.observe(footerSection);
      }
    } else {
      whatsappWidget.classList.add("is-expanded");
    }
  }

  const menu = document.getElementById("mobileMenu");
  const toggle = document.querySelector(".menu-toggle");
  const main = document.getElementById("contenido");
  const footer = document.querySelector(".site-footer");

  if (menu && toggle) {
    let lastFocused = null;

    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    const setPageInert = (inert) => {
      [main, footer, whatsappWidget].forEach((element) => {
        if (!element) return;
        if (inert) {
          element.setAttribute("inert", "");
        } else {
          element.removeAttribute("inert");
        }
      });
    };

    const openMenu = () => {
      lastFocused = document.activeElement;
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");
      document.body.classList.add("menu-open");
      setPageInert(true);
      window.setTimeout(() => menu.querySelector("a")?.focus(), 140);
    };

    const closeMenu = (returnFocus = true) => {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      document.body.classList.remove("menu-open");
      setPageInert(false);
      if (returnFocus) {
        const target = lastFocused instanceof HTMLElement ? lastFocused : toggle;
        target.focus();
      }
    };

    toggle.addEventListener("click", () => {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    document.querySelectorAll(".site-header .brand").forEach((link) => {
      link.addEventListener("click", () => {
        if (isOpen()) closeMenu(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        closeMenu();
      }
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !isOpen()) return;
      const focusable = Array.from(menu.querySelectorAll("a[href], button:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        toggle.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 1181px)");
    desktopQuery.addEventListener("change", (event) => {
      if (event.matches && isOpen()) closeMenu(false);
    });
  }

  const areaSelect = document.getElementById("area");

  document.querySelectorAll("[data-area-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!areaSelect) return;
      const area = link.getAttribute("data-area-link");
      if (!area) return;
      const option = Array.from(areaSelect.options).find((item) => item.value === area || item.text === area);
      if (!option) return;

      areaSelect.value = option.value || option.text;
      const field = areaSelect.closest(".field");

      if (field) {
        field.classList.add("is-flashing");
        window.setTimeout(() => field.classList.remove("is-flashing"), 1800);
      }
    });
  });

  const dialog = document.getElementById("legalDialog");

  if (dialog) {
    const openers = document.querySelectorAll("[data-dialog-open='legalDialog']");
    const closeButtons = dialog.querySelectorAll("[data-dialog-close]");

    const openDialog = () => {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
        document.body.classList.add("dialog-open");
      }
    };

    const closeDialog = () => {
      if (dialog.open) dialog.close();
    };

    openers.forEach((button) => button.addEventListener("click", openDialog));
    closeButtons.forEach((button) => button.addEventListener("click", closeDialog));

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const outside = (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
      if (outside) closeDialog();
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });
  }

  const form = document.getElementById("contactForm");

  if (form) {
    const status = document.getElementById("formStatus");
    const fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      message: document.getElementById("message"),
      privacy: document.getElementById("privacy")
    };

    const validators = {
      name: (value) => value.trim().length >= 2 ? "" : "Indique su nombre.",
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? "" : "Introduzca un correo electrónico válido.",
      message: (value) => value.trim().length >= 20 ? "" : "Cuéntenos brevemente su situación (mínimo 20 caracteres).",
      privacy: (_, field) => field.checked ? "" : "Debe aceptar el tratamiento de sus datos."
    };

    const setError = (name, message) => {
      const field = fields[name];
      if (!field) return;
      const error = document.getElementById(`${name}-error`);
      if (error) error.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
      field.closest(".field")?.classList.toggle("has-error", Boolean(message));
      field.closest(".checkbox-row")?.classList.toggle("has-error", Boolean(message));
    };

    const validateField = (name) => {
      const field = fields[name];
      if (!field || !validators[name]) return true;
      const message = validators[name](field.value, field);
      setError(name, message);
      return !message;
    };

    Object.entries(fields).forEach(([name, field]) => {
      if (!field) return;
      const eventName = field.type === "checkbox" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
      field.addEventListener("blur", () => {
        if (field.value || field.type === "checkbox") validateField(name);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (status) {
        status.className = "form-status";
        status.textContent = "";
      }

      const results = Object.keys(fields).map((name) => ({ name, valid: validateField(name) }));
      const invalid = results.find((result) => !result.valid);

      if (invalid) {
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Revise los campos marcados.";
        }
        fields[invalid.name]?.focus();
        return;
      }

      if (status) {
        status.classList.add("is-success");
        status.textContent = "Gracias. El formulario funciona en modo demostración: no se ha enviado ni guardado ningún dato.";
      }

      form.reset();
      Object.keys(fields).forEach((name) => setError(name, ""));
    });
  }
})();
