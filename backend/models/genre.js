'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Genre extends Model {
        static associate(models) {
            Genre.hasMany(models.Song, { foreignKey: 'genreId' })
        }
    }
    Genre.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        genreName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    }, {
        modelName: 'Genre',
        sequelize,
        timestamps: true
    })
    return Genre;
}