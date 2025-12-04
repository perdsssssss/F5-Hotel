# F5 Hotel Booking System - MongoDB Integration

## Overview
This hotel booking system is now connected to MongoDB Atlas cloud database. User registration and login are fully integrated with the backend API.

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account (already configured)

## Installation Steps

### 1. Install Dependencies
Open PowerShell in the project directory and run:
```powershell
npm install
```

This will install:
- express - Web server framework
- mongoose - MongoDB object modeling
- bcryptjs - Password hashing
- jsonwebtoken - Authentication tokens
- dotenv - Environment variables
- cors - Cross-origin resource sharing
- express-validator - Input validation

### 2. Environment Configuration
The `.env` file contains your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://johncalub393_db_user:4l1GoHvpLM1BQqDx@forensicfive.gqitql4.mongodb.net/f5hotel?retryWrites=true&w=majority&appName=ForensicFive
```

**Security Note:** Never commit the `.env` file to public repositories!

### 3. Start the Server
Run the server with:
```powershell
npm start
```

Or for development with auto-restart:
```powershell
npm run dev
```

You should see:
```
✓ Connected to MongoDB Atlas successfully
✓ Database: ForensicFive cluster
✓ Server running on http://localhost:3000
✓ Frontend: http://localhost:3000/home.html
✓ API: http://localhost:3000/api/auth
```

## How It Works

### Backend Structure
```
f5-hotel/
├── server.js              # Main server file
├── .env                   # Environment variables (MongoDB URI)
├── package.json           # Dependencies
├── models/
│   └── User.js           # User schema and methods
├── routes/
│   └── auth.js           # Authentication endpoints
└── [existing frontend files]
```

### API Endpoints

#### 1. User Signup
- **URL:** `POST /api/auth/signup`
- **Body:**
```json
{
  "firstName": "John",
  "middleName": "M",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "email": "john@example.com",
  "contactNumber": "1234567890",
  "username": "johndoe",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### 2. User Login
- **URL:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### 3. Get User Profile
- **URL:** `GET /api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile data

### Database Schema

**User Collection:**
```javascript
{
  firstName: String (required),
  middleName: String,
  lastName: String (required),
  dateOfBirth: Date (required),
  email: String (required, unique),
  contactNumber: String (required),
  username: String (required, unique),
  password: String (hashed, required),
  createdAt: Date,
  lastLogin: Date
}
```

### Security Features
✓ Password hashing with bcrypt (10 salt rounds)
✓ JWT token authentication (7-day expiration)
✓ Input validation with express-validator
✓ Unique email and username constraints
✓ Password minimum length (8 characters)
✓ Username minimum length (4 characters)

## Frontend Updates

### signup.js
- Now sends registration data to `/api/auth/signup`
- Stores JWT token in localStorage
- Shows error messages from server

### login.js
- Authenticates against `/api/auth/login`
- Stores JWT token and user data
- Validates credentials with MongoDB

## Testing the Application

1. **Start the server:**
   ```powershell
   npm start
   ```

2. **Open browser:**
   Navigate to `http://localhost:3000/signup.html`

3. **Register a new user:**
   Fill out the registration form

4. **Login:**
   Use your credentials at `http://localhost:3000/login.html`

5. **Check MongoDB:**
   View your data in MongoDB Atlas dashboard

## MongoDB Atlas Dashboard
- **Cluster:** ForensicFive
- **Database:** f5hotel
- **Collection:** users

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

### MongoDB connection error
- Verify internet connection
- Check MongoDB Atlas cluster is running
- Confirm credentials in `.env` file
- Whitelist your IP in MongoDB Atlas

### Frontend can't reach API
- Ensure server is running on port 3000
- Check browser console for CORS errors
- Verify API URL in `signup.js` and `login.js`

## Next Steps (Optional Enhancements)
- [ ] Add booking functionality
- [ ] Create room management system
- [ ] Implement password reset
- [ ] Add email verification
- [ ] Create admin dashboard
- [ ] Add booking history

## Support
For MongoDB Atlas issues, visit: https://www.mongodb.com/docs/atlas/

---
**Note:** Keep your MongoDB credentials secure and never share them publicly!
