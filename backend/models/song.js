'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Song extends Model {
        static associate(models) {
            Song.belongsTo(models.Album, { foreignKey: 'albumId' });
            Song.belongsToMany(models.Artist, {
                foreignKey: "songId",
                otherKey: "artistId",
                through: models.SongArtist,
                as: "artists"
            });
            Song.hasMany(models.SongArtist, { foreignKey: 'songId', as: 'songArtists' });
            Song.hasMany(models.AlbumSong, { foreignKey: 'songId' });
        }
    }
    Song.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        songName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        albumId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'albums',
                key: 'id',
            }
        },

        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        coverImgUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        audioUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        playCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        likeCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('public', 'private'),
            defaultValue: 'public',
        }
    }, {
        sequelize,
        modelName: 'Song',
        tableName: "songs",
        timestamps: true,
    })
    return Song;
}