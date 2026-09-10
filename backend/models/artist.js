'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Artist extends Model {
        static associate(models) {
            Artist.hasMany(models.Album, { foreignKey: 'artistId' });
            Artist.belongsToMany(models.Song, { foreignKey: 'artistId', otherKey: 'songId', through: 'song_artists', as: 'songs' });
        }
    }

    Artist.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        artistName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
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
        modelName: 'Artist',
        tableName: 'artists',
        timestamps: true,
    });
    return Artist;
}