(function () {
  "use strict";
  const elements = {
    backLink: document.querySelector(".back-link"),
    postTitle: document.querySelector(".post-title"),
    postAuthor: document.querySelector(".post-author"),
    postDate: document.querySelector(".post-date"),
    featuredImage: document.querySelector(".post-featured-image img"),
    featuredImageAlt: document.querySelector(".post-featured-image img"),
    section1: {
      heading: document.querySelector(
        '[data-key="post.body.section1.heading"]'
      ),
      paragraph: document.querySelector(
        '[data-key="post.body.section1.paragraph"]'
      ),
    },
    section2: {
      heading: document.querySelector(
        '[data-key="post.body.section2.heading"]'
      ),
      paragraph: document.querySelector(
        '[data-key="post.body.section2.paragraph"]'
      ),
      steps: {
        item1: {
          strong: document.querySelector(
            '[data-key="post.body.section2.steps[0].title"]'
          ),
          text: document.querySelector(
            '[data-key="post.body.section2.steps[0].description"]'
          ),
        },
        item2: {
          strong: document.querySelector(
            '[data-key="post.body.section2.steps[1].title"]'
          ),
          text: document.querySelector(
            '[data-key="post.body.section2.steps[1].description"]'
          ),
        },
        item3: {
          strong: document.querySelector(
            '[data-key="post.body.section2.steps[2].title"]'
          ),
          text: document.querySelector(
            '[data-key="post.body.section2.steps[2].description"]'
          ),
        },
      },
    },
    section3: {
      heading: document.querySelector(
        '[data-key="post.body.section3.heading"]'
      ),
      paragraph: document.querySelector(
        '[data-key="post.body.section3.paragraph"]'
      ),
      materials: {
        item1: {
          strong: document.querySelector(
            '[data-key="post.body.section3.materials[0].title"]'
          ),
          text: document.querySelector(
            '[data-key="post.body.section3.materials[0].description"]'
          ),
        },
        item2: {
          strong: document.querySelector(
            '[data-key="post.body.section3.materials[1].title"]'
          ),
          text: document.querySelector(
            '[data-key="post.body.section3.materials[1].description"]'
          ),
        },
      },
    },
    structuredData: document.getElementById("structured-data"),
    relatedPosts: {
      post1: {
        title: document.querySelector('[data-key="related.post1.title"]'),
        link: document.querySelector('[data-key="related.post1.link"]'),
      },
      post2: {
        title: document.querySelector('[data-key="related.post2.title"]'),
        link: document.querySelector('[data-key="related.post2.link"]'),
      },
    },
    socialShare: {
      facebook: document.querySelector('[aria-label="Share on Facebook"]'),
      twitter: document.querySelector('[aria-label="Share on Twitter"]'),
      whatsapp: document.querySelector('[aria-label="Share on WhatsApp"]'),
    },
  };
  const setText = (el, text) => {
    if (el && text !== undefined) el.textContent = text;
  };
  const setAttribute = (el, attr, value) => {
    if (el && value !== undefined) el.setAttribute(attr, value);
  };
  function updateStructuredData(postContent, postMetadata) {
    if (!elements.structuredData) return;
    const structuredData = {
      "@context": "https://schema.org ",
      "@type": "BlogPosting",
      headline: postContent.postInfo.title,
      description: postMetadata.summary,
      image: postContent.media.imageUrl,
      author: { "@type": "Organization", name: postContent.postInfo.author },
      publisher: {
        "@type": "Organization",
        name: "عوازل مكة",
        logo: {
          "@type": "ImageObject",
          url: "https://www.insulmakkah.com/imgs/logo.png ",
        },
      },
      datePublished: postContent.postInfo.date,
      dateModified: postContent.postInfo.date,
      mainEntityOfPage: { "@type": "WebPage", "@id": window.location.href },
    };
    elements.structuredData.textContent = JSON.stringify(
      structuredData,
      null,
      2
    );
  }
  function setupSocialSharing(title) {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(title);
    if (elements.socialShare.facebook) {
      elements.socialShare.facebook.setAttribute(
        "href",
        `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`
      );
    }
    if (elements.socialShare.twitter) {
      elements.socialShare.twitter.setAttribute(
        "href",
        ` https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`
      );
    }
    if (elements.socialShare.whatsapp) {
      elements.socialShare.whatsapp.setAttribute(
        "href",
        ` https://wa.me/?text=${pageTitle} ${pageUrl}`
      );
    }
  }
  async function loadPostContent(lang) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = parseInt(urlParams.get("id")) || 1;
      const currentLang = urlParams.get("lang") || lang;
      if (!postId) {
        document.querySelector(".post-full").innerHTML =
          '<p class="error-message">رقم المقال غير صحيح</p>';
        return;
      }
      const response = await fetch(`/data/posts/${postId}.json`);
      if (!response.ok) throw new Error("فشل تحميل بيانات المقال");
      const postData = await response.json();
      const postContent = postData[currentLang];
      const indexResponse = await fetch("/data/blogPost.json");
      const indexData = await indexResponse.json();
      const postMetadata = indexData[currentLang]?.find((p) => p.id === postId);
      if (!postContent || !postMetadata) {
        throw new Error("بيانات المقال غير متوفرة للغة المحددة");
      }
      document.title = postContent.postInfo.title;
      document
        .querySelector('meta[name="description"]')
        .setAttribute("content", postMetadata.postInfo.summary);
      document
        .querySelector('link[rel="canonical"]')
        .setAttribute("href", window.location.href);
      setText(elements.backLink, postContent.postInfo.backLink);
      setText(elements.postTitle, postContent.postInfo.title);
      setText(elements.postAuthor, postContent.postInfo.author);
      setText(elements.postDate, postContent.postInfo.date);
      setAttribute(elements.postDate, "datetime", postContent.postInfo.date);
      setAttribute(elements.featuredImage, "src", postContent.media.imageUrl);
      setAttribute(elements.featuredImage, "alt", postContent.media.imageAlt);
      setText(elements.section1.heading, postContent.body.section1.heading);
      setText(elements.section1.paragraph, postContent.body.section1.paragraph);
      setText(elements.section2.heading, postContent.body.section2.heading);
      setText(elements.section2.paragraph, postContent.body.section2.paragraph);
      setText(
        elements.section2.steps.item1.strong,
        postContent.body.section2.steps[0].title
      );
      setText(
        elements.section2.steps.item1.text,
        postContent.body.section2.steps[0].description
      );
      setText(
        elements.section2.steps.item2.strong,
        postContent.body.section2.steps[1].title
      );
      setText(
        elements.section2.steps.item2.text,
        postContent.body.section2.steps[1].description
      );
      setText(
        elements.section2.steps.item3.strong,
        postContent.body.section2.steps[2].title
      );
      setText(
        elements.section2.steps.item3.text,
        postContent.body.section2.steps[2].description
      );
      setText(elements.section3.heading, postContent.body.section3.heading);
      setText(elements.section3.paragraph, postContent.body.section3.paragraph);

      if (postContent.body.section3.materials && postContent.body.section3.materials.length > 0) {
        setText(
          elements.section3.materials.item1.strong,
          postContent.body.section3.materials[0].title
        );
        setText(
          elements.section3.materials.item1.text,
          postContent.body.section3.materials[0].description
        );
      }
      
      if (postContent.body.section3.materials && postContent.body.section3.materials.length > 1) {
        setText(
          elements.section3.materials.item2.strong,
          postContent.body.section3.materials[1].title
        );
        setText(
          elements.section3.materials.item2.text,
          postContent.body.section3.materials[1].description
        );
      }
      updateStructuredData(postContent, postMetadata);
      setupSocialSharing(postContent.postInfo.title);
    } catch (error) {
      console.error("Error loading post content:", error);
      document.querySelector(".post-full").innerHTML =
        '<p class="error-message">تعذر تحميل المقال</p>';
    }
  }
  window.addEventListener("languageChanged", (e) => {
    loadPostContent(e.detail.lang);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("preferred-lang") || "ar";
    loadPostContent(savedLang);
  });
})();
