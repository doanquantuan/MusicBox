'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Playlist extends Model {
        static associate(models) {
            Playlist.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }

    Playlist.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        playlistName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        status: {
            type: DataTypes.ENUM('public', 'private'),
            defaultValue: 'public',
        },
        playCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        likeCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        modelName: 'Playlist',
        tableName: 'playlists',
        timestamps: true,
    })
    return Playlist;
}