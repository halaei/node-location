var redis = require('./redis');
var lua = require('./lua');
var keys = require('./redis-keys');

module.exports = {
    beginTrip: function (nodeId, tripId) {
        //todo: store previous trip in Elasticsearch
        return redis.evalAsync(
            lua.beginTrip,
            1,
            //KEYS[1]
            keys.nodeKey(nodeId),
            //ARGV[1], ARGV[2]
            nodeId,    tripId
        );
    },
    endTrip: function (nodeId, tripId) {
        //todo: store in Elasticsearch
        return redis.evalAsync(
            lua.endTrip,
            1,
            //KEYS[1]
            keys.nodeKey(nodeId),
            //ARGV[1]
            nodeId
        );
    },
    pushLocationToTrip: function (nodeId, tripId, location, time) {
        return redis.zaddAsync(keys.tripKey(nodeId, tripId), time, JSON.stringify(location));
    },
    getTrip: function (nodeId, tripId) {
        // todo: if current trip: get from redis
        // todo: else: get from elasticsearch.
    }
};
