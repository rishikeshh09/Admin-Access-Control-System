// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    checkAdminAuth();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial data
    loadUserData(1);
    loadStats();
});

// Check if user is authenticated as admin
function checkAdminAuth() {
    fetch('/api/admin/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Redirect to login page if not authenticated or not admin
                window.location.href = '/login.html';
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error checking auth:', error);
        // Redirect to login page on error
        window.location.href = '/login.html';
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Search box
    const userSearch = document.getElementById('userSearch');
    const searchBtn = userSearch.nextElementSibling;
    
    if (userSearch && searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadUserData(1, userSearch.value);
        });
        
        userSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loadUserData(1, userSearch.value);
            }
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadUserData(1);
            loadStats();
        });
    }
    
    // Pagination buttons
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            const currentPage = parseInt(this.getAttribute('data-current-page'));
            if (currentPage > 1) {
                loadUserData(currentPage - 1, userSearch.value);
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            const currentPage = parseInt(this.getAttribute('data-current-page'));
            const totalPages = parseInt(this.getAttribute('data-total-pages'));
            if (currentPage < totalPages) {
                loadUserData(currentPage + 1, userSearch.value);
            }
        });
    }
    
    // Modal close buttons
    const closeModalBtns = document.querySelectorAll('.close-modal, .modal-close-btn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('userModal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('userModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Sidebar menu items
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // In a real app, this would load different content based on the menu item
            const menuText = this.textContent.trim();
            alert(`You clicked on ${menuText}. In a real app, this would load the ${menuText} section.`);
        });
    });
}

// Load user data
function loadUserData(page = 1, search = '') {
    const limit = 10;
    let url = `/api/admin/users?page=${page}&limit=${limit}`;
    
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayUsers(data.users);
                updatePagination(data.pagination);
            } else {
                console.error('Error loading users:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Display users in table
function displayUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="no-data">No users found</td>';
        tableBody.appendChild(row);
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Format dates
        const createdDate = new Date(user.created_at).toLocaleString();
        const lastLoginDate = user.last_login ? new Date(user.last_login).toLocaleString() : 'Never';
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${createdDate}</td>
            <td>${lastLoginDate}</td>
            <td>${user.login_count}</td>
            <td>
                <button class="view-btn" data-id="${user.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            viewUserDetails(userId);
        });
    });
}

// Update pagination controls
function updatePagination(pagination) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    pageInfo.textContent = `Page ${pagination.page} of ${pagination.pages}`;
    
    prevPageBtn.disabled = pagination.page <= 1;
    nextPageBtn.disabled = pagination.page >= pagination.pages;
    
    prevPageBtn.setAttribute('data-current-page', pagination.page);
    nextPageBtn.setAttribute('data-current-page', pagination.page);
    nextPageBtn.setAttribute('data-total-pages', pagination.pages);
}

// Load statistics
function loadStats() {
    fetch('/api/admin/stats')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('totalUsers').textContent = data.stats.totalUsers;
                document.getElementById('activeToday').textContent = data.stats.activeToday;
                document.getElementById('newUsers').textContent = data.stats.newThisWeek;
            } else {
                console.error('Error loading stats:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// View user details
function viewUserDetails(userId) {
    // In a real app, this would fetch detailed user info from the server
    // For this demo, we'll just show a modal with some placeholder data
    const modal = document.getElementById('userModal');
    const userDetails = document.getElementById('userDetails');
    
    // Find user in the table
    const userRow = document.querySelector(`button[data-id="${userId}"]`).closest('tr');
    const userData = {
        id: userRow.cells[0].textContent,
        name: userRow.cells[1].textContent,
        email: userRow.cells[2].textContent,
        created: userRow.cells[3].textContent,
        lastLogin: userRow.cells[4].textContent,
        loginCount: userRow.cells[5].textContent
    };
    
    userDetails.innerHTML = `
        <div class="user-detail-row">
            <div class="detail-label">User ID:</div>
            <div class="detail-value">${userData.id}</div>
        </div>
        <div class="user-detail-row">
            <div class="detail-label">Name:</div>
            <div class="detail-value">${userData.name}</div>
        </div>
        <div class="user-detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">${userData.email}</div>
        </div>
        <div class="user-detail-row">
            <div class="detail-label">Registration Date:</div>
            <div class="detail-value">${userData.created}</div>
        </div>
        <div class="user-detail-row">
            <div class="detail-label">Last Login:</div>
            <div class="detail-value">${userData.lastLogin}</div>
        </div>
        <div class="user-detail-row">
            <div class="detail-label">Login Count:</div>
            <div class="detail-value">${userData.loginCount}</div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Logout function
function logout() {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/login.html';
        } else {
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
} 