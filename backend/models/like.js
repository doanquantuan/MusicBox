'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            Like.belongsTo(models.User, { foreignKey: 'userId' });
            Like.belongsTo(models.Song, { foreignKey: 'songId' });
        }
    }

    Like.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
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
        modelName: 'Like',
        tableName: 'likes',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'songId']
            }
        ]
    })
    return Like;
}