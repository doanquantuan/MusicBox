const db = require("../models");
const Album = db.Album;

const getAlbumById = async (id, options = {}) => {
    return await Album.findByPk(id, options);
}
const getAllAlbums = async () => await Album.findAll();
const getAlbumByArtistId = async (artistId) => await Album.findAll({ where: { artistId } });
const createAlbum = async (data, options = {}) => {
    return await Album.create(data, options);
}
const updateAlbum = async (id, data, options = {}) => await Album.update(data, { where: { id } }, options);
const deleteAlbum = async (id) => await Album.destroy({ where: { id } });

module.exports = { getAlbumById, getAllAlbums, getAlbumByArtistId, createAlbum, updateAlbum, deleteAlbum };