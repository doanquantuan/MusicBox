const db = require("../models");
const PlaylistTopic = db.PlaylistTopic;

const findPlaylistTopic = async (topicId, playlistId) => {
    return await PlaylistTopic.findOne({
        where: { topicId, playlistId }
    });
};

const addPlaylistToTopic = async (topicId, playlistId, options = {}) => {
    return await PlaylistTopic.create({ topicId, playlistId }, options);
};

const removePlaylistFromTopic = async (topicId, playlistId, options = {}) => {
    return await PlaylistTopic.destroy({
        where: { topicId, playlistId },
        ...options
    });
};

const getPlaylistsByTopicId = async (topicId) => {
    return await db.Playlist.findAll({
        include: [
            {
                model: db.Topic,
                as: 'topics',
                where: { id: topicId },
                attributes: [],
                through: { attributes: [] }
            },
            { model: db.User, attributes: ['id', 'name', 'email'] }
        ]
    });
};

const getTopicsByPlaylistId = async (playlistId) => {
    return await db.Topic.findAll({
        include: [
            {
                model: db.Playlist,
                as: 'playlists',
                where: { id: playlistId },
                attributes: [],
                through: { attributes: [] }
            }
        ]
    });
};

module.exports = {
    findPlaylistTopic,
    addPlaylistToTopic,
    removePlaylistFromTopic,
    getPlaylistsByTopicId,
    getTopicsByPlaylistId
};
