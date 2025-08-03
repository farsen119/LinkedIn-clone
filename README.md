# 🚀 LinkedIn Clone - Full Stack Application

A modern LinkedIn-like community platform built with **Angular 17+** (frontend) and **Django** (backend), featuring user authentication, social networking, and content sharing capabilities.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🔐 API Endpoints](#-api-endpoints)
- [🎨 UI/UX Features](#-uiux-features)
- [🛡️ Security](#-security)
- [📊 Database](#-database)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔐 **Authentication & User Management**
- **User Registration**: First name, last name, email, password, profile photo
- **JWT Authentication**: Access tokens and refresh tokens
- **Profile Management**: Bio, profile photo, user information
- **Secure Login/Logout**: Token-based authentication

### 📝 **Social Networking**
- **Public Post Feed**: Create, read, and display posts
- **Media Support**: Text and image posts
- **Like System**: Like/unlike posts with real-time counters
- **Comment System**: Add, view, and delete comments
- **User Profiles**: View user profiles with their posts

### 🎨 **User Interface**
- **LinkedIn-Style Design**: Professional and modern UI
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Conditional Rendering**: Different views for logged-in/logged-out users
- **Profile Popup**: Quick access to user information
- **Real-time Updates**: Dynamic content without page refresh

### 📱 **Advanced Features**
- **IST Timezone**: All timestamps in Indian Standard Time
- **Image Upload**: Profile photos and post images
- **Post Management**: Create, view, and delete posts
- **User-specific Content**: Personal feed and profile posts
- **Professional Layout**: LinkedIn-inspired design elements

## 🛠️ Tech Stack

### **Frontend (Angular 17+)**
- **Framework**: Angular 17+ with Standalone Components
- **Routing**: Angular Router with lazy loading
- **HTTP Client**: Angular HttpClient with interceptors
- **Forms**: Reactive Forms with validation
- **Styling**: SCSS with modern CSS features
- **Icons**: Font Awesome for professional icons
- **State Management**: Services with RxJS observables

### **Backend (Django)**
- **Framework**: Django 4.2.7 with Django REST Framework
- **Authentication**: JWT with Simple JWT
- **Database**: SQLite (development) / MySQL (production ready)
- **File Upload**: Pillow for image processing
- **CORS**: django-cors-headers for cross-origin requests
- **Timezone**: pytz for IST timezone handling

### **Database**
- **Development**: SQLite3
- **Production**: MySQL (configured)
- **Models**: User profiles, posts, comments, likes
- **Relationships**: Foreign keys and many-to-many relationships

## 📁 Project Structure

```
linkdn-clone/
├── 📁 backend-django/                 # Django Backend
│   ├── 📁 api/                        # User authentication app
│   │   ├── models.py                  # User Profile model
│   │   ├── views.py                   # Auth views (register, login, profile)
│   │   ├── serializers.py             # User data serialization
│   │   └── urls.py                    # API routing
│   ├── 📁 post/                       # Posts and comments app
│   │   ├── models.py                  # Post and Comment models
│   │   ├── views.py                   # Post views (CRUD, likes, comments)
│   │   ├── serializers.py             # Post data serialization
│   │   └── urls.py                    # Post API routing
│   ├── 📁 linkedin/                   # Django project settings
│   │   ├── settings.py                # Project configuration
│   │   └── urls.py                    # Main URL routing
│   ├── requirements.txt               # Python dependencies
│   └── manage.py                      # Django management
│
├── 📁 linkedin-clone-frontend/        # Angular Frontend
│   ├── 📁 src/app/
│   │   ├── 📁 pages/                  # Main application pages
│   │   │   ├── home/                  # Home page with post feed
│   │   │   ├── login/                 # User login page
│   │   │   ├── register/              # User registration page
│   │   │   ├── profile/               # User profile page
│   │   │   └── post/                  # Post component (embedded)
│   │   ├── 📁 components/             # Reusable components
│   │   │   └── navbar/                # Navigation bar
│   │   ├── 📁 services/               # Angular services
│   │   │   ├── auth.service.ts        # Authentication service
│   │   │   └── post.service.ts        # Post management service
│   │   ├── 📁 interceptors/           # HTTP interceptors
│   │   └── app.routes.ts              # Application routing
│   ├── package.json                   # Node.js dependencies
│   └── angular.json                   # Angular configuration
│
└── README.md                          # This file
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (for production) or SQLite (for development)

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd linkdn-clone
```

### **2. Backend Setup**
```bash
# Navigate to backend
cd backend-django

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### **3. Frontend Setup**
```bash
# Navigate to frontend
cd linkedin-clone-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### **4. Access the Application**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## ⚙️ Installation

### **Detailed Backend Installation**

1. **Python Environment Setup**
```bash
cd backend-django
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Database Setup**
```bash
# For SQLite (default)
python manage.py migrate

# For MySQL (optional)
# Update settings.py with MySQL credentials
python manage.py migrate
```

4. **Create Admin User**
```bash
python manage.py createsuperuser
```

### **Detailed Frontend Installation**

1. **Node.js Setup**
```bash
cd linkedin-clone-frontend
npm install
```

2. **Environment Configuration**
```bash
# Update src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

3. **Start Development Server**
```bash
npm start
```

## 🔧 Configuration

### **Backend Configuration**

**Database Settings** (`backend-django/linkedin/settings.py`):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # or mysql
        'NAME': 'db.sqlite3',  # or your database name
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

**JWT Settings**:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### **Frontend Configuration**

**Environment Variables** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

## 📱 Usage

### **User Registration**
1. Navigate to `/register`
2. Fill in: First Name, Last Name, Email, Password, Profile Photo
3. Click "Sign Up"
4. Redirected to login page

### **User Login**
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Access authenticated features

### **Creating Posts**
1. Log in to your account
2. On the home page, use the post creation form
3. Add text content and optional image
4. Click "Post"
5. Post appears in the feed

### **Interacting with Posts**
- **Like**: Click the like button on any post
- **Comment**: Click comment button and add your comment
- **View Profile**: Click on user names to view profiles
- **Delete**: Delete your own posts from your profile

### **Profile Management**
1. Click profile photo in navbar
2. View profile popup with user info
3. Click "View Profile" for full profile page
4. Edit bio and view your posts

## 🔐 API Endpoints

### **Authentication**
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/token/refresh/` - Refresh JWT token
- `GET /api/user/` - Get current user info
- `PUT /api/user/profile/` - Update user profile

### **Posts**
- `GET /api/posts/` - Get all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/user/<id>/` - Get user's posts
- `DELETE /api/posts/<id>/delete/` - Delete post

### **Interactions**
- `POST /api/posts/<id>/like/` - Like/unlike post
- `POST /api/posts/<id>/comment/` - Add comment
- `DELETE /api/posts/<id>/comment/<comment_id>/` - Delete comment

## 🎨 UI/UX Features

### **Design System**
- **LinkedIn-Inspired**: Professional color scheme and layout
- **Responsive Design**: Mobile-first approach
- **Modern Components**: Cards, modals, dropdowns
- **Smooth Animations**: Hover effects and transitions

### **User Experience**
- **Conditional Rendering**: Different views for authenticated users
- **Real-time Updates**: Dynamic content without page refresh
- **Intuitive Navigation**: Clear navigation structure
- **Professional Layout**: Sidebar, main feed, and right panel

### **Visual Elements**
- **Profile Photos**: Circular avatars with fallback initials
- **Post Cards**: Clean, organized post display
- **Action Buttons**: Like, comment, share functionality
- **Loading States**: User feedback during operations

## 🛡️ Security

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Django's built-in password security
- **Token Refresh**: Automatic token renewal
- **CORS Protection**: Cross-origin request security

### **Data Protection**
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Django ORM protection
- **XSS Protection**: Angular's built-in XSS protection
- **File Upload Security**: Image validation and processing

### **API Security**
- **Authentication Required**: Protected endpoints
- **Permission Checks**: User-specific data access
- **Rate Limiting**: Built-in Django protection
- **HTTPS Ready**: Production-ready security

## 📊 Database

### **Models**

**User Profile** (`api/models.py`):
```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/')
    created_at = models.DateTimeField(auto_now_add=True)
```

**Post** (`post/models.py`):
```python
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    image = models.ImageField(upload_to='post_images/')
    likes = models.ManyToManyField(User, related_name='liked_posts')
    created_at = models.DateTimeField(auto_now_add=True)
```

**Comment** (`post/models.py`):
```python
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
```

### **Database Features**
- **Relationships**: Foreign keys and many-to-many
- **Indexing**: Optimized for performance
- **Migrations**: Version-controlled schema changes
- **Backup Ready**: Easy data export/import

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- **Python**: Follow PEP 8 guidelines
- **TypeScript**: Use strict typing
- **Angular**: Follow Angular style guide
- **Django**: Follow Django best practices

### **Testing**
```bash
# Backend tests
python manage.py test

# Frontend tests
ng test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status

### **✅ Completed Features**
- User authentication (register/login)
- JWT token management
- User profiles with photos
- Post creation and display
- Like and comment system
- LinkedIn-style UI
- Responsive design
- IST timezone support

### **🚧 Future Enhancements**
- Real-time notifications
- Advanced search functionality
- Connection/following system
- Message system
- Job posting features
- Analytics dashboard

---

**Built with ❤️ using Angular 17+ and Django**

*For support and questions, please open an issue in the repository.* 