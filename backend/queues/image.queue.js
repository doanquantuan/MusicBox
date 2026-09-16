const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const imageQueue = new Queue('image', {
    connection: redisConnection
});

module.exports = imageQueue;