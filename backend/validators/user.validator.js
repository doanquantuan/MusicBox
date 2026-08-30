const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = [];
    if (!username || !username.trim()) errors.push("Username không được để trống");
    if (!email || !email.trim()) errors.push("Email không được để trống");
    if (!password || password.length < 6) errors.push("Mật khẩu phải từ 6 ký tự");
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors[0], errors });
    next();
};
module.exports = { validateUser };