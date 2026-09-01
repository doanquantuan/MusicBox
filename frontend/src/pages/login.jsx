import Background from "../components/layout/background";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { apiLogin } from "../util/api";

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

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
                const res = await apiLogin(formData.email, formData.password);

                if (res && res.success) {
                    // Lưu token (nếu backend chưa thiết lập cookie, hoặc để dùng riêng)
                    if (res.data.accessToken) {
                        localStorage.setItem("access_token", res.data.accessToken);
                    }

                    notification.success({
                        message: "Thành công",
                        description: res.message || "Đăng nhập thành công",
                    });

                    // Chuyển hướng trang sau khi login
                    navigate("/"); // Điều hướng về trang chủ
                } else {
                    notification.error({
                        message: "Đăng nhập thất bại",
                        description: "Email hoặc mật khẩu không chính xác",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: error.response?.data?.message || "Đã có lỗi xảy ra từ máy chủ",
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

    const handleForgotPassword = () => {
        console.log("Forgot password");
    };

    return (

        <div className="relative min-h-screen flex items-center justify-center p-4">
            <Background />
            <div className="w-full sm:w-100 text-center bg-black/20 border border-white/10 rounded-2xl px-8">
                <h1 className="text-white text-3xl mt-10 font-medium text-center">Đăng nhập</h1>
                <p className="text-gray-400 text-sm mt-2 text-center">Hãy đăng nhập để tiếp tục</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" /> </svg>
                        <input type="email" name="email" placeholder="Email" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.email} onChange={handleInputChange} required />
                    </div>


                    <div className="relative flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full pl-6 pr-12 gap-2 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/75 shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none" value={formData.password} onChange={handleInputChange} required />

                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition" >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="h-2 mt-1.5 px-2"></div>

                    <div className="mt-4 text-left">
                        <button className="text-sm text-indigo-400 hover:underline">
                            Quên mật khẩu?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer" >
                    Bạn chưa có tài khoản?
                    <span className="text-indigo-400 hover:underline ml-1">Đăng ký</span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage