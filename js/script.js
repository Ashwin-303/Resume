// 1. SETUP GSAP FIRST
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

// 2. SETUP LENIS (Smooth Scrolling)
const lenis = new Lenis({
    lerp: 0.08,
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', () => ScrollTrigger.update());

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// A. INTRO SECTION ANIMATIONS
const introSection = document.querySelector('.intro-section');
if (introSection) {
    const firstMono = introSection.querySelector('.mono:first-of-type');
    const introTitle = introSection.querySelector('h1');
    const lastMono = introSection.querySelector('.mono:last-of-type');
    const scrollHint = introSection.querySelector('.scroll-hint');

    gsap.set([firstMono, introTitle, lastMono, scrollHint], { opacity: 0, y: 30 });

    gsap.timeline({ delay: 0.3 })
        .to(firstMono, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to(introTitle, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", scale: 1 }, "-=0.8")
        .to(lastMono, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.6")
        .to(scrollHint, { opacity: 0.6, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");

    // Animate intro title with scale effect on scroll
    if (introTitle) {
        gsap.to(introTitle, {
            scale: 0.8,
            opacity: 0.5,
            ease: "power2.in",
            scrollTrigger: {
                trigger: introSection,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// B. BACKGROUND COLOR SHIFTING with smooth transitions
const glow = document.querySelector('.ambient-glow');
const projectSection = document.querySelector('.project-section');

if (projectSection) {
    const projectTitle = projectSection.querySelector('.project-title');
    const updateGlow = (color) => {
        if (glow) {
            const rgbaColor = colorToRgba(color, 0.15);
            gsap.to(glow, { 
                background: `radial-gradient(circle, ${rgbaColor}, transparent 70%)`,
                duration: 1,
                ease: "power2.inOut"
            });
        }
    };

    ScrollTrigger.create({
        trigger: projectSection,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
            updateGlow(projectSection.dataset.color);
            projectSection.classList.add('active');
            if (projectTitle) {
                gsap.fromTo(projectTitle, 
                    { scale: 0.9, opacity: 0.2 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
                );
            }
        },
        onEnterBack: () => {
            updateGlow(projectSection.dataset.color);
            projectSection.classList.add('active');
        },
        onLeave: () => {
            projectSection.classList.remove('active');
            if (projectTitle) {
                gsap.to(projectTitle, { scale: 0.9, opacity: 0.2, duration: 0.5 });
            }
        },
        onLeaveBack: () => {
            projectSection.classList.remove('active');
            if (projectTitle) {
                gsap.to(projectTitle, { scale: 0.9, opacity: 0.2, duration: 0.5 });
            }
        }
    });
    
    // Parallax effect for project title
    if (projectTitle) {
        gsap.to(projectTitle, {
            y: -20,
            ease: "none",
            scrollTrigger: {
                trigger: projectSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// B. THE CARD "FOCUS" EFFECT with advanced animations
const memberCard = document.querySelector('.member-card');

if (memberCard) {
    const cardInner = memberCard.querySelector('.card-inner');
    const cardImg = memberCard.querySelector('.card-img');
    const roleBadge = memberCard.querySelector('.role-badge');
    const name = memberCard.querySelector('h3');
    const title = memberCard.querySelector('h4');
    const statsGrid = memberCard.querySelector('.stats-grid');
    const stats = memberCard.querySelectorAll('.stats-grid > div');
    
    // Set initial states
    gsap.set([name, title, statsGrid], { opacity: 0, x: -30 });
    gsap.set(cardImg, { scale: 1.1, opacity: 0.8 });
    gsap.set(roleBadge, { scale: 0.8, opacity: 0 });
    
    // Main card animation timeline
    const cardTL = gsap.timeline({
        scrollTrigger: {
            trigger: memberCard,
            start: "top 70%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            onEnter: () => {
                memberCard.classList.add('is-active');
                updateDeptIndicator(memberCard);
            },
            onEnterBack: () => {
                memberCard.classList.add('is-active');
                updateDeptIndicator(memberCard);
            },
            onLeave: () => {
                const DISTANCE_THRESHOLD = 800;
                const scrollPosition = window.scrollY + window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const distanceFromEnd = documentHeight - scrollPosition;
                
                if (distanceFromEnd > DISTANCE_THRESHOLD) {
                    memberCard.classList.remove('is-active');
                }
            },
            onLeaveBack: () => {
                memberCard.classList.add('is-active');
            }
        }
    });
    
    // Animate card entrance
    cardTL
        .to(memberCard, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(cardInner, { boxShadow: "0 0 40px rgba(255,255,255,0.1)", duration: 0.6, ease: "power2.out" }, "-=0.4")
        .to(roleBadge, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.6")
        .to(cardImg, { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(name, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(title, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
        .to(statsGrid, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(stats, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" }, "-=0.3");
    
    // Parallax effect for card image
    gsap.to(cardImg, {
        y: -50,
        ease: "none",
        scrollTrigger: {
            trigger: memberCard,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
    
    // Hover effect enhancement
    memberCard.addEventListener('mouseenter', () => {
        if (memberCard.classList.contains('is-active')) {
            gsap.to(cardInner, { scale: 1.02, duration: 0.3, ease: "power2.out" });
            gsap.to(cardImg, { scale: 1.1, duration: 0.3, ease: "power2.out" });
        }
    });
    
    memberCard.addEventListener('mouseleave', () => {
        gsap.to(cardInner, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(cardImg, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
    
    // Initial load animation
    gsap.from(memberCard, {
        opacity: 0,
        y: 100,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: memberCard,
            start: "top 90%",
            toggleActions: "play none none none"
        }
    });
}

// C. UPDATE THE DEPARTMENT INDICATOR with animation
function updateDeptIndicator(card) {
    const deptName = card.dataset.dept;
    const projectSection = card.closest('.project-section');
    const indicator = projectSection.querySelector('.dept-indicator');
    
    if(indicator && deptName) {
        // Animate text change
        gsap.to(indicator, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
                indicator.innerText = deptName;
                gsap.fromTo(indicator, 
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                );
            }
        });
    }
}

// D. OUTRO SECTION ANIMATION
const outro = document.querySelector('.outro');
if (outro) {
    const outroTitle = outro.querySelector('h1');
    if (outroTitle) {
        ScrollTrigger.create({
            trigger: outro,
            start: "top 80%",
            onEnter: () => {
                outroTitle.classList.add('animate');
                gsap.fromTo(outroTitle, 
                    { 
                        opacity: 0, 
                        scale: 0.5,
                        rotation: -5
                    },
                    { 
                        opacity: 1, 
                        scale: 1,
                        rotation: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.5)"
                    }
                );
            }
        });
    }
}

// E. ADD SMOOTH SCROLL HINT CLICK
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
    scrollHint.addEventListener('click', () => {
        lenis.scrollTo('.project-section', { offset: -100, duration: 2 });
    });
}

// Helper for colors (handles both hex and rgb)
function colorToRgba(color, alpha) {
    // Check if it's already in rgb format
    if (color.startsWith('rgb')) {
        // Extract numbers from rgb(r, g, b) format
        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
            return `rgba(${matches[0]}, ${matches[1]}, ${matches[2]}, ${alpha})`;
        }
    }
    // Handle hex format
    if (color.startsWith('#')) {
        let r = parseInt(color.slice(1, 3), 16),
            g = parseInt(color.slice(3, 5), 16),
            b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Fallback
    return `rgba(174, 0, 254, ${alpha})`;
}

// H. ADD CURSOR FOLLOW EFFECT
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let tickerActive = false;

if (memberCard) {
    const cardInner = memberCard.querySelector('.card-inner');
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!tickerActive && memberCard.classList.contains('is-active')) {
            gsap.ticker.add(cursorFollowTicker);
            tickerActive = true;
        }
    });
    
    // Observe card state changes
    const cardObserver = new MutationObserver(() => {
        if (!memberCard.classList.contains('is-active') && tickerActive) {
            gsap.ticker.remove(cursorFollowTicker);
            tickerActive = false;
        } else if (memberCard.classList.contains('is-active') && !tickerActive) {
            gsap.ticker.add(cursorFollowTicker);
            tickerActive = true;
        }
    });
    
    cardObserver.observe(memberCard, { attributes: true, attributeFilter: ['class'] });
    
    function cursorFollowTicker() {
        if (!memberCard.classList.contains('is-active')) return;
        
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        const rect = memberCard.getBoundingClientRect();
        const x = cursorX - (rect.left + rect.width / 2);
        const y = cursorY - (rect.top + rect.height / 2);
        
        const MAX_ROTATION = 8;
        const ROTATION_SENSITIVITY = 0.005;
        const rotationY = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, x * ROTATION_SENSITIVITY));
        const rotationX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, -y * ROTATION_SENSITIVITY));
        
        if (cardInner) {
            gsap.to(cardInner, {
                rotationY: rotationY,
                rotationX: rotationX,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power1.out"
            });
        }
    }
}