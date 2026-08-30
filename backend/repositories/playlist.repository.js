const db = require("../models");
const Playlist = db.Playlist;

const getPlaylistById = async (id) => await Playlist.findByPk(id);
const getPlaylistsByUser = async (userId) => await Playlist.findAll({ where: { userId } });
const createPlaylist = async (data) => await Playlist.create(data);
const updatePlaylist = async (id, data) => await Playlist.update(data, { where: { id } });
const deletePlaylist = async (id) => await Playlist.destroy({ where: { id } });

module.exports = { getPlaylistById, getPlaylistsByUser, createPlaylist, updatePlaylist, deletePlaylist };