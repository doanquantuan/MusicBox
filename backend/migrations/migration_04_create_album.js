'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('albums', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            albumName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            coverImgUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            artistId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'artists',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('albums');
    }
};
