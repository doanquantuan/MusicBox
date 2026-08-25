const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth.middleware");

const {
    validateRegister,
    validateLogin,
    validateVerifyOtp,
    validateResendOtp,
    validateForgotPassword,
    validateResetPassword,
    validateChangePassword
} = require("../validators/auth.validator");

// Public authentication routes
router.post("/register", validateRegister, authController.register);
router.post("/verify-otp", validateVerifyOtp, authController.verifyOtp);
router.post("/resend-otp", validateResendOtp, authController.resendOtp);
router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);

// Protected routes (require valid Access Token)
router.get("/me", authenticate, authController.getMe);
router.post("/change-password", authenticate, validateChangePassword, authController.changePassword);

// Password recovery routes
router.post("/forgot-password", validateForgotPassword, authController.forgotPassword);
router.post("/reset-password", validateResetPassword, authController.resetPassword);

module.exports = router;
