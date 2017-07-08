var redis = require('./redis');
var lua = require('./lua');
var keys = require('./redis-keys');
var elastic = require('./elasticsearch');

module.exports = {
    beginTrip: function (nodeId, tripId) {
        //todo: store previous trip in Elasticsearch
        return redis.client().evalAsync(
            lua.beginTrip,
            1,
            //KEYS[1]
            keys.nodeKey(nodeId),
            //ARGV[1], ARGV[2]
            nodeId,    tripId
        ).then (function (result) {
            return result === 'OK';
        });
    },
    endTrip: function (nodeId, tripId) {
        var saveInElastic = function (result) {

        };
        var endRedisTrip = function () {
            return redis.client().evalAsync(
                lua.endTrip,
                1,
                //KEYS[1]
                keys.nodeKey(nodeId),
                //ARGV[1]
                nodeId
            )
        };
        return redis.zrangeAsync(keys.tripKey(nodeId, tripId, 'WITHSCORES'))
            .then(saveInElastic)
            .then(endRedisTrip);
    },
    pushLocationToTrip: function (nodeId, tripId, location, time) {
        return redis.client().zaddAsync(keys.tripKey(nodeId, tripId), time, JSON.stringify(location));
    },
    getTrip: function (nodeId, tripId) {
        return redis.zrangeAsync(keys.tripKey(nodeId, tripId, 'WITHSCORES'));
        // todo: if current trip: get from redis
        // todo: else: get from elasticsearch.
    }
};
