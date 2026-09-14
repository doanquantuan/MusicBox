const AlbumRepository = require("../repositories/album.repository");
const ArtistRepository = require("../repositories/artist.repository");
const FileService = require("./file.service");
const db = require("../models/index");

const createAlbum = async (albumData, imageFile) => {
    const existingArtist = await ArtistRepository.getArtistById(alnumData.artistId);

    if (!existingArtist) {
        throw new Error("Nghệ sĩ này không tồn tại");
    }

    const t = await db.sequelize.transaction();
    let imageUrl = null;

    try {

        if (imageFile) {
            imageUrl = await FileService.uploadImage(imageFile);
        }


        const album = await AlbumRepository.createAlbum(
            {
                ...albumData,
                coverImgUrl: imageUrl
            },
            { transaction: t }
        );

        await t.commit();

        return album;

    } catch (error) {
        await t.rollback();

        if (imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Rollback ảnh thất bại:", err.message);
            }
        }

        throw error;
    }
};

const updateAlbum = async (alnumId, albumData, imageFile) => {
    const t = await db.sequelize.transaction();

    let newImageUrl = null;

    try {
        const existingArtist = await ArtistRepository.getArtistById(alnumData.artistId);

        if (!existingArtist) {
            throw new Error("Nghệ sĩ này không tồn tại");
        }

        const existingAlbum = await albumRepository.getAlbumById(
            albumId,
            { transaction: t }
        );

        if (!existingAlbum) {
            throw new Error("Album không tồn tại");
        }

        if (imageFile) {
            newImageUrl = await FileService.uploadImage(coverImage);
            updateData.coverImgUrl = newImageUrl;
        }


        await AlbumRepository.updateAlbum(
            songId,
            updateData,
            { transaction: t }
        );

        await t.commit();

        // Xóa file cũ sau khi DB commit thành công
        if (imageFile && existingAlbum.coverImgUrl) {
            try {
                await FileService.deleteImage(existingAlbum.coverImgUrl);
            } catch (err) {
                console.error("Xóa ảnh cũ thất bại:", err.message);
            }
        }

        return album;

    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }

        if (newImageUrl) {
            await FileService.deleteImage(newImageUrl)
                .catch(err =>
                    console.error(
                        "Rollback ảnh mới thất bại:",
                        err.message
                    )
                );
        }

        throw error;
    }
};

const deleteAlbum = async (albumId) => {
    const t = await db.sequelize.transaction();

    try {
        const album = await AlbumRepository.getSongById(
            albumId,
            { transaction: t }
        );

        if (!album) {
            throw new Error("Bài hát không tồn tại");
        }

        await AlbumRepository.deleteSong(
            albumId,
            { transaction: t }
        );

        await t.commit();

        if (album.coverImgUrl) {
            try {
                await FileService.deleteImage(song.coverImgUrl);
            } catch (err) {
                console.error(
                    "Xóa ảnh bài hát thất bại:",
                    err.message
                );
            }
        }


    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }

        throw error;
    }
}

const getAlbumByArtistId = async (artistId) => {

    const existingArtist = await ArtistRepository.getArtistById({ artistId, transaction: t });

    if (!existingArtist) {
        throw new Error("Nghệ sĩ không tồn tại");
    }
    return await AlbumRepository.getAlbumByArtistId(artistId);
}

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumByArtistId
}