const db = require("../models");
const Album = db.Album;

const getAlbumById = async (id) => await Album.findByPk(id);
const getAllAlbums = async () => await Album.findAll();
const createAlbum = async (data) => await Album.create(data);
const updateAlbum = async (id, data) => await Album.update(data, { where: { id } });
const deleteAlbum = async (id) => await Album.destroy({ where: { id } });

module.exports = { getAlbumById, getAllAlbums, createAlbum, updateAlbum, deleteAlbum };