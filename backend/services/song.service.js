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




module.exports = {
    getSongs,
    getSongById,
    getSongsByArtistId,
    createSong
}