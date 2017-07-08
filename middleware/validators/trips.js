var v = require('./validators');

module.exports = {
    beginEndTrip: function (req, res, next) {
        req.checkBody({
            'node_id': v.validators.node_id,
            'trip_id': v.validators.trip_id,
        });
        v.validate(req, res, next);
    },
    getTrip: function (req, res, next) {
        req.checkQuery({
            'node_id': v.validators.node_id,
            'trip_id': v.validators.trip_id,
        });
    }
};