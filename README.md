# FlowDash – Workwise

FlowDash is a full-stack dashboard application designed to manage users, tasks, and operational workflows with secure authentication and role-based access control.

---

## ✅ Implemented Features

### Authentication & Authorization
- User Login using Email & Password
- JWT-based Authentication
- Role-Based Access Control (Admin / Operator)
- Protected Backend Routes using Middleware
- Frontend Route Protection based on Authentication State

### Task Management & Workflow
- Task Assignment to Operators
- Task Transfer Between Operators
- Designation-Based Task Transfer Validation
- Transfer Allowed Only if Designations Match
- Automatic Transfer Failure Response on Invalid Transfer
- Status-Based Task Handling

### Dashboard & UI
- Dashboard Layout with Sidebar Navigation
- Dynamic Stats Cards
- Conditional UI Rendering Based on User Role
- Reusable UI Components (Cards, Dialogs, Badges, Buttons)
- Form Validation and User Feedback Messages

### API & Backend
- RESTful APIs using Express.js
- Secure Authentication APIs
- Task Transfer API with Business Rule Validation
- Axios-based API Integration
- Centralized Error Handling
- CORS Configuration for Cross-Origin Requests
- Environment-Based API URL Management

### Database & ORM
- Prisma ORM Integration
- User Model with Role & Designation Fields
- Task Model with Ownership & Status
- Database Migrations
- Secure Password Handling

### Configuration & Development
- Environment Variable Management (`.env`)
- Separate Client & Server Architecture
- Modular and Scalable Codebase

---

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Axios
- Tailwind CSS / Shadcn UI

**Backend**
- Node.js
- Express.js
- Prisma ORM

**Database**
- PostgreSQL / MySQL
