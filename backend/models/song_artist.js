'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SongArtist extends Model {
        static associate(models) {
            SongArtist.belongsTo(models.Artist, { foreignKey: 'artistId' });
            SongArtist.belongsTo(models.Song, { foreignKey: 'songId' });
        }
    }

    SongArtist.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        artistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'artists',
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

    }, {
        sequelize,
        modelName: 'SongArtist',
        tableName: 'song_artists',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["songId", "artistId"]
            }
        ]
    })
    return SongArtist;
}