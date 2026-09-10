const db = require("../models")
const Topic = db.Topic

const getTopicById = async (topicId) => {
    return await Topic.findById(topicId);
}

const getTopicByName = async (topicName) => {
    return await Topic.findOne(
        { where: { topicName: topicName } }
    )
}

const getAllTopics = async () => {
    return await Topic.findAll();
}

const createTopic = async (topicData) => {
    return await Topic.create(topicData);
}

const updateTopic = async (topicId, topicData, options = {}) => {
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }

    await topic.update(topicData, options);
    return topic;
}

const deleteTopic = async (topic) => {
    await topic.destroy();
    return topic;
}

module.exports = {
    getTopicById,
    getTopicByName,
    getAllTopics,
    createTopic,
    updateTopic,
    deleteTopic
}