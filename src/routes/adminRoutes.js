const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Multer Config for Writers
const writerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/writers/');
    },
    filename: (req, file, cb) => {
        cb(null, `writer-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadWriter = multer({ storage: writerStorage });

// Multer Config for Stories (Audio & Thumbnails)
const storyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'audio') cb(null, 'audio/');
        else if (file.fieldname === 'thumbnail') cb(null, 'uploads/thumbnails/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadStory = multer({ storage: storyStorage });

// Multer Config for Playlists
const playlistStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/thumbnails/');
    },
    filename: (req, file, cb) => {
        cb(null, `playlist-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadPlaylist = multer({ storage: playlistStorage });

// Protect all admin routes
router.use(isAuthenticated, isAdmin);

router.post('/writers', uploadWriter.single('image'), adminController.addWriter);
router.get('/writers', adminController.getWriters);

router.post('/stories', uploadStory.fields([{ name: 'audio', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), adminController.addStory);
router.get('/stories', adminController.getStories);

router.post('/playlists', uploadPlaylist.single('image'), adminController.createPlaylist);
router.get('/playlists', adminController.getPlaylists);

module.exports = router;
