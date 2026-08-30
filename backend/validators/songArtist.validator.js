const validateSongArtist = (req, res, next) => {
    const { songId, artistId } = req.body;
    const errors = [];
    if (!songId) errors.push("Thiếu songId");
    if (!artistId) errors.push("Thiếu artistId");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateSongArtist };