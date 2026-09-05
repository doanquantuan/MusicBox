const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
            type: 'access'
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            type: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        }
    );
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        return decoded;
    } catch (error) {
        throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};