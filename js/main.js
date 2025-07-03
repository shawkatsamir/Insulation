(function () {
  "use strict";

  // Cache DOM elements once
  const elements = {
    html: document.documentElement,
    callButton: document.querySelector(".btn-call"),
    callButtonIcon: document.querySelector(".btn-call .btn-call__icon"),
    langSwitcher: document.getElementById("lang-switcher"),

    header: {
      logo: document.querySelector("[data-key='header.logo']"),
      links: document.querySelectorAll("[data-key='header.links']"),
    },

    hero: {
      title: document.querySelector("[data-key='hero.title']"),
      subtitle: document.querySelector("[data-key='hero.subtitle']"),
    },
    trustItems: document.querySelectorAll(".hero-trust__item span"),

    contactButtons: {
      call: document.querySelectorAll("[data-key='contact.buttons.callBtn']"),
      whatsapp: document.querySelectorAll(
        "[data-key='contact.buttons.whatsappBtn']"
      ),
    },
    locations: {
      heroLocations: document.querySelectorAll(
        "[data-key='locations.hero.list']"
      ),
      contactLocations: document.querySelectorAll(
        "[data-key='locations.contact.list']"
      ),
      heading: document.querySelectorAll("[data-key='locations.heading']"),
      footer: document.querySelectorAll("[data-key='locations.footerText']"),
    },

    services: {
      header: {
        name: document.querySelector("[data-key='services.header.name']"),
        title: document.querySelector("[data-key='services.header.title']"),
        subtitle: document.querySelector(
          "[data-key='services.header.subtitle']"
        ),
      },
      cards: document.querySelectorAll(".service-card"),
    },

    whyUs: {
      header: {
        name: document.querySelector("[data-key='whyUs.header.name']"),
        title: document.querySelector("[data-key='whyUs.header.title']"),
        subtitle: document.querySelector("[data-key='whyUs.header.subtitle']"),
      },
      items: document.querySelectorAll(".why-us__item"),
    },

    contactUs: {
      header: {
        name: document.querySelector("[data-key='contact.header.name']"),
        subtitle: document.querySelector(
          "[data-key='contact.header.subtitle']"
        ),
      },
      labels: {
        phone: document.querySelector(
          "[data-key='contact_us.contactInfo.phoneLabel']"
        ),
        whatsapp: document.querySelector(
          "[data-key='contact_us.contactInfo.whatsappLabel']"
        ),
        email: document.querySelector(
          "[data-key='contact_us.contactInfo.emailLabel']"
        ),
      },

      locations: {
        locationsArea: document.querySelectorAll(".locations-list li"),
        heading: document.querySelectorAll("[data-key='locations.heading']"),
        footer: document.querySelectorAll("[data-key='locations.footerText']"),
      },

      trustItems: document.querySelectorAll(".hero-trust--contact span"),
    },
    footer: {
      footerAboutName: document.querySelector(".footer__name"),
      footerAboutDesc: document.querySelector(".footer__desc"),
      quickLinksTitle: document.querySelector(
        ".footer__section:nth-child(2) .footer__title"
      ),
      quickLinksHome: document.querySelector(
        ".footer__section:nth-child(2) .footer__links li:nth-child(1) a"
      ),
      quickLinksServices: document.querySelector(
        ".footer__section:nth-child(2) .footer__links li:nth-child(2) a"
      ),
      quickLinksWhyUs: document.querySelector(
        ".footer__section:nth-child(2) .footer__links li:nth-child(3) a"
      ),
      quickLinksContact: document.querySelector(
        ".footer__section:nth-child(2) .footer__links li:nth-child(4) a"
      ),
      ourServicesTitle: document.querySelector(
        ".footer__section:nth-child(3) .footer__title"
      ),
      ourServicesRoof: document.querySelector(
        ".footer__section:nth-child(3) .footer__links li:nth-child(1) a"
      ),
      ourServicesLeak: document.querySelector(
        ".footer__section:nth-child(3) .footer__links li:nth-child(2) a"
      ),
      ourServicesTank: document.querySelector(
        ".footer__section:nth-child(3) .footer__links li:nth-child(3) a"
      ),
      ourServicesBathroom: document.querySelector(
        ".footer__section:nth-child(3) .footer__links li:nth-child(4) a"
      ),
      contactUsTitle: document.querySelector(
        ".footer__section:nth-child(4) .footer__title"
      ),
      contactUsPhone: document.querySelector(
        ".footer__contact li:nth-child(1) a"
      ),
      contactUsWhatsapp: document.querySelector(
        ".footer__contact li:nth-child(2) a"
      ),
      contactUsEmail: document.querySelector(
        ".footer__contact li:nth-child(3) a"
      ),
      bottomBarCopyright: document.querySelector(".footer-bottom p"),
      bottomBarLangToggle: document.querySelector(
        ".footer-bottom__lang-toggle button"
      ),
    },

    schema: document.getElementById("schema-data"),
  };

  let translations = {};

  // Load translations from external JSON
  async function loadTranslations() {
    try {
      const response = await fetch("./data/translation.json");
      translations = await response.json();
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  }

  // Set text safely
  const setText = (el, text) => {
    if (el && text !== undefined) el.textContent = text;
  };
  // Update all UI content based on language
  function updateContent(lang) {
    if (!translations[lang]) return;

    const t = translations[lang];

    // header
    setText(elements.header.logo, t.header.logo);

    // Hero Section
    setText(elements.hero.title, t.hero.title);
    setText(elements.hero.subtitle, t.hero.subtitle);

    // Services Header
    setText(elements.services.header.name, t.services.header.name);
    setText(elements.services.header.title, t.services.header.title);
    setText(elements.services.header.subtitle, t.services.header.subtitle);

    // Why Us Header
    setText(elements.whyUs.header.name, t.whyUs.header.name);
    setText(elements.whyUs.header.title, t.whyUs.header.title);
    setText(elements.whyUs.header.subtitle, t.whyUs.header.subtitle);

    // Contact Us Header
    setText(elements.contactUs.header.name, t.contact_us.header.name);
    setText(elements.contactUs.header.subtitle, t.contact_us.header.subtitle);

    // Contact Labels
    setText(
      elements.contactUs.labels.phone,
      t.contact_us.contactInfo.phoneLabel
    );
    setText(
      elements.contactUs.labels.whatsapp,
      t.contact_us.contactInfo.whatsappLabel
    );
    setText(
      elements.contactUs.labels.email,
      t.contact_us.contactInfo.emailLabel
    );

    // Buttons
    elements.contactButtons.call.forEach((el) =>
      setText(el, t.contact.callBtn)
    );
    elements.contactButtons.whatsapp.forEach((el) =>
      setText(el, t.contact.whatsappBtn)
    );
    elements.header.links.forEach((el, i) => setText(el, t.header.links[i]));

    // Trust Items
    elements.trustItems.forEach((span, i) =>
      setText(span, t.hero.trustItems[i]?.text)
    );
    elements.contactUs.trustItems.forEach((span, i) =>
      setText(span, t.contact_us.trustItems[i]?.text)
    );

    // Labels

    setText(
      elements.contactUs.labels.phone,
      t.contact_us.contactInfo.phoneLabel
    );

    // Locations
    elements.locations.heading.forEach((el) =>
      setText(el, t.locations.heading)
    );
    elements.locations.footer.forEach((el) =>
      setText(el, t.locations.footerText)
    );

    elements.locations.heroLocations.forEach((el, i) =>
      setText(el, t.locations.hero.list[i])
    );
    elements.locations.contactLocations.forEach((el, i) =>
      setText(el, t.locations.contact.list[i])
    );

    // Service Cards
    elements.services.cards.forEach((card, i) => {
      const cardData = t.services.cards[i];
      if (!cardData) return;

      setText(card.querySelector(".service-card__title"), cardData.title);
      setText(
        card.querySelector(".services-card__subtitle"),
        cardData.subtitle
      );
      card
        .querySelectorAll(".service-card__features-item span")
        .forEach((feature, j) => {
          setText(feature, cardData.features[j]);
        });
    });

    // Why Us Items
    elements.whyUs.items.forEach((item, i) => {
      const itemData = t.whyUs.items[i];
      if (!itemData) return;

      setText(item.querySelector(".why-us__item-title"), itemData.title);
      setText(item.querySelector(".why-us__item-text"), itemData.text);
    });

    setText(elements.footer.footerAboutName, t.footer.about.name);
    setText(elements.footer.footerAboutDesc, t.footer.about.description);

    setText(elements.footer.quickLinksTitle, t.footer.quickLinks.title);
    setText(elements.footer.quickLinksHome, t.footer.quickLinks.home);
    setText(elements.footer.quickLinksServices, t.footer.quickLinks.services);
    setText(elements.footer.quickLinksWhyUs, t.footer.quickLinks.whyUs);
    setText(elements.footer.quickLinksContact, t.footer.quickLinks.contact);

    setText(elements.footer.ourServicesTitle, t.footer.ourServices.title);
    setText(
      elements.footer.ourServicesRoof,
      t.footer.ourServices.roofInsulation
    );
    setText(
      elements.footer.ourServicesLeak,
      t.footer.ourServices.leakDetection
    );
    setText(
      elements.footer.ourServicesTank,
      t.footer.ourServices.tankInsulation
    );
    setText(
      elements.footer.ourServicesBathroom,
      t.footer.ourServices.bathroomWaterproofing
    );

    setText(elements.footer.contactUsTitle, t.footer.contactUs.title);
    setText(elements.footer.contactUsPhone, t.footer.contactUs.phone);
    setText(elements.footer.contactUsWhatsapp, t.footer.contactUs.whatsapp);
    setText(elements.footer.contactUsEmail, t.footer.contactUs.email);

    setText(elements.footer.bottomBarCopyright, t.footer.bottomBar.copyright);
    setText(
      elements.footer.bottomBarLangToggle,
      t.footer.bottomBar.languageToggle
    );

    // Schema Data
    if (elements.schema) {
      try {
        const schemaData = JSON.parse(elements.schema.textContent);
        schemaData.name = t.hero.title;
        schemaData.description = t.hero.subtitle;
        elements.schema.textContent = JSON.stringify(schemaData, null, 2);
      } catch (e) {
        console.error("Failed to parse or update schema data.", e);
      }
    }
  }

  // Set language and direction
  function setLanguage(lang) {
    elements.html.setAttribute("lang", lang);
    elements.html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("preferred-lang", lang);
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang } })
    );
    updateContent(lang);
  }

  // Toggle between languages
  function switchLang() {
    const currentLang = elements.html.getAttribute("lang") || "ar";
    setLanguage(currentLang === "ar" ? "en" : "ar");
  }

  // Initialize app
  async function initialize() {
    await loadTranslations();

    const savedLang = localStorage.getItem("preferred-lang");
    const browserLangIsArabic = (
      navigator.language || navigator.userLanguage
    ).startsWith("ar");
    const initialLang = savedLang || (browserLangIsArabic ? "ar" : "en");

    setLanguage(initialLang);

    // Call button animation
    if (elements.callButton) {
      elements.callButton.addEventListener("click", () => {
        if (elements.callButtonIcon) {
          elements.callButtonIcon.style.animation = "vibrate 0.3s";
          setTimeout(() => {
            elements.callButtonIcon.style.animation = "";
          }, 300);
        }
      });
    }

    // Language switcher
    if (elements.langSwitcher) {
      elements.langSwitcher.addEventListener("click", switchLang);
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
