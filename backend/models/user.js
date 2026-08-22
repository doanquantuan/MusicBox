'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            if (models.Order) {
                User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
            }
            if (models.RefreshToken) {
                User.hasOne(models.RefreshToken, { foreignKey: "userId", as: "refreshToken" });
            }
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "User",
        },
        otpCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
    });

    return User;
};
