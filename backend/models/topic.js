'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Topic extends Model {
        static associate(models) {
            Topic.belongsToMany(models.Playlist, {
                foreignKey: 'topicId',
                otherKey: 'playlistId',
                through: models.PlaylistTopic,
                as: 'playlists'
            });
            Topic.hasMany(models.PlaylistTopic, { foreignKey: 'topicId', as: 'topicPlaylists' });
        }
    }
    Topic.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        topicName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    }, {
        modelName: 'Topic',
        sequelize,
        timestamps: true
    })
    return Topic;
}