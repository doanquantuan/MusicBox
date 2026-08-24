const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push("Tên đăng ký phải có ít nhất 2 ký tự");
    }

    if (name && name.trim().length > 50) {
        errors.push("Tên đăng ký không được vượt quá 50 ký tự");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
    }

    if (!password || typeof password !== 'string') {
        errors.push("Mật khẩu không được để trống");
    } else {
        if (password.length < 8) {
            errors.push("Mật khẩu phải có ít nhất 8 ký tự");
        }
        if (password.length > 50) {
            errors.push("Mật khẩu không được vượt quá 50 ký tự");
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.push("Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        errors.push("Mật khẩu không được để trống");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

const validateVerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
        errors.push("Mã OTP phải có đúng 6 chữ số");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

const validateResendOtp = validateForgotPassword;

const validateResetPassword = (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
        errors.push("Mã OTP phải có đúng 6 chữ số");
    }

    if (!newPassword || typeof newPassword !== 'string') {
        errors.push("Mật khẩu mới không được để trống");
    } else {
        if (newPassword.length < 8) {
            errors.push("Mật khẩu mới phải có ít nhất 8 ký tự");
        }
        if (newPassword.length > 50) {
            errors.push("Mật khẩu mới không được vượt quá 50 ký tự");
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            errors.push("Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

const validateChangePassword = (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const errors = [];

    if (!oldPassword || typeof oldPassword !== 'string' || oldPassword.trim().length === 0) {
        errors.push("Mật khẩu cũ không được để trống");
    }

    if (!newPassword || typeof newPassword !== 'string') {
        errors.push("Mật khẩu mới không được để trống");
    } else {
        if (newPassword.length < 8) {
            errors.push("Mật khẩu mới phải có ít nhất 8 ký tự");
        }
        if (newPassword.length > 50) {
            errors.push("Mật khẩu mới không được vượt quá 50 ký tự");
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            errors.push("Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors: errors
        });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateVerifyOtp,
    validateResendOtp,
    validateForgotPassword,
    validateResetPassword,
    validateChangePassword
};
