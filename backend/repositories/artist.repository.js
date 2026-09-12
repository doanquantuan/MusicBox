const db = require("../models")
const Artist = db.Artist;
const { Op } = require("sequelize");

const createArtist = async (artistData) => {
    return await Artist.create(artistData);
}

const updateArtist = async (artistId, artistData, options = {}) => {
    return await Artist.update(artistData, { where: { id: artistId }, ...options });
}

const getArtistById = async (artistId) => {
    return await Artist.findByPk(artistId);
}

const getArtistsByIds = async (artistIds, options = {}) => {
    return await Artist.findAll({ where: { id: { [Op.in]: artistIds } }, ...options });
}

const getArtistByUserId = async (userId) => {
    return await Artist.findOne({ where: { userId } });
}

const searchArtistByName = async (artistName) => {
    return await Artist.findOne({ where: { artistName } });
}

const searchArtistByKeyword = async (keyword) => {
    if (!keyword || !keyword.trim()) return [];

    return await Artist.findAll({
        where: {
            artistName: {
                [Op.like]: `%${keyword}%`
            }
        },
        order: [["artistName", "ASC"]]
    });
}

module.exports = {
    createArtist,
    updateArtist,
    getArtistById,
    getArtistsByIds,
    getArtistByUserId,
    searchArtistByName,
    searchArtistByKeyword
}