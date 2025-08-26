// Amazon Clone JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Initialize product hover effects
    initializeProductHover();
});

// Dropdown functionality
function initializeDropdowns() {
    const accountDropdown = document.querySelector('.nav-signin');
    if (accountDropdown) {
        accountDropdown.addEventListener('click', function() {
            alert('Sign-in functionality would appear here in a real Amazon site');
        });
    }
    
    const allMenuButton = document.querySelector('.panel-all');
    if (allMenuButton) {
        allMenuButton.addEventListener('click', function() {
            alert('All categories menu would appear here in a real Amazon site');
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.nav-search');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-icon');
    
    if (searchForm && searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchCategory = document.querySelector('.search-select');
    
    if (searchInput && searchInput.value.trim() !== '') {
        alert(`Searching for "${searchInput.value}" in category "${searchCategory.value}"`);
        // In a real implementation, this would redirect to search results
    } else {
        alert('Please enter a search term');
    }
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.footer-panel1');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Product hover effects
function initializeProductHover() {
    const productBoxes = document.querySelectorAll('.box');
    
    productBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Make the entire box clickable
        box.addEventListener('click', function() {
            const productName = this.querySelector('.content3')?.textContent || this.querySelector('h2')?.textContent || 'Product';
            const discount = this.querySelector('.content1')?.textContent || 'Discount';
            alert(`You clicked on ${productName}. In a real Amazon site, this would take you to the product page.`);
        });
    });
}

// Cart functionality
function addToCart(productName, price) {
    // This would be implemented in a real e-commerce site
    alert(`Added ${productName} ($${price}) to cart`);
}

// Handle "See more" links
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'See more') {
        const category = e.target.closest('.box-content').querySelector('h2').textContent;
        alert(`You clicked to see more products in the "${category}" category`);
    }
}); 