import React, { useEffect, useState } from 'react';
import { apiGetTopics } from '../../util/api';
import { Spin } from 'antd';
import { Music } from 'lucide-react';
import { Link } from "react-router-dom";


const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
];

const Topic = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await apiGetTopics();
                if (res && res.success && Array.isArray(res.data)) {
                    setTopics(res.data.slice(0, 10));
                } else if (Array.isArray(res)) {
                    setTopics(res.slice(0, 10));
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chủ đề:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return (
        <div className="mb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Chủ Đề</h2>


                <Link
                    to="/topics"
                    className="
                        inline-flex items-center gap-1.5
                        rounded-lg
                        border border-white/10
                        bg-white/5
                        px-3 py-1.5
                        text-xs font-semibold text-gray-400
                        transition-all duration-200
                        hover:border-white/20
                        hover:bg-white/10
                        hover:text-white
                    "
                >
                    Xem thêm
                </Link>
            </div>

            {/* Grid Container */}
            {
                loading ? (
                    <div className="flex justify-center items-center py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <Spin size="large" />
                    </div>
                ) : topics.length === 0 ? (
                    <div className="text-gray-400 text-sm italic py-6 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        Chưa có chủ đề nào.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {topics.map((topic, index) => {
                            const image = topic.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                            const title = topic.topicName || topic.title || 'Chủ đề';

                            return (
                                <Link
                                    to={`/topics/${topic.id}`}
                                    key={topic.id || index}
                                    className="
                                    group relative flex h-28 sm:h-32 overflow-hidden rounded-2xl
                                    bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                                    backdrop-blur-md cursor-pointer shadow-lg
                                    transition-all duration-300 hover:-translate-y-1
                                "
                                >
                                    {/* Left Content */}
                                    <div className="flex flex-1 flex-col justify-center p-4 z-10">
                                        <span className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight group-hover:translate-x-1 transition-transform duration-300 line-clamp-2 drop-shadow-sm">
                                            {title}
                                        </span>
                                    </div>

                                    {/* Right Image Container */}
                                    <div className="relative w-[42%] h-full overflow-hidden flex items-center justify-center bg-white/5">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                                                }}
                                                className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Music size={24} className="text-gray-400" />
                                        )}

                                        {/* Smooth Mask Overlay */}
                                        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-950/70 to-transparent" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )
            }
        </div >
    );
};

export default Topic;
