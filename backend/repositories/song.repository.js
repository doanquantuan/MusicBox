const db = require('../models');
const Song = db.Song;

const getSongById = async (songId) => {
    return await Song.findByPk(songId);
};

const getSongs = async () => {
    return await Song.findAll();
};

// const getSongsByArtistId = async (artistId) => {
//     return await Song.findAll({ where: { artistId } });
// };

// const getSongsByAlbumId = async (albumId) => {
//     return await Song.findAll({ where: { albumId } });
// };

// const getSongsByPlaylistId = async (playlistId) => {
//     return await Song.findAll({ where: { playlistId } });
// };

// const getSongsByGenreId = async (genreId) => {
//     return await Song.findAll({ where: { genreId } });
// };

// const getSongsByReleaseDate = async (releaseDate) => {
//     return await Song.findAll({ where: { releaseDate } });
// };

const searchSongsByTitle = async (title) => {
    return await Song.findAll({
        where: {
            title: {
                [Op.like]: `%${title}%`
            }
        }
    });
};

const createSong = async (song) => {
    return await Song.create(song);
};

const updateSong = async (songId, song) => {
    return await Song.update(song, { where: { id: songId } });
};

const deleteSong = async (songId) => {
    return await Song.destroy({ where: { id: songId } });
};

module.exports = {
    getSongById,
    getSongs,
    // searchSongsByArtistId,
    // searchSongsByAlbumId,
    // searchSongsByPlaylistId,
    // searchSongsByGenreId,
    // searchSongsByReleaseDate,
    searchSongsByTitle,
    createSong,
    updateSong,
    deleteSong
};
