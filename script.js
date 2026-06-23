/* ==========================================================================
   Priyani's Portfolio JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initTypingEffect();
    initActiveNavObserver();
    initSkillBarsObserver();
    initParticles();
    initContactForm();
    initDemoModals();
    initPacmanGame();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
        themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        
        // Redraw particles with updated colors
        if (window.particleColorUpdate) {
            window.particleColorUpdate(isLight);
        }
    });
}

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    
    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
}

/* ==========================================================================
   Dynamic Typing Animation
   ========================================================================== */
function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    const words = ["Frontend Developer", "Software Engineer", "Problem Solver", "CS Undergrad"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

/* ==========================================================================
   Active Navigation Link Highlighting on Scroll
   ========================================================================== */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // trigger when section occupies center of viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);
    
    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   Skill Bar Entrance Animations
   ========================================================================== */
function initSkillBarsObserver() {
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress');
    
    // Store original widths and reset to 0
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.setAttribute('data-width', targetWidth);
        bar.style.width = '0%';
    });
    
    const options = {
        root: null,
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
                    bar.style.width = targetWidth;
                });
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/* ==========================================================================
   Interactive Background Particles (Floating Canvas Particles)
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let numberOfParticles = 70;
    
    // Adjust size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Color definitions based on active theme
    let particleColor = 'rgba(6, 182, 212, 0.4)';
    let lineColor = 'rgba(139, 92, 246, 0.08)';
    
    window.particleColorUpdate = function(isLight) {
        if (isLight) {
            particleColor = 'rgba(8, 145, 178, 0.2)';
            lineColor = 'rgba(124, 58, 237, 0.05)';
        } else {
            particleColor = 'rgba(6, 182, 212, 0.4)';
            lineColor = 'rgba(139, 92, 246, 0.08)';
        }
    };
    // Call once to configure initially
    window.particleColorUpdate(document.body.classList.contains('light-theme'));
    
    // Particle blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // bounce boundary
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }
        
        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Connect lines
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

/* ==========================================================================
   Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';
        feedback.classList.add('hidden');
        feedback.classList.remove('success', 'error');
        
        // Mock server response delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            feedback.classList.remove('hidden');
            feedback.classList.add('success');
            feedback.innerText = 'Thank you! Your message has been sent successfully.';
            
            form.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                feedback.classList.add('hidden');
            }, 5000);
        }, 1500);
    });
}

/* ==========================================================================
   Project Demo Modals (Interactive search/actions mockup)
   ========================================================================== */
function initDemoModals() {
    const demoModal = document.getElementById('demo-modal');
    const closeDemoModal = document.getElementById('close-demo-modal');
    const closeDemoBtn = document.getElementById('close-demo-btn');
    const triggers = document.querySelectorAll('.demo-trigger');
    const demoTitle = document.getElementById('demo-title');
    const demoDesc = document.getElementById('demo-desc');
    const mockScreen = document.getElementById('demo-mock-screen');
    
    const projectDemos = {
        trip: {
            title: "AI Trip Planner Live Mockup",
            desc: "Plan your dream vacation with customized AI schedules. Select a style below to view a sample itinerary:",
            render: () => {
                mockScreen.innerHTML = `
                    <div class="mock-trip-planner">
                        <div class="mock-header">
                            <span>ExploreAI 🌐</span>
                            <div class="mock-inputs">
                                <select id="trip-dest" class="mock-select">
                                    <option value="tokyo">Tokyo, Japan 🇯🇵</option>
                                    <option value="paris">Paris, France 🇫🇷</option>
                                    <option value="swiss">Swiss Alps 🇨🇭</option>
                                </select>
                                <button id="generate-mock-trip" class="mock-btn">Generate</button>
                            </div>
                        </div>
                        <div class="mock-body" id="trip-itinerary-output">
                            <p class="placeholder-text">Choose destination & click generate!</p>
                        </div>
                    </div>
                `;
                
                // Add interactivity
                const genBtn = mockScreen.querySelector('#generate-mock-trip');
                const destSelect = mockScreen.querySelector('#trip-dest');
                const output = mockScreen.querySelector('#trip-itinerary-output');
                
                const itineraries = {
                    tokyo: `
                        <strong>🗼 3-Day Tokyo Itinerary:</strong><br>
                        • <strong>Day 1:</strong> Tech exploration in Akihabara & Shibuya Crossing.<br>
                        • <strong>Day 2:</strong> Historic Senso-ji temple and gardens in Asakusa.<br>
                        • <strong>Day 3:</strong> Morning sushi in Tsukiji & Panoramic views from Tokyo Skytree.
                    `,
                    paris: `
                        <strong>🗼 3-Day Paris Itinerary:</strong><br>
                        • <strong>Day 1:</strong> Louvre museum tour and Eiffel Tower sunset stroll.<br>
                        • <strong>Day 2:</strong> Notre Dame cathedral architecture and Seine river cruise.<br>
                        • <strong>Day 3:</strong> Artistic walks in Montmartre and shopping at Champs-Élysées.
                    `,
                    swiss: `
                        <strong>🏔️ 3-Day Swiss Alps Itinerary:</strong><br>
                        • <strong>Day 1:</strong> Scenic train ride to Interlaken & Lake Brienz cruise.<br>
                        • <strong>Day 2:</strong> Cable car to Grindelwald First for panoramic peaks.<br>
                        • <strong>Day 3:</strong> Alpine hiking & traditional fondue dinner in Zermatt.
                    `
                };
                
                genBtn.addEventListener('click', () => {
                    output.innerHTML = `<div class="spinner-small"></div>`;
                    setTimeout(() => {
                        output.innerHTML = itineraries[destSelect.value];
                    }, 600);
                });
            }
        },
        food: {
            title: "React Food App Mockup",
            desc: "Add items to your plate and watch the cart update dynamically in real time:",
            render: () => {
                mockScreen.innerHTML = `
                    <div class="mock-food-app">
                        <div class="mock-food-header">
                            <span>BiteExpress 🍔</span>
                            <span class="mock-cart-badge"><i class="fa-solid fa-cart-shopping"></i> Cart: $<span id="mock-cart-total">0.00</span></span>
                        </div>
                        <div class="mock-food-items">
                            <div class="food-item-row">
                                <span>Crispy Burger ($8.99)</span>
                                <button class="add-food-btn" data-price="8.99">Add</button>
                            </div>
                            <div class="food-item-row">
                                <span>Cheesy Pizza ($12.50)</span>
                                <button class="add-food-btn" data-price="12.50">Add</button>
                            </div>
                            <div class="food-item-row">
                                <span>Matcha Latte ($4.75)</span>
                                <button class="add-food-btn" data-price="4.75">Add</button>
                            </div>
                        </div>
                        <button class="mock-btn-secondary" id="clear-mock-cart">Reset Plate</button>
                    </div>
                `;
                
                let total = 0;
                const totalSpan = mockScreen.querySelector('#mock-cart-total');
                const addBtns = mockScreen.querySelectorAll('.add-food-btn');
                const clearBtn = mockScreen.querySelector('#clear-mock-cart');
                
                addBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const price = parseFloat(btn.getAttribute('data-price'));
                        total += price;
                        totalSpan.textContent = total.toFixed(2);
                        
                        // micro animation
                        totalSpan.parentElement.classList.add('bump');
                        setTimeout(() => totalSpan.parentElement.classList.remove('bump'), 300);
                    });
                });
                
                clearBtn.addEventListener('click', () => {
                    total = 0;
                    totalSpan.textContent = "0.00";
                });
            }
        }
    };
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projectKey = trigger.getAttribute('data-project');
            const data = projectDemos[projectKey];
            if (!data) return;
            
            demoTitle.innerText = data.title;
            demoDesc.innerText = data.desc;
            data.render();
            
            demoModal.classList.add('active');
        });
    });
    
    function closeAllDemos() {
        demoModal.classList.remove('active');
    }
    
    closeDemoModal.addEventListener('click', closeAllDemos);
    closeDemoBtn.addEventListener('click', closeAllDemos);
    
    // Close modal if clicked outside
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) closeAllDemos();
    });
}

/* ==========================================================================
   Playable Pacman Canvas Arcade Game
   ========================================================================== */
function initPacmanGame() {
    const gameModal = document.getElementById('game-modal');
    const openGameBtn = document.getElementById('open-game-btn');
    const closeGameModal = document.getElementById('close-game-modal');
    const canvas = document.getElementById('pacman-canvas');
    const scoreSpan = document.getElementById('game-score');
    const livesSpan = document.getElementById('game-lives');
    const restartBtn = document.getElementById('restart-game-btn');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let score = 0;
    let lives = 3;
    let gameInterval;
    let pacman;
    let ghosts = [];
    let pellets = [];
    let walls = [];
    let isGameOver = false;
    let isGameWon = false;
    
    // Grid definitions
    const tileSize = 20; // 20x20 pixels
    const mapRows = 20;
    const mapCols = 20;
    
    // 1 = Wall, 0 = Pellet/Dot, 2 = Empty space
    const layout = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
        [2,2,2,1,0,1,2,2,2,2,2,2,2,2,1,0,1,2,2,2],
        [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
        [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2],
        [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
        [2,2,2,1,0,1,2,2,2,2,2,2,2,2,1,0,1,2,2,2],
        [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,1,0,0,0,0,0,2,2,0,0,0,0,0,1,0,0,1],
        [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
        [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Scale responsive sizes
    function initCanvasDimensions() {
        const width = Math.min(window.innerWidth - 60, 400);
        canvas.width = width;
        canvas.height = width;
    }
    
    // Pacman Constructor
    class Pacman {
        constructor() {
            this.x = 9 * tileSize + tileSize/2;
            this.y = 12 * tileSize + tileSize/2;
            this.radius = tileSize/2 - 2;
            this.speed = 2;
            this.dirX = 0;
            this.dirY = 0;
            this.nextDirX = 0;
            this.nextDirY = 0;
            this.angle = 0.2;
            this.mouthClosing = false;
        }
        
        draw() {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            
            // Mouth opening calculation depending on direction
            let rotation = 0;
            if (this.dirX === 1) rotation = 0;
            else if (this.dirX === -1) rotation = Math.PI;
            else if (this.dirY === 1) rotation = Math.PI / 2;
            else if (this.dirY === -1) rotation = -Math.PI / 2;
            
            ctx.arc(
                this.x, 
                this.y, 
                this.radius, 
                rotation + this.angle * Math.PI, 
                rotation + (2 - this.angle) * Math.PI
            );
            ctx.lineTo(this.x, this.y);
            ctx.fill();
        }
        
        update() {
            // Animate mouth
            if (this.mouthClosing) {
                this.angle -= 0.03;
                if (this.angle < 0.05) this.mouthClosing = false;
            } else {
                this.angle += 0.03;
                if (this.angle > 0.25) this.mouthClosing = true;
            }
            
            // Grid-aligned movement checks for turning
            const currentCol = Math.floor(this.x / tileSize);
            const currentRow = Math.floor(this.y / tileSize);
            const offsetX = this.x % tileSize;
            const offsetY = this.y % tileSize;
            
            // If aligned with grid cell, attempt turning
            if (offsetX === tileSize/2 && offsetY === tileSize/2) {
                if (!checkWallCollision(currentCol + this.nextDirX, currentRow + this.nextDirY)) {
                    this.dirX = this.nextDirX;
                    this.dirY = this.nextDirY;
                }
            }
            
            // Apply speed if no wall in front
            const checkNextX = this.x + this.dirX * this.speed;
            const checkNextY = this.y + this.dirY * this.speed;
            
            // Calculate front collision grid position
            const checkCol = Math.floor((checkNextX + this.dirX * (tileSize/2)) / tileSize);
            const checkRow = Math.floor((checkNextY + this.dirY * (tileSize/2)) / tileSize);
            
            if (!checkWallCollision(checkCol, checkRow)) {
                this.x = checkNextX;
                this.y = checkNextY;
            } else {
                this.dirX = 0;
                this.dirY = 0;
            }
            
            // Wrap coordinates around grid (portal wraps)
            if (this.x < 0) this.x = canvas.width - tileSize/2;
            if (this.x > canvas.width) this.x = tileSize/2;
        }
    }
    
    // Ghost Constructor
    class Ghost {
        constructor(col, row, color) {
            this.x = col * tileSize + tileSize/2;
            this.y = row * tileSize + tileSize/2;
            this.radius = tileSize/2 - 2;
            this.speed = 1.5;
            this.dirX = 0;
            this.dirY = -1;
            this.color = color;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 2, this.radius, Math.PI, 0, false);
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            
            // Draw skirt bottom
            ctx.lineTo(this.x + this.radius - 3, this.y + this.radius - 3);
            ctx.lineTo(this.x + this.radius - 6, this.y + this.radius);
            ctx.lineTo(this.x - this.radius + 6, this.y + this.radius);
            ctx.lineTo(this.x - this.radius + 3, this.y + this.radius - 3);
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            
            ctx.closePath();
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x - 3, this.y - 3, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 3, this.y - 3, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            ctx.arc(this.x - 3 + this.dirX, this.y - 3 + this.dirY, 1.5, 0, Math.PI * 2);
            ctx.arc(this.x + 3 + this.dirX, this.y - 3 + this.dirY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        update() {
            const currentCol = Math.floor(this.x / tileSize);
            const currentRow = Math.floor(this.y / tileSize);
            const offsetX = this.x % tileSize;
            const offsetY = this.y % tileSize;
            
            // Choose direction when aligned in the center of grid
            if (offsetX === tileSize/2 && offsetY === tileSize/2) {
                // Find all valid direction turns
                const validDirs = [];
                const possibleDirections = [
                    {x: 0, y: -1},
                    {x: 0, y: 1},
                    {x: -1, y: 0},
                    {x: 1, y: 0}
                ];
                
                possibleDirections.forEach(dir => {
                    // Do not allow reversing directions immediately unless stuck
                    if (dir.x !== -this.dirX || dir.y !== -this.dirY) {
                        if (!checkWallCollision(currentCol + dir.x, currentRow + dir.y)) {
                            validDirs.push(dir);
                        }
                    }
                });
                
                if (validDirs.length === 0) {
                    // Reversing fallback
                    if (!checkWallCollision(currentCol - this.dirX, currentRow - this.dirY)) {
                        this.dirX = -this.dirX;
                        this.dirY = -this.dirY;
                    }
                } else {
                    // Choose randomly among valid directions
                    const finalDir = validDirs[Math.floor(Math.random() * validDirs.length)];
                    this.dirX = finalDir.x;
                    this.dirY = finalDir.y;
                }
            }
            
            this.x += this.dirX * this.speed;
            this.y += this.dirY * this.speed;
            
            // wraps
            if (this.x < 0) this.x = canvas.width - tileSize/2;
            if (this.x > canvas.width) this.x = tileSize/2;
        }
    }
    
    // Check map wall index bounds
    function checkWallCollision(col, row) {
        if (col < 0 || col >= mapCols || row < 0 || row >= mapRows) return true;
        return layout[row][col] === 1;
    }
    
    // Build pellets and game arrays
    function setupGame() {
        pellets = [];
        ghosts = [];
        walls = [];
        score = 0;
        isGameOver = false;
        isGameWon = false;
        
        scoreSpan.textContent = score;
        livesSpan.textContent = lives;
        gameOverlay.classList.add('hidden');
        
        // Loop map template
        for (let r = 0; r < mapRows; r++) {
            for (let c = 0; c < mapCols; c++) {
                if (layout[r][c] === 0) {
                    pellets.push({col: c, row: r, eaten: false});
                }
            }
        }
        
        pacman = new Pacman();
        
        // Spawn 3 ghosts with different colors
        ghosts.push(new Ghost(9, 7, '#ef4444')); // Blinky (Red)
        ghosts.push(new Ghost(9, 8, '#ec4899')); // Pinky (Pink)
        ghosts.push(new Ghost(10, 8, '#06b6d4')); // Inky (Cyan)
    }
    
    // Draw functions
    function drawMap() {
        const scaledTile = canvas.width / mapCols;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let r = 0; r < mapRows; r++) {
            for (let c = 0; c < mapCols; c++) {
                if (layout[r][c] === 1) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
                    ctx.fillRect(c * scaledTile, r * scaledTile, scaledTile - 1, scaledTile - 1);
                    ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
                    ctx.strokeRect(c * scaledTile, r * scaledTile, scaledTile - 1, scaledTile - 1);
                }
            }
        }
        
        // Draw Dots/Pellets
        pellets.forEach(dot => {
            if (!dot.eaten) {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(
                    dot.col * scaledTile + scaledTile/2, 
                    dot.row * scaledTile + scaledTile/2, 
                    2.5, 0, Math.PI * 2
                );
                ctx.fill();
            }
        });
    }
    
    // Distance calculator
    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    // Main loop
    function updateGame() {
        if (isGameOver || isGameWon) return;
        
        pacman.update();
        ghosts.forEach(ghost => ghost.update());
        
        // Check dot eating
        pellets.forEach(dot => {
            if (!dot.eaten) {
                const scaledTile = canvas.width / mapCols;
                const dotX = dot.col * scaledTile + scaledTile/2;
                const dotY = dot.row * scaledTile + scaledTile/2;
                
                if (getDistance(pacman.x, pacman.y, dotX, dotY) < pacman.radius + 2) {
                    dot.eaten = true;
                    score += 10;
                    scoreSpan.textContent = score;
                }
            }
        });
        
        // Check game win
        if (pellets.every(d => d.eaten)) {
            isGameWon = true;
            endGame(true);
        }
        
        // Check ghost collisions
        ghosts.forEach(ghost => {
            if (getDistance(pacman.x, pacman.y, ghost.x, ghost.y) < pacman.radius + ghost.radius - 2) {
                lives--;
                livesSpan.textContent = lives;
                
                if (lives <= 0) {
                    isGameOver = true;
                    endGame(false);
                } else {
                    // Reset positions, keep score
                    pacman = new Pacman();
                    ghosts = [];
                    ghosts.push(new Ghost(9, 7, '#ef4444'));
                    ghosts.push(new Ghost(9, 8, '#ec4899'));
                    ghosts.push(new Ghost(10, 8, '#06b6d4'));
                }
            }
        });
    }
    
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        pacman.draw();
        ghosts.forEach(ghost => ghost.draw());
    }
    
    function runTick() {
        updateGame();
        drawGame();
    }
    
    function endGame(won) {
        clearInterval(gameInterval);
        gameOverlay.classList.remove('hidden');
        if (won) {
            overlayTitle.innerText = "You Won! 🎉";
            overlayTitle.style.color = "var(--accent-cyan)";
        } else {
            overlayTitle.innerText = "Game Over 💀";
            overlayTitle.style.color = "var(--accent-pink)";
        }
    }
    
    // Controller Event Listeners
    window.addEventListener('keydown', (e) => {
        if (!gameModal.classList.contains('active')) return;
        
        // Prevent window scrolling with arrows inside modal
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
        
        switch (e.key) {
            case "ArrowUp":
                pacman.nextDirX = 0; pacman.nextDirY = -1;
                break;
            case "ArrowDown":
                pacman.nextDirX = 0; pacman.nextDirY = 1;
                break;
            case "ArrowLeft":
                pacman.nextDirX = -1; pacman.nextDirY = 0;
                break;
            case "ArrowRight":
                pacman.nextDirX = 1; pacman.nextDirY = 0;
                break;
        }
    });
    
    // Swipe gestures for touch support
    let touchstartX = 0;
    let touchstartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, {passive: true});
    
    canvas.addEventListener('touchend', (e) => {
        const touchendX = e.changedTouches[0].screenX;
        const touchendY = e.changedTouches[0].screenY;
        
        const dx = touchendX - touchstartX;
        const dy = touchendY - touchstartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) { pacman.nextDirX = 1; pacman.nextDirY = 0; } // swipe right
            else if (dx < -30) { pacman.nextDirX = -1; pacman.nextDirY = 0; } // swipe left
        } else {
            if (dy > 30) { pacman.nextDirX = 0; pacman.nextDirY = 1; } // swipe down
            else if (dy < -30) { pacman.nextDirX = 0; pacman.nextDirY = -1; } // swipe up
        }
    }, {passive: true});
    
    // Open Modal and trigger game init
    openGameBtn.addEventListener('click', () => {
        gameModal.classList.add('active');
        initCanvasDimensions();
        lives = 3;
        setupGame();
        clearInterval(gameInterval);
        gameInterval = setInterval(runTick, 1000/60); // 60 FPS
    });
    
    function closeGame() {
        gameModal.classList.remove('active');
        clearInterval(gameInterval);
    }
    
    closeGameModal.addEventListener('click', closeGame);
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) closeGame();
    });
    
    restartBtn.addEventListener('click', () => {
        lives = 3;
        setupGame();
        clearInterval(gameInterval);
        gameInterval = setInterval(runTick, 1000/60);
    });
}
