document.addEventListener('DOMContentLoaded', () => {
    const transitionOverlay = document.getElementById('transition-overlay');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const terminal = document.getElementById('terminal');
    const exitBtn = document.getElementById('exitBtn');

    console.log('Experience page loaded');

    // 設置矩陣雨畫布
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    // 矩陣雨參數
    const fontSize = 16;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    
    // 初始化雨滴
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * matrixCanvas.height / fontSize);
    }

    function drawMatrix() {
        // 半透明黑色背景，創造拖尾效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.font = `${fontSize}px 'Fira Code', monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // 隨機選擇顏色（主要是綠色系）
            const colors = ['#00ff41', '#00ff66', '#00cc33', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 設置填充色和陰影
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            
            // 繪製字符
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // 重置陰影
            ctx.shadowBlur = 0;

            // 隨機重置雨滴位置
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let matrixInterval;

    // 頁面載入動畫
    setTimeout(() => {
        console.log('Starting transition animation');
        
        // 淡出轉場覆蓋層
        transitionOverlay.style.opacity = '0';
        
        // 開始矩陣雨動畫
        matrixInterval = setInterval(drawMatrix, 50);
        
        setTimeout(() => {
            // 移除轉場覆蓋層
            if (transitionOverlay && transitionOverlay.parentNode) {
                transitionOverlay.parentNode.removeChild(transitionOverlay);
            }
            
            console.log('Transition completed');
            
            // 啟動技能條動畫
            setTimeout(() => {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    const width = bar.getAttribute('data-width');
                    if (width) {
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, index * 300);
                    }
                });
            }, 6000); // 等待技能部分出現
            
        }, 1000);
    }, 500);

    // 返回按鈕轉場動畫
    exitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        console.log('Exit button clicked');
        
        // 停止矩陣雨
        clearInterval(matrixInterval);
        
        // 創建返回轉場
        const returnTransition = document.createElement('div');
        returnTransition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 200;
            opacity: 0;
            transition: opacity 0.8s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const transitionText = document.createElement('div');
        transitionText.innerText = 'EXITING SYSTEM...';
        transitionText.style.cssText = `
            font-size: 3rem;
            color: #ff0000;
            opacity: 0;
            transition: opacity 0.5s ease 0.3s;
            font-family: 'Fira Code', monospace;
            text-shadow: 0 0 20px #ff0000;
        `;
        returnTransition.appendChild(transitionText);
        document.body.appendChild(returnTransition);

        // 淡出當前內容
        terminal.style.opacity = '0';
        matrixCanvas.style.opacity = '0';
        exitBtn.style.opacity = '0';
        
        // 觸發淡入動畫
        setTimeout(() => {
            returnTransition.style.opacity = '1';
            setTimeout(() => {
                transitionText.style.opacity = '1';
            }, 300);
        }, 50);

        // 跳轉回首頁
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    });

    // 窗口大小調整
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        
        // 重新計算列數
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops.length = columns;
        for (let i = 0; i < columns; i++) {
            if (drops[i] === undefined) {
                drops[i] = Math.floor(Math.random() * matrixCanvas.height / fontSize);
            }
        }
    });
});