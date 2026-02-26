# Goppo Soppo 
[This File is AI Generated, It may conatin errors]

## Project Aim
**Goppo Soppo** is a full-stack, theme-based web application designed to serve as a specialized audio streaming platform. The primary objective is to provide users with an immersive experience for discovering, organizing, and listening to audio content—specifically focusing on detective, mystery, and thriller stories. 

The application solves the problem of fragmented audio content by offering a centralized, dedicated platform where creators (admins) can easily upload story files and metadata, while listeners get a clean, responsive, and uninterrupted streaming experience with features like curated playlists, genre filtering, and a personal library of favorites.

## Technologies Used

### Frontend
* **React.js**
  * **What it is:** A popular JavaScript library for building user interfaces.
  * **Why it is used:** It allows us to create a dynamic, single-page application (SPA) with reusable components like the persistent audio player, sidebar, and story cards.
  * **Specific Purpose:** Manages the entire client-side view, user interactions, and state management without requiring page reloads.
* **Vite**
  * **What it is:** A modern, blazing-fast frontend build tool.
  * **Why it is used:** It provides rapid server start times and highly optimized production builds compared to older bundlers.
  * **Specific Purpose:** Serves the frontend during development and bundles the React application for deployment.
* **Tailwind CSS**
  * **What it is:** A utility-first CSS framework.
  * **Why it is used:** Enables rapid UI styling directly within the components without constantly switching context to external CSS files.
  * **Specific Purpose:** Handles the responsive design, layout alignment, and thematic styling (like the dark UI and custom gold accents).

### Backend
* **Node.js**
  * **What it is:** A JavaScript runtime environment built on Chrome's V8 engine that runs outside the browser.
  * **Why it is used:** Allows us to use JavaScript on both the frontend and backend, unifying the technology stack and simplifying development.
  * **Specific Purpose:** Hosts the server, connects to the database, and processes incoming data from the frontend.
* **Express.js**
  * **What it is:** A minimal and flexible Node.js web application framework.
  * **Why it is used:** It makes handling HTTP routes and middleware extremely simple.
  * **Specific Purpose:** Defines the API endpoints (e.g., retrieving stories, logging in, uploading audio files) and serves static media files to the client.
* **MySQL**
  * **What it is:** A relational database management system.
  * **Why it is used:** Relational databases are excellent for structured data with clear relationships (e.g., a user has many liked stories, a story belongs to a genre).
  * **Specific Purpose:** Stores all persistent application data securely, including user credentials, story metadata, and playlist configurations.

## Project Structure

```text
Goppo Soppo/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI parts (Layout, Player, Navbars)
│   │   ├── context/        # Global state managers (Auth, Player context)
│   │   └── pages/          # Full page views (Home, Library, AdminDashboard)
├── src/                    # Backend Node.js Environment
│   ├── config/             # Database connection and initialization scripts
│   ├── controllers/        # Core business logic processing API requests
│   ├── middleware/         # Route protectors and authentication checks
│   └── routes/             # API endpoint definitions mapping to controllers
├── audio/                  # Local storage for uploaded story audio files
├── uploads/                # Local storage for uploaded thumbnails/images
├── .env                    # Secret environment variables (ignored by Git)
└── .gitignore              # Files and folders to exclude from version control
```

## How to Run the Project

To run this project locally, ensure you have Node.js and MySQL installed on your system. 

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd "Goppo Soppo"
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example` (or configure your own). It must include your database credentials and session secrets.

3. **Initialize the Database**
   ```bash
   # Run the setup scripts to build the MySQL tables and seed the admin user
   node src/config/init_db.js
   node src/config/setup_schema.js
   ```

4. **Start the Backend Server**
   ```bash
   # Install dependencies and start Express
   npm install
   node src/app.js
   ```

5. **Start the Frontend Application**
   ```bash
   # Open a new terminal window
   cd client
   npm install
   npm run dev
   ```

6. **View the Application**
   Open your browser and navigate to the local server URL provided by Vite (usually `http://localhost:5173/`).

## Future Scope
* **Intelligent Recommendation Engine:** Implement a backend algorithm to suggest related stories based on a user's listening history and favorite genres.
* **Mobile Application Integration:** Extend the existing API structure to serve a React Native mobile application, allowing for offline downloads and background listening on smartphones.
* **Social Playlists:** Expand the playlist feature to allow users to follow their friends and share custom-curated collections publicly.
