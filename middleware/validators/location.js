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
    node: {
        isNode: {
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
    }
};

module.exports = {
    setLocation: function (req, res, next) {
        req.checkBody({
            'node': validators.node,
            'location.lat' : validators.lat,
            'location.lon': validators.lon
        });
        validate(req, res, next);
    },
    getLocation: function (req, res, next) {
        req.checkQuery({
            'node': validators.node,
        });
        validate(req, res, next);
    },
    delete: function (req, res, next) {
        req.checkBody({
            'node': validators.node
        });
        validate(req, res, next);
    },
    knn: function (req, res, next) {
        req.checkQuery({
            'lon': validators.lon,
            'lat': validators.lat,
            'radius': validators.n(1, parseInt(process.env.LOCATION_MAX_RADIUS)),
            'n': validators.n(1, parseInt(process.env.LOCATION_MAX_KNN)),
        });
        validate(req, res, next);
    }
};