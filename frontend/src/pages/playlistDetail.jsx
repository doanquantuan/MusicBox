import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Background from '../components/layout/background';
import Navbar from '../components/layout/navbar';
import Header from '../components/layout/header';
import PlaylistHeader from '../components/context/PlaylistHeader';
import SongListTable from '../components/context/SongListTable';
import { apiGetAccount, apiGetPlaylistById, apiGetSongsInPlaylist } from '../util/api';
import { ArrowLeft } from 'lucide-react';
import { Spin, message } from 'antd';

const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // 1. Verify user account
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

                // 2. Fetch Playlist detail
                const playlistRes = await apiGetPlaylistById(playlistId);
                if (playlistRes && playlistRes.success && playlistRes.data) {
                    setPlaylist(playlistRes.data);
                } else if (playlistRes && playlistRes.id) {
                    setPlaylist(playlistRes);
                }

                // 3. Fetch Songs in Playlist
                const songsRes = await apiGetSongsInPlaylist(playlistId);
                if (songsRes && songsRes.success && Array.isArray(songsRes.data)) {
                    setSongs(songsRes.data);
                } else if (Array.isArray(songsRes)) {
                    setSongs(songsRes);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [playlistId, navigate]);

    const handlePlayAll = () => {
        if (songs.length === 0) {
            message.info("Playlist này chưa có bài hát để phát.");
            return;
        }
        message.success(`Đang phát tất cả ${songs.length} bài hát trong playlist!`);
    };

    const handleDownload = () => {
        message.info("Tính năng tải về danh sách phát đang được phát triển.");
    };

    const handlePlaySong = (song) => {
        message.success(`Đang phát bài hát: ${song?.songName || song?.title}`);
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <Background />
                <div className="flex flex-col items-center gap-3 z-10">
                    <Spin size="large" />
                    <p className="text-gray-400 text-sm">Đang tải chi tiết danh sách phát...</p>
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

                <main className="flex-1 max-w-6xl w-full mx-auto p-6 pb-24">
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

                    {/* Playlist Header Banner Component */}
                    <PlaylistHeader
                        playlist={playlist}
                        songCount={songs.length}
                        onPlayAll={handlePlayAll}
                        onDownload={handleDownload}
                    />

                    {/* Song List Table Component */}
                    <SongListTable
                        songs={songs}
                        onPlaySong={handlePlaySong}
                    />
                </main>
            </div>
        </div>
    );
};

export default PlaylistDetailPage;
