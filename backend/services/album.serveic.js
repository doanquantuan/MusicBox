const AlbumRepository = require("../repositories/album.repository");
const ArtistRepository = require("../repositories/artist.repository");
const SongRepository = require("../repositories/song.repository");
const AlbumSongRepository = require("../repositories/album_song.repository");
const FileService = require("./file.service");
const db = require("../models/index");

const createAlbum = async (albumData, imageFile) => {
    const existingArtist = await ArtistRepository.getArtistById(albumData.artistId);

    if (!existingArtist) {
        throw new Error("Nghệ sĩ này không tồn tại");
    }

    const t = await db.sequelize.transaction();
    let imageUrl = null;

    try {

        if (imageFile) {
            imageUrl = await FileService.uploadImage(imageFile);
        }


        const album = await AlbumRepository.createAlbum(
            {
                ...albumData,
                coverImgUrl: imageUrl
            },
            { transaction: t }
        );

        await t.commit();

        return album;

    } catch (error) {
        await t.rollback();

        if (imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Rollback ảnh thất bại:", err.message);
            }
        }

        throw error;
    }
};

const updateAlbum = async (albumId, albumData, imageFile) => {
    const t = await db.sequelize.transaction();

    let newImageUrl = null;

    try {
        const existingArtist = await ArtistRepository.getArtistById(albumData.artistId);

        if (!existingArtist) {
            throw new Error("Nghệ sĩ này không tồn tại");
        }

        const existingAlbum = await albumRepository.getAlbumById(
            albumId,
            { transaction: t }
        );

        if (!existingAlbum) {
            throw new Error("Album không tồn tại");
        }

        if (imageFile) {
            newImageUrl = await FileService.uploadImage(coverImage);
            updateData.coverImgUrl = newImageUrl;
        }


        await AlbumRepository.updateAlbum(
            songId,
            updateData,
            { transaction: t }
        );

        await t.commit();

        // Xóa file cũ sau khi DB commit thành công
        if (imageFile && existingAlbum.coverImgUrl) {
            try {
                await FileService.deleteImage(existingAlbum.coverImgUrl);
            } catch (err) {
                console.error("Xóa ảnh cũ thất bại:", err.message);
            }
        }

        return album;

    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }

        if (newImageUrl) {
            await FileService.deleteImage(newImageUrl)
                .catch(err =>
                    console.error(
                        "Rollback ảnh mới thất bại:",
                        err.message
                    )
                );
        }

        throw error;
    }
};

const deleteAlbum = async (albumId) => {
    const t = await db.sequelize.transaction();

    try {
        const album = await AlbumRepository.getSongById(
            albumId,
            { transaction: t }
        );

        if (!album) {
            throw new Error("Bài hát không tồn tại");
        }

        await AlbumRepository.deleteSong(
            albumId,
            { transaction: t }
        );

        await t.commit();

        if (album.coverImgUrl) {
            try {
                await FileService.deleteImage(song.coverImgUrl);
            } catch (err) {
                console.error(
                    "Xóa ảnh bài hát thất bại:",
                    err.message
                );
            }
        }


    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }

        throw error;
    }
}

const getAlbumByArtistId = async (artistId) => {

    const existingArtist = await ArtistRepository.getArtistById({ artistId, transaction: t });

    if (!existingArtist) {
        throw new Error("Nghệ sĩ không tồn tại");
    }
    return await AlbumRepository.getAlbumByArtistId(artistId);
}

const addSongToAlbum = async (albumId, songInput) => {
    const t = await db.sequelize.transaction();
    const { songIds: rawSongIds } = songInput;

    let songIds = rawSongIds;

    if (typeof songIds === "string") {

        songIds = [songIds];

    }
    try {
        const existingAlbum = await AlbumRepository.getAlbumById(albumId, { transaction: t });
        if (!existingAlbum) {
            throw new Error("Album không tồn tại");
        }

        if (songIds.length === 0) {
            throw new Error("Danh sách bài hát không được rỗng");
        }

        const songs = await SongRepository.getSongsByIds(
            songIds,
            { transaction: t }
        );

        if (songs.length != songIds.length) {
            throw new Error("Có bài hát không tồn tại");
        }

        let maxTrack = await AlbumSongRepository.getMaxTrackNumber(albumId, { transaction: t }) || 0;
        const results = [];

        for (const songId of songIds) {
            const song = await SongRepository.getSongById(songId, { transaction: t });

            // 1. Chỉ có thể thêm bài hát chưa nằm trong bất kì album nào
            const existingAlbumSong = await AlbumSongRepository.findBySongId(songId, { transaction: t });
            if (existingAlbumSong) {
                if (existingAlbumSong.albumId === albumId) {
                    throw new Error(
                        `Bài hát "${song.songName || songId}" đã có trong album`
                    );
                }

                throw new Error(
                    `Bài hát "${song.songName || songId}" đã thuộc về album khác`
                );
            }

            // 2. Chỉ được phép thêm bài hát có cùng artist với album
            const songArtists = song.artists || [];
            const isSameArtist = songArtists.some(artist => artist.id === existingAlbum.artistId);
            if (!isSameArtist) {
                throw new Error(`Bài hát "${song.songName || songId}" không cùng nghệ sĩ với album`);
            }

            // 3. trackNumber được tạo tự động theo thứ tự các song được thêm vào album_song
            maxTrack += 1;
            const newAlbumSong = await AlbumSongRepository.addSongToAlbum({
                albumId,
                songId,
                trackNumber: maxTrack
            }, { transaction: t });

            // Đồng bộ albumId trong bảng song
            await SongRepository.updateSong(songId, { albumId }, { transaction: t });

            results.push(newAlbumSong);
        }

        await t.commit();
        return results;
    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }
        throw error;
    }
};

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumByArtistId,
    addSongToAlbum
};