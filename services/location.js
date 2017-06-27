var redis = require('redis');
var client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB
});
var lua = require('./lua');

client.on('error', function (err) {
    console.log(err);
});

module.exports = {
    list_size: process.env.LOCATION_LISTS_SIZE,
    list_ttl: process.env.LOCATION_LISTS_TTL,
    geokey: 'cur',
    list: function (node) {
        return 'nd:'+node;
    },
    push: function (node, location, onSuccess, onError) {
        console.log(location.lon, location.lat, node);
        var list = this.list(node);
        client.eval([
            lua.push,
            2,
            //KEYS[1], KEYS[2]:
            list,      this.geokey,
            //ARGV[1],                ARGV[2],        ARGV[3]:
            JSON.stringify(location), this.list_size, this.list_ttl,
            //ARGV[4],       ARGV[5],          ARGV[6]:
            ''+location.lon, ''+location.lat, node,
        ], function (error, reply) {
            if (error !== null) {
                onError(error);
                console.log(error);
            } else {
                onSuccess(reply);
            }
        });
    },
    last: function (node, n, onSuccess, onError) {
        var list = this.list(node);
        client.lrange([list, 0, n - 1], function (error, reply) {
            if (error !== null) {
                onError(error);
            } else {
                if (! Array.isArray(reply)) {
                    reply = [];
                }
                onSuccess(reply.map(function (v) {
                    return JSON.parse(v);
                }));
            }
        });
    },
    delete: function (node, onSucces, onError) {
        var list = this.list(node);
        client.del([list], function (error, reply) {
            if (error !== null) {
                onError(error);
            } else {
                onSucces(!!reply);
            }
        })
    },
    knn: function (lon, lat, radius, count, onSuccess, onError) {
        client.georadius(
            this.geokey,
            lon, lat, radius, 'm',
            'WITHCOORD', 'WITHDIST',
            'COUNT', count,
            'ASC', function (error, reply) {
                if (error !== null || ! Array.isArray(reply)) {
                    onError(error);
                } else {
                    onSuccess(reply.map(function (v) {
                        return {
                            'node': v[0],
                            'distance': v[1],
                            'location': {
                                lat: v[2][1],
                                lon: v[2][0],
                            }
                        };
                    }));
                }
            });
    }
};
