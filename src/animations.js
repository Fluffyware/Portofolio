import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initAnimations() {
    initPreloader();
    initNavbarScroll();
    initSmoothScrollLinks();
    initHeroParallax();
}

/**
 * ASYMMETRIC HERO ANIMATIONS
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero-minimal');
    if (!hero) return;

    const roleLines = document.querySelectorAll('.role-line');
    const description = document.querySelector('.hero-description-short');
    const nameCharsLeft = document.querySelectorAll('.name-left .char');
    const nameCharsRight = document.querySelectorAll('.name-right .char');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    // Random characters for scramble effect
    const scrambleChars = '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    // Scramble animation function
    function scrambleReveal(charElement, delay) {
        const originalChar = charElement.textContent;
        charElement.setAttribute('data-char', originalChar);
        let iterations = 0;
        const maxIterations = 8 + Math.floor(Math.random() * 5);

        setTimeout(() => {
            charElement.classList.add('scrambling');

            const interval = setInterval(() => {
                charElement.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                iterations++;

                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    charElement.textContent = originalChar;
                    charElement.classList.remove('scrambling');
                    charElement.classList.add('revealed');
                }
            }, 50);
        }, delay);
    }

    // Cinematic Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.8 } });

    tl.from(roleLines, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5
    })
        .from(description, {
            opacity: 0,
            y: 30,
            duration: 1.5
        }, "-=1.4")
        // Animate name characters with scramble effect
        .add(() => {
            nameCharsLeft.forEach((char, i) => {
                scrambleReveal(char, i * 60);
            });
        }, "-=0.8")
        .add(() => {
            nameCharsRight.forEach((char, i) => {
                scrambleReveal(char, i * 60);
            });
        }, "-=0.3")
        .from(scrollIndicator, {
            opacity: 0,
            y: 20,
        }, "+=0.5");

    initHeroBackgroundAnimation();
}

/**
 * PREMIUM FLUID BACKGROUND (CANVAS)
 */
function initHeroBackgroundAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;
    const particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Initialize particles for "cooler" effect
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Deep dark background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Soft atmospheric glow
        const gradient = ctx.createRadialGradient(
            width / 2 + Math.cos(time * 0.0005) * 300,
            height / 2 + Math.sin(time * 0.0005) * 300,
            0,
            width / 2,
            height / 2,
            width * 0.8
        );
        gradient.addColorStop(0, 'rgba(30, 30, 40, 0.4)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw Waves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, height * 0.3 + i * 120);
            for (let x = 0; x < width; x += 20) {
                const y = height * 0.3 + i * 120 + Math.sin(x * 0.001 + time * 0.0005 + i) * 60;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Draw and update particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        time += 16;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

/**
 * SMOOTH SCROLL FOR NAVBAR LINKS
 */
function initSmoothScrollLinks() {
    const links = document.querySelectorAll('.nav-link, .nav-logo');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Only handle internal section links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80 // Offset for the fixed navbar
                        },
                        ease: "power4.inOut"
                    });
                }
            }
        });
    });
}

/**
 * NAVBAR SCROLL ANIMATION
 */
function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.direction === 1) {
                nav.classList.add('nav-scrolled');
            } else {
                if (window.scrollY < 50) {
                    nav.classList.remove('nav-scrolled');
                }
            }
        },
        // Faster toggle behavior
        onLeaveBack: () => nav.classList.remove('nav-scrolled'),
        onEnter: () => nav.classList.add('nav-scrolled')
    });
}

/**
 * PREMIUM PRELOADER LOGIC
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentage = document.getElementById('loader-perc');
    const bar = document.getElementById('loader-bar');

    if (!preloader) return;

    let progress = 0;
    const duration = 1500; // 1.5 seconds total loading time
    const interval = 20; // Update every 20ms
    const increment = 100 / (duration / interval);

    const counter = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(counter);

            // Exit animation after reaching 100
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        ScrollTrigger.refresh();
                    }
                });
            }, 200);
        }

        // Update display
        if (percentage) {
            percentage.textContent = String(Math.floor(progress)).padStart(3, '0');
        }
        if (bar) {
            bar.style.width = progress + '%';
        }
    }, interval);
}

export function initSmoothScroll(lenis) {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}
