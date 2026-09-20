const topicService = require("../services/topic.service");

const createTopic = async (req, res) => {
    try {
        const result = await topicService.createTopic(req.body, req.file);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateTopic = async (req, res) => {
    try {
        const result = await topicService.updateTopic(req.params.topicId, req.body, req.file);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getAllTopics = async (req, res) => {
    try {
        const result = await topicService.getAllTopics();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const deleteTopic = async (req, res) => {
    try {
        const result = await topicService.deleteTopic(req.params.topicId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getTopicById = async (req, res) => {
    try {
        const result = await topicService.getTopicById(req.params.topicId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getPlaylistsByTopic = async (req, res) => {
    try {
        const result = await topicService.getPlaylistsByTopic(req.params.topicId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const addPlaylistToTopic = async (req, res) => {
    try {
        const topicId = req.params.topicId;
        const playlistId = req.params.playlistId || req.body.playlistId;
        const result = await topicService.addPlaylistToTopic(topicId, playlistId);
        res.status(200).json({
            success: true,
            message: "Thêm playlist vào chủ đề thành công",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const removePlaylistFromTopic = async (req, res) => {
    try {
        const { topicId, playlistId } = req.params;
        const result = await topicService.removePlaylistFromTopic(topicId, playlistId);
        res.status(200).json({
            success: true,
            message: "Xóa playlist khỏi chủ đề thành công",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createTopic,
    updateTopic,
    getAllTopics,
    deleteTopic,
    getTopicById,
    getPlaylistsByTopic,
    addPlaylistToTopic,
    removePlaylistFromTopic
}