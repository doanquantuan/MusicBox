const db = require('../models');
const { Op } = require('sequelize');
const Song = db.Song;
const Artist = db.Artist;

const getSongById = async (songId, options = {}) => {
    return await Song.findByPk(songId, {
        ...options,
        include: [
            {
                model: Artist,
                as: "artists",
                attributes: ["id", "artistName"],
                through: {
                    attributes: []
                }
            }
        ]
    });
};

const getSongs = async () => {
    return await Song.findAll();
};



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

const createSong = async (song, options = {}) => {
    return await Song.create(song, options);
};

const updateSong = async (songId, song, options = {}) => {
    return await Song.update(song, { where: { id: songId }, ...options });
};

const deleteSong = async (songId, options = {}) => {
    return await Song.destroy({ where: { id: songId }, ...options });
};

const getSongsByIds = async (songIds, options = {}) => {
    return await Song.findAll({ where: { id: { [Op.in]: songIds } }, ...options });
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
    deleteSong,
    getSongsByIds
};
