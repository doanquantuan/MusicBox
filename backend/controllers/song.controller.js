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

const createSong = async (req, res) => {
    try {
        console.log("req.body: ", req.body);
        const userId = req.user.id;
        const song = await songService.createSong(userId, req.body, req.file);

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

module.exports = {
    getSongs,
    getSongById,
    createSong
}
