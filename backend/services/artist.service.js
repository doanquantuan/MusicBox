const ArtistRepository = require("../repositories/artist.repository");
const FileService = require("./file.service");

const createArtist = async (userId, artistData, imageFile) => {
    if (userId) {
        const existingArtistByUserId = await ArtistRepository.getArtistByUserId(userId);
        if (existingArtistByUserId)
            throw new Error("Tài khoản đã có nghệ sĩ")
    }

    const existingArtist = await ArtistRepository.searchArtistByName(artistData.artistName);
    if (existingArtist)
        throw new Error("Tên nghệ sĩ đã tồn tại")

    let imageUrl = null;

    if (imageFile) {
        imageUrl = await FileService.uploadImage(imageFile);
        console.log("Image url from file service: " + imageUrl);
    }

    const artist = await ArtistRepository.createArtist(userId, { ...artistData, imageUrl });
    return artist;
}

module.exports = {
    createArtist
}