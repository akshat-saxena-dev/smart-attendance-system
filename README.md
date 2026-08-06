# 🎓 Smart Attendance System

A full-stack web application that digitizes attendance management for schools by combining secure access control, OCR-based student import, and attendance tracking.

Built using **React, Express.js, PostgreSQL, Node.js, and Tesseract OCR**.

---

## 🚀 Features

### Authentication
- School registration and login
- Password hashing using **bcrypt**
- Secure authentication flow

### Class & Section Management
- Create and manage multiple classes
- Create multiple sections within each class
- Unique **section access code** for secure attendance modification

### Student Management
- Add students individually
- Bulk student addition
- Delete individual students
- Delete all students
- Automatic roll number management

### OCR-Based Student Import
- Upload an image containing a printed student list
- Extract student names using **Tesseract OCR**
- Editable preview before importing
- One-click import into the database

### Attendance Management
- Mark students Present/Absent
- Attendance stored date-wise
- Prevent duplicate attendance entries for the same date

### View & Edit Attendance
- Search attendance by date
- View attendance history
- Modify attendance after entering the section access code
- Attendance changes are reflected instantly in the database

### User Experience
- Loading spinner while fetching data
- Responsive interface
- Instant UI updates after CRUD operations

---

# Tech Stack

## Frontend
- React.js
- React Router
- Axios
- CSS

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## OCR
- Tesseract.js
- Multer

## Security
- bcrypt

---

# Project Structure

```
smart-attendance-system
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── api
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── config
│   └── database
│
└── README.md
```

---

# OCR Workflow

```
Teacher uploads image
          │
          ▼
     Multer Upload
          │
          ▼
   Tesseract OCR
          │
          ▼
 Parse Student List
          │
          ▼
 Editable Preview
          │
          ▼
 Confirm Import
          │
          ▼
 PostgreSQL Database
```

---

# Attendance Workflow

```
Login
   │
   ▼
Select Class
   │
   ▼
Select Section
   │
   ▼
Choose Date
   │
   ▼
Mark Attendance
   │
   ▼
Save Attendance
   │
   ▼
View/Edit Attendance
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<akshat-saxena-dev>/smart-attendance-system.git
```

---

## Backend

```bash
cd backend
npm install
npm start
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL="postgresql://neondb_owner:npg_S7TP8IQaUBZd@ep-round-bird-aoj5wvis-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require"
```

---

# 🌟 Key Highlights

- Full-stack CRUD application
- PostgreSQL database integration
- OCR-based student import
- Attendance history management
- Role-based attendance modification using access codes
- Responsive React frontend
- RESTful API architecture

---

# 📌 Future Improvements

- JWT authentication
- Attendance analytics dashboard
- Export attendance to Excel/PDF
- Cloud deployment
- Mobile application

---
