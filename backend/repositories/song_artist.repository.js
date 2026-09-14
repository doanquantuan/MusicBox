const db = require("../models");
const SongArtist = db.SongArtist;
const Song = db.Song;
const Artist = db.Artist;

const getArtistsBySong = async (songId) => await SongArtist.findAll({ where: { songId } });

const addSongArtist = async (data, options = {}) => await SongArtist.create(data, options);
const removeSongArtist = async (songId, artistId, options = {}) => await SongArtist.destroy({ where: { songId, artistId }, ...options });
const removeBySongId = async (songId, options = {}) => await SongArtist.destroy({ where: { songId }, ...options });
const bulkCreate = async (data, options = {}) => await SongArtist.bulkCreate(data, options);
const getSongsByArtistId = async (artistId) => {
    return await Song.findAll({
        include: [
            {
                model: Artist,
                as: "artists",
                attributes: ["id", "artistName"],
                through: {
                    attributes: []
                }
            },
            {
                model: SongArtist,
                as: "songArtists",
                where: {
                    artistId
                },
                attributes: [],
                required: true
            }
        ]
    });
};
const getArtistBySongId = async (songId) => {
    return await Artist.findAll({
        include: [
            {
                model: Song,
                as: "songs",
                attributes: ["id", "title"],
                through: {
                    attributes: []
                }
            },
            {
                model: SongArtist,
                as: "songArtists",
                where: {
                    songId
                },
                attributes: [],
                required: true
            }
        ]
    });
};
module.exports = {
    getArtistsBySong,
    getArtistBySongId,
    getSongsByArtistId,
    addSongArtist,
    removeSongArtist,
    removeBySongId,
    bulkCreate
};