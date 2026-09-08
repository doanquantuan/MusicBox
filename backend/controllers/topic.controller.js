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

module.exports = {
    createTopic,
    updateTopic,
    getAllTopics
}