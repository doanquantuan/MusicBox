const db = require("../models");
const User = db.User;

const generateOtp = async (email, type) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otpCode = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    return user;
}

const verifyOtp = async (email, otp) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    if (user.otpCode !== otp) {
        throw new Error('Mã OTP không chính xác');
    }
    if (user.otpExpiry < Date.now()) {
        throw new Error('Mã OTP đã hết hạn');
    }
    user.otpCode = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();
    return user;
}

const resendOtp = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otpCode = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    return user;
}

module.exports = {
    generateOtp,
    verifyOtp,
    resendOtp
};