var redis = require('./redis');
var lua = require('./lua');
var Node = require('../models/node');
var keys = require('./redis-keys');
var trips = require('./trips');

module.exports = {
    setNodeLocation: function (nodeId, location) {
        return redis.client().evalAsync(
            lua.setNodeLocation,
            // Keys:
            2,
            //KEYS[1],            KEYS[2]:
            keys.nodeKey(nodeId), keys.geokey,
            //ARGV[1],  ARGV[2]:
            nodeId,     JSON.stringify({lat: location.lat, lon: location.lon})
        ).then(function (result) {
            return Promise.resolve(Node.fromJSON(result));
        }).then (function (node) {
            if (node.trip_id !== null) {
                return trips.pushLocationToTrip(node.id, node.trip_id, location, new Date().getTime())
                    .then(function () {
                        return node;
                    });
            }
            return node;
        });
    },
    setNodeState: function (nodeId, state) {
        return redis.client().evalAsync(
            lua.setNodeState,
            // Keys:
            3,
            //KEYS[1],            KEYS[2],     KEYS[3]:
            keys.nodeKey(nodeId), keys.geokey, keys.geoStateKey(state),
            //ARGV[1],  ARGV[2]:
            nodeId,     JSON.stringify({s:state})
        ).then(function (result) {
            return Node.fromJSON(result);
        });
    },
    getNode: function (nodeId) {
        return redis.client().getAsync([keys.nodeKey(nodeId)]).then(function (reply) {
            if (reply === null) {
                return null;
            }
            return Node.fromJSON(reply);
        });
    },
    deleteNode: function (nodeId) {
        return redis.client().evalAsync(
            lua.deleteNode,
            // Keys:
            2,
            //KEYS[1],            KEYS[2]:
            keys.nodeKey(nodeId), keys.geokey
        );
    },
    knn: function (lon, lat, radius, count, state = null) {
        return redis.client().georadiusAsync(
            state !== null ? keys.geoStateKey(state) : keys.geokey,
            lon, lat, radius, 'm',
            'WITHCOORD', 'WITHDIST',
            'COUNT', count,
            'ASC'
        ).then(function (reply) {
            return reply.map(function (v) {
                return {
                    'id': v[0],
                    'distance': v[1],
                    'location': {
                        lat: parseFloat(v[2][1]),
                        lon: parseFloat(v[2][0]),
                    }
                };
            });
        });
    }
};
