const db = require("../models");
const Playlist = db.Playlist;

const getPlaylistById = async (id) => await Playlist.findByPk(id);
const getPlaylistsByUser = async (userId) => await Playlist.findAll({ where: { userId } });
const createPlaylist = async (playlistData) => {
    const playlist = await Playlist.create(playlistData);
    return playlist;
}
const updatePlaylist = async (playlistId, playlistData, options = {}) => {
    const playlist = await Playlist.update(playlistData, { where: { id: playlistId }, ...options });
    return playlist;
}
const deletePlaylist = async (playlistId, options = {}) => await Playlist.destroy({ where: { id: playlistId }, ...options });

const upadateStatus = async (playlistId, status) => await Playlist.update({ status }, { where: { id: playlistId } });
const updatePlayCount = async (playlistId) => await Playlist.update({ playCount: Sequelize.literal('playCount + 1') }, { where: { id: playlistId } });
const likePlaylist = async (playlistId) => await Playlist.update({ likeCount: Sequelize.literal('likeCount + 1') }, { where: { id: playlistId } });
const unlikePlaylist = async (playlistId) => await Playlist.update({ likeCount: Sequelize.literal('likeCount - 1') }, { where: { id: playlistId } });

module.exports = {
    getPlaylistById,
    getPlaylistsByUser,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    upadateStatus,
    updatePlayCount,
    likePlaylist,
    unlikePlaylist
};