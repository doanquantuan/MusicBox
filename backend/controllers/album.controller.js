const albumService = require("../services/album.serveic");

const createAlbum = async (req, res) => {
    try {
        const album = await albumService.createAlbum(req.body, req.file);
        return res.status(201).json({
            success: true,
            message: "Tạo album thành công",
            data: album
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateAlbum = async (req, res) => {
    try {
        const album = await albumService.updateAlbum(req.params.id, req.body, req.file);
        return res.status(200).json({
            success: true,
            message: "Cập nhật album thành công",
            data: album
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const album = await albumService.deleteAlbum(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Xóa album thành công",
            data: album
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getAlbumByArtistId = async (req, res) => {
    try {
        const album = await albumService.getAlbumByArtistId(req.params.artistId);
        return res.status(200).json({
            success: true,
            message: "Lấy album thành công",
            data: album
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const addSongToAlbum = async (req, res) => {
    try {
        const album = await albumService.addSongToAlbum(req.params.albumId, req.body);
        return res.status(200).json({
            success: true,
            message: "Thêm bài hát vào album thành công",
            data: album
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumByArtistId,
    addSongToAlbum
}