const db = require("../models");
const Like = db.Like;

const getLikesByUser = async (userId) => await Like.findAll({ where: { userId } });
const getLikesBySong = async (songId) => await Like.findAll({ where: { songId } });
const addLike = async (data) => await Like.create(data);
const removeLike = async (userId, songId) => await Like.destroy({ where: { userId, songId } });

module.exports = { getLikesByUser, getLikesBySong, addLike, removeLike };