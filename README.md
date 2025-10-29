# Student Management System

A modern, responsive Student Management Software with real-time notifications, admin-controlled access, and beautiful UI/UX.

## 🚀 Features

### 🎨 Frontend
- **Modern UI/UX** with Tailwind CSS
- **Dark Mode Toggle** in navigation
- **Responsive Design** for all devices
- **Real-time Notifications** with Socket.io
- **Animated Transitions** with Framer Motion
- **Toast Notifications** for user feedback

### 👨‍💼 Admin Panel
- Secure admin login (admin@sms.com / admin123)
- Approve/reject student registrations
- Manage student profiles and data
- Track attendance and grades
- Send real-time announcements
- Dashboard analytics

### 👩‍🎓 Student Dashboard
- Personal profile management
- View attendance and grades
- Receive real-time notifications
- Clean, intuitive interface
- Mobile-responsive design

### 🔐 Authentication
- JWT-based authentication
- Role-based access control
- Admin approval system
- Secure session management

## 📁 Project Structure

```
Backend/
├── server/                 # Backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── client/                 # Frontend App
    ├── app/
    ├── components/
    ├── context/
    └── utils/
```

## 🛠️ Setup Instructions

### Server Setup
```bash
cd server
npm install
npm run dev  # Runs on http://localhost:8000
```

### Client Setup
```bash
cd client
npm install
npm run dev  # Runs on http://localhost:3000
```

### Environment Variables

**Server (.env):**
```env
MONGO_URI=mongodb://localhost:27017/studentmanagement
PORT=8000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
ADMIN_EMAIL=admin@sms.com
ADMIN_PASSWORD=admin123
```

**Client (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

## 🔑 Default Admin Credentials
- **Email:** admin@sms.com
- **Password:** admin123

## 🌟 Key Technologies

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io for real-time features

**Frontend:**
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Socket.io Client
- React Hot Toast

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Usage

1. **Start MongoDB** service
2. **Start the server:** `cd server && npm run dev`
3. **Start the client:** `cd client && npm run dev`
4. **Visit:** http://localhost:3000
5. **Admin Login:** Use admin@sms.com / admin123
6. **Student Registration:** Students register and wait for admin approval

## 🔔 Real-time Features

- Instant notifications for students
- Admin announcements broadcast to all users
- Real-time dashboard updates
- Live status changes

## 🎨 UI/UX Features

- **Beautiful Landing Page** with hero section
- **Dark/Light Mode** toggle
- **Smooth Animations** and transitions
- **Professional Dashboard** design
- **Mobile-First** responsive design
- **Modern Card-based** layouts

This Student Management System provides a complete solution for educational institutions with modern design, real-time capabilities, and secure access control.