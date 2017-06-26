var redis = require('redis');
var client = redis.createClient();
var lua = require('./lua');

client.on('error', function (err) {
    console.log(err);
});

module.exports = {
    list_size: 3,
    list_ttl: 3600 * 24,
    list: function (node) {
        return 'nd:'+node;
    },
    push: function (node, location, onSuccess, onError) {
        var list = this.list(node);
        client.eval([
            lua.push,
            1,
            list,
            JSON.stringify(location), this.list_size, this.list_ttl
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
    }
};
