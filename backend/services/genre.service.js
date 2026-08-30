const GenreRepository = require("../repositories/genre.repository");

const createGenre = async (genreData) => {
    const existingGenre = await GenreRepository.getGenreByName(genreData.genreName);

    if (existingGenre) {
        throw new Error("Thể loại đã tồn tại")
    }

    return GenreRepository.createGenre(genreData);
}

const getAllGenres = async () => {
    return GenreRepository.getAllGenres();
}



module.exports = {
    createGenre,
    getAllGenres
}
