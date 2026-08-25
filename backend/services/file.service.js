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

module.exports = {
    uploadImage
};
