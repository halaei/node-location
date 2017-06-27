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
    },
    radius: {
        isInt: {
            errorMessage: INVALID_INT
        },
        inRange: {
            options: [0, 10000],
            errorMessage: 'Must be between 0 and 10000',
        }
    }
};

module.exports = {
    push: function (req, res, next) {
        req.checkBody({
            'node': validators.node,
            'location.lat' : validators.lat,
            'location.lon': validators.lon
        });
        validate(req, res, next);
    },
    last: function (req, res, next) {
        req.checkQuery({
            'node': validators.node,
            'n': validators.n(1, 10000)
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
            'radius': validators.radius,
            'n': validators.n(1, 100),
        });
        validate(req, res, next);
    }
};