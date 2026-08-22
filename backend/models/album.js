'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Album extends Model {
        static associate(models) {
            Album.belongsTo(models.Artist, { foreignKey: 'artistId' })
        }
    }

    Album.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        albumName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        coverImgUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        artistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'artists',
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
        modelName: 'Album',
        tableName: 'albums',
        timestamps: true,
    })
    return Album;
}