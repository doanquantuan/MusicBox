const validateArtist = (req, res, next) => {
    const { artistName, bio } = req.body;
    const errors = [];

    if (!artistName || typeof artistName !== 'string' || !artistName.trim()) {
        errors.push("Tên nghệ sĩ không được để trống");
    } else if (artistName.length > 100) {
        errors.push("Tên nghệ sĩ không được vượt quá 100 ký tự");
    }

    if (bio && bio.length > 1000) {
        errors.push("Tiểu sử không được vượt quá 1000 ký tự");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
}

module.exports = {
    validateArtist
}