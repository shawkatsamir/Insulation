document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("posts-container");
  const postContainer = document.querySelector(".post-full");
  let lang = document.documentElement.lang || "en";

  if (postsContainer) {
    loadBlogPosts(lang);
  }

  if (postContainer) {
    loadPostContent(lang);
  }
});

async function loadBlogPosts(lang) {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = '<p class="loading-message">Loading posts...</p>'; // Loading indicator

  if (window.location.protocol === "file:") {
    postsContainer.innerHTML =
      '<p class="error-message">Cannot load posts directly from file system. Please run a local web server (e.g., with Live Server VS Code extension, or `python -m http.server`).</p>';
    return;
  }

  try {
    const response = await fetch("/data/blogPost.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const posts = data[lang];

    postsContainer.innerHTML = ""; // Clear loading message

    if (!posts || posts.length === 0) {
      postsContainer.innerHTML =
        '<p class="error-message">No blog posts found.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    posts.forEach((post) => {
      const postCard = document.createElement("article"); // Use <article> for semantics
      postCard.classList.add("post-card");
      postCard.innerHTML = `
                <h2><a href="post.html?id=${post.id}&lang=${lang}">${post.title}</a></h2>
                <p class="post-meta">By ${post.author} on ${post.date}</p>
                <p>${post.summary}</p>
                <a href="post.html?id=${post.id}&lang=${lang}" class="read-more">Read More</a>
            `;
      fragment.appendChild(postCard);
    });

    postsContainer.appendChild(fragment);
  } catch (error) {
    console.error("Error loading blog posts:", error);
    postsContainer.innerHTML =
      '<p class="error-message">Could not load blog posts. Please try again later.</p>'; // User-friendly error
  }
}

async function loadPostContent(lang) {
  const postContainer = document.querySelector(".post-full");
  if (!postContainer) {
    console.error("Required element '.post-full' not found.");
    return;
  }
  postContainer.style.display = "none"; // Hide container until content is ready

  const loadingIndicator = document.createElement("p");
  loadingIndicator.className = "loading-message";
  loadingIndicator.textContent = "Loading post...";
  postContainer.parentElement.insertBefore(loadingIndicator, postContainer);

  if (window.location.protocol === "file:") {
    loadingIndicator.textContent =
      "Cannot load post directly from file system. Please run a local web server.";
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get("id"));
    const currentLang = urlParams.get("lang") || lang;

    if (isNaN(postId)) {
      loadingIndicator.textContent = "Invalid Post ID.";
      return;
    }

    const [indexResponse, postResponse] = await Promise.all([
      fetch("/data/blogPost.json"),
      fetch(`/data/posts/${postId}.json`),
    ]);

    if (!indexResponse.ok || !postResponse.ok) {
      throw new Error(
        `HTTP error! Index: ${indexResponse.status}, Post: ${postResponse.status}`
      );
    }

    const indexData = await indexResponse.json();
    const postData = await postResponse.json();

    const postMetadata = indexData[currentLang]?.find((p) => p.id === postId);
    const postContent = postData[currentLang];

    if (!postMetadata || !postContent) {
      throw new Error(
        "Post data or metadata not found for the current language."
      );
    }

    // --- Populate Page ---

    // 1. Update Metadata (Title, Meta Description, Canonical)
    document.title = postContent.title;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", postMetadata.summary);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", window.location.href);
    }

    // 2. Populate Header Elements
    const postTitleEl = document.querySelector(".post-title");
    if (postTitleEl) postTitleEl.textContent = postContent.title;

    const postAuthorEl = document.querySelector(".post-author");
    if (postAuthorEl) postAuthorEl.textContent = `By ${postContent.author}`;

    const postDateEl = document.querySelector(".post-date");
    if (postDateEl) {
      postDateEl.textContent = postContent.date;
      postDateEl.setAttribute("datetime", postContent.date);
    }

    // 3. Populate Featured Image
    const featuredImageEl = document.querySelector(".post-featured-image img");
    if (featuredImageEl) {
      featuredImageEl.src = postContent.imageUrl;
      featuredImageEl.alt = postContent.imageAlt;
    }

    // 4. Populate Post Body
    const postBodyEl = document.querySelector(".post-body");
    if (postBodyEl) postBodyEl.innerHTML = postContent.contentHtml;

    // 5. Populate Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": window.location.href,
      },
      headline: postContent.title,
      description: postMetadata.summary,
      image: postContent.imageUrl,
      author: {
        "@type": "Organization",
        name: postContent.author,
      },
      publisher: {
        "@type": "Organization",
        name: "عوازل مكة",
        logo: {
          "@type": "ImageObject",
          url: "https://www.insulmakkah.com/imgs/logo.png",
        },
      },
      datePublished: postContent.date,
      dateModified: postContent.date,
    };
    const structuredDataEl = document.getElementById("structured-data");
    if (structuredDataEl) {
      structuredDataEl.textContent = JSON.stringify(structuredData, null, 2);
    }

    // --- Final Steps ---
    loadingIndicator.remove(); // Remove loading message
    postContainer.style.display = ''; // Show the populated container

    // Load related posts
    if (postContent.relatedPosts && postContent.relatedPosts.length > 0) {
      loadRelatedPosts(postContent.relatedPosts, currentLang);
    }

    // Activate social sharing
    setupSocialSharing(postContent.title);

  } catch (error) {
    console.error("Error loading post content:", error);
    const errorEl = document.querySelector('.loading-message') || document.querySelector('.post-full').parentElement;
    errorEl.innerHTML = '<p class="error-message">Could not load post content. Please try again later.</p>';
  }
}

async function loadRelatedPosts(relatedIds, lang) {
  const container = document.querySelector('.related-posts-container');
  if (!container) return;

  try {
    const response = await fetch('/data/blogPost.json');
    if (!response.ok) throw new Error('Failed to fetch blog index');
    
    const indexData = await response.json();
    const allPosts = indexData[lang];

    const relatedPosts = allPosts.filter(post => relatedIds.includes(post.id));

    if (relatedPosts.length > 0) {
      const fragment = document.createDocumentFragment();
      relatedPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'related-post-card';
        card.innerHTML = `
          <a href="post.html?id=${post.id}&lang=${lang}">
            <h4>${post.title}</h4>
            <p>${post.summary}</p>
          </a>
        `;
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    }
  } catch (error) {
    console.error('Error loading related posts:', error);
    container.innerHTML = '<p>Could not load related articles.</p>';
  }
}

function setupSocialSharing(title) {
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(title);

  const facebookLink = document.querySelector('.social-share-link[aria-label="Share on Facebook"]');
  const twitterLink = document.querySelector('.social-share-link[aria-label="Share on Twitter"]');
  const whatsappLink = document.querySelector('.social-share-link[aria-label="Share on WhatsApp"]');

  if (facebookLink) {
    facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    facebookLink.target = '_blank';
  }
  if (twitterLink) {
    twitterLink.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    twitterLink.target = '_blank';
  }
  if (whatsappLink) {
    whatsappLink.href = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
    whatsappLink.target = '_blank';
  }
}
