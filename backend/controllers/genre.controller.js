const genreService = require("../services/genre.service");

const createGenre = async (req, res) => {
    try {
        const genreData = req.body;
        const result = await genreService.createGenre(genreData);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getAllGenres = async (req, res) => {
    try {
        const result = await genreService.getAllGenres();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createGenre,
    getAllGenres
}