const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const playlistController = require('../controllers/playlistController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Ensure uploads/playlists directory exists
const uploadDir = path.join(__dirname, '../../uploads/playlists');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for cover image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Playlist CRUD routes
router.post('/', isAuthenticated, upload.single('coverImage'), playlistController.createPlaylist);
router.get('/', isAuthenticated, playlistController.getUserPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', isAuthenticated, upload.single('coverImage'), playlistController.updatePlaylist);
router.delete('/:id', isAuthenticated, playlistController.deletePlaylist);

// Playlist items routes
router.post('/:id/items', isAuthenticated, playlistController.addToPlaylist);
router.delete('/:id/items/:storyId', isAuthenticated, playlistController.removeFromPlaylist);

module.exports = router;
