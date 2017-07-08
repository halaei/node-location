var redis = require('./redis');
var Node = require('../models/node');
var keys = require('./redis-keys');

module.exports = {
    get: function (nodeId) {
        return redis.client().getAsync([keys.nodeKey(nodeId)]).then(function (reply) {
            if (reply === null) {
                return null;
            }
            return Node.fromJSON(reply);
        });
    },
};
