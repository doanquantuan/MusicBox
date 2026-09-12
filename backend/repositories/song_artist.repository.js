const db = require("../models");
const SongArtist = db.SongArtist;
const Song = db.Song;
const Artist = db.Artist;

const getArtistsBySong = async (songId) => await SongArtist.findAll({ where: { songId } });

const addSongArtist = async (data, { transaction }) => await SongArtist.create(data, { transaction });
const removeSongArtist = async (songId, artistId) => await SongArtist.destroy({ where: { songId, artistId } });
const bulkCreate = async (data, { transaction }) => await SongArtist.bulkCreate(data, { transaction });
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
module.exports = {
    getArtistsBySong,
    getSongsByArtistId,
    addSongArtist,
    removeSongArtist,
    bulkCreate
};