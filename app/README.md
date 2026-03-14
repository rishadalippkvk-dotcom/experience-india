# Indian Travel Experience Project

A full-stack web application for exploring and managing travel destinations in India. This project features a modern React frontend and a Node.js/Express backend with MongoDB, organized in a monorepo structure.

## 🚀 Tech Stack

**Frontend (`apps/client`)**
*   **React** (Vite)
*   **TypeScript**
*   **Tailwind CSS**
*   **Lucide React** (Icons)
*   **React Router DOM**

**Backend (`apps/server`)**
*   **Node.js** & **Express**
*   **MongoDB** (Mongoose)
*   **JWT** (Authentication)

---

## 📂 Project Structure

This project follows a **Monorepo** architecture:

```
my-project/
├── apps/
│   ├── client/           # React Frontend (Feature-First)
│   │   ├── src/features/ # Auth, Admin, Destinations
│   │   └── src/shared/   # UI components, hooks, types
│   └── server/           # Node Backend (Modular)
│       └── src/modules/  # Auth, Destinations APIs
├── docker-compose.yml    # Docker setup
└── package.json          # Root workspace config
```

---

## 🛠️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Atlas URI or local)

### Installation

1.  **Install Dependencies** (from root):
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    *   **Server**: Ensure `apps/server/.env` exists with:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```

### Running the App

You can run commands from the **root** folder:

*   **Start Backend**:
    ```bash
    npm run dev:server
    ```
    *Runs on http://localhost:5000*

*   **Start Frontend**:
    ```bash
    npm run dev:client
    ```
    *Runs on http://localhost:5173* (or 5174 if busy)

---

## 🔐 Admin Access

To manage destinations, food spots, hostels, and reviews:

1.  Go to `/admin` (e.g., `http://localhost:5173/admin`).
2.  Login with default credentials:
    *   **Username**: `admin`
    *   **Password**: `admin123`

---

## 🐳 Docker Support

To run the entire stack with Docker:

```bash
docker-compose up --build
```

---

## ✨ Features

*   **Destinations**: Browse top-rated Indian destinations.
*   **Admin Panel**: Full CRUD for managing places.
*   **Rich Data**: Support for Reviews, Food Spots, and Hostels.
*   **Responsive**: Beautiful UI optimized for all devices.
