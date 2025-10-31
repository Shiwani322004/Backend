# Student Management System - API Endpoints with Dummy Data

**Base URL:** `http://localhost:8000/api`

## 🔐 Authentication Endpoints

### 1. Student Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "rollNumber": "2024001",
  "class": "12th",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "message": "Registration submitted for approval",
  "student": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "status": "pending"
  }
}
```

### 2. Student Login
**POST** `/auth/login/student`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "rollNumber": "2024001",
  "class": "12th",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Admin Login
**POST** `/auth/login/admin`

**Request Body:**
```json
{
  "email": "admin@sms.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "fullname": "System Administrator",
  "email": "admin@sms.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
**POST** `/auth/logout`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "redirect": "/"
}
```

## 👥 Student Management Endpoints (Admin Only)

### 5. Get All Students
**GET** `/students`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "fullname": "John Doe",
      "email": "john.doe@example.com",
      "rollNumber": "2024001",
      "class": "12th",
      "phone": "+1234567890",
      "status": "approved",
      "isActive": true,
      "attendance": [
        {
          "date": "2024-01-15T00:00:00.000Z",
          "status": "present"
        },
        {
          "date": "2024-01-16T00:00:00.000Z",
          "status": "absent"
        }
      ],
      "grades": [
        {
          "subject": "Mathematics",
          "marks": 85,
          "totalMarks": 100,
          "grade": "A",
          "date": "2024-01-10T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "fullname": "Jane Smith",
      "email": "jane.smith@example.com",
      "rollNumber": "2024002",
      "class": "11th",
      "phone": "+1234567891",
      "status": "approved",
      "isActive": true,
      "attendance": [
        {
          "date": "2024-01-15T00:00:00.000Z",
          "status": "present"
        }
      ],
      "grades": [
        {
          "subject": "Physics",
          "marks": 92,
          "totalMarks": 100,
          "grade": "A+",
          "date": "2024-01-12T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### 6. Get Pending Students
**GET** `/students/pending`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
      "fullname": "Mike Johnson",
      "email": "mike.johnson@example.com",
      "rollNumber": "2024003",
      "class": "10th",
      "phone": "+1234567892",
      "status": "pending",
      "createdAt": "2024-01-16T00:00:00.000Z"
    }
  ]
}
```

### 7. Update Student Status
**PUT** `/students/:id/status`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "fullname": "Mike Johnson",
    "email": "mike.johnson@example.com",
    "rollNumber": "2024003",
    "class": "10th",
    "status": "approved",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### 8. Delete Student
**DELETE** `/students/:id`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Student deleted"
}
```

### 9. Add Attendance
**POST** `/students/attendance`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "status": "present"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance added"
}
```

### 10. Add Grades
**POST** `/students/grades`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "studentId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "subject": "Chemistry",
  "marks": 88,
  "totalMarks": 100,
  "grade": "A"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Grades added"
}
```

## 👤 Student Profile Endpoints

### 11. Get Student Profile
**GET** `/profile`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "rollNumber": "2024001",
    "class": "12th",
    "phone": "+1234567890",
    "address": "123 Main St, City, State 12345",
    "dateOfBirth": "2006-05-15T00:00:00.000Z",
    "status": "approved",
    "attendance": [
      {
        "date": "2024-01-15T00:00:00.000Z",
        "status": "present"
      },
      {
        "date": "2024-01-16T00:00:00.000Z",
        "status": "absent"
      },
      {
        "date": "2024-01-17T00:00:00.000Z",
        "status": "late"
      }
    ],
    "grades": [
      {
        "subject": "Mathematics",
        "marks": 85,
        "totalMarks": 100,
        "grade": "A",
        "date": "2024-01-10T00:00:00.000Z"
      },
      {
        "subject": "Physics",
        "marks": 78,
        "totalMarks": 100,
        "grade": "B+",
        "date": "2024-01-12T00:00:00.000Z"
      },
      {
        "subject": "Chemistry",
        "marks": 92,
        "totalMarks": 100,
        "grade": "A+",
        "date": "2024-01-14T00:00:00.000Z"
      }
    ],
    "notifications": [
      {
        "title": "Welcome to SMS",
        "message": "Your account has been approved. Welcome to the Student Management System!",
        "isRead": false,
        "createdAt": "2024-01-15T09:00:00.000Z"
      },
      {
        "title": "Assignment Due",
        "message": "Mathematics assignment is due tomorrow. Please submit on time.",
        "isRead": true,
        "createdAt": "2024-01-14T14:30:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-17T00:00:00.000Z"
  }
}
```

### 12. Update Student Profile
**PUT** `/profile`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullname": "John Michael Doe",
  "phone": "+1234567899",
  "address": "456 Oak Avenue, New City, State 54321",
  "dateOfBirth": "2006-05-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "fullname": "John Michael Doe",
    "email": "john.doe@example.com",
    "rollNumber": "2024001",
    "class": "12th",
    "phone": "+1234567899",
    "address": "456 Oak Avenue, New City, State 54321",
    "dateOfBirth": "2006-05-15T00:00:00.000Z",
    "updatedAt": "2024-01-17T10:15:00.000Z"
  }
}
```

## 📊 Dashboard Analytics Endpoints

### 13. Get Dashboard Statistics
**GET** `/dashboard/stats`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "pendingApprovals": 8,
    "activeStudents": 142,
    "monthlyRegistrations": [
      {
        "month": "Aug 2023",
        "users": 20
      },
      {
        "month": "Sep 2023",
        "users": 25
      },
      {
        "month": "Oct 2023",
        "users": 30
      },
      {
        "month": "Nov 2023",
        "users": 28
      },
      {
        "month": "Dec 2023",
        "users": 22
      },
      {
        "month": "Jan 2024",
        "users": 25
      }
    ]
  }
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

## 🧪 Testing Examples

### Using cURL:

```bash
# Student Registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "rollNumber": "2024999",
    "class": "12th",
    "phone": "+1234567890"
  }'

# Admin Login
curl -X POST http://localhost:8000/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sms.com",
    "password": "admin123"
  }'

# Get All Students (with token)
curl -X GET http://localhost:8000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Approve Student
curl -X PUT http://localhost:8000/api/students/STUDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status": "approved"}'
```

### Using JavaScript/Fetch:

```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:8000/api/auth/login/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@sms.com',
    password: 'admin123'
  })
});
const { token } = await loginResponse.json();

// Get dashboard stats
const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await statsResponse.json();
```

## 📝 Notes

- All protected routes require `Authorization: Bearer <token>` header
- Admin routes require admin role in JWT token
- Student profile routes work with student tokens
- All dates are in ISO 8601 format
- Phone numbers should include country code
- Passwords are hashed using bcrypt
- JWT tokens expire in 30 days