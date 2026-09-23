'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('playlist_topics', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            playlistId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'playlists',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            topicId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'topics',
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

        // Add unique constraint for playlistId and topicId
        await queryInterface.addIndex('playlist_topics', ['playlistId', 'topicId'], {
            unique: true,
            name: 'playlist_topics_playlistId_topicId_unique'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('playlist_topics');
    }
};
