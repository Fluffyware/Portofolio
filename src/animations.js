import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initAnimations() {
    initPreloader();
    initNavbarScroll();
    initSmoothScrollLinks();
    initHeroParallax();
    initMobileMenu();
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('body');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
    });
}

/**
 * MINIMAL WAVE HERO ANIMATIONS
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero-wave');
    const canvas = document.getElementById('hero-waves');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    const name = document.querySelector('.hero-display-name');
    const caption = document.querySelector('.hero-caption');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    let width, height, animationFrame;
    let increment = 0;

    const waves = [
        { amplitude: 40, frequency: 0.012, speed: 0.015, color: 'rgba(255, 255, 255, 0.05)' },
        { amplitude: 60, frequency: 0.008, speed: 0.01, color: 'rgba(255, 255, 255, 0.03)' },
        { amplitude: 30, frequency: 0.015, speed: 0.02, color: 'rgba(255, 255, 255, 0.02)' }
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function drawWave(amplitude, frequency, speed, color) {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let i = 0; i < width; i++) {
            const y = height / 2 + Math.sin(i * frequency + increment * speed) * amplitude;
            ctx.lineTo(i, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        increment += 1;

        waves.forEach(w => drawWave(w.amplitude, w.frequency, w.speed, w.color));
        animationFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    // 2. Simple Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.5 } });
    const buttons = document.querySelectorAll('.hero-btn');

    tl.from([name, caption], {
        opacity: 0,
        y: 40,
        stagger: 0.2,
        delay: 0.5
    })
        .from(buttons, {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 1
        }, "-=1")
        .from(scrollIndicator, {
            opacity: 0,
            y: 20
        }, "-=1");

    // 3. Magnetic Buttons Logic
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6,
                ease: "power2.out"
            });

            gsap.to(btn.querySelector('.btn-text'), {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to([btn, btn.querySelector('.btn-text')], {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 3. Mouse Parallax Effect
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to('.hero-center-content', {
            x: xPos,
            y: yPos,
            duration: 1,
            ease: "power2.out"
        });

        gsap.to('.hero-grid-bg', {
            x: xPos * 0.5,
            y: yPos * 0.5,
            duration: 1.5,
            ease: "power2.out"
        });
    });
}

function initHeroBackgroundAnimation() {
    // Canvas background removed in favor of CSS Grid + GSAP mouse parallax in initHeroParallax
    return;
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
                    // Close mobile menu if open
                    document.body.classList.remove('nav-active');

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
