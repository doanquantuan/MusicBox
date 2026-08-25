const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const {
    validateArtist
} = require("../validators/artist.validator");

router.post("/register", authenticate, upload.single("image"), validateArtist, artistController.createArtist)
router.put("/update/:artistId", authenticate, upload.single("image"), validateArtist, artistController.updateArtist)

module.exports = router