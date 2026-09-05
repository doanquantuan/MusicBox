const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};

const authorize = (...roles) => {
    const allowedRoles = roles.flat().map(r => String(r).toLowerCase());
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Không tìm thấy thông tin quyền của người dùng"
            });
        }

        const userRole = req.user.role.toLowerCase();
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện hành động này"
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
