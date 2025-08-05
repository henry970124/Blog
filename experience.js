document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const transitionOverlay = document.getElementById('transition-overlay');
    const experienceText = document.getElementById('experience-text');
    const experienceContent = document.getElementById('experience-content');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const backButton = document.getElementById('backButton');

    // Page load animation
    setTimeout(() => {
        experienceText.style.transition = 'all 0.5s ease';
        experienceText.style.top = '0';
        experienceText.style.left = '0';
        experienceText.style.transform = 'none';
        experienceText.style.fontSize = '2.5rem';
        experienceText.style.color = '#00ff00';
        experienceText.style.textShadow = '0 0 5px #00ff00';

        body.appendChild(experienceText);
        transitionOverlay.style.left = '-100%';
        body.classList.add('loaded');

        setTimeout(() => {
            const contentLines = experienceContent.children;
            let delay = 0;
            for (let i = 0; i < contentLines.length; i++) {
                setTimeout(() => {
                    contentLines[i].style.transition = 'opacity 0.5s ease';
                    contentLines[i].style.opacity = '1';
                }, delay);
                delay += 150;
            }
        }, 500);
    }, 500);

    // Back button transition
    backButton.addEventListener('click', (event) => {
        event.preventDefault();
        experienceContent.style.transform = 'translateY(100px)';
        const contentLines = experienceContent.children;
        for (let i = 0; i < contentLines.length; i++) {
            contentLines[i].style.opacity = '0';
        }
        matrixCanvas.style.opacity = '0';
        experienceText.style.opacity = '0'; // Hide Experience text
        body.classList.remove('loaded');
        transitionOverlay.style.left = '0';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });

    // Matrix rain effect
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let columns = canvas.width / 20;
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.font = '15px "Fira Code", monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(33 + Math.random() * 94);
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const newColumns = canvas.width / 20;
        if (newColumns !== columns) {
            columns = newColumns;
            drops.length = 0;
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * canvas.height;
            }
        }
    });
});