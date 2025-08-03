# LinkedIn Clone - JWT Authentication

A mini LinkedIn-like community platform with JWT authentication and user management.

## Features Implemented

- ✅ User Registration (First Name, Last Name, Email, Password)
- ✅ User Login (Email, Password)
- ✅ JWT Authentication with Access & Refresh Tokens
- ✅ Automatic Token Refresh
- ✅ Secure Token Storage
- ✅ Clean LinkedIn-style UI
- ✅ Frontend-Backend Connection

## Setup Instructions

### Backend (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend-django
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

   Backend will run on: http://localhost:8000

### Frontend (Angular)

1. **Navigate to frontend directory:**
   ```bash
   cd linkedin-clone-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Angular server:**
   ```bash
   ng serve
   ```

   Frontend will run on: http://localhost:4200

## API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

## JWT Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

- **Access Token**: Short-lived token (60 minutes) for API requests
- **Refresh Token**: Long-lived token (7 days) for getting new access tokens
- **Automatic Refresh**: The frontend automatically refreshes tokens when they expire
- **Secure Storage**: Tokens are stored in localStorage with proper security measures

## Register Form Fields

- First Name (required)
- Last Name (required)
- Email (required)
- Password (required)

The system automatically generates a username from the email address.

## Login Form Fields

- Email (required)
- Password (required)

## Usage

1. Open http://localhost:4200 in your browser
2. Click "Sign Up" button in the navbar to register
3. Or click "Sign In" to login with existing credentials
4. Fill in the respective forms
5. You'll be automatically logged in after successful authentication
6. The navbar will show your name and a logout button when logged in 