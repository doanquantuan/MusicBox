import React, { useState } from 'react';
import { Play, Download, Heart, Share2, MoreHorizontal, Music } from 'lucide-react';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80';

const PlaylistHeader = ({ playlist, songCount = 0, artistsSummary = "", onPlayAll, onDownload }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(playlist?.likeCount || 0);

    if (!playlist) return null;

    const title = playlist.playlistName || playlist.name || 'Playlist';
    const imageUrl = playlist.imageUrl || DEFAULT_COVER;
    const authorName = playlist.User?.name || 'MusicBox';
    const description = playlist.description || artistsSummary || `${authorName} và nhiều hơn`;

    const handleLikeToggle = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 shadow-2xl">
            {/* Square Playlist Cover Image (Left) */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 group">
                <img
                    src={imageUrl}
                    alt={title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_COVER;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </div>

            {/* Playlist Info & Actions (Right) */}
            <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left justify-between min-h-[208px]">
                <div>
                    {/* Header Label */}
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                        Playlist · <span className="text-gray-200 font-bold">{songCount} Bài hát</span>
                    </span>

                    {/* Playlist Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                        {title}
                    </h1>

                    {/* Artists / Description */}
                    <p className="text-sm text-gray-300 font-medium line-clamp-2 max-w-2xl mb-6">
                        {description}
                    </p>
                </div>

                {/* Interaction Row: Likes, Share, Options & Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 pt-2 w-full">
                    {/* Like Button */}
                    <div className="flex flex-col items-center">
                        <button
                            onClick={handleLikeToggle}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border ${
                                liked 
                                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 scale-105' 
                                    : 'bg-white/10 border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                            }`}
                            title="Yêu thích"
                        >
                            <Heart size={18} fill={liked ? '#f43f5e' : 'none'} />
                        </button>
                        <span className="text-[11px] font-semibold text-gray-400 mt-1">
                            {likeCount}
                        </span>
                    </div>

                    {/* Share Button */}
                    <div className="flex flex-col items-center">
                        <button
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                            title="Chia sẻ"
                        >
                            <Share2 size={18} />
                        </button>
                        <span className="text-[11px] font-semibold text-gray-400 mt-1">
                            0
                        </span>
                    </div>

                    {/* More Options Button */}
                    <div className="flex flex-col items-center">
                        <button
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                            title="Thao tác khác"
                        >
                            <MoreHorizontal size={18} />
                        </button>
                        <span className="text-[11px] font-semibold text-gray-400 mt-1 opacity-0">.</span>
                    </div>

                    {/* Spacer / Divider for wide screens */}
                    <div className="hidden sm:block flex-1" />

                    {/* Cyan Action Button: Phát tất cả */}
                    <button
                        onClick={onPlayAll}
                        className="
                            flex items-center justify-center gap-2.5 px-7 py-3 rounded-full
                            bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm sm:text-base
                            shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30
                            transition-all duration-200 cursor-pointer active:scale-95
                        "
                    >
                        <Play size={18} fill="currentColor" />
                        <span>Phát tất cả</span>
                    </button>

                    {/* Dark Action Button: Tải về */}
                    <button
                        onClick={onDownload}
                        className="
                            flex items-center justify-center gap-2 px-6 py-3 rounded-full
                            bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-sm sm:text-base
                            backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95
                        "
                    >
                        <Download size={18} />
                        <span>Tải về</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaylistHeader;
