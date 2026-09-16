const { Worker } = require('bullmq');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const redisConnection = require('../config/redis');
const s3Repository = require('../repositories/s3.repository');
const { measureExecutionTime } = require('../utils/performance');

const audioWorker = new Worker(
    'audio',
    async (job) => {
        if (job.name === 'upload-audio') {
            const { filePath, audioId } = job.data;

            if (!filePath) {
                throw new Error('Không tìm thấy đường dẫn file (filePath) trong Job data');
            }

            const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `audio-${audioId}-`));
            const inputPath = path.join(tempDir, 'input.mp3');
            const hlsDir = path.join(tempDir, 'hls');
            const segmentDir = path.join(hlsDir, 'segments');

            try {
                const result = await measureExecutionTime(async () => {
                    await fs.mkdir(segmentDir, { recursive: true });

                    // 1. Copy file audio từ đĩa tạm vào tempDir của Worker
                    await fs.copyFile(filePath, inputPath);

                    // Xóa file tạm ban đầu từ Multer đĩa cứng
                    await fs.unlink(filePath).catch(() => { });

                    // 2. Chuyển audio sang HLS bằng ffmpeg
                    await execFileAsync('ffmpeg', [
                        '-i', inputPath,
                        '-vn',
                        '-c:a', 'aac',
                        '-b:a', '128k',
                        '-f', 'hls',
                        '-hls_time', '6',
                        '-hls_playlist_type', 'vod',
                        '-hls_segment_filename', path.join(segmentDir, 'segment_%03d.ts'),
                        path.join(hlsDir, 'playlist.m3u8')
                    ]);

                    // 3. Upload tất cả segments trước
                    const segments = await fs.readdir(segmentDir);
                    for (const segmentName of segments) {
                        const segmentPath = path.join(segmentDir, segmentName);
                        const segmentBuffer = await fs.readFile(segmentPath);
                        await s3Repository.uploadFile(
                            segmentBuffer,
                            `audios/${audioId}/segments/${segmentName}`,
                            'video/mp2t'
                        );
                    }

                    // 4. Upload playlist sau cùng
                    const playlistPath = path.join(hlsDir, 'playlist.m3u8');
                    const playlistBuffer = await fs.readFile(playlistPath);
                    const playlistUrl = await s3Repository.uploadFile(
                        playlistBuffer,
                        `audios/${audioId}/playlist.m3u8`,
                        'application/vnd.apple.mpegurl'
                    );

                    return playlistUrl;
                });

                console.log(`[Audio Worker] Upload & HLS audio ${audioId} thành công trong ${result.durationMs} ms -> URL: ${result.result}`);
                return result;
            } finally {
                // Luôn dọn dẹp thư mục tạm
                await fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });
            }
        }

        if (job.name === 'delete-audio') {
            const { audioUrl } = job.data;

            if (!audioUrl) {
                throw new Error('Audio URL là bắt buộc');
            }

            const result = await measureExecutionTime(async () => {
                const match = audioUrl.match(/\.amazonaws\.com\/(audios\/[^/]+\/)/);
                if (match) {
                    const folderPrefix = match[1];
                    return await s3Repository.deleteFolder(folderPrefix);
                }

                const singleMatch = audioUrl.match(/\.amazonaws\.com\/(.+)$/);
                if (singleMatch) {
                    return await s3Repository.deleteFile(singleMatch[1]);
                }

                console.warn(`URL audio không đúng định dạng S3: ${audioUrl}`);
                return false;
            });

            return result;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

audioWorker.on('completed', (job, result) => {
    console.log(`[Audio Worker] Job ${job.id} (${job.name}) completed.`);
});

audioWorker.on('failed', (job, err) => {
    console.error(`[Audio Worker] Job ${job?.id} (${job?.name}) failed:`, err.message);
});

console.log('Audio worker is running...');
