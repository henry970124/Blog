// ========== 宇宙探索者 - 壯觀簡潔版 腳本 ==========
class CosmicExplorer {
    constructor() {
        this.canvases = {};
        this.animations = [];
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.setupCanvases();
        this.startLoader();
        this.initializeAnimations();
        this.setupNavigation();
    }

    setupCanvases() {
        const layers = ['starfield', 'nebula', 'meteors'];
        layers.forEach(layerId => {
            const canvas = document.getElementById(layerId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                this.canvases[layerId] = { canvas, ctx };
            }
        });
    }

    startLoader() {
        const loader = document.getElementById('cosmic-loader');
        const progressFill = document.querySelector('.progress-fill');
        const loaderStatus = document.querySelector('.loader-status');
        
        const statusMessages = [
            'INITIALIZING UNIVERSE...',
            'CALCULATING STELLAR POSITIONS...',
            'ESTABLISHING COSMIC CONNECTIONS...',
            'PREPARING WARP DRIVE...',
            'ENTERING COSMIC REALM...'
        ];

        let progress = 0;
        let messageIndex = 0;

        const updateLoader = () => {
            if (progress < 100) {
                progress += Math.random() * 2 + 0.5;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = `${progress}%`;
                
                if (progress > messageIndex * 20 && messageIndex < statusMessages.length) {
                    loaderStatus.textContent = statusMessages[messageIndex];
                    messageIndex++;
                }
                
                requestAnimationFrame(updateLoader);
            } else {
                // 更平滑的轉場效果
                setTimeout(() => {
                    loader.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
                    loader.style.opacity = '0';
                    loader.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        this.isLoaded = true;
                        this.startTextRotation(); // 啟動文字動畫
                        this.startUptimeDisplay(); // 啟動上線時間顯示
                    }, 1500);
                }, 500);
            }
        };

        updateLoader();
    }

    initializeAnimations() {
        this.createStarfield();
        this.createNebula();
        this.createMeteors();
        this.startAnimationLoop();
    }

    createStarfield() {
        const { canvas, ctx } = this.canvases.starfield;
        const stars = [];
        const numStars = 300;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 1000 + 1,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 1 + 0.2,
                twinkle: Math.random() * Math.PI * 2
            });
        }

        this.animations.push(() => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // 星星向前移動
                star.z -= star.speed;
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                }

                // 計算螢幕位置
                const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2;
                const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2;
                const size = star.size * (1000 / star.z);

                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    // 閃爍效果
                    star.twinkle += 0.05;
                    const alpha = (Math.sin(star.twinkle) + 1) * 0.5 * (1 - star.z / 1000);
                    
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.fill();

                    // 亮星加光暈
                    if (size > 1.5) {
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#06b6d4';
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            });
        });
    }

    createNebula() {
        const { canvas, ctx } = this.canvases.nebula;
        let time = 0;

        this.animations.push(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // 創建星雲效果
            const gradient = ctx.createRadialGradient(
                canvas.width * 0.3, canvas.height * 0.7, 0,
                canvas.width * 0.3, canvas.height * 0.7, canvas.width * 0.8
            );
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
            gradient.addColorStop(0.5, 'rgba(139, 69, 19, 0.2)');
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 第二層星雲
            const gradient2 = ctx.createRadialGradient(
                canvas.width * 0.7, canvas.height * 0.3, 0,
                canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.6
            );
            gradient2.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
            gradient2.addColorStop(0.7, 'rgba(16, 185, 129, 0.1)');
            gradient2.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    createMeteors() {
        const { canvas, ctx } = this.canvases.meteors;
        const meteors = [];

        // 創建流星
        for (let i = 0; i < 3; i++) {
            meteors.push({
                x: Math.random() * canvas.width,
                y: -50,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 2 + 1,
                trail: [],
                life: 1,
                respawnTime: Math.random() * 1000 + 500
            });
        }

        this.animations.push(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            meteors.forEach(meteor => {
                if (meteor.life > 0) {
                    // 更新位置
                    meteor.x += meteor.vx;
                    meteor.y += meteor.vy;
                    
                    // 添加軌跡點
                    meteor.trail.push({ x: meteor.x, y: meteor.y, alpha: 1 });
                    if (meteor.trail.length > 20) {
                        meteor.trail.shift();
                    }

                    // 繪製軌跡
                    meteor.trail.forEach((point, index) => {
                        const alpha = (index / meteor.trail.length) * meteor.life;
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, meteor.size * alpha, 0, 2 * Math.PI);
                        ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
                        ctx.fill();
                        
                        if (index === meteor.trail.length - 1) {
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = '#fbbf24';
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        }
                    });

                    // 檢查邊界
                    if (meteor.x < -100 || meteor.x > canvas.width + 100 || 
                        meteor.y > canvas.height + 100) {
                        meteor.life = 0;
                    }
                } else {
                    // 重生流星
                    meteor.respawnTime--;
                    if (meteor.respawnTime <= 0) {
                        meteor.x = Math.random() * canvas.width;
                        meteor.y = -50;
                        meteor.vx = (Math.random() - 0.5) * 4;
                        meteor.vy = Math.random() * 3 + 2;
                        meteor.trail = [];
                        meteor.life = 1;
                        meteor.respawnTime = Math.random() * 2000 + 1000;
                    }
                }
            });
        });
    }

    setupNavigation() {
        const cosmicBtns = document.querySelectorAll('.cosmic-btn');
        
        cosmicBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const href = btn.getAttribute('href');
                this.warpToPage(href);
            });

            // 3D 傾斜效果
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 8;
                const rotateY = (centerX - x) / 8;
                
                btn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.05)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
            });
        });

        // 狀態欄動態更新
        this.updateStatusBar();
    }

    warpToPage(href) {
        // 創建流暢的轉場效果
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(6,182,212,0.1) 0%, 
                rgba(139,69,19,0.2) 25%,
                rgba(34,197,94,0.1) 50%,
                rgba(147,51,234,0.2) 75%,
                rgba(2,6,23,0.9) 100%);
            z-index: 9999;
            opacity: 0;
            backdrop-filter: blur(0px);
            transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
        `;
        document.body.appendChild(transitionOverlay);

        // 立即開始轉場動畫
        requestAnimationFrame(() => {
            transitionOverlay.style.opacity = '1';
            transitionOverlay.style.backdropFilter = 'blur(10px)';
        });

        // 主內容優雅淡出並縮放
        const mainContainer = document.querySelector('.main-container');
        mainContainer.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'scale(0.95) translateY(20px)';

        // 星空背景加速
        const backgroundLayers = document.getElementById('background-layers');
        if (backgroundLayers) {
            backgroundLayers.style.transition = 'all 1s ease-out';
            backgroundLayers.style.opacity = '0.3';
            backgroundLayers.style.filter = 'blur(2px)';
        }

        setTimeout(() => {
            window.location.href = href;
        }, 1200);
    }

    updateStatusBar() {
        const statusTexts = [
            'SYSTEM ONLINE',
            'WARP READY', 
            'EXPLORING',
            'SCANNING COSMOS',
            'STELLAR NAVIGATION'
        ];

        const statusItems = document.querySelectorAll('.status-text');
        let textIndex = 0;

        setInterval(() => {
            statusItems.forEach((item, index) => {
                if (index === 1) { // 中間的狀態項目
                    item.textContent = statusTexts[textIndex];
                }
            });
            textIndex = (textIndex + 1) % statusTexts.length;
        }, 3000);
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isLoaded) {
                this.animations.forEach(animation => animation());
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    handleResize() {
        Object.values(this.canvases).forEach(({ canvas }) => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    startTextRotation() {
        const rotatingText = document.getElementById('rotating-text');
        const cursor = document.querySelector('.cursor');
        const texts = [
            'a Blue Team player',
            'a B33F 50uP member', 
            'a forensics player',
            'a cybersecurity enthusiast',
            'a sophomore at SAIHS',
            'exploring the digital universe'
        ];
        
        let currentIndex = 0;
        let isDeleting = false;
        let currentText = '';
        let typeSpeed = 80;
        
        const typeWriter = () => {
            const fullText = texts[currentIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, currentText.length - 1);
                typeSpeed = 40;
            } else {
                currentText = fullText.substring(0, currentText.length + 1);
                typeSpeed = 80;
            }
            
            rotatingText.textContent = currentText;
            
            // 動態調整光標位置
            const textWidth = rotatingText.offsetWidth;
            cursor.style.left = textWidth + 'px';
            
            if (!isDeleting && currentText === fullText) {
                // 停留2秒後開始刪除
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
                return;
            }
            
            if (isDeleting && currentText === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % texts.length;
                typeSpeed = 500; // 下一個字詞前的停頓
            }
            
            setTimeout(typeWriter, typeSpeed);
        };
        
        // 延遲1秒後開始動畫
        setTimeout(() => {
            typeWriter();
        }, 1000);
    }

    startUptimeDisplay() {
        const uptimeDisplay = document.getElementById('uptime-display');
        // 假設網站上線時間 (你可以修改這個日期)
        const siteStartDate = new Date('2025-08-06T00:00:00Z');
        
        const updateUptime = () => {
            const now = new Date();
            const uptime = now - siteStartDate;
            
            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            
            let uptimeString = '';
            if (days > 0) {
                uptimeString += `${days}D `;
            }
            if (hours > 0) {
                uptimeString += `${hours}H `;
            }
            uptimeString += `${minutes}M`;
            
            uptimeDisplay.textContent = uptimeString;
        };
        
        // 立即更新一次
        updateUptime();
        
        // 每分鐘更新一次
        setInterval(updateUptime, 60000);
    }
}

// ========== 系統初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    const cosmicExplorer = new CosmicExplorer();

    // 視窗調整
    window.addEventListener('resize', () => {
        cosmicExplorer.handleResize();
    });

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const frame = document.querySelector('.cosmic-frame');
            frame.style.opacity = frame.style.opacity === '0' ? '1' : '0';
        }
    });

    console.log('🌌 宇宙探索者系統已啟動');
});

// 動態樣式
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes cosmicFadeOut {
        to { 
            opacity: 0; 
            transform: scale(0.7) translateY(-100px);
            filter: blur(10px);
        }
    }
    
    @keyframes warpDrive {
        0% { 
            transform: scale(1) rotate(0deg);
            opacity: 0;
        }
        50% { 
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
        }
        100% { 
            transform: scale(50) rotate(720deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(dynamicStyles);
