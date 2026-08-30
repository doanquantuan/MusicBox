const db = require("../models");
const User = db.User;

const getUserById = async (id) => await User.findByPk(id);
const getUserByEmail = async (email) => await User.findOne({ where: { email } });
const createUser = async (data) => await User.create(data);
const updateUser = async (id, data) => await User.update(data, { where: { id } });

module.exports = { getUserById, getUserByEmail, createUser, updateUser };