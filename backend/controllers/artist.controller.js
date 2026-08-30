const artistService = require("../services/artist.service");

const createArtist = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const userId = req.user.id;
        const artist = await artistService.createArtist(userId, req.body, req.file);
        return res.status(201).json({
            success: true,
            message: "Tạo nghệ sĩ thành công",
            data: artist
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const updateArtist = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const artist = await artistService.updateArtist(artistId, req.body, req.file);
        return res.status(200).json({
            success: true,
            message: "Cập nhật nghệ sĩ thành công",
            data: artist
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createArtist,
    updateArtist
}