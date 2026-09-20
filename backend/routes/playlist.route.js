const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { imageUpload } = require("../middlewares/upload.middleware");

// Standard RESTful endpoints for /api/playlists
router.get("/", authenticate, playlistController.getAllPlaylists);
router.post("/", authenticate, imageUpload.single("image"), playlistController.createPlaylist);
router.put("/:playlistId", authenticate, imageUpload.single("image"), playlistController.updatePlaylist);
router.delete("/:playlistId", authenticate, playlistController.deletePlaylist);
router.post("/:playlistId/song", authenticate, playlistController.addSongToPlaylist);
router.delete("/:playlistId/song/:songId", authenticate, playlistController.removeSongFromPlaylist);

module.exports = router;
