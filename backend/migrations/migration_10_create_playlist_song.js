'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('playlist_songs', {
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
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            addAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('playlist_songs');
    }
};
