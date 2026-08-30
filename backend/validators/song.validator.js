const validateSong = (req, res, next) => {
    const { title, artistId } = req.body;
    const errors = [];
    if (!title || !title.trim()) errors.push("Tiêu đề bài hát không được để trống");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateSong };