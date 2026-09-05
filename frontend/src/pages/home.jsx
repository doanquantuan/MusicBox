import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/layout/background';
import Header from '../components/layout/header';
import { apiGetAccount } from '../util/api';
import { Music, Mic, ShieldAlert, PlusCircle, ListMusic, Users, Disc, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Spin } from 'antd';

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await apiGetAccount();
                if (res && res.success && res.data) {
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                } else {
                    // Fallback to local storage if API call fails or token expired
                    const localUser = localStorage.getItem("user");
                    if (localUser) {
                        setUser(JSON.parse(localUser));
                    } else {
                        navigate("/login");
                    }
                }
            } catch (error) {
                console.error("Failed to verify user token:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, [navigate]);

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <Background />
                <div className="flex flex-col items-center gap-3 z-10">
                    <Spin size="large" />
                    <p className="text-gray-400 text-sm">Đang xác thực quyền truy cập...</p>
                </div>
            </div>
        );
    }

    const userRole = (user?.role || 'User').toUpperCase();

    return (
        <div className="relative min-h-screen bg-slate-950 text-white flex flex-col">
            <Background />

            {/* Header */}
            <Header user={user} setUser={setUser} />

            {/* Main Container */}
            <main className="flex-1 max-w-6xl w-full mx-auto p-6 z-10">
                {/* Hero / Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-white/10 p-8 shadow-2xl backdrop-blur-md mb-8">
                    <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/10 text-xs font-medium mb-4">
                            <CheckCircle2 size={14} />
                            Đã xác thực thành công
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            Xin chào, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>!
                        </h1>
                        <p className="mt-2 text-gray-300 max-w-xl text-sm sm:text-base">
                            Chào mừng bạn đến với hệ thống MusicBox. Quyền hiện tại của bạn là{' '}
                            <span className="font-bold text-indigo-300 underline underline-offset-4">{userRole}</span>.
                        </p>
                    </div>
                </div>

                {/* Section: Dynamic Capabilities Based on Role */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Disc className="text-indigo-400" size={22} />
                        Chức năng dành cho vai trò ({userRole})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Option 1: General User Features */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:scale-[1.02] flex flex-col justify-between group">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Music size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Thư viện Nhạc</h3>
                                <p className="text-gray-400 text-sm">
                                    Khám phá danh sách bài hát yêu thích, nghe trực tuyến và tạo danh sách phát cá nhân.
                                </p>
                            </div>
                            <button className="mt-6 flex items-center gap-2 text-indigo-400 text-sm font-medium hover:text-indigo-300 group-hover:translate-x-1 transition-transform">
                                Khám phá ngay <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Option 2: Artist Features (If user is ARTIST or ADMIN, or show Register Artist for User) */}
                        {userRole === 'USER' && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:scale-[1.02] flex flex-col justify-between group">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Mic size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Đăng ký Nghệ sĩ</h3>
                                    <p className="text-gray-400 text-sm">
                                        Bạn là ca sĩ/nhạc sĩ? Đăng ký hồ sơ nghệ sĩ để tải nhạc trực tiếp lên nền tảng.
                                    </p>
                                </div>
                                <button className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium hover:text-emerald-300 group-hover:translate-x-1 transition-transform">
                                    Tạo hồ sơ Nghệ sĩ <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {(userRole === 'ARTIST' || userRole === 'ADMIN') && (
                            <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500 transition-all hover:scale-[1.02] flex flex-col justify-between group bg-emerald-950/10">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <PlusCircle size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Đăng tải Bài hát</h3>
                                    <p className="text-gray-400 text-sm">
                                        Dành cho Nghệ sĩ: Đăng tải bài hát mới của bạn lên hệ thống kèm theo hình ảnh minh họa.
                                    </p>
                                </div>
                                <button className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-medium hover:text-emerald-300 group-hover:translate-x-1 transition-transform">
                                    Tải nhạc lên <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Option 3: Admin Features */}
                        {userRole === 'ADMIN' && (
                            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-all hover:scale-[1.02] flex flex-col justify-between group bg-purple-950/10">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Quản trị Hệ thống</h3>
                                    <p className="text-gray-400 text-sm">
                                        Quản lý Thể loại nhạc, duyệt Nghệ sĩ và theo dõi toàn bộ hoạt động hệ thống.
                                    </p>
                                </div>
                                <button className="mt-6 flex items-center gap-2 text-purple-400 text-sm font-medium hover:text-purple-300 group-hover:translate-x-1 transition-transform">
                                    Vào trang Quản trị <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users size={18} className="text-indigo-400" /> Thông tin tài khoản
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-400 text-xs block mb-1">ID Người dùng</span>
                            <span className="font-semibold text-white">#{user?.id}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-400 text-xs block mb-1">Họ và Tên</span>
                            <span className="font-semibold text-white">{user?.name}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-400 text-xs block mb-1">Địa chỉ Email</span>
                            <span className="font-semibold text-white truncate block">{user?.email}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-gray-400 text-xs block mb-1">Vai trò (Role)</span>
                            <span className="font-semibold text-indigo-300">{userRole}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
