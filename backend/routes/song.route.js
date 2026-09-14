const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { songUpload } = require("../middlewares/upload.middleware");

const {
    validateSong
} = require("../validators/song.validator");

// Standard RESTful endpoints for /api/songs
router.get("/", songController.getSongs);
router.get("/:songId", songController.getSongById);
router.get("/artists/:artistId", songController.getSongsByArtistId);
router.post("/", authenticate, authorize('ADMIN'), songUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), validateSong, songController.createSong);
router.put("/:songId", authenticate, authorize('ADMIN'), songUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), songController.updateSong);
router.delete("/:songId", authenticate, authorize('ADMIN'), songController.deleteSong);

module.exports = router;