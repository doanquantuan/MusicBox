const playlistService = require("../services/playlist.service");

const createPlaylist = async (req, res) => {
    try {
        const result = await playlistService.createPlaylist(req.user.id, req.body, req.file);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updatePlaylist = async (req, res) => {
    try {
        const result = await playlistService.updatePlaylist(req.user.id, req.body, req.file, req.params.playlistId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        let statusCode = 400;
        if (error.message.includes("Không tìm thấy")) {
            statusCode = 404;
        } else if (error.message.includes("của bạn")) {
            statusCode = 403;
        }
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

const getAllPlaylists = async (req, res) => {
    try {
        const result = await playlistService.getAllPlaylists();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const deletePlaylist = async (req, res) => {
    try {
        const result = await playlistService.deletePlaylist(req.params.playlistId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const addSongToPlaylist = async (req, res) => {
    try {
        const result = await playlistService.addSongToPlaylist(req.params.playlistId, req.body.songId, req.user.id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const removeSongFromPlaylist = async (req, res) => {
    try {
        const result = await playlistService.removeSongFromPlaylist(req.params.playlistId, req.body.songId, req.user.id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getSongsInPlaylist = async (req, res) => {
    try {
        const result = await playlistService.getSongsInPlaylist(req.params.playlistId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const getPlaylistById = async (req, res) => {
    try {
        const result = await playlistService.getPlaylistById(req.params.playlistId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        let statusCode = 400;
        if (error.message.includes("Không tìm thấy")) {
            statusCode = 404;
        }
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createPlaylist,
    updatePlaylist,
    getAllPlaylists,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getSongsInPlaylist,
    getPlaylistById
}