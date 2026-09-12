const SongRepository = require("../repositories/song.repository");
const SongArtistRepository = require("../repositories/song_artist.repository");
const ArtistRepository = require("../repositories/artist.repository");
const FileService = require("./file.service");
const db = require("../models/index");

const getSongs = async () => {
    return await SongRepository.getSongs();
}

const getSongById = async (songId) => {
    const existingSong = await SongRepository.getSongById(songId);
    if (!existingSong) throw new Error("Bài hát không tồn tại");
    return existingSong;
}

const getSongsByArtistId = async (artistId) => {
    const existingArtist = await ArtistRepository.getArtistById(artistId);
    if (!existingArtist) throw new Error("Nghệ sĩ không tồn tại");
    return await SongArtistRepository.getSongsByArtistId(artistId);
}

const createSong = async (songData, coverImage, audioFile) => {
    const t = await db.sequelize.transaction();

    let imageUrl = null;
    let audioUrl = null;

    const { artistIds: rawArtistIds, ...songInfo } = songData;

    let artistIds = rawArtistIds;

    if (typeof artistIds === "string") {

        artistIds = [artistIds];

    }

    try {

        const artists = await ArtistRepository.getArtistsByIds(
            artistIds,
            { transaction: t }
        );

        if (artists.length != artistIds.length) {
            throw new Error("Có nghệ sĩ không tồn tại");
        }


        if (coverImage) {
            imageUrl = await FileService.uploadImage(coverImage);
        }

        let duration = 0;

        if (audioFile) {
            duration = await FileService.getAudioDuration(audioFile.buffer);
            audioUrl = await FileService.uploadAudio(audioFile);
        }

        console.log("Audio url: " + audioUrl);
        console.log("Image url: " + imageUrl);

        const song = await SongRepository.createSong(
            {
                ...songInfo,
                duration,
                audioUrl,
                coverImgUrl: imageUrl
            },
            { transaction: t }
        );

        await SongArtistRepository.bulkCreate(
            artists.map(artist => ({
                songId: song.id,
                artistId: artist.id
            })),
            { transaction: t }
        );

        await t.commit();

        return {
            song,
            artists: artists.map(artist => ({
                id: artist.id,
                name: artist.artistName
            }))
        };

    } catch (error) {
        await t.rollback();

        if (imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Rollback ảnh thất bại:", err.message);
            }
        }

        if (audioUrl) {
            try {
                await FileService.deleteAudio(audioUrl);
            } catch (err) {
                console.error("Rollback audio thất bại:", err.message);
            }
        }

        throw error;
    }
};




const updateSong = async (songId, songData, coverImage, audioFile) => {
    const t = await db.sequelize.transaction();

    let newImageUrl = null;
    let newAudioUrl = null;

    try {
        const existingSong = await SongRepository.getSongById(
            songId,
            { transaction: t }
        );

        if (!existingSong) {
            throw new Error("Bài hát không tồn tại");
        }

        const {
            artistIds: rawArtistIds,
            ...songInfo
        } = songData;

        const updateData = { ...songInfo };

        // =========================
        // UPDATE ARTISTS
        // =========================
        if (rawArtistIds !== undefined) {
            let artistIds = rawArtistIds;

            if (typeof artistIds === "string") {
                artistIds = [artistIds];
            }

            if (!Array.isArray(artistIds) || artistIds.length === 0) {
                throw new Error("Phải có ít nhất 1 nghệ sĩ");
            }

            const artists = await ArtistRepository.getArtistsByIds(
                artistIds,
                { transaction: t }
            );

            if (artists.length !== artistIds.length) {
                throw new Error("Có nghệ sĩ không tồn tại");
            }

            await SongArtistRepository.removeBySongId(
                songId,
                { transaction: t }
            );

            await SongArtistRepository.bulkCreate(
                artistIds.map(artistId => ({
                    songId,
                    artistId
                })),
                { transaction: t }
            );
        }

        // =========================
        // UPDATE IMAGE
        // =========================
        if (coverImage) {
            newImageUrl = await FileService.uploadImage(coverImage);
            updateData.coverImgUrl = newImageUrl;
        }

        // =========================
        // UPDATE AUDIO
        // =========================
        if (audioFile) {
            updateData.duration =
                await FileService.getAudioDuration(audioFile.buffer);

            newAudioUrl = await FileService.uploadAudio(audioFile);
            updateData.audioUrl = newAudioUrl;
        }

        await SongRepository.updateSong(
            songId,
            updateData,
            { transaction: t }
        );

        // Lấy lại song + artists
        const song = await SongRepository.getSongById(
            songId,
            { transaction: t }
        );

        await t.commit();

        // Xóa file cũ sau khi DB commit thành công
        if (coverImage && existingSong.coverImgUrl) {
            try {
                await FileService.deleteImage(existingSong.coverImgUrl);
            } catch (err) {
                console.error("Xóa ảnh cũ thất bại:", err.message);
            }
        }

        if (audioFile && existingSong.audioUrl) {
            try {
                await FileService.deleteAudio(existingSong.audioUrl);
            } catch (err) {
                console.error("Xóa audio cũ thất bại:", err.message);
            }
        }

        return song;

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

        if (newAudioUrl) {
            await FileService.deleteAudio(newAudioUrl)
                .catch(err =>
                    console.error(
                        "Rollback audio mới thất bại:",
                        err.message
                    )
                );
        }

        throw error;
    }
};

const deleteSong = async (songId) => {
    const t = await db.sequelize.transaction();

    try {
        const song = await SongRepository.getSongById(
            songId,
            { transaction: t }
        );

        if (!song) {
            throw new Error("Bài hát không tồn tại");
        }

        // Xóa quan hệ Song - Artist
        await SongArtistRepository.removeBySongId(
            songId,
            { transaction: t }
        );

        await SongRepository.deleteSong(
            songId,
            { transaction: t }
        );

        await t.commit();

        // Xóa file trên S3 sau khi DB commit
        if (song.coverImgUrl) {
            try {
                await FileService.deleteImage(song.coverImgUrl);
            } catch (err) {
                console.error(
                    "Xóa ảnh bài hát thất bại:",
                    err.message
                );
            }
        }

        if (song.audioUrl) {
            try {
                await FileService.deleteAudio(song.audioUrl);
            } catch (err) {
                console.error(
                    "Xóa audio bài hát thất bại:",
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
};

module.exports = {
    getSongs,
    getSongById,
    getSongsByArtistId,
    createSong,
    updateSong,
    deleteSong
}