const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/s3");

const uploadFile = async (fileBuffer, fileName, mimeType) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME không được cấu hình");
    }

    if (!region) {
        throw new Error("AWS_REGION không được cấu hình");
    }

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType
    };

    try {
        const command = new PutObjectCommand(params);

        await s3Client.send(command);

        return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new Error(`S3 tải file thất bại: ${error.message}`);
    }
};

module.exports = {
    uploadFile
};