const express = require("express");
const albumController = require("../controllers/album.controller");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { imageUpload } = require("../middlewares/upload.middleware");

// Standard RESTful endpoints for /api/albums
router.post("/", authenticate, authorize("ARTIST", "ADMIN"), imageUpload.single("image"), albumController.createAlbum);
router.put("/:id", authenticate, authorize("ARTIST", "ADMIN"), imageUpload.single("image"), albumController.updateAlbum);
router.delete("/:id", authenticate, authorize("ARTIST", "ADMIN"), albumController.deleteAlbum);
router.get("/artists/:artistId", albumController.getAlbumByArtistId);
router.post("/:albumId/songs", authenticate, authorize("ARTIST", "ADMIN"), albumController.addSongToAlbum);

module.exports = router;