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
        // Add unique constraint for playlistId and songId
        await queryInterface.addIndex('playlist_songs', ['playlistId', 'songId'], {
            unique: true,
            name: 'playlist_songs_playlistId_songId_unique'
        });
        // Add unique constraint for position and playlistId
        await queryInterface.addIndex('playlist_songs', ['position', 'playlistId'], {
            unique: true,
            name: 'playlist_songs_position_playlistId_unique'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('playlist_songs');
    }
};
