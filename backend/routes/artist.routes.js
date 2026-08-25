const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const {
    validateCreateArtist
} = require("../validators/artist.validator");

router.post("/register", authenticate, upload.single("image"), validateCreateArtist, artistController.createArtist)

module.exports = router