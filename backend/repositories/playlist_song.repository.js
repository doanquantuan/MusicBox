const db = require("../models");
const PlaylistSong = db.PlaylistSong;
const { Op } = require("sequelize");

const getSongsByPlaylist = async (playlistId) => await PlaylistSong.findAll({
    where: { playlistId },
    include: [
        {
            model: db.Song,
            include: [
                {
                    model: db.Artist,
                    as: 'artists',
                    attributes: ['id', 'artistName', 'imageUrl'],
                    through: { attributes: [] }
                },
                {
                    model: db.Album,
                    attributes: ['id', 'albumName', 'coverImgUrl']
                }
            ]
        }
    ],
    order: [['position', 'ASC']]
});
const addSongToPlaylist = async (data) => await PlaylistSong.create(data);
const removeSongFromPlaylist = async (playlistId, songId, options) => await PlaylistSong.destroy({ where: { playlistId, songId }, options });

const getMaxPosition = async (playlistId) => await PlaylistSong.max('position', { where: { playlistId } });

const findByPlaylistAndSong = async (playlistId, songId) => {
    return await PlaylistSong.findOne({
        where: {
            playlistId,
            songId
        }
    });
};


const decreasePositions = async (playlistId, position, options) => {
    return await PlaylistSong.increment(
        { position: -1 },
        {
            where: {
                playlistId,
                position: {
                    [Op.gt]: position
                }
            },
            ...options
        }
    );
};

const updatePosition = async (id, position, options) => {
    return await PlaylistSong.update(
        { position },
        { where: { id }, ...options }
    );
};

const updatePositionsRange = async (playlistId, startPosition, endPosition, newPosition, options) => {
    return await PlaylistSong.update(
        { position: newPosition },
        {
            where: {
                playlistId,
                position: {
                    [Op.gte]: startPosition,
                    [Op.lte]: endPosition
                }
            },
            ...options
        }
    );
};

module.exports = {
    getSongsByPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getMaxPosition,
    findByPlaylistAndSong,
    decreasePositions,
    updatePosition,
    updatePositionsRange,
};