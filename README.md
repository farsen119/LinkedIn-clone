# LinkedIn Clone - Register Functionality

A mini LinkedIn-like community platform with user registration functionality.

## Features Implemented

- ✅ User Registration (First Name, Last Name, Email, Password)
- ✅ User Login (Email, Password)
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
- `POST /api/auth/logout/` - User logout

## Register Form Fields

- First Name (required)
- Last Name (required)
- Email (required)
- Password (required)

The system automatically generates a username from the email address.

## Usage

1. Open http://localhost:4200 in your browser
2. Click "Sign Up" button in the navbar
3. Fill in the registration form
4. Submit to create your account
5. You'll be automatically logged in after successful registration 