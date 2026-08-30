const multer = require('multer');

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const imageUpload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

const audioFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['audio/mp3', 'audio/mpeg'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
}

const audioUpload = multer({
    storage,
    fileFilter: audioFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 50 //50MB
    }
});
module.exports = {
    imageUpload,
    audioUpload
};