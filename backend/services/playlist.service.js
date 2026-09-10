const PlaylistRepository = require("../repositories/playlist.repository");
const PlaylistSongRepository = require("../repositories/playlist-song.repository");
const FileService = require("./file.service");

const getSongsByPlaylist = async (playlistId) => {
    try {
        const songs = await PlaylistSongRepository.getSongsByPlaylist(playlistId);
        return songs;
    } catch (error) {
        throw error;
    }
}

const createPlaylist = async (userId, playlistData, imageFile) => {
    let imageUrl = null;

    if (imageFile) {
        imageUrl = await FileService.uploadImage(imageFile);
    }

    const playlist = await PlaylistRepository.createPlaylist({ ...playlistData, imageUrl, userId });
    return playlist;
}

const updatePlaylist = async (userId, playlistData, imageFile, playlistId) => {
    const existingPlaylist = await PlaylistRepository.getPlaylistById(playlistId);
    if (!existingPlaylist) {
        throw new Error("Không tìm thấy playlist");
    }

    if (existingPlaylist.userId !== userId) {
        throw new Error("Bạn không có quyền cập nhật playlist này");
    }

    let imageUrl = existingPlaylist.imageUrl;
    let uploadSuccess = false;

    if (imageFile) {
        try {
            imageUrl = await FileService.uploadImage(imageFile);
            uploadSuccess = true;
        } catch (error) {
            console.error("Upload ảnh mới thất bại, giữ nguyên ảnh cũ:", error.message);
            imageUrl = existingArtist.imageUrl;
        }
    }

    const t = await db.sequelize.transaction();

    try {
        const updatedPlaylist = await PlaylistRepository.updatePlaylist(playlistId, { ...playlistData, imageUrl }, { transaction: t });
        await t.commit();

        if (uploadSuccess && existingPlaylist.imageUrl) {
            await FileService.deleteFile(existingPlaylist.imageUrl);
        }

        return updatedPlaylist;
    } catch (error) {
        await t.rollback();
        if (imageFile && uploadSuccess && imageUrl && imageUrl !== existingTopic.imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Xóa ảnh mới tải lên thất bại sau khi DB rollback:", err.message);
            }
        }

        throw new Error(`Cập nhật playlist thất bại: ${error.message}`);
    }
}

const getAllPlaylist = async () => {
    try {
        const playlists = await PlaylistRepository.getAllPlaylists();
        return playlists;
    } catch (error) {
        throw error;
    }
}

const deletePlaylist = async (playlistId) => {
    const playlist = await PlaylistRepository.getPlaylistById(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }

    await PlaylistRepository.deletePlaylist(playlistId);

    if (playlist.imageUrl) {
        try {
            await FileService.deleteFile(playlist.imageUrl);
        } catch (err) {
            console.error("Xóa ảnh cũ thất bại:", err.message);
        }
    }

    return playlist;
}

const addSongToPlaylist = async (playlistId, songId, userId) => {
    const playlist = await PlaylistRepository.getPlaylistById(playlistId);

    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }

    if (playlist.userId !== userId) {
        throw new Error("Bạn không có quyền thêm bài hát vào playlist này");
    }

    const song = await SongRepository.getSongById(songId);

    if (!song) {
        throw new Error("Không tìm thấy bài hát");
    }

    const existing = await PlaylistSongRepository.findByPlaylistAndSong(playlistId, songId);

    if (existing) {
        throw new Error("Bài hát đã có trong playlist");
    }

    const maxPosition = await PlaylistSongRepository.getMaxPosition(playlistId);

    const position = (maxPosition || 0) + 1;

    await PlaylistSongRepository.createPlaylistSong({
        playlistId,
        songId,
        position,
        addedAt: new Date()
    });

    return playlist;
};

const removeSongFromPlaylist = async (playlistId, songId, userId) => {
    const playlist = await PlaylistRepository.getPlaylistById(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }

    if (playlist.userId !== userId) {
        throw new Error("Bạn không có quyền xóa bài hát khỏi playlist này");
    }

    const playlistSong = await PlaylistSongRepository.findByPlaylistAndSong(playlistId, songId);

    if (!playlistSong) {
        throw new Error("Không tìm thấy bài hát trong playlist");
    }

    const position = playlistSong.position;

    const t = await db.sequelize.transaction();

    try {
        await PlaylistSongRepository.removeSongFromPlaylist(playlistId, songId, { transaction: t });

        await PlaylistSongRepository.decreasePositions(playlistId, position, { transaction: t });

        await t.commit();

        return playlist;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};



module.exports = {
    getSongsByPlaylist,
    createPlaylist,
    updatePlaylist,
    getAllPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
}