const SongRepository = require("../repositories/song.repository");
const ArtistRepository = require("../repositories/artist.repository");
const FileService = require("./file.service");


const createSong = async (songData, coverImage, audioFile) => {
    const t = await db.sequelize.transaction();

    let imageUrl = null;
    let audioUrl = null;

    try {

        if (coverImage) {
            imageUrl = await FileService.uploadImage(coverImage);
        }

        let duration = 0;

        if (audioFile) {
            duration = await FileService.getAudioDuration(audioFile.buffer);
            audioUrl = await FileService.uploadAudio(audioFile);
        }

        const song = await SongRepository.createSong(
            {
                ...songData,
                duration,
                audioUrl,
                imageUrl
            },
            { transaction: t }
        );

        await t.commit();

        return song;

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
    createSong
}