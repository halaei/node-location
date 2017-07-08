var redis = require('./redis');
var lua = require('./lua');
var keys = require('./redis-keys');
var elastic = require('./elasticsearch');
var nodeStore = require('./node-store');

function getRedisTrip(nodeId, tripId) {
    return redis.client().zrangeAsync(keys.tripKey(nodeId, tripId), 0, -1)
        .then(function (result) {
            return result.map(function (v) {
                return JSON.parse(v);
            });
        });
}

function getElasticTrip(nodeId, tripId) {
    return elastic.search({
        'index': process.env.ELASTICSEARCH_INDEX,
        'type': 'trip',
        'body': {
            'from': 0,
            'size': 1,
            'query': {
                'bool': {
                    'must': [
                        {
                            'term': {
                                'node_id': {value: nodeId},
                            }
                        },
                        {
                            'term': {
                                'trip_id': {value: tripId},
                            }
                        },
                    ]
                },
            }
        }
    }).then(function (result) {
        var first = result.hits.hits[0];
        if (first) {
            return first._source;
        }
        return null;
    });
}
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
            elastic.index({
                'index': process.env.ELASTICSEARCH_INDEX,
                'type': 'trip',
                'body': {
                    'node_id': nodeId,
                    'trip_id': tripId,
                    'trace': result,
                }
            });
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
        return getRedisTrip(nodeId, tripId)
            .then(saveInElastic)
            .then(endRedisTrip);
    },
    pushLocationToTrip: function (nodeId, tripId, location, time) {
        return redis.client().zaddAsync(keys.tripKey(nodeId, tripId), time, JSON.stringify({
            t: time,
            l: location,
        }));
    },
    getTrip: function (nodeId, tripId) {
        return nodeStore.get(nodeId).then(function (nd) {
            if (nd === null || nd.trip_id !== tripId) {
                return null;
            }
            return getRedisTrip(nodeId, tripId);
        }).then (function (trip) {
            if (trip !== null) {
                return trip;
            }
            return getElasticTrip(nodeId, tripId);
        });
    }
};
