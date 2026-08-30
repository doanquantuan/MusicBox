const validatePlaylistSong = (req, res, next) => {
    const { playlistId, songId } = req.body;
    const errors = [];
    if (!playlistId) errors.push("Thiếu playlistId");
    if (!songId) errors.push("Thiếu songId");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validatePlaylistSong };