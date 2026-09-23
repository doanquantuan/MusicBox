import React from 'react';
import { Play, Music } from 'lucide-react';

const DEFAULT_SONG_COVER = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80';

const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '03:30';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SongRow = ({ item, index, onPlay }) => {
    // item can be PlaylistSong junction record containing .Song or direct Song object
    const song = item?.Song || item;
    const songName = song?.songName || song?.title || 'Bài hát không tên';
    const coverImage = song?.coverImgUrl || DEFAULT_SONG_COVER;
    const durationStr = formatDuration(song?.duration);
    
    // Extract artists
    const artistList = song?.artists && Array.isArray(song.artists) && song.artists.length > 0
        ? song.artists.map(a => a.artistName).join(', ')
        : (song?.artistName || 'Nghệ sĩ');

    // Extract uploader / provider
    const uploader = song?.Album?.albumName || item?.User?.name || 'BELIEVE MUSIC';

    return (
        <div
            onClick={() => onPlay && onPlay(song)}
            className="
                group relative grid grid-cols-12 items-center px-4 py-3 rounded-xl
                hover:bg-white/10 transition-colors duration-200 cursor-pointer text-sm
                border-b border-white/5 last:border-b-0
            "
        >
            {/* Index # (Cols 1) */}
            <div className="col-span-1 flex items-center justify-center font-bold text-gray-400 group-hover:text-white">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play size={16} fill="white" className="hidden group-hover:block text-cyan-400" />
            </div>

            {/* Song Thumbnail & Title (Cols 5) */}
            <div className="col-span-5 flex items-center gap-3 overflow-hidden pr-2">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/10">
                    <img
                        src={coverImage}
                        alt={songName}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_SONG_COVER;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="flex flex-col truncate">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {songName}
                    </span>
                </div>
            </div>

            {/* Uploader / Provider (Cols 3) */}
            <div className="col-span-3 hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-300 truncate">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-cyan-400 border border-white/10 shrink-0">
                    🎵
                </div>
                <span className="truncate">{uploader}</span>
            </div>

            {/* Artist(s) (Cols 2) */}
            <div className="col-span-2 hidden md:block text-xs text-gray-400 truncate">
                <span className="truncate">{artistList}</span>
            </div>

            {/* Duration (Cols 1) */}
            <div className="col-span-6 sm:col-span-3 md:col-span-1 text-right text-xs font-semibold text-gray-400">
                {durationStr}
            </div>
        </div>
    );
};

export default SongRow;
