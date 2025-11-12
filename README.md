# Pet Adoption Management System

A full-stack MERN application that enables users to browse pets available for adoption, submit adoption applications, and allows administrators to manage the pet inventory and adoption workflow.

## Features

### For Visitors
- Browse available pets with pagination
- Search pets by name or breed
- Filter pets by species, breed, and age
- View detailed pet information

### For Users
- User registration and authentication
- Apply for pet adoption
- View application status
- Track adoption history

### For Administrators
- Complete pet management (CRUD operations)
- Review and process adoption applications
- Update pet availability status
- View all applications with filtering

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18+
- React Router for navigation
- Axios for API requests
- Context API for state management
- CSS3 for styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sayamjn/pet
cd pet
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=24h
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Ruhe Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/pet-adoption |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `JWT_EXPIRE` | JWT token expiration time | 24h |
| `NODE_ENV` | Environment mode | development |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Overview

**Base URL:** `http://localhost:5000/api`

**Authentication Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

**Pet Endpoints:**
- `GET /pets` - Get all pets (public)
- `GET /pets/:id` - Get pet by ID (public)
- `POST /pets` - Create pet (admin only)
- `PUT /pets/:id` - Update pet (admin only)
- `DELETE /pets/:id` - Delete pet (admin only)
- `PATCH /pets/:id/status` - Update pet status (admin only)

**Application Endpoints:**
- `POST /applications` - Create application (authenticated)
- `GET /applications/my` - Get user's applications (authenticated)
- `GET /applications` - Get all applications (admin only)
- `PATCH /applications/:id/status` - Update application status (admin only)

### Postman Collection

Import the `postman_collection.json` file into Postman to test all API endpoints.

## Project Structure

```
pet-adoption-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── petController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PetCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │   ├── ApplyButton.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── PetList.jsx
│   │   │   ├── PetDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── accessibility.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── API_DOCUMENTATION.md
├── postman_collection.json
└── README.md
```

## User Roles

### User (Default)
- Browse and search pets
- Apply for pet adoption
- View own applications

### Admin
- All user permissions
- Create, update, and delete pets
- View all applications
- Approve or reject applications
- Update pet status

## Creating an Admin User

By default, all registered users have the "user" role. To create an admin user, you need to manually update the user's role in the database:

```javascript
// Using MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes on frontend and backend
- Input validation
- Error handling without exposing sensitive information

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Update `MONGODB_URI` with production database URL
4. Set `NODE_ENV=production`
5. Deploy using your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment

1. Update `VITE_API_URL` to point to production backend
2. Build the frontend: `npm run build`
3. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

### Recommended Platforms

**Backend:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Database:**
- MongoDB Atlas (recommended)
- Self-hosted MongoDB

## Testing

### Manual Testing

1. Start both backend and frontend servers
2. Register a new user account
3. Browse available pets
4. Apply for pet adoption
5. Create an admin user (see above)
6. Login as admin
7. Test pet management features
8. Test application approval/rejection

### API Testing

Use the provided Postman collection to test all API endpoints.

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Ensure port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Check for CORS issues in browser console

### Authentication issues
- Clear browser localStorage
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration time

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

