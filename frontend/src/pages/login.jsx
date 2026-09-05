import Background from "../components/layout/background";
import { Eye, EyeOff, Mail, Lock, Loader2, KeyRound, ArrowRight, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification, Steps, ConfigProvider, theme } from "antd";
import { UserOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { apiLogin, apiVerifyOtp, apiResendOtp } from "../util/api";

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    // State cho Popup Kích hoạt tài khoản / Xác thực OTP
    const [activateModalVisible, setActivateModalVisible] = useState(false);
    const [emailForActivate, setEmailForActivate] = useState("");
    const [otp, setOtp] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1); // 0 = Login, 1 = Verification, 2 = Done
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(true);

    // Countdown effect cho nút Resend OTP
    useEffect(() => {
        let timer;
        if (activateModalVisible && !canResend && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [activateModalVisible, canResend, countdown]);

    const validate = () => {
        const errs = {};

        if (!formData.email.trim()) {
            errs.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errs.email = "Email không hợp lệ";
        }

        if (!formData.password) {
            errs.password = "Mật khẩu là bắt buộc";
        }

        return errs;
    };

    const handleLoginSubmit = async (e) => {
        if (e) e.preventDefault();
        const errs = validate();
        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            setLoading(true);
            try {
                const res = await apiLogin(formData.email, formData.password);

                if (res && res.success) {
                    // Lưu token và thông tin người dùng
                    if (res.data?.accessToken) {
                        localStorage.setItem("access_token", res.data.accessToken);
                    }
                    if (res.data?.user) {
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                    }

                    notification.success({
                        message: "Đăng nhập thành công",
                        description: res.message || "Chào mừng bạn quay trở lại!",
                    });

                    // Chuyển hướng về trang chủ
                    navigate("/");
                } else {
                    const msg = res?.message || "Email hoặc mật khẩu không chính xác";
                    if (msg.includes("chưa được xác thực") || msg.includes("chưa xác thực") || msg.includes("chưa kích hoạt")) {
                        setEmailForActivate(formData.email);
                        setActivateModalVisible(true);
                        setActiveStep(1);
                        notification.warning({
                            message: "Tài khoản chưa kích hoạt",
                            description: "Vui lòng nhập mã OTP để kích hoạt ngay.",
                        });
                    } else {
                        notification.error({
                            message: "Đăng nhập thất bại",
                            description: msg,
                        });
                    }
                }
            } catch (error) {
                const errMsg = error.response?.data?.message || error.message || "Đã có lỗi xảy ra từ máy chủ";

                if (errMsg.includes("chưa được xác thực") || errMsg.includes("chưa xác thực") || errMsg.includes("chưa kích hoạt")) {
                    setEmailForActivate(formData.email);
                    setActivateModalVisible(true);
                    setActiveStep(1);
                    notification.warning({
                        message: "Tài khoản chưa kích hoạt",
                        description: "Vui lòng nhập mã OTP để kích hoạt ngay.",
                    });
                } else {
                    notification.error({
                        message: "Đăng nhập thất bại",
                        description: errMsg,
                    });
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Gửi lại mã kích hoạt (OTP)
    const handleResendActivation = async () => {
        if (!emailForActivate) return;
        setResendLoading(true);
        try {
            const res = await apiResendOtp(emailForActivate);
            if (res && res.success) {
                notification.success({
                    message: "Đã gửi mã OTP",
                    description: res.message || "Mã OTP mới đã được gửi tới email của bạn.",
                });
                setCountdown(60);
                setCanResend(false);
            } else {
                notification.error({
                    message: "Gửi thất bại",
                    description: res?.message || "Không thể gửi lại mã OTP",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể gửi lại mã OTP",
            });
        } finally {
            setResendLoading(false);
        }
    };

    // Xác thực mã OTP trong Popup
    const handleVerifyActivation = async () => {
        if (!otp.trim()) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng nhập mã OTP",
            });
            return;
        }

        setVerifyLoading(true);
        try {
            const res = await apiVerifyOtp(emailForActivate, otp.trim());
            if (res && res.success) {
                setActiveStep(2); // Hoàn tất
                notification.success({
                    message: "Kích hoạt thành công",
                    description: "Tài khoản của bạn đã được kích hoạt thành công! Đang tiến hành đăng nhập...",
                });

                setTimeout(async () => {
                    setActivateModalVisible(false);
                    setOtp("");
                    handleLoginSubmit();
                }, 1200);
            } else {
                notification.error({
                    message: "Xác thực thất bại",
                    description: res?.message || "Mã OTP không đúng hoặc đã hết hạn",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi xác thực",
                description: error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn",
            });
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => {
            const newErrors = { ...prev };
            if (name === "email") {
                if (!value.trim()) {
                    newErrors.email = "Email là bắt buộc";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = "Email không hợp lệ";
                } else {
                    delete newErrors.email;
                }
            }
            if (name === "password") {
                if (!value) {
                    newErrors.password = "Mật khẩu là bắt buộc";
                } else {
                    delete newErrors.password;
                }
            }
            return newErrors;
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            <Background />

            {/* Main Login Card */}
            <div className="w-full sm:w-100 text-center bg-black/30 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-xl shadow-2xl z-10">
                <h1 className="text-white text-3xl mt-8 font-medium text-center">Đăng nhập</h1>
                <p className="text-gray-400 text-sm mt-2 text-center">Hãy đăng nhập để tiếp tục trải nghiệm</p>

                <form onSubmit={handleLoginSubmit} className="mt-6">
                    {/* Input Email */}
                    <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                        <Mail size={16} className="text-white/75 shrink-0" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-sm"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-xs text-left mt-1 ml-4">{errors.email}</p>
                    )}

                    {/* Input Password */}
                    <div className="relative flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 pr-12 gap-2 transition-all">
                        <Lock size={16} className="text-white/75 shrink-0" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Mật khẩu"
                            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-sm"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-xs text-left mt-1 ml-4">{errors.password}</p>
                    )}

                    <div className="mt-4 text-left">
                        <button type="button" className="text-sm text-indigo-400 hover:underline">
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Nút Đăng nhập */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg shadow-indigo-600/30"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Đang đăng nhập...</span>
                            </>
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-6 mb-8 cursor-pointer">
                    Bạn chưa có tài khoản?
                    <Link to="/register" className="text-indigo-400 hover:underline ml-1 font-medium">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>

            {/* ==================== CỬA SỔ POPUP XÁC THỰC NHỎ (KHÔNG CHE PHỦ BACKGROUND) ==================== */}
            {activateModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Semi-transparent Backdrop Overlay - retains background image visibility */}
                    <div
                        className="absolute inset-0 max-w-lg backdrop-blur-[2px]"
                        onClick={() => setActivateModalVisible(false)}
                    />

                    {/* Popup Content Card */}
                    <div className="relative w-full max-w-[548px] bg-slate-900/90 border border-white/15 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl text-white z-10">
                        {/* Close Icon */}
                        <button
                            onClick={() => setActivateModalVisible(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Title Header */}
                        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
                            <SafetyOutlined className="text-indigo-400 text-lg" />
                            <h3 className="text-base font-semibold text-white">Kích hoạt tài khoản</h3>
                        </div>

                        {/* Stepper */}
                        <ConfigProvider
                            theme={{
                                algorithm: theme.darkAlgorithm,
                                token: {
                                    colorPrimary: '#6366f1',
                                    colorText: '#ffffff',
                                    colorTextSecondary: '#9ca3af',
                                }
                            }}
                        >
                            <Steps
                                current={activeStep}
                                size="small"
                                className="my-3"
                                items={[
                                    {
                                        title: "Login",
                                        icon: <UserOutlined />,
                                    },
                                    {
                                        title: "Verification",
                                        icon: <SafetyOutlined />,
                                    },
                                    {
                                        title: "Done",
                                        icon: <CheckCircleOutlined />,
                                    },
                                ]}
                            />
                        </ConfigProvider>

                        {/* Form & Actions */}
                        <div className="mt-4 space-y-3.5 text-left">
                            <p className="text-gray-300 text-xs leading-relaxed">
                                Tài khoản chưa kích hoạt. Vui lòng nhập mã OTP 6 chữ số đã được gửi tới email bên dưới:
                            </p>

                            {/* Email Readonly */}
                            <div>
                                <label className="text-[11px] text-gray-400 font-medium block mb-1">Email kích hoạt</label>
                                <div className="flex items-center w-full bg-white/5 border border-white/10 h-10 rounded-full px-3 gap-2 text-gray-300 text-xs">
                                    <Mail size={14} className="text-gray-400 shrink-0" />
                                    <span className="font-medium truncate">{emailForActivate}</span>
                                </div>
                            </div>

                            {/* Form Nhập OTP */}
                            <div>
                                <label className="text-[11px] text-gray-400 font-medium block mb-1">Mã OTP (6 chữ số)</label>
                                <div className="flex items-center w-full bg-white/5 ring-1 ring-white/15 focus-within:ring-indigo-500/80 h-11 rounded-full px-3 gap-2 transition-all">
                                    <KeyRound size={16} className="text-indigo-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="• • • • • •"
                                        maxLength={6}
                                        className="w-full bg-transparent text-white placeholder-white/30 border-none outline-none font-mono text-center text-lg tracking-[0.4em] font-bold"
                                    />
                                </div>
                            </div>

                            {/* Nút thao tác */}
                            <div className="pt-2 flex flex-col gap-2.5">
                                <button
                                    type="button"
                                    disabled={verifyLoading}
                                    onClick={handleVerifyActivation}
                                    className="w-full h-10 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium shadow-md shadow-indigo-600/30"
                                >
                                    {verifyLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Đang xác thực...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Xác thực & Kích hoạt</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-gray-400">Chưa nhận được mã?</span>
                                    <button
                                        type="button"
                                        disabled={resendLoading || !canResend}
                                        onClick={handleResendActivation}
                                        className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs font-medium transition disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                                    >
                                        {resendLoading && <RefreshCw size={12} className="animate-spin" />}
                                        {canResend ? "Gửi lại mã OTP" : `Gửi lại sau ${countdown}s`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;