(function () {
  "use strict";
  const elements = {
    postsContainer: document.getElementById("posts-container"),
  };
  const createPostElement = (post, lang) => {
    const article = document.createElement("article");
    article.className = "post-card";
    article.dataset.postId = post.id;
    const title = document.createElement("h2");
    title.dataset.key = `post.${post.id}.title`;
    const link = document.createElement("a");
    link.href = `dist/posts/${post.id}_${lang}.html`;
    link.textContent = post.postInfo.title;
    title.appendChild(link);
    const meta = document.createElement("p");
    meta.className = "post-meta";
    meta.innerHTML = `By <span data-key="post.${post.id}.author">${post.postInfo.author}</span> on <span data-key="post.${post.id}.date">${post.postInfo.date}</span>`;
    const summary = document.createElement("p");
    summary.dataset.key = `post.${post.id}.summary`;
    summary.textContent = post.postInfo.summary;
    const readMore = document.createElement("a");
    readMore.href = `/posts/${post.id}_${lang}.html`;
    readMore.className = "read-more";
    readMore.textContent = "Read More";
    article.appendChild(title);
    article.appendChild(meta);
    article.appendChild(summary);
    article.appendChild(readMore);
    return article;
  };
  async function loadBlogPosts(lang = "ar") {
    try {
      const response = await fetch("data/blogPost.json");
      if (!response.ok) throw new Error("Failed to load blog posts");
      const data = await response.json();
      const posts = data[lang] || data["ar"];
      elements.postsContainer.innerHTML = "";
      posts.forEach((post) => {
        const postElement = createPostElement(post, lang);
        elements.postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error loading blog posts:", error);
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("preferred-lang") || "ar";
    loadBlogPosts(savedLang);
  });
})();
