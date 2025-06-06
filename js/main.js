/**
 * Main JavaScript for LostHistory
 * Handles navigation, UI interactions, and dynamic content
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    updateCurrentYear();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

/**
 * Updates the current year in the footer
 */
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Handles newsletter form submission
 * @param {Event} e - The form submit event
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Here you would typically send the data to a server
    // For now, we'll just show the thank you message
    form.style.display = 'none';
    if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
    }
    
    // Reset form
    form.reset();
}

/**
 * Sets the active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const navId = link.getAttribute('data-nav');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (currentPage.includes(navId) || 
            (currentPage === 'index.html' && navId === 'home') ||
            (currentPage === '' && navId === 'home')) {
            link.classList.add('active');
        }
    });
}

// Export functions for use in other scripts if needed
window.LostHistory = {
    updateCurrentYear,
    initSmoothScrolling,
    handleNewsletterSubmit,
    setActiveNavLink
};
