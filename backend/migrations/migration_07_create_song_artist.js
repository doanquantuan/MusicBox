'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('song_artists', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            artistId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'artists',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('song_artists');
    }
};
