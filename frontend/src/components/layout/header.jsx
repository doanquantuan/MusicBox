import React from 'react';
import { Search, LogOut, User, Music, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiLogout } from '../../util/api';
import { notification } from 'antd';

const Header = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            if (setUser) setUser(null);
            notification.success({
                message: "Đăng xuất",
                description: "Bạn đã đăng xuất thành công."
            });
            navigate("/login");
        }
    };

    const getRoleBadge = (role) => {
        const r = (role || 'User').toUpperCase();
        if (r === 'ADMIN') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/40 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <Shield size={12} />
                    ADMIN
                </span>
            );
        } else if (r === 'ARTIST') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Sparkles size={12} />
                    ARTIST
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-500/40 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                <User size={12} />
                USER
            </span>
        );
    };

    return (
        <header className="w-full bg-slate-950/50 backdrop-blur-2xl border-b border-white/10 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
            {/* Search Bar (Left) */}
            <div className="flex-1 max-w-md relative left-5">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"

                    className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                       transition-all hover:bg-white/10"
                />
            </div>


            {/* User Profile & Actions (Right) */}
            {user && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="text-sm font-medium text-white leading-tight">{user.name}</div>
                            <div className="text-xs text-gray-400 leading-tight">{user.email}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
