const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { imageUpload } = require("../middlewares/upload.middleware");

const {
    validateArtist
} = require("../validators/artist.validator");

// Standard RESTful endpoints for /api/artists
router.post("/", authenticate, authorize("ADMIN"), imageUpload.single("image"), validateArtist, artistController.createArtist);
router.put("/:artistId", authenticate, authorize("ARTIST", "ADMIN"), imageUpload.single("image"), validateArtist, artistController.updateArtist);

module.exports = router;