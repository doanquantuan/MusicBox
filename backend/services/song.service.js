const SongRepository = require("../repositories/song.repository");
const ArtistRepository = require("../repositories/artist.repository");
const GenreRepository = require("../repositories/genre.repository");
const FileService = require("./file.service");
const db = require("../models");

const createSong = async (userId, songData, audioFile) => {
    if (userId) {
        const existingArtistByUserId = await ArtistRepository.getArtistByUserId(userId);
        if (!existingArtistByUserId) {
            throw new Error("Tài khoản chưa có nghệ sĩ")
        }
    }

    // const existingGenre = await GenreRepository.getGenreById(songData.genreId);
    // if (!existingGenre) {
    //     throw new Error("Thể loại không tồn tại")
    // }

    //  let imageUrl = null;
    let audioUrl = null;

    console.log(songData);


    // if (coverImage) {
    //     imageUrl = await FileService.uploadImage(coverImage);
    // }
    if (audioFile) {
        audioUrl = await FileService.uploadAudio(audioFile);
    }

    const song = await SongRepository.createSong({ ...songData, audioUrl });
    return song;

}

module.exports = {
    createSong
}