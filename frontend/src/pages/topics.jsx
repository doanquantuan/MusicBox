import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Background from '../components/layout/background';
import Navbar from '../components/layout/navbar';
import Header from '../components/layout/header';
import { apiGetAccount, apiGetTopics } from '../util/api';
import { Music, ArrowLeft, Layers } from 'lucide-react';
import { Spin } from 'antd';

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

const TopicsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Verify user account
                const accountRes = await apiGetAccount();
                if (accountRes && accountRes.success && accountRes.data) {
                    setUser(accountRes.data);
                    localStorage.setItem("user", JSON.stringify(accountRes.data));
                } else {
                    const localUser = localStorage.getItem("user");
                    if (localUser) {
                        setUser(JSON.parse(localUser));
                    } else {
                        navigate("/login");
                        return;
                    }
                }

                // Fetch ALL topics
                const topicRes = await apiGetTopics();
                if (topicRes && topicRes.success && Array.isArray(topicRes.data)) {
                    setTopics(topicRes.data);
                } else if (Array.isArray(topicRes)) {
                    setTopics(topicRes);
                }
            } catch (error) {
                console.error("Failed to fetch topics page data:", error);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <Background />
                <div className="flex flex-col items-center gap-3 z-10">
                    <Spin size="large" />
                    <p className="text-gray-400 text-sm">Đang tải danh sách chủ đề...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen text-white flex flex-col">
            <Background />
            <Navbar />

            <div className="flex-1 flex flex-col ml-64">
                <Header user={user} setUser={setUser} />

                <main className="flex-1 max-w-6xl w-full mx-auto p-6">
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                                title="Quay lại"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                                    <Layers className="text-indigo-400" size={28} />
                                    Tất Cả Chủ Đề
                                </h1>
                                <p className="text-sm text-gray-400 mt-1">
                                    Khám phá toàn bộ {topics.length} chủ đề âm nhạc độc đáo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Topics Grid */}
                    {topics.length === 0 ? (
                        <div className="text-gray-400 text-sm italic py-12 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            Chưa có chủ đề nào trong hệ thống.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                                            transition-all duration-300 hover:-translate-y-1.5
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

                                            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-950/70 to-transparent" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TopicsPage;
