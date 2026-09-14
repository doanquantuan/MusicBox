const db = require("../models");
const AlbumSong = db.AlbumSong;

const addSongToAlbum = async (data, options = {}) => await AlbumSong.create(data, options);
const bulkCreate = async (data, options = {}) => await AlbumSong.bulkCreate(data, options);
const removeSongFromAlbum = async (albumId, songId, options = {}) => await AlbumSong.destroy({ where: { albumId, songId }, ...options });

const findBySongId = async (songId, options = {}) => await AlbumSong.findOne({ where: { songId }, ...options });
const getMaxTrackNumber = async (albumId, options = {}) => await AlbumSong.max('trackNumber', { where: { albumId }, ...options });

module.exports = {
    addSongToAlbum,
    bulkCreate,
    removeSongFromAlbum,
    findBySongId,
    getMaxTrackNumber
};