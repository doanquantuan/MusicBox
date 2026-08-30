const validateGenre = (req, res, next) => {
    const { genreName } = req.body;
    const errors = [];
    if (!genreName || !genreName.trim()) errors.push("Tên thể loại không được để trống");
    if (genreName.length > 50) errors.push("Tên thể loại không được vượt quá 50 ký tự");
    if (genreName.length < 3) errors.push("Tên thể loại không được nhỏ hơn 3 ký tự");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateGenre };