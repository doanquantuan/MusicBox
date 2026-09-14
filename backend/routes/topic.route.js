const express = require('express');
const topicController = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

const { validateTopic } = require('../validators/topic.validator');
const { imageUpload } = require('../middlewares/upload.middleware');

// Standard RESTful endpoints for /api/topics
router.get('/', authenticate, topicController.getAllTopics);
router.post('/', authenticate, authorize('ADMIN'), imageUpload.single("image"), validateTopic, topicController.createTopic);
router.put('/:topicId', authenticate, authorize('ADMIN'), imageUpload.single("image"), validateTopic, topicController.updateTopic);
router.delete('/:topicId', authenticate, authorize('ADMIN'), topicController.deleteTopic);

module.exports = router;