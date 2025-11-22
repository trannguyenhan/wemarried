// Envelope opening animation
const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('main-content');
const flowerEffects = document.getElementById('flowerEffects');

// Create flower particles
function createFlowerParticle(index) {
    const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '🌿', '✨', '⭐', '💖', '💕'];
    const flower = document.createElement('div');
    flower.className = 'flower-particle';
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    
    const size = Math.random() * 25 + 25;
    flower.style.fontSize = size + 'px';
    flower.style.animationDuration = (Math.random() * 1.5 + 2.5) + 's';
    flower.style.animationDelay = Math.random() * 0.3 + 's';
    
    // Random position for explosion
    const angle = (Math.PI * 2 * index) / 30;
    const distance = Math.random() * 200 + 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    flower.style.setProperty('--random-x', x + 'px');
    flower.style.setProperty('--random-y', y + 'px');
    
    return flower;
}

// Create confetti particles
function createConfettiParticle(index) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd89b', '#ffecd2', '#ff6b9d', '#c44569'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    
    const size = Math.random() * 10 + 5;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    confetti.style.animationDelay = Math.random() * 0.3 + 's';
    
    // Random position for explosion
    const angle = (Math.PI * 2 * index) / 50;
    const distance = Math.random() * 250 + 200;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    confetti.style.setProperty('--random-x', x + 'px');
    confetti.style.setProperty('--random-y', y + 'px');
    
    return confetti;
}

// Trigger flower explosion effect
function triggerFlowerEffect() {
    // Clear previous effects
    flowerEffects.innerHTML = '';
    
    // Create flower particles
    for (let i = 0; i < 30; i++) {
        const flower = createFlowerParticle(i);
        flowerEffects.appendChild(flower);
    }
    
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
        const confetti = createConfettiParticle(i);
        flowerEffects.appendChild(confetti);
    }
    
    // Remove particles after animation
    setTimeout(() => {
        flowerEffects.innerHTML = '';
    }, 4000);
}

envelope.addEventListener('click', () => {
    // Add opened class to trigger flap animation
    envelope.classList.add('opened');
    
    // Trigger flower effect immediately
    triggerFlowerEffect();
    
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
        // After flap animation, hide envelope and show main content
        setTimeout(() => {
            envelope.classList.add('hidden');
            mainContent.classList.remove('hidden');
            
            // Fade in main content with requestAnimationFrame
            requestAnimationFrame(() => {
                setTimeout(() => {
                    mainContent.classList.add('visible');
                }, 100);
            });
        }, 1000);
    });
});

// Image placeholder click handler - allows users to paste images
document.querySelectorAll('.image-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Replace placeholder with image
                    placeholder.style.backgroundImage = `url(${event.target.result})`;
                    placeholder.style.backgroundSize = 'cover';
                    placeholder.style.backgroundPosition = 'center';
                    placeholder.innerHTML = '';
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });
    
    // Allow paste from clipboard
    placeholder.addEventListener('paste', function(e) {
        e.preventDefault();
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    placeholder.style.backgroundImage = `url(${event.target.result})`;
                    placeholder.style.backgroundSize = 'cover';
                    placeholder.style.backgroundPosition = 'center';
                    placeholder.innerHTML = '';
                };
                
                reader.readAsDataURL(blob);
                break;
            }
        }
    });
    
    // Make placeholder focusable for paste
    placeholder.setAttribute('tabindex', '0');
    placeholder.style.outline = 'none';
});

// Smooth scroll for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation on scroll with optimized IntersectionObserver
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            });
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.family-card, .gallery-item, .invitation-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Image Modal/Popup functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.querySelector('.modal-caption');
const closeBtn = document.querySelector('.modal-close');

// Open modal when clicking on any clickable image
document.querySelectorAll('.clickable-image').forEach(img => {
    img.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-src') || this.getAttribute('src');
        const imageAlt = this.getAttribute('alt') || '';
        
        // Use requestAnimationFrame for smoother modal opening
        requestAnimationFrame(() => {
            modal.classList.add('show');
            modalImg.src = imageSrc;
            modalCaption.textContent = imageAlt;
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });
    });
});

// Close modal when clicking the X button
closeBtn.addEventListener('click', function() {
    closeModal();
});

// Close modal when clicking outside the image
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

function closeModal() {
    // Use requestAnimationFrame for smoother closing
    requestAnimationFrame(() => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        // Clear image src to stop loading if user closes quickly
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                modalImg.src = '';
            }
        }, 300);
    });
}

// Album Cover Click Handler
const albumCover = document.getElementById('albumCover');
const galleryGrid = document.getElementById('galleryGrid');
const closeAlbumBtn = document.getElementById('closeAlbumBtn');

if (albumCover && galleryGrid && closeAlbumBtn) {
    // Open album
    albumCover.addEventListener('click', function() {
        // Hide album cover
        albumCover.style.display = 'none';
        
        // Show close button
        closeAlbumBtn.classList.remove('hidden');
        
        // Show gallery grid with animation
        requestAnimationFrame(() => {
            galleryGrid.classList.remove('hidden');
            galleryGrid.classList.add('visible');
            
            // Smooth scroll to gallery
            galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Close album
    closeAlbumBtn.addEventListener('click', function() {
        // Hide gallery grid
        galleryGrid.classList.remove('visible');
        galleryGrid.classList.add('hidden');
        
        // Hide close button
        closeAlbumBtn.classList.add('hidden');
        
        // Show album cover
        requestAnimationFrame(() => {
            albumCover.style.display = 'block';
            
            // Smooth scroll to album cover
            albumCover.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('2025-11-29T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
if (document.getElementById('countdown')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

