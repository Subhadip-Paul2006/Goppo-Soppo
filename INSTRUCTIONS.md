# Goppo Soppo - How To Use [AI Generated]

Goppo Soppo is a full-stack storytelling web application where users can discover, listen to, and manage audio and text-based stories. The platform features robust management tools for content creators and an intuitive, immersive browsing experience for listeners.

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your local machine:

*   **[Node.js](https://nodejs.org/) (v16 or higher):** Required to run both the Express backend and the React development server.
*   **[npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/):** Package managers required to install the project dependencies.
*   **[MongoDB](https://www.mongodb.com/):** The NoSQL database used to store users, stories, authors, and playlists. You can install it locally or use MongoDB Atlas (cloud).
*   **[Git](https://git-scm.com/):** Required to clone the repository and manage version control.

---

## 2. Project Setup (Local Development)

Follow these steps to get your local development environment set up.

### Clone the Repository
```bash
git clone https://github.com/your-username/goppo-soppo.git
cd goppo-soppo
```

### Install Backend Dependencies
```bash
# Navigate to the backend directory (adjust if your folder name is different, e.g., /server)
cd server
npm install
```

### Install Frontend Dependencies
```bash
# Open a new terminal or navigate to the frontend directory
cd ../client
npm install
```

### Folder Structure
*   `/client`: Contains the React.js (Vite) frontend application, components, pages, and Tailwind CSS styles.
*   `/server` (or `/api`): Contains the Node.js/Express backend, route handlers, controllers, and MongoDB models.

---

## 3. Environment Configuration

You need to configure environment variables for both the frontend and backend to communicate properly.

### Backend Configuration
Create a `.env` file in the root of your `server` directory:

```bash
cd server
touch .env
```

Add the following required variables:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/goppo-soppo

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# File Upload (if using AWS S3 or Cloudinary, otherwise local path configuration)
# CLOUDINARY_URL=your_cloudinary_url
```

### Frontend Configuration
Create a `.env` file in the root of your `client` directory:

```bash
cd client
touch .env
```

Add the following required variables:
```env
# Vite environment variables must be prefixed with VITE_
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 4. Database Setup

Goppo Soppo uses **MongoDB**, a flexible NoSQL database perfect for handling hierarchical data like playlists and stories.

### Installation
1.  **Local:** Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community). Start the MongoDB service on your machine.
2.  **Cloud:** Alternatively, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.

### Database Creation
If running locally, MongoDB will automatically create the `goppo-soppo` database the first time the backend connects and saves data. No manual database creation command is required.

### High-Level Data Structure
*   **Users:** Stores user credentials, roles (admin/user), and personalized data like favorites.
*   **Authors:** Contains author profiles, biographies, and references to their stories.
*   **Stories:** Stores the core content: title, description, genre, audio file URL/path, text content, and duration.
*   **Playlists:** User-generated or admin-curated collections referencing multiple stories.

*(Note: If the application includes a database seeding script, you can run `npm run seed` inside the server folder to populate initial dummy data.)*

---

## 5. Running the Project

To run the full stack application, you need to start both the backend server and the frontend client simultaneously.

### Start the Backend Server
Open a terminal instance:
```bash
cd server
npm run dev
```
*The backend should default to `http://localhost:5000`.*

### Start the Frontend Client
Open a second terminal instance:
```bash
cd client
npm run dev
```
*Vite will typically start the frontend on `http://localhost:5173`.*

### Verification
Open your browser and navigate to `http://localhost:5173`. If you see the Goppo Soppo homepage and your backend terminal shows "Database connected successfully", your setup is complete!

---

## 6. Using the Application

### For Admin / Content Creators
*   **Managing Authors:** Log in with an admin account and navigate to the Admin Dashboard. Click "Add Author" to upload an author profile picture and bio.
*   **Uploading Stories:** Click "New Story". Fill in the title, description, and genre. You can upload an accompanying `.mp3` or `.wav` audio file. The server will handle the upload, extract the duration, and store the file either locally or in your configured cloud storage.
*   **Content Moderation:** Admins have the ability to edit or delete existing stories and manage user-generated playlists.

### For End Users
*   **Browsing:** Use the home page to explore stories filterable by genre or author. 
*   **Listening:** Click on any story to open the built-in audio player. The player persists across pages, so you can continue exploring while listening.
*   **Playlists & Favorites:** Create an account to like stories, save them for later, or assemble them into custom thematic playlists.

---

## 7. API Overview

Here is a brief overview of the primary backend API routes:

*   **Authentication:**
    *   `POST /api/auth/register` - Register a new user
    *   `POST /api/auth/login` - Authenticate a user and return a JWT
*   **Stories:**
    *   `GET /api/stories` - Fetch all stories (supports pagination and filtering)
    *   `POST /api/stories` - (Admin) Upload a new story and audio file
    *   `GET /api/stories/:id` - Fetch single story details
*   **Authors:**
    *   `GET /api/authors` - Fetch author directory
*   **Playlists:**
    *   `POST /api/playlists` - Create a new playlist
    *   `GET /api/playlists/:userId` - Fetch a user's playlists

---

## 8. Common Errors & Troubleshooting

*   **`Error: listen EADDRINUSE: address already in use :::5000`**
    *   *Cause:* Another application is using port 5000.
    *   *Fix:* Kill the process running on port 5000 or change the `PORT` variable in your backend `.env` file (and update `VITE_API_BASE_URL` in the frontend).
*   **`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`**
    *   *Cause:* The backend cannot reach the database.
    *   *Fix:* Ensure your local MongoDB service is actively running or verify your `MONGODB_URI` string is correct.
*   **`CORS Error` or Frontend Not Connecting to Backend**
    *   *Cause:* The Vite client is trying to fetch data from the wrong URL.
    *   *Fix:* Check your `client/.env` file. Ensure `VITE_API_BASE_URL` exactly matches your backend's running URL and port. Restart the Vite server after `.env` changes.
*   **Missing Environment Variables**
    *   *Cause:* `process.env.JWT_SECRET` is undefined during login.
    *   *Fix:* Ensure you have correctly created and populated the `.env` file in the server directory without any typos.

---

## 9. Future Improvements

Here are a few planned enhancements for the project:
1.  **Offline Support (PWA):** Implement service workers to allow users to download stories and listen to them offline.
2.  **Advanced Analytics Dashboard:** Provide content creators with insights into listen durations, drop-off rates, and popular demographics.
3.  **Social Sharing & Comments:** Allow users to comment on specific timestamps in an audio story and share snippets to social media.
4.  **Automated Transcriptions:** Integrate an AI service to automatically generate text transcripts for uploaded audio files to improve accessibility.
