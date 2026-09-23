import React from 'react';
import { Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_PLAYLIST_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80';

const PlaylistCard = ({ playlist, onClick, to }) => {
    if (!playlist) return null;

    const title = playlist.playlistName || playlist.name || 'Playlist';
    const imageUrl = playlist.imageUrl || DEFAULT_PLAYLIST_COVER;
    const authorName = playlist.User?.name || playlist.author || 'MusicBox';

    const CardContent = (
        <div
            className="
                group relative flex flex-col overflow-hidden rounded-2xl
                bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                backdrop-blur-md cursor-pointer shadow-lg p-3.5
                transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10
                h-full justify-between
            "
        >
            {/* Hình ảnh playlist (phía trên) */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-white/5 shrink-0">
                <img
                    src={imageUrl}
                    alt={title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PLAYLIST_COVER;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay nút Play khi hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                        <Play size={20} fill="white" className="ml-0.5" />
                    </div>
                </div>
            </div>

            {/* Thông tin bên dưới ảnh */}
            <div className="flex flex-col flex-1 justify-between">
                {/* Tên Playlist (bên dưới ảnh) */}
                <h3 className="text-sm font-bold text-white tracking-wide line-clamp-1 group-hover:text-indigo-300 transition-colors mb-1" title={title}>
                    {title}
                </h3>

                {/* Tác giả / Người tạo */}
                <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                    <User size={12} className="shrink-0 text-indigo-400" />
                    <span className="truncate">{authorName}</span>
                </p>
            </div>
        </div>
    );

    if (to) {
        return (
            <Link to={to} className="block h-full">
                {CardContent}
            </Link>
        );
    }

    if (onClick) {
        return (
            <div onClick={onClick} className="h-full">
                {CardContent}
            </div>
        );
    }

    return CardContent;
};

export default PlaylistCard;
