const ERROR_INVALID_INPUT = 'invalid-input';
const MSG_INVALID_INOUT = 'The input is invalid';
const INVALID_NODE = 'Node must be a string or integer';
const INVALID_LAT = 'Invalid latutude';
const INVALID_LON = 'Invalid longitude';
const INVALID_INT = 'Must be an integer';

validate = function (req, res, next) {
    req.getValidationResult().then(function(result) {
        if (! result.isEmpty()) {
            res.status(422).json({
                'code': ERROR_INVALID_INPUT,
                'message': MSG_INVALID_INOUT,
                'info': result.array()
            });
        } else {
            next();
        }
    });
};
var validators = {
    node_id: {
        isNodeId: {
            errorMessage: INVALID_NODE
        },
    },
    lat : {
        isLat: {
            errorMessage: INVALID_LAT
        }
    },
    lon: {
        isLon: {
            errorMessage: INVALID_LON
        }
    },
    n: function (min, max) {
        return {
            isInt: {
                errorMessage: INVALID_INT
            },
            inRange: {
                options: [min, max],
                errorMessage: 'Must be between '+min+' and '+max,
            }
        };
    },
    string: function (min, max) {
        return {
            isString: {
                options: [min, max],
                errorMessage: 'The length must be between '+min+' and '+max
            }
        }
    },
    nullOrString: function (min, max) {
        return {
            isNullOrString: {
                options: [min, max],
                errorMessage: 'Must be null or a string of length between '+min+' and '+max
            }
        }
    }
};

module.exports = {
    setNodeLocation: function (req, res, next) {
        req.checkBody({
            'id': validators.node_id,
            'location.lat' : validators.lat,
            'location.lon': validators.lon
        });
        validate(req, res, next);
    },
    setNodeState: function (req, res, next) {
        req.checkBody({
            'id': validators.node_id,
            'state': validators.nullOrString(1, 255),
        });
        validate(req, res, next);
    },
    getNode: function (req, res, next) {
        req.checkQuery({
            'id': validators.node_id,
        });
        validate(req, res, next);
    },
    deleteNode: function (req, res, next) {
        req.checkBody({
            'id': validators.node_id
        });
        validate(req, res, next);
    },
    knn: function (req, res, next) {
        req.checkQuery({
            'lon': validators.lon,
            'lat': validators.lat,
            'radius': validators.n(1, parseInt(process.env.LOCATION_MAX_RADIUS)),
            'k': validators.n(1, parseInt(process.env.LOCATION_MAX_KNN)),
            'state': validators.nullOrString(1, 255),
        });
        validate(req, res, next);
    }
};