# Goppo Soppo - Project Summary in few words... 

## Project Overview
**Goppo Soppo** is a full-stack audio streaming web application with a "Detective/Mystery" theme. It features a React frontend and a Node.js/Express backend, using MySQL for data storage. The app allows users to listen to audio stories, manage a library of favorites, and explores genres. Admins can upload content via a dedicated dashboard.

##  file Structure & Summary

### Root Directory (`e:/Goppo Soppo/`) -> Pendrive
*   `.env`: Environment variables (Database credentials, Session secret, API keys).
*   `ADMIN_GUIDE.md`: Instructions for admins on managing content.
*   `RUN_INSTRUCTIONS.md`: Steps to install and run the project.
*   `PROJECT_SUMMARY.md`: This file.

### Backend (`src/`)
*   **`app.js`**: The entry point of the backend server. Configures Express, Middleware (CORS, Session), and Routes. Serves static files (audio/images).
*   **`config/`**:
    *   `db.js`: Configures the MySQL connection pool.
    *   `init_db.js`: Script to initialize the database (create DB if not exists).
    *   `setup_schema.js`: Script to create Tables (users, stories, etc.) and seed the Admin user.
*   **`controllers/`**: Logic for handling API requests.
    *   `authController.js`: Handles Registration, Login, Logout, OTP verification.
    *   `adminController.js`: Handles Uploads (Writers, Stories), Playlist creation.
    *   `publicController.js`: Handles fetching Home data, Search, Genres.
    *   `userController.js`: Handles User Library (Likes) and fetching liked stories.
*   **`middleware/`**:
    *   `authMiddleware.js`: Protects routes. checks if user is logged in (`isAuthenticated`) or is Admin (`isAdmin`).
*   **`routes/`**: API Route definitions.
    *   `authRoutes.js`: `/api/auth` (Login/Register).
    *   `adminRoutes.js`: `/api/admin` (Uploads).
    *   `publicRoutes.js`: `/api/public` (Home data).
    *   `userRoutes.js`: `/api/user` (Library/Likes).
*   **`utils/`**: Helper functions (e.g., `emailService.js` for sending OTPs).

### Frontend (`client/`)
*   **`src/App.jsx`**: Main React component. Defines Application Routes (Home, Login, Admin, etc.) and Providers (Auth, Player).
*   **`src/main.jsx`**: Entry point, mounts the React app to the DOM.
*   **`src/index.css`**: Global styles and Tailwind imports.
*   **`tailwind.config.js`**: Tailwind CSS configuration (Custom colors like `gold-accent`, Fonts).

#### Components (`client/src/components/`)
*   **`Layout.jsx`**: The main wrapper for pages. Contains Sidebar, TopBar, and sets the structure.
*   **`TopBar.jsx`**: Top navigation bar (Search, User Profile, Admin Link).
*   **`Sidebar.jsx`**: Left navigation menu (Home, Library, Genres).
*   **`BottomPlayer.jsx`**: The persistent audio player bar. Handles Play/Pause, Seek, Volume, and Liking songs.
*   **`admin/`**:
    *   `AddWriter.jsx`: Form to add writers.
    *   `AddStory.jsx`: Form to upload stories (with file inputs).
    *   `CreatePlaylist.jsx`: Form to create global playlists.

#### Context (`client/src/context/`)
*   **`AuthContext.jsx`**: Manages User Login state globally.
*   **`PlayerContext.jsx`**: Manages Audio Player state (Playing, Current Time, Story) globally.

#### Pages (`client/src/pages/`)
*   **`Home.jsx`**: Landing page. Shows Hero section, Trending, Detective stories.
*   **`Genres.jsx`**: Displays list of genres and filters stories.
*   **`Library.jsx`**: Shows the user's "Liked" stories.
*   **`AdminDashboard.jsx`**: The container page for Admin features (Switching between Add Writer/Story tabs).
*   **`Login.jsx` / `Register.jsx`**: Authentication pages.
*   **`ComingSoon.jsx`**: Placeholder for future pages.

## Database Schema (MySQL)
*   **users**: Stores user info, password hash, role (admin/user).
*   **otps**: Stores temporary OTPs for verification.
*   **writers**: Stores writer profiles.
*   **stories**: Stores story metadata and paths to audio/images. Linked to `writers`.
*   **playlists**: Stores playlist metadata.
*   **playlist_items**: Links `stories` to `playlists`.
*   **likes**: Links `users` to `stories` for the Library feature.
