const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/home', publicController.getHomeData);
router.get('/search', publicController.search);
router.get('/genres', publicController.getAllGenres);
router.get('/writer/:id', publicController.getWriterDetails);
router.get('/story/:id/meta', publicController.getStoryMeta);

module.exports = router;
