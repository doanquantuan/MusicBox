const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { imageUpload, audioUpload } = require("../middlewares/upload.middleware");

// const {
//     validateSong
// } = require("../validators/artist.validator");

router.post("/create", authenticate, audioUpload.single("audio"), songController.createSong)
//router.put("/update/:artistId", authenticate, imageUpload.single("image"), validateArtist, artistController.updateArtist)

module.exports = router