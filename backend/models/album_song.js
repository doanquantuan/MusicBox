'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AlbumSong extends Model {
        static associate(models) {
            AlbumSong.belongsTo(models.Album, { foreignKey: 'albumId' })
            AlbumSong.belongsTo(models.Song, { foreignKey: 'songId' })
        }
    }

    AlbumSong.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        songId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'songs',
                key: 'id',
            }
        },
        albumId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'albums',
                key: 'id',
            }
        },
        trackNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        modelName: 'AlbumSong',
        tableName: 'album_songs',
        timestamps: true,
    })
    return AlbumSong;
}