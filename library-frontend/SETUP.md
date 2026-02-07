# Complete Setup Guide - LibraryMS

This guide will walk you through setting up both the Django backend and Next.js frontend.

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

## 🔧 Backend Setup (Django)

### 1. Install Dependencies

```bash
# Install Django and required packages
pip install django djangorestframework djangorestframework-simplejwt django-filter django-cors-headers mysqlclient python-dotenv
```

### 2. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Variables

Create a `.env` file in your LMS project root:

```env
SECRET_KEY=your-secret-key-here
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

### 4. Run Migrations

```bash
cd LMS
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 6. Add Sample Data (Optional)

You can add sample data through the Django admin panel:

1. Start the server: `python manage.py runserver`
2. Go to `http://localhost:8000/admin/`
3. Login with your superuser credentials
4. Add:
   - Authors
   - Categories
   - Publishers
   - Books
   - Book Copies

### 7. Start Django Server

```bash
python manage.py runserver
```

Backend should now be running at `http://localhost:8000`

## 🎨 Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory

```bash
cd library-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The `.env.local` file should already exist with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend should now be running at `http://localhost:3000`

## 🚀 First Time Usage

### 1. Access the Application

Open your browser and go to `http://localhost:3000`

### 2. Register a New User

1. Click "Register" or go to `http://localhost:3000/register`
2. Fill in the registration form:
   - First Name
   - Last Name
   - Username
   - Email
   - Password
   - User Type (student/staff/external)
3. Click "Register"

### 3. Login

After registration, you'll be automatically logged in and redirected to the books page.

### 4. Browse Books

- Search for books by title, author, or ISBN
- Filter by category or language
- Click on a book to view details
- Reserve available books

### 5. View Your Books

- Click "My Books" in the navigation
- See your borrowed books and reservations
- Track due dates and fines

### 6. Admin Access (Staff Users Only)

To make a user an admin:

1. Go to Django admin: `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Go to Users → Select the user
4. Check "Staff status" and "Superuser status"
5. Save

Admin users can:
- Access the Admin Dashboard at `http://localhost:3000/admin`
- View system statistics
- Manage all books, users, issues, and reservations

## 📊 Sample Data Structure

### Create Sample Books

Here's an example of creating a book through Django admin:

**Book Details:**
- Title: "The Great Gatsby"
- ISBN: "9780743273565"
- Publication Year: 1925
- Language: English
- Description: "A novel by F. Scott Fitzgerald..."
- Authors: F. Scott Fitzgerald (create author first)
- Category: Fiction (create category first)
- Publisher: Scribner (create publisher first)

**Book Copies:**
After creating a book, add copies:
- Copy Number: "COPY-9780743273565-001"
- Condition: Good
- Is Available: Yes
- Location: "Shelf A-12"

## 🔐 API Testing

Test the API endpoints using tools like Postman or curl:

### Login
```bash
curl -X POST http://localhost:8000/api/v1/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Get Books (with auth token)
```bash
curl -X GET http://localhost:8000/api/v1/books/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🐛 Common Issues

### Issue: CORS Error

**Solution:** Ensure `django-cors-headers` is installed and configured in `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Issue: Database Connection Error

**Solution:**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure user has proper permissions

### Issue: JWT Token Expired

**Solution:**
- Logout and login again
- Clear browser localStorage
- Check token lifetime in `settings.py`

### Issue: Module Not Found (Frontend)

**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Migration Errors

**Solution:**
```bash
python manage.py migrate --run-syncdb
```

## 📝 Workflow Example

### Borrowing a Book (Admin Process)

1. User reserves a book through the frontend
2. Admin logs into Django admin (`http://localhost:8000/admin/`)
3. Admin goes to Circulation → Issues
4. Admin creates a new Issue:
   - User: Select the user
   - Book Copy: Select available copy
   - Due Date: Auto-calculated (14 days)
5. Book copy is marked as unavailable
6. User can see the issue in "My Books"

### Returning a Book

1. Admin goes to the Issue in Django admin
2. Check "Returned"
3. Enter "Return Date"
4. Save
5. Fine is automatically calculated if overdue
6. Book copy becomes available again

## 🎯 Next Steps

1. **Add More Books**: Populate your library with books
2. **Customize**: Modify colors, logos, and branding
3. **Test Features**: Try all functionalities
4. **Deploy**: Consider deploying to production

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs (browser and terminal)
2. Review Django admin logs
3. Verify API responses
4. Check database records

## 🎉 You're All Set!

Your library management system is now ready to use. Happy reading! 📖
