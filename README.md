# Amazon Clone with SQLite Authentication

This project is an Amazon clone with user authentication and an admin dashboard using SQLite for data storage.

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

4. Access the application:
- Main site: http://localhost:3000
- Login page: http://localhost:3000/login.html
- Registration page: http://localhost:3000/register.html
- Admin dashboard: http://localhost:3000/admin.html (requires admin login)

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

## License

This project is for educational purposes only. 