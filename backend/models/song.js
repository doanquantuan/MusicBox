'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Song extends Model {
        static associate(models) {
            Song.belongsTo(models.Album, { foreignKey: 'albumId' });
            Song.belongsToMany(models.Artist, { foreignKey: 'songId', otherKey: 'artistId', through: 'song_artists', as: 'artists' });
            Song.belongsTo(models.Genre, { foreignKey: 'genreId' });
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
        genreId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'genres',
                key: 'id',
            }
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        coverImgUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        audioUrl: {
            type: DataTypes.STRING,
            allowNull: false,
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