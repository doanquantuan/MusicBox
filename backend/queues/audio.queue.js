const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const audioQueue = new Queue('audio', {
    connection: redisConnection
});

module.exports = audioQueue;