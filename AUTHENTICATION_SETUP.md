# Authentication Integration Summary

## Changes Made

### 1. Environment Configuration
- **File**: `.env`
- **Added**: `VITE_API_URL=http://localhost:8080/api/v1`
- **Purpose**: Set the backend API base URL for the frontend

### 2. Cookie-based Authentication
- **Package Added**: `js-cookie` for cookie management
- **Files Updated**:
  - `src/signin.jsx` - Now saves JWT token in cookies instead of sessionStorage
  - `src/signup.jsx` - Connected to backend `/auth/register` endpoint
  - `src/vos ferme.jsx` - Updated to use cookie-based auth
  - `src/users-managment.jsx` - Updated to use cookie-based auth
  - `src/Tableau de Bord Boumerdas.jsx` - Updated to use cookie-based auth

### 3. Authentication Utilities
- **New File**: `src/utils/auth.js`
- **Functions**:
  - `getAuthToken()` - Get JWT token from cookies
  - `getUser()` - Get user data from cookies
  - `isAuthenticated()` - Check if user is logged in
  - `logout()` - Remove all auth cookies
  - `getAuthHeaders()` - Get headers with Authorization Bearer token

### 4. API Integration
- **Login Endpoint**: `POST /api/v1/auth/login`
  - Accepts: `{ email, password }`
  - Returns: `{ token, user }`
  - Frontend saves token in cookies with 7-day expiration

- **Register Endpoint**: `POST /api/v1/auth/register`
  - Accepts: `{ name, email, password, role }`
  - Frontend redirects to login page on success

### 5. Security Improvements
- **Cookie Settings**:
  - `expires: 7` - 7-day expiration
  - `secure: false` - Allow over HTTP for development
  - `sameSite: 'lax'` - CSRF protection

## Backend API Endpoints Available

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Protected Routes (Require Authorization: Bearer <token>)
- `GET /api/v1/users/{id}` - Get user details
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/{id}/farms` - Get user's farms
- `POST /api/v1/farms` - Create farm
- `GET /api/v1/farms/{id}` - Get farm details
- `PUT /api/v1/farms/{id}` - Update farm
- `DELETE /api/v1/farms/{id}` - Delete farm

## How to Use

### Frontend (http://localhost:5174)
1. Visit the signin page
2. Enter credentials and login
3. JWT token will be saved in cookies automatically
4. All subsequent API calls will include the Authorization header

### Backend (http://localhost:8080)
- API documentation: http://localhost:8080/api/v1/swagger/index.html
- Health check: http://localhost:8080/api/v1/

### Testing Authentication
```javascript
// In browser console, check if user is authenticated
import { isAuthenticated, getUser, getAuthToken } from './utils/auth.js';

console.log('Authenticated:', isAuthenticated());
console.log('User:', getUser());
console.log('Token:', getAuthToken());
```

## Next Steps
1. Update other components that make API calls to use `getAuthHeaders()`
2. Add logout functionality to clear cookies
3. Add route protection/guards for authenticated routes
4. Implement automatic token refresh if needed
5. Add error handling for expired tokens
