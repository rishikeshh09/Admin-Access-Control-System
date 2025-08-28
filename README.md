# Admin Access Control System

This project is an Amazon clone with user authentication and an admin dashboard using SQLite for data storage.

## Technologies Used
- Backend: Node.js, Express.js<br>
- Database: SQLite with sqlite3 driver<br>
- Authentication: bcrypt, express-session<br>
- Frontend: HTML5, CSS3, JavaScript (ES6+)<br>
- UI Components: Custom CSS, Font Awesome for icons<br>
- API Architecture: RESTful API endpoints<br>

## Authentication Flow
- Users register with email/password <br>
- Passwords are securely hashed with bcrypt<br>
- Login creates a session stored in SQLite<br>
- Navigation dynamically changes based on login status<br>
- Admin users get additional access<br>

## Features

- User registration and login
- Session management with SQLite
- Admin dashboard to view user information
- Responsive design
- Password hashing with bcrypt
- User activity tracking (last login, login count)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd amazon-clone
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev
```

## Default Admin Account

- Email: admin@example.com
- Password: admin123

## Project Structure

- `/public` - Static assets (HTML, CSS, client-side JS, images)
- `server.js` - Express server and API endpoints
- `amazon.db` - SQLite database file
- `sessions.db` - SQLite session store

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `POST /api/logout` - Logout a user

### Admin
- `GET /api/admin/users` - Get list of users (paginated)
- `GET /api/admin/stats` - Get user statistics

## Security Features

- Password hashing with bcrypt
- Session management
- CSRF protection
- Input validation
- Authentication middleware
- Admin access control
