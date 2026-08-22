'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SongArtist extends Model {
        static associate(models) {
            SongArtist.belongsTo(models.Song, { foreignKey: 'songId' });
            SongArtist.belongsTo(models.Artist, { foreignKey: 'artistId' });
        }
    }

    SongArtist.init({
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
        artistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'artists',
                key: 'id',
            }
        }
    }, {
        sequelize,
        modelName: 'SongArtist',
        tableName: 'song_artists',
        timestamps: false,
    })
    return SongArtist;
}
