const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
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

const uploadAudio = async (file) => {
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

        // 1. Lưu audio buffer tạm thời
        await fs.writeFile(
            inputPath,
            file.buffer
        );

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

        /*
        Upload structure:

        audios/{audioId}/
        ├── playlist.m3u8
        └── segments/
            ├── segment_000.ts
            ├── segment_001.ts
            └── ...
        */


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
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadAudio
};
