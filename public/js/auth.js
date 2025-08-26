// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded');
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Email:', email);
            console.log('Password length:', password.length);
            
            // Validate inputs
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            // Send login request to server
            console.log('Sending login request to /api/login');
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Login response:', data);
                if (data.success) {
                    // Check if user is admin
                    if (data.isAdmin) {
                        console.log('Redirecting to admin page');
                        window.location.href = '/admin';
                    } else {
                        console.log('Redirecting to home page');
                        window.location.href = '/';
                    }
                } else {
                    showError(data.message || 'Login failed. Please check your credentials.');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showError('An error occurred. Please try again later.');
            });
        });
    } else {
        console.log('Login form not found');
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Register form submitted');
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const password2 = document.getElementById('password2').value;
            
            // Validate inputs
            if (!name || !email || !password || !password2) {
                showError('Please fill in all fields');
                return;
            }
            
            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }
            
            if (password !== password2) {
                showError('Passwords do not match');
                return;
            }
            
            // Send registration request to server
            console.log('Sending register request to /api/register');
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Register response:', data);
                if (data.success) {
                    // Show success message and redirect to login
                    alert('Registration successful! Please log in.');
                    window.location.href = '/login';
                } else {
                    showError(data.message || 'Registration failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Register error:', error);
                showError('An error occurred. Please try again later.');
            });
        });
    } else {
        console.log('Register form not found');
    }
    
    // Helper function to show error messages
    function showError(message) {
        console.log('Showing error:', message);
        // Check if error element already exists
        let errorElement = document.querySelector('.error-message');
        
        if (!errorElement) {
            // Create error element if it doesn't exist
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#d13212';
            errorElement.style.backgroundColor = '#fff0f0';
            errorElement.style.padding = '10px';
            errorElement.style.borderRadius = '4px';
            errorElement.style.marginBottom = '15px';
            errorElement.style.fontSize = '14px';
            errorElement.style.textAlign = 'center';
            
            // Insert at the top of the form
            const form = document.querySelector('form');
            form.insertBefore(errorElement, form.firstChild);
        }
        
        // Set error message
        errorElement.textContent = message;
        
        // Scroll to error message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}); 