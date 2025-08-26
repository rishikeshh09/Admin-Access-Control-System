const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Session configuration
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './' }),
    secret: 'amazon_clone_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTML routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Database setup
const db = new sqlite3.Database('./amazon.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database');
        createTables();
    }
});

// Create database tables if they don't exist
function createTables() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            login_count INTEGER DEFAULT 0
        )`);

        // Check if admin user exists, if not create one
        db.get("SELECT * FROM users WHERE is_admin = 1", [], (err, row) => {
            if (err) {
                console.error('Error checking admin user:', err.message);
                return;
            }
            
            if (!row) {
                // Create admin user if none exists
                bcrypt.hash('admin123', 10, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err.message);
                        return;
                    }
                    
                    db.run(`INSERT INTO users (name, email, password, is_admin) 
                            VALUES (?, ?, ?, ?)`, 
                            ['Admin User', 'admin@example.com', hash, 1], 
                            function(err) {
                                if (err) {
                                    console.error('Error creating admin user:', err.message);
                                } else {
                                    console.log('Admin user created successfully');
                                }
                            });
                });
            }
        });
    });
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Authentication required' });
    }
}

// Admin middleware
function requireAdmin(req, res, next) {
    if (req.session.userId && req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
}

// Routes
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide name, email and password' 
        });
    }
    
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (user) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }
        
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error hashing password' 
                });
            }
            
            // Insert new user
            const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            stmt.run(name, email, hash, function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error creating user' 
                    });
                }
                
                res.json({ 
                    success: true, 
                    message: 'User registered successfully',
                    userId: this.lastID
                });
            });
            stmt.finalize();
        });
    });
});

app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide email and password' 
        });
    }
    
    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        console.log('User found:', user.email);
        
        // Compare password
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Password comparison error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error comparing passwords' 
                });
            }
            
            if (!match) {
                console.log('Password does not match');
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }
            
            console.log('Password matches, login successful');
            
            // Update last login time and login count
            db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?',
                [user.id],
                (err) => {
                    if (err) {
                        console.error('Error updating login info:', err.message);
                    }
                }
            );
            
            // Set session
            req.session.userId = user.id;
            req.session.isAdmin = user.is_admin === 1;
            
            console.log('Session set:', req.session);
            
            res.json({ 
                success: true, 
                message: 'Login successful',
                isAdmin: user.is_admin === 1
            });
        });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error logging out' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            isLoggedIn: true,
            isAdmin: req.session.isAdmin || false
        });
    } else {
        res.json({
            success: true,
            isLoggedIn: false,
            isAdmin: false
        });
    }
});

// Get user profile data
app.get('/api/user/profile', requireAuth, (req, res) => {
    db.get('SELECT id, name, email, created_at, last_login, login_count FROM users WHERE id = ?', 
        [req.session.userId], (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            res.json({
                success: true,
                user
            });
        }
    );
});

// Admin routes
app.get('/api/admin/users', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    
    let query = 'SELECT id, name, email, created_at, last_login, login_count FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    
    const params = [];
    
    if (search) {
        query += ' WHERE name LIKE ? OR email LIKE ?';
        countQuery += ' WHERE name LIKE ? OR email LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    db.get(countQuery, search ? [`%${search}%`, `%${search}%`] : [], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        const total = row.total;
        
        db.all(query, params, (err, users) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            res.json({
                success: true,
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        });
    });
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
    db.get('SELECT COUNT(*) as total FROM users', [], (err, totalRow) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        db.get('SELECT COUNT(*) as active FROM users WHERE last_login >= datetime("now", "-1 day")', [], (err, activeRow) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error' 
                });
            }
            
            db.get('SELECT COUNT(*) as new_users FROM users WHERE created_at >= datetime("now", "-7 day")', [], (err, newRow) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }
                
                res.json({
                    success: true,
                    stats: {
                        totalUsers: totalRow.total,
                        activeToday: activeRow.active,
                        newThisWeek: newRow.new_users
                    }
                });
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Close database connection on process exit
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
}); 