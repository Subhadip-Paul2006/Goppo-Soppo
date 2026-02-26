const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/like', isAuthenticated, userController.toggleLike);
router.get('/library', isAuthenticated, userController.getLibrary);

module.exports = router;
