# Pet Adoption API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Auth Required:** No
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```
- **Error Responses:**
  - 400: Validation error
  - 409: User already exists

#### Login
- **POST** `/auth/login`
- **Auth Required:** No
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```
- **Error Responses:**
  - 400: Missing credentials
  - 401: Invalid credentials

#### Get Current User
- **GET** `/auth/me`
- **Auth Required:** Yes
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```
- **Error Responses:**
  - 401: Invalid or missing token
  - 404: User not found

---

### Pets

#### Get All Pets
- **GET** `/pets`
- **Auth Required:** No
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `search` (optional): Search by name or breed
  - `species` (optional): Filter by species
  - `breed` (optional): Filter by breed
  - `age` (optional): Filter by age
- **Example:** `/pets?page=1&species=Dog&search=golden`
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "pets": [
      {
        "_id": "pet_id",
        "name": "Buddy",
        "species": "Dog",
        "breed": "Golden Retriever",
        "age": 3,
        "description": "Friendly and energetic dog",
        "photoUrl": "https://example.com/photo.jpg",
        "status": "available",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### Get Pet by ID
- **GET** `/pets/:id`
- **Auth Required:** No
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "pet": {
      "_id": "pet_id",
      "name": "Buddy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": 3,
      "description": "Friendly and energetic dog",
      "photoUrl": "https://example.com/photo.jpg",
      "status": "available",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```
- **Error Responses:**
  - 404: Pet not found

#### Create Pet (Admin Only)
- **POST** `/pets`
- **Auth Required:** Yes (Admin)
- **Body:**
```json
{
  "name": "Buddy",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 3,
  "description": "Friendly and energetic dog",
  "photoUrl": "https://example.com/photo.jpg"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "data": {
    "pet": { ... }
  }
}
```
- **Error Responses:**
  - 400: Validation error
  - 401: Not authenticated
  - 403: Not authorized (not admin)

#### Update Pet (Admin Only)
- **PUT** `/pets/:id`
- **Auth Required:** Yes (Admin)
- **Body:** (all fields optional)
```json
{
  "name": "Buddy Updated",
  "species": "Dog",
  "breed": "Golden Retriever",
  "age": 4,
  "description": "Updated description",
  "photoUrl": "https://example.com/new-photo.jpg"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "pet": { ... }
  }
}
```
- **Error Responses:**
  - 400: Validation error
  - 401: Not authenticated
  - 403: Not authorized
  - 404: Pet not found

#### Delete Pet (Admin Only)
- **DELETE** `/pets/:id`
- **Auth Required:** Yes (Admin)
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Pet deleted successfully"
  }
}
```
- **Error Responses:**
  - 400: Pet has existing applications
  - 401: Not authenticated
  - 403: Not authorized
  - 404: Pet not found

#### Update Pet Status (Admin Only)
- **PATCH** `/pets/:id/status`
- **Auth Required:** Yes (Admin)
- **Body:**
```json
{
  "status": "adopted"
}
```
- **Valid Status Values:** `available`, `pending`, `adopted`
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "pet": { ... }
  }
}
```
- **Error Responses:**
  - 400: Invalid status
  - 401: Not authenticated
  - 403: Not authorized
  - 404: Pet not found

---

### Applications

#### Create Application
- **POST** `/applications`
- **Auth Required:** Yes
- **Body:**
```json
{
  "petId": "pet_id_here"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "application_id",
      "user": { ... },
      "pet": { ... },
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```
- **Error Responses:**
  - 400: Pet not available or missing petId
  - 401: Not authenticated
  - 404: Pet not found
  - 409: Duplicate application

#### Get My Applications
- **GET** `/applications/my`
- **Auth Required:** Yes
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "pet": {
          "_id": "pet_id",
          "name": "Buddy",
          "species": "Dog",
          "breed": "Golden Retriever",
          "age": 3,
          "photoUrl": "https://example.com/photo.jpg"
        },
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```
- **Error Responses:**
  - 401: Not authenticated

#### Get All Applications (Admin Only)
- **GET** `/applications`
- **Auth Required:** Yes (Admin)
- **Query Parameters:**
  - `status` (optional): Filter by status (pending, approved, rejected)
- **Example:** `/applications?status=pending`
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "application_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "pet": { ... },
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```
- **Error Responses:**
  - 401: Not authenticated
  - 403: Not authorized

#### Update Application Status (Admin Only)
- **PATCH** `/applications/:id/status`
- **Auth Required:** Yes (Admin)
- **Body:**
```json
{
  "status": "approved"
}
```
- **Valid Status Values:** `approved`, `rejected`
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "application": { ... }
  }
}
```
- **Note:** When an application is approved, the associated pet's status is automatically updated to "adopted"
- **Error Responses:**
  - 400: Invalid status or application already processed
  - 401: Not authenticated
  - 403: Not authorized
  - 404: Application not found

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `USER_EXISTS` | User with email already exists |
| `MISSING_CREDENTIALS` | Email or password not provided |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `NO_TOKEN` | Authorization token not provided |
| `INVALID_TOKEN` | Token is invalid or expired |
| `TOKEN_EXPIRED` | Token has expired |
| `NOT_AUTHENTICATED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `USER_NOT_FOUND` | User not found |
| `PET_NOT_FOUND` | Pet not found |
| `PET_NOT_AVAILABLE` | Pet is not available for adoption |
| `HAS_APPLICATIONS` | Cannot delete pet with existing applications |
| `INVALID_STATUS` | Invalid status value |
| `APPLICATION_NOT_FOUND` | Application not found |
| `DUPLICATE_APPLICATION` | User already applied for this pet |
| `ALREADY_PROCESSED` | Application already approved or rejected |
| `DUPLICATE_ERROR` | Duplicate value for unique field |
| `NOT_FOUND` | Resource not found |
| `SERVER_ERROR` | Internal server error |

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
