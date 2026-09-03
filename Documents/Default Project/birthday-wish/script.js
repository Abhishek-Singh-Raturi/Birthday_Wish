// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        createBalloons();
        createStars();
        launchConfetti();
    }, 1500);
});

// Get music elements early
const music = document.getElementById('birthday-music');
const musicBtn = document.getElementById('music-toggle');
let isPlaying = false;

// Confetti
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 8 - 4;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.shape = Math.floor(Math.random() * 3);
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) { this.y = -10; this.x = Math.random() * canvas.width; }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        if (this.shape === 0) ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
        else if (this.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -this.size / 2); ctx.lineTo(this.size / 2, this.size / 2); ctx.lineTo(-this.size / 2, this.size / 2); ctx.closePath(); ctx.fill(); }
        ctx.restore();
    }
}

function createConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 80; i++) confettiParticles.push(new ConfettiParticle());
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animateConfetti);
}

function launchConfetti() {
    createConfetti();
    animateConfetti();
    setTimeout(() => { cancelAnimationFrame(animationId); confettiParticles = []; ctx.clearRect(0, 0, canvas.width, canvas.height); }, 3500);
}

// Balloons
function createBalloons() {
    const container = document.getElementById('balloons');
    const colors = ['#ff6b9d', '#c44dff', '#00d4ff', '#ffd700', '#00ff88'];
    for (let i = 0; i < 8; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.background = `linear-gradient(135deg, ${colors[Math.floor(Math.random() * colors.length)]}, ${colors[Math.floor(Math.random() * colors.length)]})`;
        balloon.style.animationDelay = Math.random() * 8 + 's';
        balloon.style.animationDuration = (Math.random() * 8 + 10) + 's';
        container.appendChild(balloon);
    }
}

// Stars
function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 25; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        container.appendChild(star);
    }
}

// Countdown
function updateCountdown() {
    const now = new Date();
    const birthday = new Date(now.getFullYear(), 11, 25);
    if (now > birthday) birthday.setFullYear(birthday.getFullYear() + 1);
    const diff = birthday - now;
    document.getElementById('days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Music - AUTO PLAY
// Set volume
music.volume = 0.8;

// Try to auto play immediately
function tryAutoPlay() {
    if (music.paused && !isPlaying) {
        music.play().then(() => {
            musicBtn.classList.add('playing');
            isPlaying = true;
            console.log('Music auto playing!');
        }).catch(err => {
            console.log('Auto play blocked, waiting for interaction...');
        });
    }
}

// Try auto play on load
window.addEventListener('load', () => {
    setTimeout(tryAutoPlay, 1000);
});

// Also try on first interaction
document.addEventListener('click', function firstClick() {
    tryAutoPlay();
    document.removeEventListener('click', firstClick);
});

document.addEventListener('touchstart', function firstTouch() {
    tryAutoPlay();
    document.removeEventListener('touchstart', firstTouch);
});

// Music button toggle
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        music.play().then(() => {
            musicBtn.classList.add('playing');
            isPlaying = true;
        }).catch(err => {
            console.log('Music error:', err);
        });
    }
});

// Scroll Background
const backgrounds = [
    'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #2d132c 0%, #801336 50%, #c72c41 100%)',
    'linear-gradient(135deg, #0b0c10 0%, #1f2833 50%, #45a29e 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #e94560 50%, #0f3460 100%)'
];

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollY / docHeight;
            const bgIndex = Math.min(Math.floor(scrollPercent * backgrounds.length), backgrounds.length - 1);
            document.body.style.background = backgrounds[bgIndex];

            const hero = document.querySelector('.hero-content');
            if (hero && scrollY < window.innerHeight) {
                hero.style.transform = `translateY(${scrollY * 0.2}px)`;
                hero.style.opacity = 1 - scrollY / 600;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Scroll Animations
function setupScrollAnimations() {
    const photoShowcases = document.querySelectorAll('.photo-showcase');
    const photoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    photoShowcases.forEach(s => photoObserver.observe(s));

    const otherElements = document.querySelectorAll('.wish-card, .shayari-card, .countdown-box');
    const elObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    otherElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        elObserver.observe(el);
    });
}
setupScrollAnimations();

// Image Popup
const popup = document.getElementById('image-popup');
const popupImage = document.getElementById('popup-image');
const popupClose = document.getElementById('popup-close');
const pixelBurst = document.getElementById('pixel-burst');

const shayaris = [
    { l1: "Teri muskaan dekh ke dil kiya bole", l2: "Tu hai sabse khoobsurat, bas yahi hai thanaai!" },
    { l1: "Har pal tera saath chahiye,", l2: "Tere bina yeh dil adhoora sa lagta hai!" },
    { l1: "Tu chaand hai aasman ka,", l2: "Main hoon tera sitaaron ka shama!" },
    { l1: "Zindagi mein tu hai meri jaan,", l2: "Tere bina yeh pal hai bekaar!" },
    { l1: "Teri yaadein hain mere paas,", l2: "Har pal hai tera ehsaas!" },
    { l1: "Duniya ki sabse khoobsurat dost,", l2: "Meri zindagi ka sabse haseen mod!" }
];

function createPixelBurst() {
    pixelBurst.innerHTML = '';
    const colors = ['#ff6b9d', '#c44dff', '#00d4ff', '#ffd700', '#00ff88'];
    for (let i = 0; i < 40; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.left = '50%';
        pixel.style.top = '50%';
        pixel.style.background = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / 40;
        const dist = 80 + Math.random() * 150;
        pixel.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        pixel.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        pixel.style.animationDelay = Math.random() * 0.3 + 's';
        pixelBurst.appendChild(pixel);
    }
}

function openPopup(src) {
    popupImage.src = src;
    const r = shayaris[Math.floor(Math.random() * shayaris.length)];
    document.querySelector('.shayari-line:first-child').textContent = r.l1;
    document.querySelector('.shayari-line:last-of-type').textContent = r.l2;
    createPixelBurst();
    popup.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    popup.classList.remove('active');
    setTimeout(() => { popup.style.display = 'none'; }, 500);
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.photo-frame img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => { if (img.src) openPopup(img.src); });
});

popupClose.addEventListener('click', closePopup);
popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

// ========== CELEBRATION SECTION ==========
const blowBtn = document.getElementById('blow-btn');
const flashOverlay = document.getElementById('flash-overlay');
const finalMessage = document.getElementById('final-message');

// Blow Button - Simple blow candles
if (blowBtn) {
    blowBtn.addEventListener('click', () => {
        // Blow out candles
        const candles = document.querySelector('.candles');
        if (candles) candles.classList.add('blown');

        // Flash effect
        setTimeout(() => {
            flashOverlay.classList.add('active');
            setTimeout(() => flashOverlay.classList.remove('active'), 1500);
        }, 500);

        // Show final message
        setTimeout(() => {
            finalMessage.classList.add('show');
            launchConfetti();
        }, 2000);

        // Play music
        if (music.paused) {
            music.load();
            music.play().then(() => {
                musicBtn.classList.add('playing');
                isPlaying = true;
            }).catch(() => {});
        }
    });
}

// Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        launchConfetti();
        setTimeout(() => launchConfetti(), 500);
    }
});

console.log('%c Happy Birthday Prachi! 🎂', 'font-size: 25px; color: #ff6b9d; font-weight: bold;');
console.log('%c Made with ❤️ by your Dude', 'font-size: 14px; color: #c44dff;');
