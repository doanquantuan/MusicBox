const db = require("../models")
const Topic = db.Topic

const getTopicById = async (topicId) => {
    return await Topic.findByPk(topicId);
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

const playlistTopicRepository = require("./playlist_topic.repository");

const getPlaylistsByTopicId = async (topicId) => {
    return await playlistTopicRepository.getPlaylistsByTopicId(topicId);
};

const addPlaylistToTopic = async (topicId, playlistId) => {
    return await playlistTopicRepository.addPlaylistToTopic(topicId, playlistId);
};

const removePlaylistFromTopic = async (topicId, playlistId) => {
    return await playlistTopicRepository.removePlaylistFromTopic(topicId, playlistId);
};

module.exports = {
    getTopicById,
    getTopicByName,
    getAllTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    getPlaylistsByTopicId,
    addPlaylistToTopic,
    removePlaylistFromTopic
}