import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Background from '../components/layout/background';
import Navbar from '../components/layout/navbar';
import Header from '../components/layout/header';
import PlaylistCard from '../components/context/playlistCard';
import { apiGetAccount, apiGetTopicById, apiGetPlaylistsByTopic } from '../util/api';
import { ArrowLeft, ListMusic } from 'lucide-react';
import { Spin } from 'antd';

const FALLBACK_TOPIC_IMAGES = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
];

const TopicDetailPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [topic, setTopic] = useState(null);
    const [playlists, setPlaylists] = useState([]);
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

                // Fetch topic info
                const topicRes = await apiGetTopicById(topicId);
                if (topicRes && topicRes.success && topicRes.data) {
                    setTopic(topicRes.data);
                } else if (topicRes && topicRes.id) {
                    setTopic(topicRes);
                }

                // Fetch playlists in topic
                const playlistsRes = await apiGetPlaylistsByTopic(topicId);
                if (playlistsRes && playlistsRes.success && Array.isArray(playlistsRes.data)) {
                    setPlaylists(playlistsRes.data);
                } else if (Array.isArray(playlistsRes)) {
                    setPlaylists(playlistsRes);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết chủ đề:", error);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [topicId, navigate]);

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <Background />
                <div className="flex flex-col items-center gap-3 z-10">
                    <Spin size="large" />
                    <p className="text-gray-400 text-sm">Đang tải thông tin chủ đề...</p>
                </div>
            </div>
        );
    }

    const topicTitle = topic?.topicName || topic?.title || "Chủ Đề";
    const topicCover = topic?.imageUrl || FALLBACK_TOPIC_IMAGES[0];

    return (
        <div className="relative min-h-screen text-white flex flex-col">
            <Background />
            <Navbar />

            <div className="flex-1 flex flex-col ml-64">
                <Header user={user} setUser={setUser} />

                <main className="flex-1 max-w-6xl w-full mx-auto p-6">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer backdrop-blur-md"
                        >
                            <ArrowLeft size={16} />
                            <span>Quay lại</span>
                        </button>
                    </div>

                    {/* Topic Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                            <img
                                src={topicCover}
                                alt={topicTitle}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_TOPIC_IMAGES[0];
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
                                Chủ Đề Âm Nhạc
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                {topicTitle}
                            </h1>
                            <p className="mt-2 text-gray-300 text-sm max-w-xl">
                                Danh sách các Playlist nổi bật thuộc chủ đề <span className="text-white font-semibold">{topicTitle}</span>
                            </p>
                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-gray-400">
                                <span className="flex items-center gap-1">
                                    <ListMusic size={14} className="text-indigo-400" />
                                    {playlists.length} Playlist
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Playlists Section Title */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ListMusic size={20} className="text-indigo-400" />
                            Danh Sách Phát Chi Tiết
                        </h2>
                    </div>

                    {/* Playlists Grid */}
                    {playlists.length === 0 ? (
                        <div className="text-gray-400 text-sm italic py-12 text-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            Chưa có danh sách phát nào thuộc chủ đề này.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                            {playlists.map((playlist, index) => (
                                <PlaylistCard key={playlist.id || index} playlist={playlist} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TopicDetailPage;
