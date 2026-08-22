const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require("../models");
const otpService = require("./otpService");
const emailService = require("./emailService");
const tokenService = require("./tokenService");

const User = db.User;
const RefreshToken = db.RefreshToken;

const register = async (name, email, password) => {
    const normalizedEmail = email
        .toLowerCase()
        .trim();

    const existingUser = await User.findOne({
        where: {
            email: normalizedEmail
        }
    });

    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false
    });

    const userWithOtp = await otpService.generateOtp(normalizedEmail);

    await emailService.sendOtpEmail(normalizedEmail, userWithOtp.otpCode, 'verify-email');

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
    };
};

const login = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
        throw new Error('Tài khoản không tồn tại');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác');
    }

    if (!user.isVerified) {
        throw new Error('Tài khoản chưa được xác thực');
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    // Hash the refresh token before saving to database (SHA-256)
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Save refresh token to DB
    const expiryDate = new Date();
    // Default refresh token life: 7 days
    expiryDate.setDate(expiryDate.getDate() + 7);

    // One-to-one mapping check and save/update
    const existingToken = await RefreshToken.findOne({ where: { userId: user.id } });
    if (existingToken) {
        existingToken.token = hashedRefreshToken;
        existingToken.expiryDate = expiryDate;
        await existingToken.save();
    } else {
        await RefreshToken.create({
            token: hashedRefreshToken,
            userId: user.id,
            expiryDate: expiryDate
        });
    }

    return {
        accessToken: accessToken,
        refreshToken: refreshToken, // returned raw to allow controller to set cookie
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const logout = async (token) => {
    if (!token) return false;
    const hashedRefreshToken = crypto.createHash('sha256').update(token).digest('hex');
    await RefreshToken.destroy({
        where: { token: hashedRefreshToken }
    });
    return true;
};

const refreshAccessToken = async (token) => {
    if (!token) {
        throw new Error('Refresh token là bắt buộc');
    }

    // 1. Verify mathematically via tokenService (secret & JWT expiration)
    const decoded = tokenService.verifyRefreshToken(token);

    // 2. Hash incoming token and search in database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const dbToken = await RefreshToken.findOne({ where: { token: hashedToken } });
    if (!dbToken) {
        throw new Error('Refresh token không tồn tại hoặc đã bị hủy');
    }

    // 3. Check DB expiry date
    if (new Date(dbToken.expiryDate) < new Date()) {
        await dbToken.destroy();
        throw new Error('Refresh token đã hết hạn');
    }

    // 4. Find user
    const user = await User.findByPk(dbToken.userId);
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }

    // 5. Generate new access token and rotate refresh token
    const newAccessToken = tokenService.generateAccessToken(user);
    const newRefreshToken = tokenService.generateRefreshToken(user);

    // 6. Hash new refresh token and update DB
    const newHashedToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 7); // 7 days

    dbToken.token = newHashedToken;
    dbToken.expiryDate = newExpiryDate;
    await dbToken.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

const forgotPassword = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (!existingUser) {
        throw new Error('Tài khoản không tồn tại trong hệ thống');
    }

    // Call existing otpService helper to generate and store the OTP
    const userWithOtp = await otpService.generateOtp(normalizedEmail);

    // Send email with the generated OTP code
    await emailService.sendOtpEmail(normalizedEmail, userWithOtp.otpCode, 'forgot-password');

    return true;
};

const resetPassword = async (email, otp, newPassword) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
        throw new Error('Tài khoản không tồn tại');
    }

    if (user.otpCode !== otp) {
        throw new Error('Mã OTP không chính xác');
    }

    if (user.otpExpiry < Date.now()) {
        throw new Error('Mã OTP đã hết hạn');
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    return true;
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Người dùng không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return true;
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    changePassword
};