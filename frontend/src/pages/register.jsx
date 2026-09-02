import Background from "../components/layout/background";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { apiRegister, apiVerifyOtp, apiResendOtp } from "../util/api";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: ""
    })

    const [step, setStep] = useState("register");
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [countdown, setCountdown] = useState(60); // 60 giây
    const [canResend, setCanResend] = useState(false);

    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {};

        if (!formData.email.trim()) {
            errs.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errs.email = "Invalid email address";
        }

        if (!formData.password) {
            errs.password = "Password is required";
        }

        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            setLoading(true);
            try {
                const res = await apiRegister(formData.name, formData.email, formData.password);

                if (res && res.success) {
                    notification.success({
                        message: "Thành công",
                        description: res.message || "Đăng ký thành công",
                    });

                    setRegisteredEmail(formData.email);
                    setStep("verify");
                } else {
                    notification.error({
                        message: "Đăng ký thất bại",
                        description: res?.message || "Thông tin đăng ký không hợp lệ",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: error.response?.data?.message || error.message || "Đã có lỗi xảy ra từ máy chủ",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Cập nhật giá trị
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Validate realtime từng field
        setErrors((prev) => {
            const newErrors = { ...prev };

            if (name === "email") {
                if (!value.trim()) {
                    newErrors.email = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = "Invalid email address";
                } else {
                    delete newErrors.email; // Đã đúng → ẩn lỗi
                }
            }

            if (name === "password") {
                if (!value) {
                    newErrors.password = "Password is required";
                } else {
                    delete newErrors.password; // Đã đúng → ẩn lỗi
                }
            }

            // Xóa lỗi chung khi người dùng bắt đầu sửa
            delete newErrors.general;

            return newErrors;
        });
    };

    // Đếm ngược
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    // Gửi lại OTP
    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await apiResendOtp(registeredEmail); // API gửi lại OTP
            notification.success({
                message: "Thành công",
                description: "Đã gửi lại mã OTP",
            });

            // Reset đếm ngược
            setCountdown(60 * 5);
            setCanResend(false);
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || error.message || "Đã có lỗi xảy ra từ máy chủ",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password");
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault(); // Chống reload trang khi submit form
        
        setLoading(true);
        try {
            const res = await apiVerifyOtp(registeredEmail, formData.otp);
            
            if (res && res.success) {
                notification.success({
                    message: "Thành công",
                    description: "Đã xác thực tài khoản",
                });
                navigate("/login");
            } else {
                notification.error({
                    message: "Xác thực thất bại",
                    description: res?.message || "Mã OTP không chính xác",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || error.message || "Đã có lỗi xảy ra từ máy chủ",
            });
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="relative min-h-screen flex items-center justify-center p-4">
            <Background />
            <div className="w-full sm:w-100 text-center bg-black/20 border border-white/10 rounded-2xl px-8">
                {step === "register" ? (
                    <>
                        <h1 className="text-white text-3xl mt-10 font-medium text-center">Đăng ký</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center">Hãy đăng ký để tiếp tục</p>

                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                                <User size={14} className="text-white/75 shrink-0" />
                                <input type="text" name="name" placeholder="Name" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                                <Mail size={14} className="text-white/75 shrink-0" />
                                <input type="email" name="email" placeholder="Email" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.email} onChange={handleInputChange} required />
                            </div>


                            <div className="relative flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 pr-12 gap-2 transition-all">
                                <Lock size={14} className="text-white/75 shrink-0" />
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.password} onChange={handleInputChange} required />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition" >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="h-2 mt-1.5 px-2"></div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Đang đăng ký...</span>
                                    </>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </form>

                        <p className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
                            Bạn chưa có tài khoản?
                            <span className="text-indigo-400 hover:underline ml-1">Đăng ký</span>
                        </p>
                    </>
                ) : (
                    step === "verify" && <>
                        <h1 className="text-white text-3xl mt-10 font-medium text-center">Xác thực tài khoản</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center">Hãy nhập mã xác thực để tiếp tục</p>

                        <form onSubmit={handleVerifyOtp}>
                            <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">

                                <input type="text" name="otp" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.otp} onChange={handleInputChange} required />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Đang xác thực...</span>
                                    </>
                                ) : (
                                    "Xác thực"
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="text-sm text-indigo-400 hover:underline disabled:opacity-50 disabled:no-underline mb-10"
                                    >
                                        {loading ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-400 mb-10">
                                        Gửi lại mã OTP sau <span className="text-indigo-400 font-medium">{countdown}s</span>
                                    </p>
                                )}
                            </div>
                        </form>
                    </>
                )
                }
            </div>
        </div>
    )
}

export default RegisterPage