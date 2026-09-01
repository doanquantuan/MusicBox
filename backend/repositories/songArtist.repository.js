const db = require("../models");
const SongArtist = db.SongArtist;

const getArtistsBySong = async (songId) => await SongArtist.findAll({ where: { songId } });
const getSongsByArtist = async (artistId) => await SongArtist.findAll({ where: { artistId } });
const addSongArtist = async (data) => await SongArtist.create(data);
const removeSongArtist = async (songId, artistId) => await SongArtist.destroy({ where: { songId, artistId } });

module.exports = { getArtistsBySong, getSongsByArtist, addSongArtist, removeSongArtist };