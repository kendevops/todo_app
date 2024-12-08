# Todo Application Documentation

## Overview

This is a full-stack Todo application that allows users to register, login, and manage their own todos. The app supports creating, editing, deleting, and filtering todos, as well as toggling their completion status. User authentication is handled via a token-based system, and the frontend is built with React, TypeScript, Tailwind CSS, and React Testing Library for tests.

## Features

- **User Authentication:** Users can register and login.
- **Todo Management:** Create new todos, edit existing ones, delete them, and mark them as completed.
- **Filtering and Sorting:** Filter todos by completion status, due date, and search term. Sort todos by title.
- **Dark/Light Mode Toggle:** Switch between themes.
- **Client-side Validation:** Uses Zod for input validation on the frontend.
- **Tests:** Includes unit tests for reducers, auth, and components.

## Prerequisites

- **Node.js (>=14)** and **Yarn**
- A modern browser to run the frontend
- Optional: A backend API if choosing to persist data server-side (this can be adapted, but by default todos are stored in `localStorage`)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/kendevops/todo_app

   cd todo-app
   ```

2. **Install Dependencies:**

- Ensure you have either npm or yarn installed but for this i will use yarn.

  a. **For backend:**

  ```bash
  cd backend

  yarn install
  ```

  - To run the application in development mode with hot reloading:

  ```bash
    yarn dev
  ```

  - This is will start running on Port 8000 (you can go to <http://localhost:8000/health> to verify that it's pinging)

  b. **For Frontend:**

  ```bash
  cd frontend

  yarn install

  ```

  - To run the application in development mode with hot reloading:

  ```bash
    yarn dev
  ```

  - This will start the frontend on a local development server (<http://localhost:5173> since i am using Vite).

**Authentication Note:**

- If the app backend is configured to use a different backend port for authentication:
  - Ensure the backend server is running and verify the port.
  - Update API endpoints in the frontend code (/utils/api.ts file).

**Testing**

The application includes Jest and React Testing Library tests.

Run Tests:

```bash
yarn test
```

**Folder Structure**

A general overview:

```
todo_app/
backend/
frontend/
├─ src/
│  ├─ components/           # Reusable UI components
│  ├─ context/              # Auth and Todo contexts
│  ├─ hooks/                # Custom hooks (useAuth, useToast, useTodos)
│  ├─ pages/                # Page-level components (Login, Register, TodoList)
│  ├─ utils/             # API related code (api.ts)
│  ├─ __test__/             # Test files
│  ├─ types/                # TypeScript type definitions
│  ├─ App.tsx               # Main App component
│  ├─ index.tsx             # App entry point
│  └─ ...other config files
├─ public/                   # Public assets
├─ package.json
├─ yarn.lock
├─ tsconfig.json
└─ ...other config files

```

**Additional Customization (If i am to suggest)**

- Currently the app state for the CRUD operation is handled on the frontend so i would Integrate a backend API for persistent data.
- Add more tests for higher coverage.
- Extend filtering and sorting logic.
- Implement additional themes or UI improvements (like sidebars and so on).

## NOTE

- I updated some changes that has to do with the validate-ip on the backend based on our conversation and i used mysql2 as the mysql it came with didn't work for me.

- I added screenshots of the app in the frontend folder readme file.