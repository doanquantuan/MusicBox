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

const getPlaylistsByTopicId = async (topicId) => {
    return await db.Playlist.findAll({
        where: { topicId },
        include: [{ model: db.User, attributes: ['id', 'name', 'email'] }]
    });
};

const addPlaylistToTopic = async (topicId, playlistId) => {
    const playlist = await db.Playlist.findByPk(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }
    await playlist.update({ topicId });
    return playlist;
};

const removePlaylistFromTopic = async (topicId, playlistId) => {
    const playlist = await db.Playlist.findByPk(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }
    await playlist.update({ topicId: null });
    return playlist;
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