(function () {
  "use strict";

  // Cache all DOM elements once at startup
  const elements = {
    html: document.documentElement,
    postTitle: document.querySelector(".post-title"),
    postAuthor: document.querySelector(".post-author"),
    postDate: document.querySelector(".post-date"),
    postDateEl: document.querySelector(".post-date"),
    featuredImage: document.querySelector(".post-featured-image img"),
    canonicalLink: document.querySelector("link[rel='canonical']"),

    // Post body sections
    section1: {
      heading: document.querySelector('[data-key="post.body.section1.heading"]'),
      paragraph: document.querySelector('[data-key="post.body.section1.paragraph"]')
    },
    section2: {
      heading: document.querySelector('[data-key="post.body.section2.heading"]'),
      paragraph: document.querySelector('[data-key="post.body.section2.paragraph"]'),
      steps: [
        {
          title: document.querySelector('[data-key="post.body.section2.steps[0].title"]'),
          description: document.querySelector('[data-key="post.body.section2.steps[0].description"]')
        },
        {
          title: document.querySelector('[data-key="post.body.section2.steps[1].title"]'),
          description: document.querySelector('[data-key="post.body.section2.steps[1].description"]')
        },
        {
          title: document.querySelector('[data-key="post.body.section2.steps[2].title"]'),
          description: document.querySelector('[data-key="post.body.section2.steps[2].description"]')
        }
      ]
    },
    section3: {
      heading: document.querySelector('[data-key="post.body.section3.heading"]'),
      paragraph: document.querySelector('[data-key="post.body.section3.paragraph"]'),
      materials: [
        {
          title: document.querySelector('[data-key="post.body.section3.materials[0].title"]'),
          description: document.querySelector('[data-key="post.body.section3.materials[0].description"]')
        },
        {
          title: document.querySelector('[data-key="post.body.section3.materials[1].title"]'),
          description: document.querySelector('[data-key="post.body.section3.materials[1].description"]')
        }
      ]
    },

    // Structured Data
    structuredData: document.getElementById("structured-data")
  };

  // Utility functions
  const setText = (el, text) => {
    if (el && text !== undefined) el.textContent = text;
  };

  const setAttribute = (el, attr, value) => {
    if (el && value !== undefined) el.setAttribute(attr, value);
  };

  // Update structured data dynamically
  function updateStructuredData(postContent, postId, lang) {
    if (!elements.structuredData) return;

    const structuredData = {
      "@context": "https://schema.org ",
      "@type": "BlogPosting",
      headline: postContent.postInfo.title,
      description: postContent.postInfo.summary,
      url: `https://www.insulmakkah.com/post.html?id=${postId}&lang=${lang}`,
      datePublished: postContent.postInfo.date,
      dateModified: postContent.postInfo.date,
      image: postContent.media.imageUrl,
      author: {
        "@type": "Organization",
        name: postContent.postInfo.author
      },
      publisher: {
        "@type": "Organization",
        name: "عوازل مكة",
        logo: {
          "@type": "ImageObject",
          url: " https://www.insulmakkah.com/imgs/logo.png "
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.insulmakkah.com/post.html?id=${postId}&lang=${lang}`
      }
    };

    elements.structuredData.textContent = JSON.stringify(structuredData, null, 2);
  }

  // Update meta tags dynamically
  function updateMetaTags(postContent, postId, lang) {
    const baseUrl = " https://www.insulmakkah.com ";
    const postUrl = `${baseUrl}/post.html?id=${postId}&lang=${lang}`;
    const summary = postContent.postInfo.summary;

    // Update <title>
    document.title = postContent.postInfo.title;

    // Update meta description
    document.querySelector('meta[name="description"]').setAttribute("content", summary);

    // Update Open Graph tags
    document.querySelector('meta[property="og:title"]').setAttribute("content", postContent.postInfo.title);
    document.querySelector('meta[property="og:description"]').setAttribute("content", summary);
    document.querySelector('meta[property="og:image"]').setAttribute("content", postContent.media.imageUrl);
    document.querySelector('meta[property="og:url"]').setAttribute("content", postUrl);

    // Update canonical URL
    if (elements.canonicalLink) {
      elements.canonicalLink.setAttribute("href", postUrl);
    }
  }

  // Load post content from JSON
  async function loadPostContent(lang = "ar") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = parseInt(urlParams.get("id"));
      const currentLang = urlParams.get("lang") || lang;

      if (!postId) {
        document.querySelector(".post-full").innerHTML = '<p class="error-message">رقم المقال غير صحيح</p>';
        return;
      }

      // Fetch blog index and post JSON
      const [indexResponse, postResponse] = await Promise.all([
        fetch("/data/blogPost.json"),
        fetch(`/data/posts/${postId}.json`)
      ]);

      if (!indexResponse.ok || !postResponse.ok) throw new Error("فشل تحميل بيانات المقال");

      const indexData = await indexResponse.json();
      const postData = await postResponse.json();

      const postMetadata = indexData[currentLang]?.find(p => p.id === postId);
      const postContent = postData[currentLang];

      if (!postMetadata || !postContent) {
        throw new Error(`بيانات المقال غير متوفرة للغة ${currentLang}`);
      }

      // 1. Update HTML lang & dir
      elements.html.setAttribute("lang", currentLang);
      elements.html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

      // 2. Update Meta Tags
      updateMetaTags(postContent, postId, currentLang);

      // 3. Update Structured Data
      updateStructuredData(postContent, postId, currentLang);

      // 4. Populate Header Elements
      setText(elements.postTitle, postContent.postInfo.title);
      setText(elements.postAuthor, postContent.postInfo.author);
      setText(elements.postDate, postContent.postInfo.date);
      setAttribute(elements.postDateEl, "datetime", postContent.postInfo.date);

      // 5. Featured Image
      setAttribute(elements.featuredImage, "src", postContent.media.imageUrl);
      setAttribute(elements.featuredImage, "alt", postContent.media.imageAlt);

      // 6. Section 1
      setText(elements.section1.heading, postContent.body.section1.heading);
      setText(elements.section1.paragraph, postContent.body.section1.paragraph);

      // 7. Section 2
      setText(elements.section2.heading, postContent.body.section2.heading);
      setText(elements.section2.paragraph, postContent.body.section2.paragraph);
      setText(elements.section2.steps[0].title, postContent.body.section2.steps[0].title);
      setText(elements.section2.steps[0].description, postContent.body.section2.steps[0].description);
      setText(elements.section2.steps[1].title, postContent.body.section2.steps[1].title);
      setText(elements.section2.steps[1].description, postContent.body.section2.steps[1].description);
      setText(elements.section2.steps[2].title, postContent.body.section2.steps[2].title);
      setText(elements.section2.steps[2].description, postContent.body.section2.steps[2].description);

      // 8. Section 3
      setText(elements.section3.heading, postContent.body.section3.heading);
      setText(elements.section3.paragraph, postContent.body.section3.paragraph);
      setText(elements.section3.materials[0].title, postContent.body.section3.materials[0].title);
      setText(elements.section3.materials[0].description, postContent.body.section3.materials[0].description);
      setText(elements.section3.materials[1].title, postContent.body.section3.materials[1].title);
      setText(elements.section3.materials[1].description, postContent.body.section3.materials[1].description);

    } catch (error) {
      console.error("Error loading post content:", error);
      document.querySelector(".post-full").innerHTML = '<p class="error-message">تعذر تحميل المقال</p>';
    }
  }

  // Listen for language change event
  window.addEventListener("languageChanged", (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    if (postId) {
      loadPostContent(e.detail.lang);
    }
  });

  // Initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("preferred-lang") || "ar";
    loadPostContent(savedLang);
  });
})();