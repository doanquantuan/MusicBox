const express = require('express');
const topicController = require('../controllers/topic.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

const { validateTopic } = require('../validators/topic.validator');
const { imageUpload } = require('../middlewares/upload.middleware');

// Standard RESTful endpoints for /api/topics
router.get('/', authenticate, topicController.getAllTopics);
router.get('/:topicId', authenticate, topicController.getTopicById);
router.get('/:topicId/playlists', authenticate, topicController.getPlaylistsByTopic);
router.post('/', authenticate, authorize('ADMIN'), imageUpload.single("image"), validateTopic, topicController.createTopic);
router.post('/:topicId/playlists/:playlistId', authenticate, authorize('ADMIN'), topicController.addPlaylistToTopic);
router.post('/:topicId/playlists', authenticate, authorize('ADMIN'), topicController.addPlaylistToTopic);
router.put('/:topicId', authenticate, authorize('ADMIN'), imageUpload.single("image"), validateTopic, topicController.updateTopic);
router.delete('/:topicId', authenticate, authorize('ADMIN'), topicController.deleteTopic);
router.delete('/:topicId/playlists/:playlistId', authenticate, authorize('ADMIN'), topicController.removePlaylistFromTopic);

module.exports = router;