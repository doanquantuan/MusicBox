const validatePlaylist = (req, res, next) => {
    const { playlistName, userId } = req.body;
    const errors = [];
    if (!playlistName || !playlistName.trim()) errors.push("Tên playlist không được để trống");
    if (!userId) errors.push("Thiếu userId");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validatePlaylist };