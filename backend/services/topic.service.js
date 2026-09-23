const TopicRepository = require("../repositories/topic.repository");
const PlaylistRepository = require("../repositories/playlist.repository");
const PlaylistTopicRepository = require("../repositories/playlist_topic.repository");
const FileService = require("./file.service");
const db = require("../models");

const createTopic = async (topicData, imageFile) => {
    const existingTopic = await TopicRepository.getTopicByName(topicData.topicName);

    if (existingTopic) {
        throw new Error("Thể loại đã tồn tại")
    }

    let imageUrl = null;

    if (imageFile) {
        imageUrl = await FileService.uploadImage(imageFile);
    }

    const newTopic = await TopicRepository.createTopic({
        ...topicData,
        imageUrl
    });

    return newTopic;
}

const updateTopic = async (topicId, topicData, imageFile) => {
    const existingTopic = await TopicRepository.getTopicById(topicId);

    if (!existingTopic) {
        throw new Error("Không tìm thấy chủ đề")
    }

    let imageUrl = existingTopic.imageUrl;
    let uploadSuccess = false;

    if (imageFile) {
        try {
            imageUrl = await FileService.uploadImage(imageFile);
            uploadSuccess = true;
        } catch (error) {
            console.error("Upload ảnh mới thất bại, giữ nguyên ảnh cũ:", error.message);
            imageUrl = existingTopic.imageUrl;
        }
    }

    const t = await db.sequelize.transaction();
    try {
        await TopicRepository.updateTopic(topicId, { ...topicData, imageUrl }, { transaction: t });
        await t.commit();

        if (imageFile && uploadSuccess && existingTopic.imageUrl) {
            try {
                await FileService.deleteImage(existingTopic.imageUrl);
            } catch (err) {
                console.error("Xóa ảnh cũ thất bại:", err.message);
            }
        }

        return await TopicRepository.getTopicById(topicId);
    } catch (error) {
        await t.rollback();
        if (imageFile && uploadSuccess && imageUrl && imageUrl !== existingTopic.imageUrl) {
            try {
                await FileService.deleteImage(imageUrl);
            } catch (err) {
                console.error("Xóa ảnh mới tải lên thất bại sau khi DB rollback:", err.message);
            }
        }

        throw new Error(`Cập nhật chủ đề thất bại: ${error.message}`);
    }
}

const getAllTopics = async () => {
    return TopicRepository.getAllTopics();
}

const deleteTopic = async (topicId) => {
    const topic = await TopicRepository.getTopicById(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }

    await TopicRepository.deleteTopic(topic);

    if (topic.imageUrl) {
        try {
            await FileService.deleteImage(topic.imageUrl);
        } catch (err) {
            console.error("Xóa ảnh cũ thất bại:", err.message);
        }
    }

    return topic;
}

const getTopicById = async (topicId) => {
    const topic = await TopicRepository.getTopicById(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }
    return topic;
};

const getPlaylistsByTopic = async (topicId) => {
    const topic = await TopicRepository.getTopicById(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }
    return await TopicRepository.getPlaylistsByTopicId(topicId);
};

const addPlaylistToTopic = async (topicId, playlistId) => {
    if (!topicId || !playlistId) {
        throw new Error("topicId và playlistId là bắt buộc");
    }
    const topic = await TopicRepository.getTopicById(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }
    const playlist = await PlaylistRepository.getPlaylistById(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }
    const existing = await PlaylistTopicRepository.findPlaylistTopic(topicId, playlistId);
    if (existing) {
        throw new Error("Playlist đã tồn tại trong chủ đề này");
    }
    return await TopicRepository.addPlaylistToTopic(topicId, playlistId);
};

const removePlaylistFromTopic = async (topicId, playlistId) => {
    if (!topicId || !playlistId) {
        throw new Error("topicId và playlistId là bắt buộc");
    }
    const topic = await TopicRepository.getTopicById(topicId);
    if (!topic) {
        throw new Error("Không tìm thấy chủ đề");
    }
    const playlist = await PlaylistRepository.getPlaylistById(playlistId);
    if (!playlist) {
        throw new Error("Không tìm thấy playlist");
    }
    const existing = await PlaylistTopicRepository.findPlaylistTopic(topicId, playlistId);
    if (!existing) {
        throw new Error("Playlist không thuộc chủ đề này");
    }
    await TopicRepository.removePlaylistFromTopic(topicId, playlistId);
    return { topicId, playlistId };
};

module.exports = {
    createTopic,
    getAllTopics,
    updateTopic,
    deleteTopic,
    getTopicById,
    getPlaylistsByTopic,
    addPlaylistToTopic,
    removePlaylistFromTopic
}
