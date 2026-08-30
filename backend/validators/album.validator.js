const validateAlbum = (req, res, next) => {
    const { albumName, artistId } = req.body;
    const errors = [];
    if (!albumName || !albumName.trim()) errors.push("Tên album không được để trống");
    if (!artistId) errors.push("Nghệ sĩ không được để trống");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateAlbum };