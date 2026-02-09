# LMS_assignment
# 📚 LibraryMS - Complete Library Management System

A modern, full-stack library management system built with Django REST Framework (backend) and Next.js (frontend). Manage books, users, issues, and reservations with a beautiful, responsive interface.

![LibraryMS](https://img.shields.io/badge/Django-5.2-green?style=flat&logo=django)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 📖 **Book Management** - Add, edit, delete, and search books
- 👥 **User Management** - Student, staff, and external member accounts
- 📋 **Issue Tracking** - Track borrowed books with due dates
- 🔖 **Reservations** - Reserve books that are currently unavailable
- 💰 **Fine Calculation** - Automatic fine calculation for overdue books
- 📊 **Admin Dashboard** - Statistics and system management

### User Features
- 🔍 **Advanced Search** - Search by title, author, ISBN
- 🏷️ **Filtering** - Filter by category, language, availability
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔔 **Status Tracking** - Real-time availability status
- 📅 **Due Date Tracking** - Visual indicators for overdue books

### Admin Features
- 📈 **Statistics Dashboard** - View system metrics
- 👨‍💼 **User Management** - Manage all user accounts
- 📚 **Book Copies** - Track individual book copies
- ⚙️ **Circulation Control** - Issue and return books
- 🎯 **Reservation Management** - Approve/cancel reservations

---

## 🛠️ Tech Stack

### Backend (Django)
- **Framework:** Django 5.2
- **API:** Django REST Framework 3.14+
- **Authentication:** JWT (Simple JWT)
- **Database:** MySQL 8.0
- **CORS:** django-cors-headers
- **Filtering:** django-filter

### Frontend (Next.js)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Icons:** Lucide React
- **Date Handling:** date-fns

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                  Next.js 14 Frontend                     │
│                   (Port: 3000)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests (JWT Auth)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Django REST Framework API                   │
│                   (Port: 8000)                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Apps: books | circulation | accounts | api      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ ORM Queries
                     │
┌────────────────────▼────────────────────────────────────┐
│                  MySQL Database                          │
│   Tables: User | Book | BookCopy | Issue | Reservation │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.10 or higher
- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### 2. Backend Setup (Django)

#### 2.1 Create Virtual Environment

```bash
cd LMS
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

#### 2.2 Install Dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt
pip install django-filter django-cors-headers mysqlclient python-dotenv
```

#### 2.3 Configure Database

Create a MySQL database:

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2.4 Environment Variables

Create `.env` file in the `LMS` directory:

```env
SECRET_KEY=your-secret-key-here-generate-a-long-random-string
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

#### 2.5 Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.6 Create Superuser

```bash
python manage.py createsuperuser
```

#### 2.7 Start Django Server

```bash
python manage.py runserver
```

Backend will be running at: **http://localhost:8000**

---

### 3. Frontend Setup (Next.js)

#### 3.1 Navigate to Frontend Directory

```bash
cd library-frontend
```

#### 3.2 Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3.3 Environment Variables

The `.env.local` file should already exist with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### 3.4 Start Development Server

```bash
npm run dev
# or
yarn dev
```

Frontend will be running at: **http://localhost:3000**

---

## ⚙️ Configuration

### Django Settings (LMS/settings.py)

Key configurations already included:

```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
```

### Next.js Configuration

Update API URL for production in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

---

## 📖 Usage

### First Time Setup

1. **Start both servers:**
   - Backend: `python manage.py runserver`
   - Frontend: `npm run dev`

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Django Admin: http://localhost:8000/admin
   - API Browser: http://localhost:8000/api/v1

3. **Create sample data:**
   - Login to Django admin (http://localhost:8000/admin)
   - Add Authors, Categories, Publishers
   - Add Books
   - Add Book Copies

### User Workflows

#### Regular User:
1. **Register** → Create account
2. **Login** → Access system
3. **Browse Books** → Search and filter
4. **Reserve Book** → Click book → Reserve
5. **View My Books** → Track borrowed books and reservations

#### Admin User:
1. **Access Admin Dashboard** → View statistics
2. **Manage Books** → Add/edit/delete books
3. **Issue Books** → Create issues for users
4. **Process Returns** → Mark books as returned
5. **Manage Reservations** → Approve/cancel reservations

---

## 🔌 API Documentation

### Authentication

#### Login
```http
POST /api/v1/login/
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Refresh Token
```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Books

#### List All Books
```http
GET /api/v1/books/
Authorization: Bearer {access_token}

Response:
[
  {
    "id": 1,
    "title": "Book Title",
    "isbn": "1234567890",
    "authors": [...],
    "category": {...},
    "available_copies_count": 3,
    "total_copies_count": 5
  }
]
```

#### Get Book Details
```http
GET /api/v1/books/{id}/
Authorization: Bearer {access_token}
```

#### Get Book Copies
```http
GET /api/v1/books/{id}/copies/
Authorization: Bearer {access_token}
```

### Issues

#### My Issues
```http
GET /api/v1/issues/my_issues/
Authorization: Bearer {access_token}
```

#### Overdue Books (Admin)
```http
GET /api/v1/issues/overdue/
Authorization: Bearer {access_token}
```

#### Return Book (Admin)
```http
POST /api/v1/issues/{id}/return_book/
Authorization: Bearer {access_token}
```

### Reservations

#### Create Reservation
```http
POST /api/v1/reservations/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user": 1,
  "book": 1
}
```

#### My Reservations
```http
GET /api/v1/reservations/my_reservations/
Authorization: Bearer {access_token}
```

#### Cancel Reservation
```http
POST /api/v1/reservations/{id}/cancel/
Authorization: Bearer {access_token}
```

### Users

#### Register
```http
POST /api/v1/users/
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "student"
}
```

#### Get Current User
```http
GET /api/v1/users/me/
Authorization: Bearer {access_token}
```

---

## 📁 Project Structure

```
library-management-system/
│
├── LMS/                          # Django Backend
│   ├── LMS/                      # Project settings
│   │   ├── settings.py           # Main settings
│   │   ├── urls.py               # URL configuration
│   │   └── wsgi.py
│   │
│   ├── accounts/                 # User management app
│   │   ├── models.py             # Custom User model
│   │   ├── serializers.py        # User serializers
│   │   └── admin.py
│   │
│   ├── books/                    # Books app
│   │   ├── models.py             # Book, Author, Category, Publisher, BookCopy
│   │   ├── serializers.py        # Book serializers
│   │   └── admin.py
│   │
│   ├── circulation/              # Circulation app
│   │   ├── models.py             # Issue, Reservation models
│   │   ├── serializers.py        # Circulation serializers
│   │   └── admin.py
│   │
│   ├── api/                      # API app
│   │   ├── views.py              # API viewsets
│   │   └── urls.py               # API routes
│   │
│   ├── manage.py
│   └── .env                      # Environment variables
│
└── library-frontend/             # Next.js Frontend
    ├── app/                      # Next.js app directory
    │   ├── page.tsx              # Landing page
    │   ├── login/                # Login page
    │   ├── register/             # Registration page
    │   ├── books/                # Books listing
    │   ├── my-books/             # User dashboard
    │   ├── admin/                # Admin dashboard
    │   ├── layout.tsx            # Root layout
    │   └── globals.css           # Global styles
    │
    ├── components/               # React components
    │   ├── ui/                   # UI components
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   └── Badge.tsx
    │   │
    │   ├── layout/               # Layout components
    │   │   ├── Navbar.tsx
    │   │   └── PageHeader.tsx
    │   │
    │   ├── auth/                 # Auth components
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   │
    │   ├── books/                # Book components
    │   │   ├── BookCard.tsx
    │   │   ├── BookDetailModal.tsx
    │   │   └── BookFilters.tsx
    │   │
    │   └── dashboard/            # Dashboard components
    │       ├── IssueCard.tsx
    │       └── ReservationCard.tsx
    │
    ├── lib/                      # Utilities
    │   ├── api.ts                # Axios API client
    │   └── store.ts              # Zustand store
    │
    ├── types/                    # TypeScript types
    │   └── index.ts
    │
    ├── utils/                    # Helper functions
    │   └── helpers.ts
    │
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── .env.local                # Environment variables
```

---

## 📸 Screenshots

### Landing Page
Beautiful hero section with feature highlights

### Books Page
Browse and search books with advanced filters

### Book Details
Detailed book information with reservation option

### My Books Dashboard
Track borrowed books and reservations

### Admin Dashboard
System statistics and management options

---

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem:** Browser shows CORS policy errors

**Solution:**
```python
# In Django settings.py, ensure:
INSTALLED_APPS = [..., 'corsheaders']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
```

#### 2. Database Connection Error

**Problem:** Can't connect to MySQL

**Solution:**
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists
- Check user permissions

#### 3. Books Show "Out of Stock"

**Problem:** Books show unavailable despite having copies

**Solution:**
Ensure serializer uses `SerializerMethodField`:
```python
available_copies_count = serializers.SerializerMethodField()
total_copies_count = serializers.SerializerMethodField()

def get_available_copies_count(self, obj):
    return obj.copies.filter(is_available=True).count()
```

#### 4. JWT Token Expired

**Problem:** Getting 401 Unauthorized errors

**Solution:**
- Logout and login again
- Clear browser localStorage
- Check token lifetime in settings

#### 5. Frontend Not Loading

**Problem:** White screen or errors

**Solution:**
```bash
# Delete and reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Debug Mode

Enable detailed error messages:

**Django:**
```python
# settings.py
DEBUG = True
```

**Next.js:**
Check browser console (F12) for errors

---

## 🧪 Testing

### Backend Testing

```bash
cd LMS
python manage.py test
```

### API Testing

Use tools like:
- **Postman** - Import API collection
- **cURL** - Command line testing
- **Django REST Browser** - http://localhost:8000/api/v1

Example cURL:
```bash
# Login
curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Books
curl -X GET http://localhost:8000/api/v1/books/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Deployment

### Backend Deployment

1. **Update settings for production:**

```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

2. **Collect static files:**

```bash
python manage.py collectstatic
```

3. **Use production server (Gunicorn):**

```bash
pip install gunicorn
gunicorn LMS.wsgi:application
```

### Frontend Deployment

1. **Build for production:**

```bash
npm run build
```

2. **Start production server:**

```bash
npm start
```

3. **Deploy to Vercel/Netlify:**

```bash
# Connect to your Git repository
# Platform will auto-deploy on push
```

---

### Coding Standards

- **Python:** Follow PEP 8
- **TypeScript:** Use ESLint configuration
- **Commits:** Use conventional commits format

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📊 Database Schema

```
User
├── id (PK)
├── username
├── email
├── user_type (student/staff/external)
└── ...

Book
├── id (PK)
├── title
├── isbn
├── publication_year
├── category (FK → Category)
├── publisher (FK → Publisher)
└── authors (M2M → Author)

BookCopy
├── id (PK)
├── book (FK → Book)
├── copy_number
├── is_available
└── condition

Issue
├── id (PK)
├── user (FK → User)
├── book_copy (FK → BookCopy)
├── issue_date
├── due_date
├── return_date
├── returned
└── fine_amount

Reservation
├── id (PK)
├── user (FK → User)
├── book (FK → Book)
├── created_at
├── status
└── expiry_date
```

---

## 🔐 Security

- JWT token-based authentication
- Password hashing with Django's default hasher
- CORS protection
- CSRF protection
- SQL injection prevention (Django ORM)
- XSS protection
- Rate limiting (recommended for production)

---

## ⚡ Performance Tips

1. **Database Indexing:**
   - Indexes on frequently queried fields (title, ISBN)
   - Optimized queries with `select_related` and `prefetch_related`

2. **Caching:**
   - Consider Redis for session caching
   - Cache frequently accessed data

3. **Frontend Optimization:**
   - Next.js automatic code splitting
   - Image optimization with Next.js Image component
   - Lazy loading for better performance

---
