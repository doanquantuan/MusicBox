const ArtistRepository = require("../repositories/artist.repository");
const FileService = require("./file.service");
const db = require("../models");

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
    }

    const artist = await ArtistRepository.createArtist(userId, { ...artistData, imageUrl });
    return artist;
}

const updateArtist = async (artistId, artistData, imageFile) => {
    const existingArtist = await ArtistRepository.getArtistById(artistId);
    if (!existingArtist) {
        throw new Error("Nghệ sĩ không tồn tại");
    }

    let imageUrl = existingArtist.imageUrl;
    let uploadSuccess = false;

    if (imageFile) {
        try {
            imageUrl = await FileService.uploadImage(imageFile);
            uploadSuccess = true;
        } catch (error) {
            console.error("Upload ảnh mới thất bại, giữ nguyên ảnh cũ:", error.message);
            imageUrl = existingArtist.imageUrl;
        }
    }

    const t = await db.sequelize.transaction();

    try {
        await ArtistRepository.updateArtist(artistId, { ...artistData, imageUrl }, { transaction: t });
        await t.commit();

        // Nếu upload ảnh mới thành công và trước đó nghệ sĩ đã có ảnh cũ, thực hiện xóa ảnh cũ
        if (imageFile && uploadSuccess && existingArtist.imageUrl) {
            try {
                await FileService.deleteImage(existingArtist.imageUrl);
            } catch (err) {
                console.error("Xóa ảnh cũ thất bại:", err.message);
            }
        }

        return await ArtistRepository.getArtistById(artistId);
    } catch (error) {
        await t.rollback();

        // Nếu update db thất bại và trước đó đã upload thành công ảnh mới lên S3,
        // thực hiện xóa ảnh mới để tránh rác S3
        if (imageFile && uploadSuccess && imageUrl && imageUrl !== existingArtist.imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Xóa ảnh mới tải lên thất bại sau khi DB rollback:", err.message);
            }
        }

        throw new Error(`Cập nhật nghệ sĩ thất bại: ${error.message}`);
    }
}

module.exports = {
    createArtist,
    updateArtist
}