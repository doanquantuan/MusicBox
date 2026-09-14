'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('album_songs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            albumId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'albums',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            songId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'songs',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            trackNumber: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
            },

        });
        // Add unique constraint for albumId and songId
        await queryInterface.addIndex('album_songs', ['albumId', 'songId'], {
            unique: true,
            name: 'album_songs_albumId_songId_unique'
        });
        // Add unique constraint for trackNumber and albumId
        await queryInterface.addIndex('album_songs', ['trackNumber', 'albumId'], {
            unique: true,
            name: 'album_songs_trackNumber_albumId_unique'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('album_songs');
    }
};
