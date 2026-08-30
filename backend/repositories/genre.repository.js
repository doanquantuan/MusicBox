const db = require("../models")
const Genre = db.Genre

const getGenreById = async (genreId) => {
    return await Genre.findById(genreId);
}

const getGenreByName = async (genreName) => {
    return await Genre.findOne(
        { where: { genreName: genreName } }
    )
}

const getAllGenres = async () => {
    return await Genre.findAll();
}

const createGenre = async (genreData) => {
    return await Genre.create(genreData);
}

module.exports = {
    getGenreById,
    getGenreByName,
    getAllGenres,
    createGenre
}