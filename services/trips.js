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
                2,
                //KEYS[1],            KEYS[2]:
                keys.nodeKey(nodeId), keys.tripKey(nodeId, tripId),
                //ARGV[1],  ARGV[2]:
                nodeId,     tripId
            )
        };
        return redis.client().zrangeAsync(keys.tripKey(nodeId, tripId), 0, -1)
            // .then(saveInElastic)
            .then(endRedisTrip);
    },
    pushLocationToTrip: function (nodeId, tripId, location, time) {
        return redis.client().zaddAsync(keys.tripKey(nodeId, tripId), time, JSON.stringify({
            t: time,
            l: location,
        }));
    },
    getTrip: function (nodeId, tripId) {
        return redis.client().zrangeAsync(keys.tripKey(nodeId, tripId), 0, -1)
            .then(function (result) {
                return result.map(function (v) {
                    return JSON.parse(v);
                });
            });
        // todo: if current trip: get from redis
        // todo: else: get from elasticsearch.
    }
};
