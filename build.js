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

function generateSectionHtml(section) {
  let html = '';
  if (section.heading) {
    html += `<h2>${section.heading}</h2>`;
  }
  if (section.paragraph) {
    html += `<p>${section.paragraph}</p>`;
  }
  if (section.definition) {
    html += `<p><strong>Definition:</strong> ${section.definition}</p>`;
  }
  if (section.criticality) {
    html += `<p><strong>Criticality:</strong> ${section.criticality}</p>`;
  }
  if (section.points && section.points.length > 0) {
    html += `<ul>`;
    section.points.forEach(point => {
      html += `<li><strong>${point.title}:</strong> ${point.description}</li>`;
    });
    html += `</ul>`;
  }
  if (section.comparison && section.comparison.length > 0) {
    html += `<ul>`;
    section.comparison.forEach(item => {
      html += `<li><strong>${item.material}:</strong> ${item.description}</li>`;
    });
    html += `</ul>`;
  }
  if (section.steps && section.steps.length > 0) {
    html += `<ol>`;
    section.steps.forEach(step => {
      html += `<li><strong>${step.title}:</strong> ${step.description}</li>`;
    });
    html += `</ol>`;
  }
    if (section.considerations) {
    html += `<p>${section.considerations}</p>`;
  }
  if (section.tips && section.tips.length > 0) {
    html += `<ul>`;
    section.tips.forEach(tip => {
      html += `<li>${tip}</li>`;
    });
    html += `</ul>`;
  }
  if (section.questions && section.questions.length > 0) {
    html += `<dl>`;
    section.questions.forEach(faq => {
      html += `<dt>${faq.question}</dt><dd>${faq.answer}</dd>`;
    });
    html += `</dl>`;
  }
  return html;
}


const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.json'));

postFiles.forEach(file => {
  const postPath = path.join(postsDir, file);
  const postData = JSON.parse(fs.readFileSync(postPath, 'utf-8'));

  for (const lang in postData) {
    const content = postData[lang];
    const postMetadata = allPostsInfo[lang].find(p => p.id === content.id);
    if (!postMetadata) continue;

    let bodyHtml = '';
    const sectionOrder = ['introduction', 'understanding', 'problems', 'materials', 'installation', 'maintenance', 'faq'];

    sectionOrder.forEach(sectionKey => {
        if (content.body[sectionKey]) {
            bodyHtml += generateSectionHtml(content.body[sectionKey]);
        }
    });

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
      .replace(/{{POST_IMAGE_URL}}/g, `../../${content.media.imageUrl}`)
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