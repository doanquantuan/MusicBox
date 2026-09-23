'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PlaylistTopic extends Model {
        static associate(models) {
            PlaylistTopic.belongsTo(models.Playlist, { foreignKey: 'playlistId' });
            PlaylistTopic.belongsTo(models.Topic, { foreignKey: 'topicId' });
        }
    }

    PlaylistTopic.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        playlistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'playlists',
                key: 'id',
            }
        },
        topicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topics',
                key: 'id',
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'PlaylistTopic',
        tableName: 'playlist_topics',
        timestamps: true,
    });
    return PlaylistTopic;
};
