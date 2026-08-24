const ArtistRepository = require("../repositories/artistRepository");

const createArtist = async (userId, artistData) => {
    if (userId) {
        const existingArtistByUserId = await ArtistRepository.getArtistByUserId(userId);
        if (existingArtistByUserId)
            throw new Error("Tài khoản đã có nghệ sĩ")
    }

    const existingArtist = await ArtistRepository.searchArtistByName(artistData.artistName);
    if (existingArtist)
        throw new Error("Tên nghệ sĩ đã tồn tại")

    const artist = await ArtistRepository.createArtist(userId, artistData);
    return artist;
}

module.exports = {
    createArtist
}