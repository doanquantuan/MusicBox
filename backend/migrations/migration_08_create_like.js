'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('likes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            songId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'songs',
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

        // Add unique constraint for userId and songId
        await queryInterface.addIndex('likes', ['userId', 'songId'], {
            unique: true,
            name: 'likes_userId_songId_unique'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('likes');
    }
};
