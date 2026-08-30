const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { imageUpload } = require("../middlewares/upload.middleware");

const {
    validateArtist
} = require("../validators/artist.validator");

router.post("/register", authenticate, imageUpload.single("image"), validateArtist, artistController.createArtist)
router.put("/update/:artistId", authenticate, imageUpload.single("image"), validateArtist, artistController.updateArtist)

module.exports = router