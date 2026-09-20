const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const s3Repository = require("../repositories/s3.repository");
const imageQueue = require("../queues/image.queue");
const audioQueue = require("../queues/audio.queue");


const uploadImage = async (file) => {
    // ==========================================
    // PHIÊN BẢN CỦ: Upload trực tiếp (Synchronous)
    // ==========================================
    // if (!file) {
    //     throw new Error("Không có file nào được tải lên");
    // }

    // const fileName = `images/${crypto.randomUUID()}.jpg`;
    // console.log("File name: " + fileName);

    // const buffer = file.buffer || (file.path ? await fs.readFile(file.path) : null);
    // const imageUrl = await s3Repository.uploadFile(buffer, fileName, file.mimetype);
    // console.log("Image url: " + imageUrl);

    // if (file.path) {
    //     await fs.unlink(file.path).catch(() => {});
    // }

    // return imageUrl;

    if (!file) {
        throw new Error("Không có file nào được tải lên");
    }

    const filePath = file.path || null;
    if (!filePath) {
        throw new Error("Không tìm thấy đường dẫn file tạm (filePath). Vui lòng sử dụng diskStorage middleware.");
    }

    const s3Key = `images/${crypto.randomUUID()}.jpg`;

    // Đẩy Job chứa đường dẫn file (filePath) và s3Key vào hàng chờ BullMQ
    await imageQueue.add(
        'upload-image',
        {
            filePath,
            s3Key,
            mimetype: file.mimetype
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );

    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;

    return imageUrl
};


const deleteImage = async (imageUrl) => {
    // if (!imageUrl) return false;

    // // Extract S3 object key from the public URL
    // const match = imageUrl.match(/\.amazonaws\.com\/(.+)$/);
    // if (!match) {
    //     console.warn(`URL ảnh không đúng định dạng S3: ${imageUrl}`);
    //     return false;
    // }

    // const s3Key = match[1];
    // return await s3Repository.deleteFile(s3Key);

    if (!imageUrl) {
        return false;
    }

    await imageQueue.add(
        'delete-image',
        {
            imageUrl
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );

    return true;
};

const uploadAudio = async (file) => {
    // ==========================================
    // PHIÊN BẢN CỦ: Upload & HLS trực tiếp (Synchronous)
    // ==========================================
    /*
    if (!file) {
        throw new Error("Không có file nào được tải lên");
    }

    const audioId = crypto.randomUUID();

    // Cấu trúc thư mục tạm
    const tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), `audio-${audioId}-`)
    );

    const inputPath = path.join(
        tempDir,
        "input.mp3"
    );

    const hlsDir = path.join(
        tempDir,
        "hls"
    );

    const segmentDir = path.join(
        hlsDir,
        "segments"
    );

    try {
        // Tạo thư mục segments
        await fs.mkdir(segmentDir, {
            recursive: true
        });

        // 1. Lưu audio file tạm thời
        if (file.path) {
            await fs.copyFile(file.path, inputPath);
            await fs.unlink(file.path).catch(() => { });
        } else {
            await fs.writeFile(
                inputPath,
                file.buffer
            );
        }

        // 2. Chuyển audio sang HLS
        await execFileAsync("ffmpeg", [
            "-i",
            inputPath,

            // Bỏ qua cover image
            "-vn",

            // Chuyển audio sang AAC
            "-c:a",
            "aac",

            "-b:a",
            "128k",

            // HLS
            "-f",
            "hls",

            "-hls_time",
            "6",

            "-hls_playlist_type",
            "vod",

            // Các segment nằm trong thư mục segments
            "-hls_segment_filename",
            path.join(
                segmentDir,
                "segment_%03d.ts"
            ),

            // Playlist
            path.join(
                hlsDir,
                "playlist.m3u8"
            )
        ]);

        // 3. Upload tất cả segments trước
        const segments = await fs.readdir(segmentDir);

        for (const segmentName of segments) {
            const segmentPath = path.join(
                segmentDir,
                segmentName
            );

            const segmentBuffer = await fs.readFile(
                segmentPath
            );

            await s3Repository.uploadFile(
                segmentBuffer,
                `audios/${audioId}/segments/${segmentName}`,
                "video/mp2t"
            );
        }

        // 4. Upload playlist sau cùng
        const playlistPath = path.join(
            hlsDir,
            "playlist.m3u8"
        );

        const playlistBuffer = await fs.readFile(
            playlistPath
        );

        const playlistUrl =
            await s3Repository.uploadFile(
                playlistBuffer,
                `audios/${audioId}/playlist.m3u8`,
                "application/vnd.apple.mpegurl"
            );

        console.log("Playlist URL:", playlistUrl);

        return playlistUrl;

    } finally {
        // 5. Xóa toàn bộ file tạm
        await fs.rm(tempDir, {
            recursive: true,
            force: true
        });
    }
    */

    if (!file) {
        throw new Error("Không có file nào được tải lên");
    }

    const filePath = file.path || null;
    if (!filePath) {
        throw new Error("Không tìm thấy đường dẫn file tạm (filePath). Vui lòng sử dụng diskStorage middleware.");
    }

    const audioId = crypto.randomUUID();

    // Đẩy Job chuyển đổi HLS và Upload Audio vào hàng chờ BullMQ
    await audioQueue.add(
        'upload-audio',
        {
            filePath,
            audioId
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );

    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;
    const playlistUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/audios/${audioId}/playlist.m3u8`;

    return playlistUrl;
};

const getAudioDuration = async (input) => {
    if (!input) {
        throw new Error("Dữ liệu audio không hợp lệ (input bị undefined)");
    }

    let tempPath;
    let isTempFileCreated = false;

    if (typeof input === 'string') {
        tempPath = input;
    } else if (input?.path) {
        tempPath = input.path;
    } else {
        const buffer = input?.buffer || input;
        if (!buffer) {
            throw new Error("Không tìm thấy đường dẫn đĩa (path) hoặc dữ liệu bộ nhớ (buffer) của audio");
        }
        tempPath = path.join(
            os.tmpdir(),
            `audio-${crypto.randomUUID()}.mp3`
        );
        await fs.writeFile(tempPath, buffer);
        isTempFileCreated = true;
    }

    try {
        const duration = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(tempPath, (err, metadata) => {
                if (err) {
                    return reject(err);
                }

                const duration = metadata?.format?.duration;

                if (!duration) {
                    return reject(
                        new Error("Không thể xác định thời lượng bài hát")
                    );
                }

                resolve(Math.round(duration));
            });
        });

        return duration;
    } finally {
        if (isTempFileCreated) {
            await fs.unlink(tempPath).catch(() => { });
        }
    }
};

const deleteAudio = async (audioUrl) => {
    // if (!audioUrl) return false;

    // const match = audioUrl.match(/\.amazonaws\.com\/(audios\/[^/]+\/)/);
    // if (match) {
    //     const folderPrefix = match[1];
    //     return await s3Repository.deleteFolder(folderPrefix);
    // }

    // const singleMatch = audioUrl.match(/\.amazonaws\.com\/(.+)$/);
    // if (singleMatch) {
    //     return await s3Repository.deleteFile(singleMatch[1]);
    // }

    // console.warn(`URL audio không đúng định dạng S3: ${audioUrl}`);
    // return false;

    if (!audioUrl) {
        return false;
    }

    await audioQueue.add(
        'delete-audio',
        {
            audioUrl
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );

    return true;
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadAudio,
    deleteAudio,
    getAudioDuration
};
