const validateSong = (req, res, next) => {
    const { ...songInfo } = req.body;
    const errors = [];

    if (!songInfo.songName || !songInfo.songName.trim()) errors.push("Tên bài hát không được để trống");
    let artistIds = req.body.artistIds;

    if (typeof artistIds === "string") {
        artistIds = [artistIds];
    }

    if (
        !Array.isArray(artistIds) ||
        artistIds.length === 0
    ) {
        errors.push("Phải có ít nhất 1 nghệ sĩ");
    }
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateSong };