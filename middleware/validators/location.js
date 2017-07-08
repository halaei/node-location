var v = require('./validators');
module.exports = {
    setNodeLocation: function (req, res, next) {
        req.checkBody({
            'id': v.validators.node_id,
            'location.lat' : v.validators.lat,
            'location.lon': v.validators.lon
        });
        v.validate(req, res, next);
    },
    setNodeState: function (req, res, next) {
        req.checkBody({
            'id': v.validators.node_id,
            'state': v.validators.nullOrString(1, 255),
        });
        v.validate(req, res, next);
    },
    getNode: function (req, res, next) {
        req.checkQuery({
            'id': v.validators.node_id,
        });
        v.validate(req, res, next);
    },
    deleteNode: function (req, res, next) {
        req.checkBody({
            'id': v.validators.node_id
        });
        v.validate(req, res, next);
    },
    knn: function (req, res, next) {
        req.checkQuery({
            'lon': v.validators.lon,
            'lat': v.validators.lat,
            'radius': v.validators.n(1, parseInt(process.env.LOCATION_MAX_RADIUS)),
            'k': v.validators.n(1, parseInt(process.env.LOCATION_MAX_KNN)),
            'state': v.validators.nullOrString(1, 255),
        });
        v.validate(req, res, next);
    }
};