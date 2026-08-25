import request from "supertest";
import app from "../server";
import authService from "../services/auth.service";
import otpService from "../services/otp.service";

// Mock the service layer to isolate controller and router testing
jest.mock("../services/auth.service");
jest.mock("../services/otp.service");
jest.mock("../middlewares/auth.middleware", () => ({
    authenticate: (req, res, next) => {
        req.user = { id: 1, name: "Test User", email: "test@example.com" };
        next();
    }
}));

describe("Auth API Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/register", () => {
        it("should register user successfully", async () => {
            const mockUser = { id: 1, name: "Test User", email: "test@example.com", isVerified: false };
            authService.register.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/register")
                .send({ name: "Test User", email: "test@example.com", password: "Password123!" });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockUser);
            expect(authService.register).toHaveBeenCalledWith("Test User", "test@example.com", "Password123!");
        });

        it("should return 400 if fields are missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ name: "Test User" });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toContain("Email không đúng định dạng");
            expect(res.body.errors).toContain("Mật khẩu không được để trống");
        });
    });

    describe("POST /api/auth/verify-otp", () => {
        it("should verify OTP successfully", async () => {
            otpService.verifyOtp.mockResolvedValue(true);

            const res = await request(app)
                .post("/api/auth/verify-otp")
                .send({ email: "test@example.com", otp: "123456" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Xác thực tài khoản thành công");
            expect(otpService.verifyOtp).toHaveBeenCalledWith("test@example.com", "123456");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login successfully and set HttpOnly cookie", async () => {
            const mockLoginResult = {
                accessToken: "mockAccessToken",
                refreshToken: "mockRefreshToken",
                user: { id: 1, name: "Test User", email: "test@example.com", role: "User" }
            };
            authService.login.mockResolvedValue(mockLoginResult);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "test@example.com", password: "Password123!" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toEqual("mockAccessToken");
            expect(res.headers["set-cookie"]).toBeDefined();
            expect(res.headers["set-cookie"][0]).toContain("refreshToken=mockRefreshToken");
        });
    });

    describe("POST /api/auth/logout", () => {
        it("should logout successfully and clear cookie", async () => {
            authService.logout.mockResolvedValue(true);

            const res = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", ["refreshToken=mockRefreshToken"]);

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Đăng xuất thành công");
        });
    });

    describe("POST /api/auth/forgot-password", () => {
        it("should request password reset OTP successfully", async () => {
            authService.forgotPassword.mockResolvedValue(true);

            const res = await request(app)
                .post("/api/auth/forgot-password")
                .send({ email: "test@example.com" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Mã OTP khôi phục mật khẩu");
        });
    });

    describe("POST /api/auth/reset-password", () => {
        it("should reset password successfully using OTP", async () => {
            authService.resetPassword.mockResolvedValue(true);

            const res = await request(app)
                .post("/api/auth/reset-password")
                .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword123!" });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("Đặt lại mật khẩu thành công");
        });
    });
});
