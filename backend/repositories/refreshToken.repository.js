const db = require("../models");
const RefreshToken = db.RefreshToken;

const getToken = async (token) => await RefreshToken.findOne({ where: { token } });
const createToken = async (data) => await RefreshToken.create(data);
const deleteToken = async (token) => await RefreshToken.destroy({ where: { token } });

module.exports = { getToken, createToken, deleteToken };