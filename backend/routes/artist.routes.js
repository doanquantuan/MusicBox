const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { authenticate } = require("../middlewares/auth.middleware");

const {
    validateCreateArtist
} = require("../validators/artist.validator");

router.post("/register", authenticate, validateCreateArtist, artistController.createArtist)

module.exports = router