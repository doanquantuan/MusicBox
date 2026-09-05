const express = require('express');
const genreController = require('../controllers/genre.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

const { validateGenre } = require('../validators/genre.validator');


router.post('/create', authenticate, authorize('ADMIN', 'ARTIST'), validateGenre, genreController.createGenre);
router.get('/', authenticate, genreController.getAllGenres);

module.exports = router;