const songService = require("../services/song.service");

const getSongs = async (req, res) => {
    try {
        const songs = await songService.getSongs();
        return res.status(200).json({
            success: true,
            message: "Lấy danh sách bài hát thành công",
            data: songs
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getSongById = async (req, res) => {
    try {
        const songId = req.params.songId;
        const song = await songService.getSongById(songId);
        return res.status(200).json({
            success: true,
            message: "Lấy thông tin bài hát thành công",
            data: song
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const getSongsByArtistId = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const songs = await songService.getSongsByArtistId(artistId);
        return res.status(200).json({
            success: true,
            message: "Lấy danh sách bài hát thành công",
            data: songs
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const createSong = async (req, res) => {
    try {
        const image = req.files?.image?.[0];
        const audio = req.files?.audio?.[0];
        const song = await songService.createSong(req.body, image, audio);

        return res.status(201).json({
            success: true,
            message: "Tạo bài hát thành công",
            data: song
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



const updateSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const image = req.files?.image?.[0];
        const audio = req.files?.audio?.[0];
        const song = await songService.updateSong(songId, req.body, image, audio);

        return res.status(200).json({
            success: true,
            message: "Cập nhật bài hát thành công",
            data: song
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteSong = async (req, res) => {
    try {
        const songId = req.params.songId;
        const song = await songService.deleteSong(songId);
        return res.status(200).json({
            success: true,
            message: "Xóa bài hát thành công",
            data: song
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    getSongs,
    getSongById,
    getSongsByArtistId,
    createSong,
    updateSong,
    deleteSong
}
