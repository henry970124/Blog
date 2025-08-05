document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const indexTransitionOverlay = document.getElementById('index-transition-overlay'); // 用於 index.html 初始載入動畫
    const dynamicTextEl = document.getElementById("dynamic-text");
    const mainContent = document.getElementById('mainContent');
    const experienceBtn = document.getElementById("experienceBtn");
    const blogBtn = document.getElementById("blogBtn");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- 星星、流星、動畫迴圈的變數和函數 ---
    let time = 0;
    ctx.globalCompositeOperation = 'source-over';

    const starCount = 150;
    let stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            baseAlpha: Math.random() * 0.5 + 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }

    let shootingStars = [];
    let animationFrameId;

    function spawnShootingStar() {
        const startX = Math.random() * canvas.width;
        const startY = -50;
        const speedX = 5 + Math.random() * 5;
        const speedY = 5 + Math.random() * 5;
        shootingStars.push({ x: startX, y: startY, speedX, speedY, length: 150, opacity: 1 });
    }

    function updateShootingStars() {
        shootingStars.forEach((star, index) => {
            star.x += star.speedX;
            star.y += star.speedY;
            star.opacity -= 0.01;
            if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
                shootingStars.splice(index, 1);
            }
        });
    }

    function drawShootingStars() {
        shootingStars.forEach(star => {
            ctx.save();
            ctx.globalAlpha = star.opacity;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            const speed = Math.sqrt(star.speedX * star.speedX + star.speedY * star.speedY);
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.speedX * star.length / speed, star.y - star.speedY * star.length / speed);
            ctx.stroke();
            ctx.restore();
        });
    }

    function animate() {
        ctx.fillStyle = '#1a1a2e'; // 背景顏色
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += 0.02;
        stars.forEach(star => {
            let alpha = star.baseAlpha + 0.2 * Math.sin(time + star.phase);
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
        });

        if (Math.random() < 0.005) { // 隨機生成流星
            spawnShootingStar();
        }
        updateShootingStars();
        drawShootingStars();

        animationFrameId = requestAnimationFrame(animate);
    }

    // 動態文字打字效果的變數和函數
    const phrases = ["CTF PLAYER", "WELCOME TO MY BLOG", "FORENSICS ENTHUSIAST", "BLUE TEAMER"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeWriterTimeoutId;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (!isDeleting) {
            if (charIndex <= currentPhrase.length) {
                dynamicTextEl.innerHTML = currentPhrase.substring(0, charIndex) + '<span class="cursor"></span>';
                charIndex++;
                typeWriterTimeoutId = setTimeout(typeWriter, 100);
            } else {
                typeWriterTimeoutId = setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
            }
        } else {
            if (charIndex >= 0) {
                dynamicTextEl.innerHTML = currentPhrase.substring(0, charIndex) + '<span class="cursor"></span>';
                charIndex--;
                typeWriterTimeoutId = setTimeout(typeWriter, 50);
            } else {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeWriterTimeoutId = setTimeout(typeWriter, 500);
            }
        }
    }

    // --- 處理進入轉場動畫 (從白色背景漸入) ---
    // 讓白色覆蓋層淡出，然後開始其他頁面動畫
    setTimeout(() => {
        indexTransitionOverlay.style.opacity = '0'; // 開始淡出白色覆蓋層
        indexTransitionOverlay.style.pointerEvents = 'none'; // 允許點擊下方內容

        // 在覆蓋層淡出完成後，開始其他動畫和內容的顯示
        setTimeout(() => {
            if (indexTransitionOverlay.parentNode) {
                indexTransitionOverlay.parentNode.removeChild(indexTransitionOverlay); // 淡出後移除
            }
            
            mainContent.style.opacity = '1';
            experienceBtn.style.opacity = '1';
            blogBtn.style.opacity = '1';

            animate();
            setTimeout(typeWriter, 1000);
        }, 800); // 等待 indexTransitionOverlay 淡出動畫 (0.8秒) 完成
    }, 100); // 頁面載入後稍作延遲，確保 overlay 初始狀態被正確渲染

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                baseAlpha: Math.random() * 0.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
        shootingStars = []; 
    });

    // Experience 按鈕事件 (新增從左邊滑入的白色轉場動畫)
    experienceBtn.addEventListener("click", (event) => {
        event.preventDefault(); // 阻止按鈕預設的導航行為

        cancelAnimationFrame(animationFrameId); // 停止背景動畫
        clearTimeout(typeWriterTimeoutId); // 停止打字效果

        // 創建一個新的白色覆蓋層來處理離開轉場
        const transitionCurtain = document.createElement('div');
        transitionCurtain.id = 'transition-curtain'; // 獨立ID
        transitionCurtain.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%; /* 初始位置在螢幕左側外 */
            width: 100%;
            height: 100%;
            background: #fff;
            z-index: 200; /* 確保在最上層 */
            transition: left 0.8s ease; /* 滑動動畫時間 */
            pointer-events: auto;
        `;
        document.body.appendChild(transitionCurtain);

        // 創建 "Experience" 文字元素，它將跟隨轉場層一起滑動
        const experienceTextDiv = document.createElement('div');
        experienceTextDiv.id = 'transition-experience-text-index'; // 獨特 ID，防止與 experience.html 內的衝突
        experienceTextDiv.innerText = 'Experience';
        experienceTextDiv.style.cssText = `
            position: absolute; /* 相對於 transitionCurtain 定位 */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: #000; /* 白色背景上的黑色文字 */
            opacity: 0; /* 初始隱藏 */
            transition: opacity 0.3s ease; /* 文字漸顯動畫 */
            font-family: 'Fira Code', monospace; /* 使用 Fira Code 字體 */
        `;
        transitionCurtain.appendChild(experienceTextDiv);

        // 隱藏當前頁面內容和按鈕
        mainContent.style.opacity = '0';
        experienceBtn.style.opacity = '0';
        blogBtn.style.opacity = '0';
        
        // 觸發白色覆蓋層從左邊滑入
        // 使用 setTimeout 確保元素在 DOM 中渲染後再觸發 CSS transition
        setTimeout(() => {
            transitionCurtain.style.left = '0%';
        }, 50); // 微小延遲

        // 在覆蓋層滑動過程中，讓 "Experience" 文字漸顯
        setTimeout(() => {
            experienceTextDiv.style.opacity = '1';
        }, 400); // 調整此時間點，讓文字在覆蓋層滑入途中出現

        // 在覆蓋層完全滑入後跳轉到目標頁面
        setTimeout(() => {
            window.location.href = "experience.html";
        }, 800); // 與 transitionCurtain 的 left 過渡時間 (0.8s) 匹配
    });

    // Writeups 按鈕事件 (同 Experience 按鈕的轉場邏輯)
    blogBtn.addEventListener("click", (event) => {
        event.preventDefault();

        cancelAnimationFrame(animationFrameId);
        clearTimeout(typeWriterTimeoutId);

        // 創建一個與 Experience 按鈕類似的轉場覆蓋層
        const transitionCurtain = document.createElement('div');
        transitionCurtain.id = 'transition-curtain-blog'; // 確保 ID 唯一
        transitionCurtain.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: #fff;
            z-index: 200;
            transition: left 0.8s ease;
            pointer-events: auto;
        `;
        document.body.appendChild(transitionCurtain);

        // 可以在這裡為 Writeups 轉場顯示不同的文字
        const writeupsTextDiv = document.createElement('div');
        writeupsTextDiv.innerText = 'Writeups'; // 可以根據需要更改文字
        writeupsTextDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: #000;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Fira Code', monospace;
        `;
        transitionCurtain.appendChild(writeupsTextDiv);

        mainContent.style.opacity = '0';
        experienceBtn.style.opacity = '0';
        blogBtn.style.opacity = '0';

        setTimeout(() => {
            transitionCurtain.style.left = '0%';
        }, 50);

        setTimeout(() => {
            writeupsTextDiv.style.opacity = '1';
        }, 400);

        setTimeout(() => {
            alert("轉到文章專區頁面");
            // 因為沒有實際跳轉，需要在 alert 後將轉場覆蓋層移除並重新顯示內容
            if (transitionCurtain.parentNode) {
                transitionCurtain.parentNode.removeChild(transitionCurtain);
            }
            mainContent.style.opacity = '1';
            experienceBtn.style.opacity = '1';
            blogBtn.style.opacity = '1';
            animate();
            setTimeout(typeWriter, 1000);
        }, 800);
    });
});