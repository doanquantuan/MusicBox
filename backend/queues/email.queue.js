const { Queue } = require('bullmq');
const redisConnection = require('../config/redis');

const emailQueue = new Queue('email', {
    connection: redisConnection
});

module.exports = emailQueue;