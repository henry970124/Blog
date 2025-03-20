/* ------------------------------
   修正背景顏色差異
   - 使用不透明顏色 (#1a1a2e) 先清空畫布
   - 設置 globalCompositeOperation = 'source-over'
------------------------------ */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

// 流星
let shootingStars = [];
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
    ctx.moveTo(star.x, star.y);
    const speed = Math.sqrt(star.speedX * star.speedX + star.speedY * star.speedY);
    ctx.lineTo(
      star.x - star.speedX * star.length / speed,
      star.y - star.speedY * star.length / speed
    );
    ctx.stroke();
    ctx.restore();
  });
}

// 動畫迴圈
function animate() {
  // 填滿背景（不透明）
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  time += 0.02;
  // 星星閃爍
  stars.forEach(star => {
    let alpha = star.baseAlpha + 0.2 * Math.sin(time + star.phase);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });

  // 流星
  if (Math.random() < 0.005) {
    spawnShootingStar();
  }
  updateShootingStars();
  drawShootingStars();

  requestAnimationFrame(animate);
}
animate();

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
});

/* ------------------------------
   動態文字打字效果
------------------------------ */
const dynamicTextEl = document.getElementById("dynamic-text");
const phrases = ["CTF PLAYER", "WELCOME TO MY BLOG", "FORENSICS ENTHUSIAST", "BLUE TEAMER"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeWriter() {
  const currentPhrase = phrases[phraseIndex];
  if (!isDeleting) {
    if (charIndex <= currentPhrase.length) {
      dynamicTextEl.innerHTML = currentPhrase.substring(0, charIndex) + '<span class="cursor"></span>';
      charIndex++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2000);
    }
  } else {
    if (charIndex >= 0) {
      dynamicTextEl.innerHTML = currentPhrase.substring(0, charIndex) + '<span class="cursor"></span>';
      charIndex--;
      setTimeout(typeWriter, 50);
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeWriter, 500);
    }
  }
}
setTimeout(typeWriter, 1000);

/* ------------------------------
   左側白色長方形
------------------------------ */
const leftPanel = document.getElementById('leftPanel');
const leftPanelText = document.getElementById('leftPanelText');
const mainContent = document.getElementById('mainContent');

/* ------------------------------
   按鈕事件
------------------------------ */
const experienceBtn = document.getElementById("experienceBtn");
const blogBtn = document.getElementById("blogBtn");

experienceBtn.addEventListener("mouseover", () => {
    leftPanel.classList.add("focused");
    mainContent.classList.add("shifted");
  });
  
  experienceBtn.addEventListener("mouseout", () => {
    leftPanel.classList.remove("focused");
    mainContent.classList.remove("shifted");
  });
  
  experienceBtn.addEventListener("click", () => {
    leftPanel.classList.remove("focused"); // 移除預覽效果
    leftPanel.classList.add("expanded");
    leftPanelText.classList.add("visible");
    setTimeout(() => {
      window.location.href = "experience.html";
    }, 800);
  });

// Writeups 按鈕事件
blogBtn.addEventListener("click", () => {
  blogBtn.classList.add("active");
  setTimeout(() => {
    alert("轉到文章專區頁面");
    blogBtn.classList.remove("active");
  }, 200);
});
