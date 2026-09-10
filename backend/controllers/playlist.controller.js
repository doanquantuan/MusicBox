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
        res.status(500).json({
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



module.exports = {
    createPlaylist,
    updatePlaylist,
    getAllPlaylists,
    deletePlaylist
}