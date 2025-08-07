// 立即測試 - 這應該會立即執行
console.log('=== JavaScript file loaded ===');
console.log('Script execution started at:', new Date().toISOString());

// 星空特效和文章管理系統
class WriteupStarfield {
    constructor() {
        this.canvas = document.getElementById('starfield-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.nebulaClouds = [];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createStars();
        this.createNebulaClouds();
        this.setupEventListeners();
        this.animate();
        this.startPageAnimation();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    createStars() {
        const starCount = 300;
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = ['#ffffff', '#64ffda', '#a3c2ff', '#ffebb3', '#ffa3b3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createNebulaClouds() {
        const cloudCount = 5;
        for (let i = 0; i < cloudCount; i++) {
            this.nebulaClouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 200 + 100,
                opacity: Math.random() * 0.1 + 0.02,
                drift: Math.random() * 0.2 + 0.1,
                color: Math.random() > 0.5 ? '#64ffda' : '#a3c2ff'
            });
        }
    }

    drawStars() {
        this.stars.forEach(star => {
            star.brightness += (Math.random() - 0.5) * star.twinkleSpeed;
            star.brightness = Math.max(0.1, Math.min(1, star.brightness));

            this.ctx.save();
            this.ctx.globalAlpha = star.brightness;
            this.ctx.fillStyle = star.color;
            this.ctx.shadowBlur = star.size * 2;
            this.ctx.shadowColor = star.color;
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawNebulaClouds() {
        this.nebulaClouds.forEach(cloud => {
            cloud.x += cloud.drift;
            if (cloud.x > this.canvas.width + cloud.size) {
                cloud.x = -cloud.size;
            }

            this.ctx.save();
            this.ctx.globalAlpha = cloud.opacity;
            
            const gradient = this.ctx.createRadialGradient(
                cloud.x, cloud.y, 0,
                cloud.x, cloud.y, cloud.size
            );
            gradient.addColorStop(0, cloud.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    createShootingStar() {
        if (Math.random() < 0.002) {
            this.shootingStars.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                speed: Math.random() * 3 + 2,
                length: Math.random() * 80 + 20,
                opacity: 1
            });
        }
    }

    drawShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => {
            star.y += star.speed;
            star.x += star.speed * 0.5;
            star.opacity -= 0.008;

            if (star.opacity > 0 && star.y < this.canvas.height + 100) {
                this.ctx.save();
                this.ctx.globalAlpha = star.opacity;
                this.ctx.strokeStyle = '#64ffda';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#64ffda';
                
                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y);
                this.ctx.lineTo(star.x - star.length * 0.5, star.y - star.length);
                this.ctx.stroke();
                
                this.ctx.restore();
                return true;
            }
            return false;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawNebulaClouds();
        this.drawStars();
        this.createShootingStar();
        this.drawShootingStars();
        
        requestAnimationFrame(() => this.animate());
    }

    startPageAnimation() {
        setTimeout(() => {
            const transitionOverlay = document.getElementById('transition-overlay');
            transitionOverlay.style.opacity = '0';
            
            setTimeout(() => {
                transitionOverlay.style.display = 'none';
                document.getElementById('writeup-content').style.opacity = '1';
                this.animateWriteupCards();
            }, 1000);
        }, 1500);
    }

    animateWriteupCards() {
        const cards = document.querySelectorAll('.writeup-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupEventListeners() {
        document.getElementById('backButton').addEventListener('click', (event) => {
            event.preventDefault();
            this.exitToIndex();
        });
    }

    exitToIndex() {
        const jumpOverlay = document.createElement('div');
        jumpOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 0%, #0a0a0f 70%);
            z-index: 1000; opacity: 0; transition: opacity 1s ease;
            display: flex; align-items: center; justify-content: center;
        `;

        const jumpText = document.createElement('div');
        jumpText.innerText = 'Jumping to hyperspace...';
        jumpText.style.cssText = `
            font-size: 2.5rem; color: #64ffda; font-family: 'Fira Code', monospace;
            text-shadow: 0 0 20px #64ffda; opacity: 0; transition: opacity 0.5s ease 0.3s;
        `;
        jumpOverlay.appendChild(jumpText);
        document.body.appendChild(jumpOverlay);

        setTimeout(() => {
            jumpOverlay.style.opacity = '1';
            setTimeout(() => jumpText.style.opacity = '1', 300);
        }, 100);

        setTimeout(() => window.location.href = 'index.html', 1800);
    }
}

// 文章管理系統
const writeupSystem = {
    articles: {
        'scist-final-ctf': {
            title: 'SCIST Final CTF 2024 - Complete Writeup',
            file: 'scist-final-ctf.md',
            date: '2024-12-15',
            author: 'Hanrui',
            tags: ['CTF', 'Writeup', 'Bronze Medal'],
            description: 'SCIST Final CTF 銅牌獲獎完整解題過程'
        }
    },

    openArticle(articleId) {
        const article = this.articles[articleId];
        if (!article) {
            return;
        }
        this.createArticleReader(article);
    },

    async createArticleReader(article) {
        const reader = document.createElement('div');
        reader.className = 'article-reader';
        reader.innerHTML = `
            <div class="reader-header">
                <div class="reader-controls">
                    <button class="reader-btn close-btn" onclick="writeupSystem.closeReader()">✕</button>
                    <button class="reader-btn minimize-btn">－</button>
                    <button class="reader-btn fullscreen-btn">⬜</button>
                </div>
                <div class="reader-title">${article.title}</div>
                <div class="reader-meta">
                    <span class="reader-date">${article.date}</span>
                    <span class="reader-author">by ${article.author}</span>
                </div>
            </div>
            <div class="reader-body">
                <div class="toc-container">
                    <div class="toc-header">
                        <h3 class="toc-title">目錄</h3>
                    </div>
                    <div class="toc-content" id="toc-content">
                        <div class="loading-indicator">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">正在生成目錄...</div>
                        </div>
                    </div>
                </div>
                <div class="reader-content">
                    <div class="loading-indicator">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">Loading article...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(reader);

        try {
            const response = await fetch(`./${article.file}?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`檔案不存在或無法讀取: ${article.file}`);
            }
            const markdownContent = await response.text();
            
            if (!markdownContent.trim()) {
                throw new Error(`檔案內容為空: ${article.file}`);
            }
            
            this.renderMarkdown(reader, markdownContent);
        } catch (error) {
            this.showArticleError(reader, error);
        }

        setTimeout(() => reader.classList.add('active'), 100);
    },

    renderMarkdown(reader, markdownContent) {
        const contentDiv = reader.querySelector('.reader-content');
        const htmlContent = this.parseMarkdown(markdownContent);
        
        contentDiv.innerHTML = `
            <div class="article-content">${htmlContent}</div>
            <div class="article-footer">
                <div class="back-to-top" onclick="writeupSystem.scrollToTop()">↑ Back to Top</div>
            </div>
        `;
        
        this.enhanceContent(contentDiv);
        
        // 初始化目錄功能
        setTimeout(() => {
            this.initTOC(reader);
        }, 100);
    },

    parseMarkdown(markdown) {
        // 先處理程式碼區塊，將其標記為特殊格式避免後續處理
        let codeBlockIndex = 0;
        const codeBlocks = {};
        
        // 第一步：提取所有程式碼區塊
        markdown = markdown.replace(/```(\w+)?\s*\n([\s\S]*?)\n```/gim, (match, lang, code) => {
            const language = (lang && lang.trim()) ? lang.trim().toLowerCase() : '';
            const escapedCode = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
            
            const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
            
            // 只有當語言不為空時才顯示語言標籤
            if (language) {
                codeBlocks[placeholder] = `<pre data-language="${language}"><code class="language-${language}">${escapedCode}</code></pre>`;
            } else {
                codeBlocks[placeholder] = `<pre><code>${escapedCode}</code></pre>`;
            }
            
            codeBlockIndex++;
            return placeholder;
        });

        // 第二步：處理其他 Markdown 語法
        markdown = markdown
            // 處理行內程式碼
            .replace(/`([^`\n]+)`/gim, (match, code) => {
                const escapedCode = code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return `<code>${escapedCode}</code>`;
            })
            // 處理標題
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // 處理粗體和斜體
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // 處理圖片（改善alt文字和src處理）
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, alt, src) => {
                // 處理不同類型的圖片來源
                let imgSrc = src.trim();
                
                // 如果是相對路徑，檢查檔案是否存在
                if (!imgSrc.startsWith('http')) {
                    // 對於本地檔案，嘗試相對路徑
                    imgSrc = src;
                }
                
                return `<img src="${imgSrc}" alt="${alt || '圖片'}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='block');" />
                        <div class="image-placeholder" style="display:none; padding: 20px; background: rgba(255,107,107,0.1); border: 1px dashed rgba(255,107,107,0.3); border-radius: 8px; text-align: center; color: #ff6b6b; margin: 15px 0;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">🖼️</div>
                            <div>圖片載入失敗: ${imgSrc}</div>
                            <div style="font-size: 0.8rem; margin-top: 5px; opacity: 0.7;">原始路徑: ${src}</div>
                        </div>`;
            })
            // 處理連結
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
            // 處理列表
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            // 處理段落
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(.*)$/gim, '<p>$1</p>')
            .replace(/<p><\/p>/gim, '')
            // 修復嵌套標籤問題
            .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/gim, '$1')
            .replace(/<p>(<pre.*?<\/pre>)<\/p>/gim, '$1')
            .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gim, '$1')
            .replace(/<p>(<img.*?\/>)<\/p>/gim, '$1');

        // 第三步：還原程式碼區塊
        Object.keys(codeBlocks).forEach(placeholder => {
            markdown = markdown.replace(placeholder, codeBlocks[placeholder]);
        });

        return markdown;
    },

    showArticleError(reader, error) {
        const contentDiv = reader.querySelector('.reader-content');
        contentDiv.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <h3>無法載入文章</h3>
                <p>錯誤訊息: ${error.message}</p>
                <div class="error-details">
                    <h4>解決步驟：</h4>
                    <ol>
                        <li>確認 <code>scist-final-ctf.md</code> 檔案在專案根目錄</li>
                        <li>檔案應該和 <code>index.html</code> 在同一層資料夾</li>
                        <li>如果是本地檔案，請使用 HTTP 伺服器開啟</li>
                        <li>可以先在 <code>scist-final-ctf.md</code> 中寫入一些測試內容</li>
                    </ol>
                    <div class="debug-info">
                        <h4>除錯資訊：</h4>
                        <p>當前位置: ${window.location.href}</p>
                        <p>嘗試載入: scist-final-ctf.md</p>
                    </div>
                </div>
            </div>
        `;
    },

    enhanceContent(contentDiv) {
        const codeBlocks = contentDiv.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.textContent = '📋 Copy';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(block.textContent);
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
            };
            block.parentElement.appendChild(copyBtn);
        });

        // 處理圖片載入錯誤
        const images = contentDiv.querySelectorAll('img');
        images.forEach(img => {
            // 添加載入狀態
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = function() {
                this.style.opacity = '1';
            };
            
            img.onerror = function() {
                this.style.display = 'none';
                
                // 如果下一個元素已經是錯誤訊息，就顯示它
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('image-placeholder')) {
                    this.nextElementSibling.style.display = 'block';
                }
            };
            
            // 圖片點擊放大功能
            img.onclick = function() {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.9); z-index: 3000;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                `;
                
                const enlargedImg = document.createElement('img');
                enlargedImg.src = this.src;
                enlargedImg.style.cssText = `
                    max-width: 90%; max-height: 90%;
                    border-radius: 10px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
                `;
                
                overlay.appendChild(enlargedImg);
                overlay.onclick = () => overlay.remove();
                document.body.appendChild(overlay);
            };
        });
    },

    closeReader() {
        const reader = document.querySelector('.article-reader');
        if (reader) {
            // 清理 IntersectionObserver
            if (reader._tocObserver) {
                reader._tocObserver.disconnect();
            }
            
            reader.classList.remove('active');
            setTimeout(() => reader.remove(), 300);
        }
    },

    scrollToTop() {
        document.querySelector('.reader-content').scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 簡化版目錄功能 - 只保留導航功能
    initTOC(reader) {
        this.generateTOC(reader);
        this.setupScrollSpy(reader);
    },

    // 生成目錄
    generateTOC(reader) {
        const tocContent = reader.querySelector('#toc-content');
        const articleContent = reader.querySelector('.article-content');
        
        if (!tocContent || !articleContent) {
            return;
        }
        
        const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        if (headings.length === 0) {
            tocContent.innerHTML = `
                <div class="toc-empty-state">
                    <div class="toc-empty-icon">📄</div>
                    <div class="toc-empty-text">此文章沒有標題</div>
                    <div class="toc-empty-subtext">文章內容暫無可導航的標題</div>
                </div>
            `;
            return;
        }

        let tocHTML = '';
        headings.forEach((heading, index) => {
            const headingId = `heading-${index}`;
            heading.id = headingId;
            
            const level = heading.tagName.toLowerCase();
            const text = heading.textContent.trim();
            
            tocHTML += `
                <a href="#${headingId}" class="toc-item ${level}" data-heading="${headingId}">
                    ${text}
                </a>
            `;
        });

        tocContent.innerHTML = tocHTML;
        
        // 添加點擊事件
        this.setupTOCClicks(reader);
    },

    // 設置目錄點擊事件
    setupTOCClicks(reader) {
        const tocItems = reader.querySelectorAll('.toc-item');
        const articleContent = reader.querySelector('.article-content');
        const readerContent = reader.querySelector('.reader-content');
        
        tocItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-heading');
                const targetElement = articleContent.querySelector(`#${targetId}`);
                
                if (targetElement && readerContent) {
                    const offsetTop = targetElement.offsetTop - 100;
                    
                    readerContent.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // 更新活動狀態
                    tocItems.forEach(tocItem => tocItem.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
    },

    // 設置滾動監控
    setupScrollSpy(reader) {
        const readerContent = reader.querySelector('.reader-content');
        const headings = reader.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
        
        if (headings.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const headingId = entry.target.id;
                    const tocItems = reader.querySelectorAll('.toc-item');
                    
                    // 移除所有活動狀態
                    tocItems.forEach(item => item.classList.remove('active'));
                    
                    // 添加當前標題的活動狀態
                    const activeTocItem = reader.querySelector(`[data-heading="${headingId}"]`);
                    if (activeTocItem) {
                        activeTocItem.classList.add('active');
                    }
                }
            });
        }, {
            root: readerContent,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });

        headings.forEach(heading => {
            observer.observe(heading);
        });

        // 存儲 observer 以便後續清理
        reader._tocObserver = observer;
    },
};

// 全域函數
function openWriteup(articleId) {
    writeupSystem.openArticle(articleId);
}

// 確保函數掛載到 window 對象
window.openWriteup = openWriteup;

// 初始化系統
document.addEventListener('DOMContentLoaded', () => {
    try {
        new WriteupStarfield();
    } catch (error) {
        console.error('Error initializing WriteupStarfield:', error);
    }
    
    // 手動綁定點擊事件作為備用方案
    const writeupCard = document.querySelector('.writeup-card');
    if (writeupCard) {
        writeupCard.addEventListener('click', () => {
            openWriteup('scist-final-ctf');
        });
    }
});
