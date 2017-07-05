var client = require('./redis');

module.exports = {
    geokey: 'cur',
    setLocation: function (node, location) {
        return client.geoaddAsync([this.geokey, ''+location.lon, ''+location.lat, node]);
    },
    getLocation: function (node) {
        return client.geoposAsync([this.geokey, node]).then(function (reply) {
            return reply.map(function (v) {
                return {
                    lat: v[1],
                    lon: v[0]
                }
            });
        });
    },
    delete: function (node) {
        return client.zremAsync([this.geokey, node]);
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
