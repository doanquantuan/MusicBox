import React from 'react';
import { Clock, Info } from 'lucide-react';
import SongRow from './SongRow';

const SongListTable = ({ songs = [], onPlaySong }) => {
    if (!songs || songs.length === 0) {
        return (
            <div className="text-gray-400 text-sm italic py-16 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                Chưa có bài hát nào trong playlist này.
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 sm:p-6 shadow-xl">
            {/* Table Header Row */}
            <div className="grid grid-cols-12 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-400 border-b border-white/10 mb-2">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Tiêu đề</div>
                <div className="col-span-3 hidden sm:block">Người đăng</div>
                <div className="col-span-2 hidden md:block">Nghệ sĩ</div>
                <div className="col-span-6 sm:col-span-3 md:col-span-1 text-right flex items-center justify-end">
                    <Info size={16} title="Thời lượng" />
                </div>
            </div>

            {/* Song Rows List */}
            <div className="flex flex-col">
                {songs.map((item, idx) => (
                    <SongRow
                        key={item?.id || item?.Song?.id || idx}
                        item={item}
                        index={idx}
                        onPlay={onPlaySong}
                    />
                ))}
            </div>
        </div>
    );
};

export default SongListTable;
