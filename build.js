const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'data', 'posts');
const templatePath = path.join(__dirname, 'post-template.html');
const outputDir = path.join(__dirname, 'dist', 'posts');
const blogPostsInfoPath = path.join(__dirname, 'data', 'blogPost.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const template = fs.readFileSync(templatePath, 'utf-8');
const allPostsInfo = JSON.parse(fs.readFileSync(blogPostsInfoPath, 'utf-8'));

const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));

postFiles.forEach(file => {
  const postPath = path.join(postsDir, file);
  const postData = JSON.parse(fs.readFileSync(postPath, 'utf-8'));

  for (const lang in postData) {
    const content = postData[lang];
    const postMetadata = allPostsInfo[lang].find(p => p.id === content.id);
    if (!postMetadata) continue;

    let bodyHtml = '';
    // Generate body content
    for (const sectionKey in content.body) {
      const section = content.body[sectionKey];
      if (section.heading) {
        bodyHtml += `<h2>${section.heading}</h2>`;
      }
      if (section.paragraph) {
        bodyHtml += `<p>${section.paragraph}</p>`;
      }
      if (section.steps && section.steps.length > 0) {
        bodyHtml += `<ol class="post-steps">`;
        section.steps.forEach(step => {
          bodyHtml += `<li><h3>${step.title}</h3><span>${step.description}</span></li>`;
        });
        bodyHtml += `</ol>`;
      }
      if (section.materials && section.materials.length > 0) {
        bodyHtml += `<ul class="post-materials">`;
        section.materials.forEach(material => {
          bodyHtml += `<li><h3>${material.title}</h3><span>${material.description}</span></li>`;
        });
        bodyHtml += `</ul>`;
      }
    }

    // Generate related posts
    let relatedHtml = '';
    if (content.related && content.related.posts) {
      content.related.posts.forEach(relatedId => {
        const relatedPostInfo = allPostsInfo[lang].find(p => p.id === relatedId);
        if (relatedPostInfo) {
          relatedHtml += `<li><a href="${relatedId}_${lang}.html">${relatedPostInfo.postInfo.title}</a></li>`;
        }
      });
    }

    const pageUrl = `https://www.insulmakkah.com/dist/posts/${content.id}_${lang}.html`;
    
    let finalHtml = template
      .replace(/{{LANG}}/g, lang)
      .replace(/{{DIR}}/g, lang === 'ar' ? 'rtl' : 'ltr')
      .replace(/{{POST_TITLE}}/g, content.postInfo.title)
      .replace(/{{META_DESCRIPTION}}/g, postMetadata.postInfo.summary)
      .replace(/{{PAGE_URL}}/g, pageUrl)
      .replace(/{{OG_IMAGE}}/g, `https://www.insulmakkah.com/${content.media.imageUrl}`)
      .replace(/{{BACK_LINK_TEXT}}/g, content.postInfo.backLink)
      .replace(/{{POST_AUTHOR}}/g, content.postInfo.author)
      .replace(/{{POST_DATE}}/g, content.postInfo.date)
      .replace(/{{POST_IMAGE_URL}}/g, `../${content.media.imageUrl}`)
      .replace(/{{POST_IMAGE_ALT}}/g, content.media.imageAlt)
      .replace(/{{POST_BODY_HTML}}/g, bodyHtml)
      .replace(/{{RELATED_POSTS_HEADING}}/g, lang === 'ar' ? 'مقالات ذات صلة' : 'Related Posts')
      .replace(/{{RELATED_POSTS_HTML}}/g, relatedHtml);

    const outputFilePath = path.join(outputDir, `${content.id}_${lang}.html`);
    fs.writeFileSync(outputFilePath, finalHtml);
    console.log(`Generated: ${outputFilePath}`);
  }
});

console.log('Blog posts generated successfully!');
