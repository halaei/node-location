const ERROR_INVALID_INPUT = 'invalid-input';
const MSG_INVALID_INOUT = 'The input is invalid';
const INVALID_NODE = 'Node id must be a string or integer';
const INVALID_TRIP = 'Trip id must be a string or integer';
const INVALID_LAT = 'Invalid latutude';
const INVALID_LON = 'Invalid longitude';
const INVALID_INT = 'Must be an integer';

var validate = function (req, res, next) {
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
        isId: {
            errorMessage: INVALID_NODE
        },
    },
    trip_id: {
        isId: {
            errorMessage: INVALID_TRIP
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
    validate: validate,
    validators: validators
};