var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var _client;

module.exports = {
    client: function () {
        if (! _client) {
            _client = redis.createClient({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                db: process.env.REDIS_DB,
                retry_strategy: function (options) {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        _client.quit();
                        _client = null;
                        console.error(options.error);
                        // End reconnecting on a specific error and flush all commands with a individual error
                        return new Error('The server refused the connection');
                    }
                    if (options.total_retry_time > 1000 * 10) {
                        _client.quit();
                        _client = null;
                        console.error(options.error);
                        // End reconnecting after a specific timeout and flush all commands with a individual error
                        return new Error('Retry time exhausted');
                    }
                    if (options.times_connected > 10) {
                        _client.quit();
                        _client = null;
                        console.error(options.error);
                        // End reconnecting with built in error
                        return undefined;
                    }
                    // reconnect after
                    return Math.min(options.attempt * 500, 3000);
                }
            });
        }
        return _client;
    }
};