const crypto = require("crypto");
const s3Repository = require("../repositories/s3.repository");

const uploadImage = async (file) => {
    if (!file) {
        throw new Error("Không có file nào được tải lên");
    }

    const fileName = `images/${crypto.randomUUID()}.jpg`;
    console.log("File name: " + fileName);

    const imageUrl = await s3Repository.uploadFile(file.buffer, fileName, file.mimetype);
    console.log("Image url: " + imageUrl);

    return imageUrl;
};

const deleteImage = async (imageUrl) => {
    if (!imageUrl) return false;

    // Extract S3 object key from the public URL
    const match = imageUrl.match(/\.amazonaws\.com\/(.+)$/);
    if (!match) {
        console.warn(`URL ảnh không đúng định dạng S3: ${imageUrl}`);
        return false;
    }

    const s3Key = match[1];
    return await s3Repository.deleteFile(s3Key);
};

module.exports = {
    uploadImage,
    deleteImage
};
