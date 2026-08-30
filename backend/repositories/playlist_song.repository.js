const db = require("../models");
const PlaylistSong = db.PlaylistSong;

const getSongsByPlaylist = async (playlistId) => await PlaylistSong.findAll({ where: { playlistId }, order: [['position', 'ASC']] });
const addSongToPlaylist = async (data) => await PlaylistSong.create(data);
const removeSongFromPlaylist = async (playlistId, songId) => await PlaylistSong.destroy({ where: { playlistId, songId } });

module.exports = { getSongsByPlaylist, addSongToPlaylist, removeSongFromPlaylist };