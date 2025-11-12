# Admin Setup Guide

## Creating an Admin User

### Method 1: Using the Script (Recommended)

1. Make sure your MongoDB is running and the backend `.env` file is configured

2. Run the admin creation script:
```bash
cd backend
npm run create-admin
```

3. The script will create an admin user with these default credentials:
   - **Email:** admin@petadoption.com
   - **Password:** Admin123
   - **Role:** admin

### Method 2: Custom Admin Credentials

You can customize the admin credentials by setting environment variables in your `backend/.env` file:

```env
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_NAME=Your Admin Name
```

Then run:
```bash
cd backend
npm run create-admin
```

### Method 3: Manually via MongoDB

If you prefer to create an admin manually, you can update an existing user's role in MongoDB:

```javascript
// Connect to MongoDB
use pet-adoption

// Update a user to admin role
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Accessing the Admin Panel

### Frontend URL
Once you have an admin account, access the admin panel at:

**http://localhost:5173/admin**

(Or whatever port your frontend is running on)

### Login Steps

1. Go to **http://localhost:5173/login**
2. Enter your admin credentials:
   - Email: `admin@petadoption.com`
   - Password: `Admin123`
3. After successful login, you'll see an "Admin" link in the navigation bar
4. Click "Admin" or navigate directly to **http://localhost:5173/admin**

---

## Admin Features

Once logged in as admin, you can:

### Pet Management
- ✅ Create new pets
- ✅ Edit existing pets
- ✅ Delete pets (if no applications exist)
- ✅ Update pet status (available, pending, adopted)

### Application Management
- ✅ View all adoption applications
- ✅ Filter applications by status
- ✅ Approve applications (automatically marks pet as adopted)
- ✅ Reject applications

---

## Security Notes

⚠️ **Important Security Recommendations:**

1. **Change Default Password:** Always change the default admin password after first login
2. **Use Strong Passwords:** Use passwords with at least 8 characters, including uppercase, lowercase, and numbers
3. **Secure Environment Variables:** Never commit your `.env` file with real credentials to version control
4. **Production Setup:** In production, use strong, randomly generated passwords and store them securely

---

## Troubleshooting

### "Admin user already exists"
If you see this message, an admin with that email already exists. You can:
- Login with the existing credentials
- Use a different email in your `.env` file
- Manually update the user's role in MongoDB

### Cannot access /admin route
Make sure:
1. You're logged in with an admin account
2. The user's role is set to "admin" in the database
3. The JWT token is valid and not expired
4. The frontend is running on the correct port

### Script fails to connect to MongoDB
Ensure:
1. MongoDB is running
2. The `MONGODB_URI` in your `.env` file is correct
3. You have the necessary permissions to create users

---

## API Endpoints for Admin

Admin users have access to these additional endpoints:

**Pets:**
- POST `/api/pets` - Create pet
- PUT `/api/pets/:id` - Update pet
- DELETE `/api/pets/:id` - Delete pet
- PATCH `/api/pets/:id/status` - Update pet status

**Applications:**
- GET `/api/applications` - Get all applications
- PATCH `/api/applications/:id/status` - Approve/reject application

See `API_DOCUMENTATION.md` for complete API reference.
