(function () {
  "use strict";

  function initializeMobileNav() {
    const navToggle = document.querySelector(".button-mobile__toggle");
    const header = document.querySelector(".header");

    if (navToggle && header) {
      navToggle.addEventListener("click", () => {
        header.classList.toggle("nav-open");
        const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", !isExpanded);
      });
    }
  }

  window.addEventListener("DOMContentLoaded", initializeMobileNav);
})();
