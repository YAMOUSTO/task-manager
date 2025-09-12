 #Task Manager

A full-stack task management application built with React for the frontend and Node.js/Express with MongoDB for the backend API. Users can register, log in, create, view, update, and delete tasks, as well as manage their profile by changing their password. This application provides a persistent data solution using MongoDB Atlas.

## ✨ Features

*   **User Authentication:**
    *   Secure user registration and login using JWT (JSON Web Tokens).
    *   Password hashing via `bcryptjs` for enhanced security.
    *   Session persistence with tokens stored in `localStorage`.
    *   Profile management: Users can change their password.
*   **Task Management (CRUD):**
    *   **Create:** Add new tasks with title, description, status, priority, and an optional due date.
    *   **Read:** View a filterable list of tasks created by the logged-in user on a central dashboard.
    *   **Update:** Modify existing task details, including status, priority, and due date.
    *   **Delete:** Remove tasks when they are no longer needed.
*   **Task Properties:**
    *   **Status Tracking:** 'Todo', 'In Progress', 'Done'.
    *   **Priority Levels:** 'Low', 'Medium', 'High'.
    *   **Due Dates:** Selectable via an MUI DatePicker.
    *   (Optional: Add 'Assignee' if you implemented it).
*   **User Interface & Experience:**
    *   Clean, responsive, and modern UI built with Material UI (MUI).
    *   Intuitive dashboard for task visualization and management.
    *   Modal dialogs for efficient task creation and editing.
    *   User-friendly notifications and error messages using MUI Snackbars.
    *   Client-side form validation for improved data entry.
*   **Persistent Data Storage:**
    *   All user and task data is stored persistently in a MongoDB Atlas cloud database.
*   **API:**
    *   RESTful API built with Node.js and Express.js.
    *   Protected routes using JWT authentication middleware.
    *   Mongoose ODM for MongoDB interactions.

---

## 🛠️ Technologies Used

**Frontend:**
*   React (v18+)
*   React Router (v6)
*   Context API (for global state management: Auth & Tasks)
*   Axios (for HTTP API calls)
*   Material UI (MUI v5)
    *   `@mui/material` (Core components)
    *   `@mui/icons-material` (Icons)
    *   `@mui/x-date-pickers` (Date Picker component)
*   `date-fns` (for date formatting and utilities)


**Backend:**
*   Node.js
*   Express.js (Web framework)
*   MongoDB (NoSQL Database)
*   Mongoose (ODM for MongoDB)
*   JSON Web Token (`jsonwebtoken`) (Authentication)
*   `bcryptjs` (Password hashing)
*   `cors` (Cross-Origin Resource Sharing)
*   `dotenv` (Environment variable management)

**Development & Version Control:**
*   Git & GitHub
*   Nodemon (for automatic backend server restarts during development)
*   [Your Code Editor, e.g., VS Code]

**Login Page:**
![Login Page](./screenshots/login-page.png)

**Registration Page:**
![Registration Page](./screenshots/register-page.png)

**Dashboard (Task List):**
![Dashboard](./screenshots/dashboard-tasks.png)

**Add/Edit Task Modal (with DatePicker):**
![Task Modal](./screenshots/task-modal.png)

**User Profile / Change Password Page:**
![Profile Page](./screenshots/profile-page.png)
