
import React, { useState } from 'react';
import { Music, AudioLines, BarChart2, User, Heart, History, Plus } from 'lucide-react';

const Navbar = ({ activeTab, onTabChange, playlists = [], onAddPlaylist }) => {
    const [localTab, setLocalTab] = useState('kham-pha');

    // Controlled if activeTab prop is passed, otherwise fallback to local state
    const currentTab = activeTab !== undefined ? activeTab : localTab;

    const handleSelect = (id) => {
        setLocalTab(id);
        if (onTabChange) {
            onTabChange(id);
        }
    };

    const mainNavItems = [
        {
            id: 'kham-pha',
            label: 'Khám Phá',
            icon: AudioLines,
            activeColor: 'text-indigo-400'
        },
        {
            id: 'danh-cho-ban',
            label: 'Dành Cho Bạn',
            icon: BarChart2,
            activeColor: 'text-purple-400'
        },
        {
            id: 'cua-tui',
            label: 'Của Tui',
            icon: User,
            activeColor: 'text-pink-400'
        },
    ];

    const libraryNavItems = [
        {
            id: 'yeu-thich',
            label: 'Bài hát Yêu thích',
            icon: Heart,
            activeColor: 'text-rose-400'
        },
        {
            id: 'nghe-gan-day',
            label: 'Nghe gần đây',
            icon: History,
            activeColor: 'text-indigo-400'
        },
    ];

    return (
        <aside className="fixed w-64 top-[5px] h-[calc(100vh-5px)] bg-slate-950/40 backdrop-blur-2xl text-white p-4 flex flex-col gap-6 select-none font-sans shrink-0 z-20 border-r border-white/10 overflow-y-auto">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Music size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wide">MusicBox</h1>
                    <p className="text-xs text-gray-400">Stream & Discover</p>
                </div>
            </div>
            {/* Top Navigation Group */}
            <div className="flex flex-col gap-2">
                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-full text-base font-bold transition-all duration-150 ease-in-out text-left w-full cursor-pointer active:scale-[0.96] ${isActive
                                ? 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl translate-x-1'
                                : 'text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                                }`}
                        >
                            <Icon
                                size={22}
                                className={`transition-transform duration-150 group-hover:scale-110 ${isActive ? `${item.activeColor} scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]` : 'text-gray-400 group-hover:text-white'
                                    }`}
                            />
                            <span className="transition-colors duration-150">{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* THƯ VIỆN Section */}
            <div className="flex flex-col gap-2">
                <h3 className="px-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    THƯ VIỆN
                </h3>
                <div className="flex flex-col gap-2">
                    {libraryNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item.id)}
                                className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-full text-base font-bold transition-all duration-150 ease-in-out text-left w-full cursor-pointer active:scale-[0.96] ${isActive
                                    ? 'bg-gradient-to-r from-white/20 via-white/15 to-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl translate-x-1'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                                    }`}
                            >
                                <Icon
                                    size={22}
                                    className={`transition-transform duration-150 group-hover:scale-110 ${isActive ? `${item.activeColor} scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]` : 'text-gray-400 group-hover:text-white'
                                        }`}
                                />
                                <span className="transition-colors duration-150">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PLAYLIST ĐÃ TẠO Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                        PLAYLIST ĐÃ TẠO
                    </h3>
                    <button
                        onClick={onAddPlaylist}
                        className="text-gray-400 hover:text-white transition-all duration-150 p-1.5 rounded-full hover:bg-white/15 active:scale-90 flex items-center justify-center cursor-pointer"
                        title="Tạo playlist mới"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Playlist list */}
                <div className="flex flex-col gap-1.5 mt-1 max-h-48 overflow-y-auto">
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => handleSelect(`playlist-${playlist.id}`)}
                                className={`px-4 py-2.5 text-sm font-semibold rounded-full text-left truncate transition-all duration-150 ease-in-out cursor-pointer active:scale-[0.97] ${currentTab === `playlist-${playlist.id}`
                                    ? 'bg-white/20 text-white translate-x-1 shadow-md'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10 hover:translate-x-1'
                                    }`}
                            >
                                {playlist.name}
                            </button>
                        ))
                    ) : (
                        <p className="px-4 text-xs text-gray-500 py-1 italic">
                            Chưa có playlist nào
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Navbar;
