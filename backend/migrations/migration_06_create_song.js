'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('songs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            songName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            albumId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'albums',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            genreId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'genres',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            releaseDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            coverImgUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            audioUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            playCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            likeCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('public', 'private'),
                defaultValue: 'public',
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
        await queryInterface.dropTable('songs');
    }
};
