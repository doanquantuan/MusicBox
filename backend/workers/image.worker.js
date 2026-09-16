const { Worker } = require('bullmq');
const fs = require('fs/promises');
const redisConnection = require('../config/redis');
const s3Repository = require('../repositories/s3.repository');
const { measureExecutionTime } = require('../utils/performance');

const uploadImageWorker = new Worker(
    'image',
    async (job) => {
        const { filePath, s3Key, mimetype } = job.data;

        const buffer = await fs.readFile(filePath);

        const targetKey = s3Key || `images/${crypto.randomUUID()}.jpg`;

        const result = await measureExecutionTime(async () => {
            await s3Repository.uploadFile(buffer, targetKey, mimetype || 'image/jpeg');
        });

        // Xóa file tạm thời trên đĩa cứng sau khi upload thành công
        await fs.unlink(filePath).catch(() => { });

        return result;
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

const deleteImageWorker = new Worker(
    'image',
    async (job) => {
        const { imageUrl } = job.data;

        if (!imageUrl) {
            throw new Error("Image URL is required");
        }

        const match = imageUrl.match(/\.amazonaws\.com\/(.+)$/);
        if (!match) {
            console.warn(`URL ảnh không đúng định dạng S3: ${imageUrl}`);
            return false;
        }

        const s3Key = match[1];

        const result = await measureExecutionTime(async () => {
            await s3Repository.deleteFile(s3Key);
        });

        return result;
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);


uploadImageWorker.on('completed', (job, result) => {
    console.log(`[Image Worker] Image job ${job.id} completed. URL: ${result?.imageUrl}`);
});

uploadImageWorker.on('failed', (job, err) => {
    console.error(`[Image Worker] Image job ${job?.id} failed:`, err.message);
});

deleteImageWorker.on('completed', (job, result) => {
    console.log(`[Image Worker] Image job ${job.id} completed. URL: ${result?.imageUrl}`);
});

deleteImageWorker.on('failed', (job, err) => {
    console.error(`[Image Worker] Image job ${job?.id} failed:`, err.message);
});

console.log('Image worker is running...');
