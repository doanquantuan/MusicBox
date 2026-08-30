const validateLike = (req, res, next) => {
    const { userId, songId } = req.body;
    const errors = [];
    if (!userId) errors.push("Thiếu userId");
    if (!songId) errors.push("Thiếu songId");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateLike };