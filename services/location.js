var client = require('./redis');

var lua = require('./lua');

module.exports = {
    list_size: process.env.LOCATION_LISTS_SIZE,
    list_ttl: process.env.LOCATION_LISTS_TTL,
    geokey: 'cur',
    list: function (node) {
        return 'nd:'+node;
    },
    push: function (node, location) {
        var list = this.list(node);
        return client.evalAsync([
            lua.push,
            2,
            //KEYS[1], KEYS[2]:
            list,      this.geokey,
            //ARGV[1],                ARGV[2],        ARGV[3]:
            JSON.stringify(location), this.list_size, this.list_ttl,
            //ARGV[4],       ARGV[5],          ARGV[6]:
            ''+location.lon, ''+location.lat, node,
        ]);
    },
    last: function (node, n) {
        var list = this.list(node);
        return client.lrangeAsync([list, 0, n - 1]).then(function (reply) {
            return reply.map(function (v) {
                return JSON.parse(v);
            });
        });
    },
    delete: function (node) {
        var list = this.list(node);
        return client.evalAsync([
            lua.delete,
            2,
            //KEYS[1], KEYS[2]:
            list,      this.geokey,
            //ARGV[1]:
            node
        ]);
    },
    knn: function (lon, lat, radius, count) {
        return client.georadiusAsync(
            this.geokey,
            lon, lat, radius, 'm',
            'WITHCOORD', 'WITHDIST',
            'COUNT', count,
            'ASC'
        ).then(function (reply) {
            return reply.map(function (v) {
                return {
                    'node': v[0],
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
