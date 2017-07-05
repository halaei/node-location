var client = require('./redis');
var lua = require('./lua');
var Node = require('../models/node');

var geokey = 'cur';
function geoStateKey(state) {
    return 'cur:'+state;
}
function nodeKey(id) {
    return 'nd:'+id;
}

module.exports = {
    setNodeLocation: function (nodeId, location) {
        return client.evalAsync(
            lua.setNodeLocation,
            // Keys:
            2,
            //KEYS[1],      KEYS[2]:
            nodeKey(nodeId), geokey,
            //ARGV[1],  ARGV[2]:
            nodeId,     JSON.stringify({lat: location.lat, lon: location.lon})
        ).then(function (result) {
            console.log(result);
            return Node.fromJSON(result);
        });
    },
    setNodeState: function (nodeId, state) {
        return client.evalAsync(
            lua.setNodeState,
            // Keys:
            3,
            //KEYS[1],      KEYS[2], KEYS[3]:
            nodeKey(nodeId), geokey, geoStateKey(state),
            //ARGV[1],  ARGV[2]:
            nodeId,     JSON.stringify({s:state})
        ).then(function (result) {
            return Node.fromJSON(result);
        });
    },
    getNode: function (nodeId) {
        return client.getAsync([nodeKey(nodeId)]).then(function (reply) {
            if (reply === null) {
                return null;
            }
            return Node.fromJSON(reply);
        });
    },
    deleteNode: function (nodeId) {
        return client.evalAsync(
            lua.deleteNode,
            // Keys:
            2,
            //KEYS[1],       KEYS[2]:
            nodeKey(nodeId), geokey
        );
    },
    knn: function (lon, lat, radius, count, state = null) {
        return client.georadiusAsync(
            state !== null ? geoStateKey(state) : geokey,
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
                        lat: v[2][1],
                        lon: v[2][0],
                    }
                };
            });
        });
    }
};
