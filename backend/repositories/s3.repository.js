const { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
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

const deleteFile = async (fileName) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME không được cấu hình");
    }

    const params = {
        Bucket: bucketName,
        Key: fileName
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        return true;
    } catch (error) {
        throw new Error(`S3 xóa file thất bại: ${error.message}`);
    }
};

const deleteFolder = async (folderPrefix) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME không được cấu hình");
    }

    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPrefix
        });
        const listedObjects = await s3Client.send(listCommand);

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            return true;
        }

        const deleteParams = {
            Bucket: bucketName,
            Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) }
        };

        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await s3Client.send(deleteCommand);

        if (listedObjects.IsTruncated) {
            await deleteFolder(folderPrefix);
        }
        return true;
    } catch (error) {
        throw new Error(`S3 xóa folder thất bại: ${error.message}`);
    }
};

module.exports = {
    uploadFile,
    deleteFile,
    deleteFolder
};