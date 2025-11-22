// 極簡版 Writeup JavaScript - 支援 Markdown
const articles = {
  'scist-final-ctf': {
    title: 'SCIST Final CTF 2024 - Complete Writeup',
    file: 'scist-final-ctf.md',
    date: '2024-12-15'
  },
  'ais3-junior-1': {
    title: 'AIS3 Junior Writeup Part 1',
    file: 'AIS3_Junior_writeup1.md',
    date: '2025-8-12'
  },
  'ais3-junior-2': {
    title: 'AIS3 Junior Writeup Part 2',
    file: 'AIS3_Junior_writeup2.md',
    date: '2025-8-13'
  },
  'advent-of-cyber-2024-part1': {
    title: 'Advent of Cyber 2024 Part 1',
    url: 'https://hackmd.io/@dOGHrpypS1-c6wGeom96Hw/SkWJ1cH41e',
    date: '2024-12-16'
  }
};

function openWriteup(articleId) {
  const article = articles[articleId];
  if (!article) return;

  const reader = document.getElementById('article-reader');
  const readerTitle = document.getElementById('reader-title');
  const readerDate = document.getElementById('reader-date');
  const readerContent = document.getElementById('reader-content');

  readerTitle.textContent = article.title;
  readerDate.textContent = article.date;
  reader.style.display = 'flex';

  // 如果是外部連結，嵌入 iframe
  if (article.url) {
    readerContent.classList.add('iframe-mode');
    readerContent.innerHTML = `<iframe src="${article.url}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`;
    // 隱藏目錄
    document.getElementById('toc').style.display = 'none';
    return;
  }
  
  // 重置樣式（針對 markdown 文件）
  readerContent.classList.remove('iframe-mode');
  document.getElementById('toc').style.display = 'block';

  // 載入 Markdown 檔案
  fetch(`./${article.file}`)
    .then(response => {
      if (!response.ok) throw new Error('檔案載入失敗');
      return response.text();
    })
    .then(markdown => {
      // 預處理 ::: 語法
      markdown = preprocessCallouts(markdown);
      
      // 使用 marked.js 解析 Markdown
      if (typeof marked !== 'undefined') {
        const html = marked.parse(markdown);
        readerContent.innerHTML = html;
      } else {
        // 如果 marked.js 未載入，使用簡單的解析
        readerContent.innerHTML = parseMarkdown(markdown);
      }
      
      // 生成目錄
      generateTOC();
      
      // 添加複製按鈕到程式碼區塊
      addCopyButtons();
    })
    .catch(error => {
      readerContent.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #999;">
          <p>載入失敗: ${error.message}</p>
          <p style="margin-top: 15px; font-size: 0.9rem;">請確認 ${article.file} 檔案存在</p>
        </div>
      `;
    });
}

function closeReader() {
  const reader = document.getElementById('article-reader');
  reader.style.display = 'none';
}

function preprocessCallouts(markdown) {
  // 處理 ::: type 語法（包含 spoiler）
  const calloutRegex = /:::(\s*)(success|info|warning|danger|note|tip|spoiler)([^\n]*)\n([\s\S]*?)\n:::/gim;
  
  markdown = markdown.replace(calloutRegex, (match, space, type, title, content) => {
    const trimmedTitle = title.trim();
    
    if (type.toLowerCase() === 'spoiler') {
      const displayTitle = trimmedTitle || 'Spoiler';
      return `<details class="callout callout-spoiler">
<summary class="callout-title">${displayTitle}</summary>
<div class="callout-content">

${content}

</div>
</details>`;
    }
    
    // 對於其他類型，不顯示標題，只有樣式
    return `<div class="callout callout-${type.toLowerCase()}">
<div class="callout-content">

${content}

</div>
</div>`;
  });
  
  // 處理行內暴雷標記 ||text||
  markdown = markdown.replace(/\|\|([^|]+)\|\|/g, '<span class="spoiler">$1</span>');
  
  // 處理螢光筆標記 ==text==
  markdown = markdown.replace(/==([^=]+)==/g, '<mark>$1</mark>');
  
  // 處理分隔線 ***
  markdown = markdown.replace(/^\*\*\*\s*$/gm, '<hr>');
  
  return markdown;
}

function parseMarkdown(markdown) {
  // 簡單的 Markdown 解析器（備用方案）
  let html = markdown
    // 處理程式碼區塊
    .replace(/```(\w+)?\n([\s\S]*?)\n```/gm, (match, lang, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`;
    })
    // 處理行內程式碼（確保不在其他標記內）
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 處理標題
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 處理粗體和斜體
    .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gm, '<em>$1</em>')
    // 處理連結
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gm, '<a href="$2">$1</a>')
    // 處理圖片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gm, (match, alt, src) => {
      return `<img src="${src}" alt="${alt}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div class="image-placeholder" style="display:none;">圖片載入失敗: ${src}</div>`;
    })
    // 處理列表
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // 處理段落
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(.+)$/gim, '<p>$1</p>')
    .replace(/<p><\/p>/gim, '')
    // 修復標題和區塊元素不應該在 p 標籤內
    .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/gim, '$1')
    .replace(/<p>(<pre>.*?<\/pre>)<\/p>/gim, '$1')
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gim, '$1');

  return html;
}

function generateTOC() {
  const content = document.getElementById('reader-content');
  const tocContent = document.getElementById('toc-content');
  const headings = content.querySelectorAll('h1, h2, h3');

  if (headings.length === 0) {
    tocContent.innerHTML = '<p style="color: #999; font-size: 0.85rem;">目錄為空</p>';
    return;
  }

  let tocHTML = '';
  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;

    tocHTML += `<a href="#${id}" class="toc-item ${level}" onclick="scrollToHeading('${id}'); return false;">${text}</a>`;
  });

  tocContent.innerHTML = tocHTML;

  // 監聽滾動來更新活動狀態
  const readerContent = document.querySelector('.reader-content');
  readerContent.addEventListener('scroll', updateActiveTOC);
}

function scrollToHeading(id) {
  const heading = document.getElementById(id);
  const readerContent = document.querySelector('.reader-content');
  if (heading && readerContent) {
    const offset = heading.offsetTop - readerContent.offsetTop - 20;
    readerContent.scrollTo({ top: offset, behavior: 'smooth' });
  }
}

function updateActiveTOC() {
  const readerContent = document.querySelector('.reader-content');
  const headings = readerContent.querySelectorAll('h1, h2, h3');
  const tocItems = document.querySelectorAll('.toc-item');
  
  let activeIndex = 0;
  const scrollTop = readerContent.scrollTop;

  headings.forEach((heading, index) => {
    if (heading.offsetTop - readerContent.offsetTop - 100 <= scrollTop) {
      activeIndex = index;
    }
  });

  tocItems.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    const pre = block.parentElement;
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.textContent = 'Copy';
    button.onclick = () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    };
    pre.appendChild(button);
  });
  
  // 添加暴雷內容點擊事件
  const spoilers = document.querySelectorAll('.spoiler');
  spoilers.forEach(spoiler => {
    spoiler.addEventListener('click', function() {
      this.classList.toggle('revealed');
    });
  });
}

// 掛載到全域
window.openWriteup = openWriteup;
window.closeReader = closeReader;
