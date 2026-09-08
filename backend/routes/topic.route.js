const express = require('express');
const topicController = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

const { validateTopic } = require('../validators/topic.validator');
const { imageUpload } = require('../middlewares/upload.middleware');

router.post('/create', authenticate, authorize('ADMIN'), validateTopic, imageUpload.single("image"), topicController.createTopic);
router.get('/', authenticate, topicController.getAllTopics);

module.exports = router;