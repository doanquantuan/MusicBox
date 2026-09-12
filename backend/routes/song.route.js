const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { imageUpload, audioUpload, songUpload } = require("../middlewares/upload.middleware");

const {
    validateSong
} = require("../validators/song.validator");



router.get("/all", songController.getSongs)
router.get("/:songId", songController.getSongById)
router.get("/artist/:artistId", songController.getSongsByArtistId)
router.post("/create", authenticate, authorize('ADMIN'), songUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), validateSong, songController.createSong)
//router.put("/update/:artistId", authenticate, imageUpload.single("image"), validateArtist, artistController.updateArtist)

module.exports = router