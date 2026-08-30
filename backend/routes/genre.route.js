const express = require('express');
const genreController = require('../controllers/genre.controller');
const { authenticate } = require('../middlewares/auth.middleware');
//const adminMiddleware = require('../middlewares/admin.middleware');
const router = express.Router();

const { validateGenre } = require('../validators/genre.validator');


router.post('/create', authenticate, validateGenre, genreController.createGenre);
router.get('/', authenticate, genreController.getAllGenres);

module.exports = router;