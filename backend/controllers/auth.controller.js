const authService = require("../services/auth.service");
const otpService = require("../services/otp.service");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email và mật khẩu không được để trống"
            });
        }

        const result = await authService.login(email, password);

        // Set HttpOnly cookie for Refresh Token
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                accessToken: result.accessToken,
                user: result.user
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token không tồn tại"
            });
        }

        const result = await authService.refreshAccessToken(token);

        // Update the HttpOnly cookie with the new rotated Refresh Token
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Lấy Access Token mới thành công",
            data: {
                accessToken: result.accessToken
            }
        });
    } catch (error) {
        // Clear cookie if refresh failed (revoked or expired)
        res.clearCookie('refreshToken');
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            await authService.logout(token);
        }

        // Clear HttpOnly cookie on client browser
        res.clearCookie('refreshToken');

        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Tên, email và mật khẩu không được để trống"
            });
        }

        const data = await authService.register(name, email, password);
        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực OTP.",
            data
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email và mã OTP không được để trống"
            });
        }

        await otpService.verifyOtp(email, otp);
        return res.status(200).json({
            success: true,
            message: "Xác thực tài khoản thành công. Bạn có thể đăng nhập."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email không được để trống"
            });
        }

        const user = await otpService.resendOtp(email);
        
        // Resend email
        const emailService = require("../services/email.service");
        await emailService.sendOtpEmail(user.email, user.otpCode, 'verify-email');

        return res.status(200).json({
            success: true,
            message: "Mã OTP mới đã được gửi lại vào email của bạn."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        const { id, name, email, role, createdAt, updatedAt } = req.user;
        return res.status(200).json({
            success: true,
            data: { id, name, email, role, createdAt, updatedAt }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu cũ và mật khẩu mới không được để trống"
            });
        }

        await authService.changePassword(req.user.id, oldPassword, newPassword);

        return res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email không được để trống"
            });
        }

        await authService.forgotPassword(email);

        return res.status(200).json({
            success: true,
            message: "Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, mã OTP và mật khẩu mới không được để trống"
            });
        }

        await authService.resetPassword(email, otp, newPassword);

        return res.status(200).json({
            success: true,
            message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login,
    refresh,
    logout,
    register,
    verifyOtp,
    resendOtp,
    getMe,
    changePassword,
    forgotPassword,
    resetPassword
};
