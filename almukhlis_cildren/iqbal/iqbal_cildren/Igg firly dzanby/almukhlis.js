window.addEventListener('load', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.children[0].classList.toggle('fa-bars');
            hamburger.children[0].classList.toggle('fa-times');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.children[0].classList.add('fa-bars');
                hamburger.children[0].classList.remove('fa-times');
            }
        });
    });

    /* --- Soft Scroll Reveal --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* --- Carousel Logic --- */
    const carousels = document.querySelectorAll('.projects-grid');

    carousels.forEach(carousel => {
        const cards = carousel.querySelectorAll('.project-card');

        if (cards.length > 0) {
            const updateCarousel = () => {
                const center = carousel.scrollLeft + (carousel.offsetWidth / 2);

                cards.forEach(card => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const distance = Math.abs(center - cardCenter);

                    if (distance < card.offsetWidth / 1.5) {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0.7';
                        card.style.transform = 'scale(0.95)';
                    }
                });
            };

            setTimeout(() => {
                const firstCard = cards[0];
                const paddingSide = (carousel.offsetWidth - firstCard.offsetWidth) / 2;
                carousel.style.paddingLeft = `${paddingSide}px`;
                carousel.style.paddingRight = `${paddingSide}px`;

                if (cards.length > 1) {
                    const middleIndex = Math.floor(cards.length / 2);
                    const targetCard = cards[middleIndex];
                    carousel.scrollLeft = targetCard.offsetLeft - (carousel.offsetWidth / 2) + (targetCard.offsetWidth / 2);
                }
                updateCarousel();
            }, 100);

            carousel.addEventListener('scroll', () => {
                window.requestAnimationFrame(updateCarousel);
            });

            window.addEventListener('resize', () => {
                const firstCard = cards[0];
                const paddingSide = (carousel.offsetWidth - firstCard.offsetWidth) / 2;
                carousel.style.paddingLeft = `${paddingSide}px`;
                carousel.style.paddingRight = `${paddingSide}px`;
                updateCarousel();
            });
        }
    });

    /* --- Interactive Floating Family Names --- */
    const createFloatingNames = () => {
        const bgContainer = document.createElement('div');
        bgContainer.id = 'floating-names-container';
        document.body.appendChild(bgContainer);

        const names = [
            "Ahmad", "Siti", "Budi", "Dewi", "Eko", "Lani", "Hendra", "Sari", "Rudi", "Maya",
            "Agus", "Ratna", "Fajar", "Indah", "Bambang", "Wulan", "Dedi", "Rina", "Surya", "Mega",
            "Joko", "Sri", "Hadi", "Ani", "Taufik", "Yanti", "Rian", "Dian", "Aris", "Fitri",
            "Lukman", "Siska", "Andi", "Nur", "Galuh", "Yuda", "Putri", "Iwan", "Mila", "Bagus",
            "Nana", "Dodo", "Gita", "Farhan", "Rara", "Dika", "Novi", "Zaki", "Tia", "Eka"
        ];

        // Theme-consistent colors
        const themeColors = [
            "#c97b63", // Terracotta
            "#a3b18a", // Sage
            "#f4a261", // Peach
            "#8d6e63"  // Brown
        ];

        const nameData = [];
        const mouse = { x: -1000, y: -1000 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        for (let i = 0; i < 50; i++) {
            const nameEl = document.createElement('div');
            nameEl.className = 'floating-name';
            nameEl.innerText = names[i % names.length];

            const size = Math.random() * (20 - 10) + 10;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const opacity = Math.random() * (0.15 - 0.05) + 0.05;
            const color = themeColors[Math.floor(Math.random() * themeColors.length)];

            nameEl.style.fontSize = `${size}px`;
            nameEl.style.opacity = opacity;
            nameEl.style.color = color;
            bgContainer.appendChild(nameEl);

            nameData.push({
                el: nameEl,
                x: x,
                y: y,
                originX: x,
                originY: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            nameData.forEach(data => {
                // Return to origin force
                const dx0 = data.originX - data.x;
                const dy0 = data.originY - data.y;
                data.vx += dx0 * 0.01;
                data.vy += dy0 * 0.01;

                // Mouse repulsion
                const dx1 = data.x - mouse.x;
                const dy1 = data.y - mouse.y;
                const dist = Math.sqrt(dx1 * dx1 + dy1 * dy1);

                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    data.vx += (dx1 / dist) * force * 5;
                    data.vy += (dy1 / dist) * force * 5;
                }

                // Friction
                data.vx *= 0.95;
                data.vy *= 0.95;

                // Update position
                data.x += data.vx;
                data.y += data.vy;

                // Infinite drift (wrap around) - optional, but let's just keep them near origin
                data.el.style.transform = `translate(${data.x}px, ${data.y}px)`;
            });

            requestAnimationFrame(animate);
        };

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            nameData.forEach(data => {
                data.originX = Math.random() * window.innerWidth;
                data.originY = Math.random() * window.innerHeight;
            });
        });
    };

    createFloatingNames();

});
