const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==========================================
// 1. PHIÊN BẢN CŨ: Memory Storage (Lưu trên RAM)
// ==========================================
const memoryStorage = multer.memoryStorage();

// ==========================================
// 2. PHIÊN BẢN MỚI: Disk Storage (Lưu tạm trên Ổ Cứng tại MusicBox/temp)
// ==========================================
const tempDir = path.resolve(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Chế độ lưu trữ mặc định đang dùng (Thay đổi giữa diskStorage và memoryStorage ở đây)
const currentStorage = diskStorage;

// ==========================================
// FILE FILTERS & LIMITS
// ==========================================
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const audioFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['audio/mp3', 'audio/mpeg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// ==========================================
// EXPORTS CẢ 2 PHIÊN BẢN
// ==========================================

// Disk Storage
const imageUpload = multer({ storage: currentStorage, fileFilter: imageFileFilter, limits: { fileSize: 1024 * 1024 * 5 } });
const audioUpload = multer({ storage: currentStorage, fileFilter: audioFileFilter, limits: { fileSize: 1024 * 1024 * 50 } });
const songUpload = multer({ storage: currentStorage });

// Memory Storage
const imageMemoryUpload = multer({ storage: memoryStorage, fileFilter: imageFileFilter, limits: { fileSize: 1024 * 1024 * 5 } });
const audioMemoryUpload = multer({ storage: memoryStorage, fileFilter: audioFileFilter, limits: { fileSize: 1024 * 1024 * 50 } });
const songMemoryUpload = multer({ storage: memoryStorage });

module.exports = {
    // Disk Storage
    imageUpload,
    audioUpload,
    songUpload,

    // Memory Storage
    imageMemoryUpload,
    audioMemoryUpload,
    songMemoryUpload
};

