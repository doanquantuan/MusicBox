'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PlaylistSong extends Model {
        static associate(models) {
            PlaylistSong.belongsTo(models.Playlist, { foreignKey: 'playlistId' });
            PlaylistSong.belongsTo(models.Song, { foreignKey: 'songId' });
        }
    }

    PlaylistSong.init({
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
        songId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'songs',
                key: 'id',
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        addAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'PlaylistSong',
        tableName: 'playlist_songs',
        timestamps: false,
    })
    return PlaylistSong;
}