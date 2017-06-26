var express = require('express');
var router = express.Router();
const ERROR_NOT_IMPLEMENTED = 'not-implemented';

/* push location of a node. */
router.post('/', function(req, res, next) {
    res.status(501).json({
        'error': {
            'code': ERROR_NOT_IMPLEMENTED,
            'message': 'This action is not implemented',
        },
    });
});

/* get the last n location of a node */
router.get('/', function (req, res) {
    res.status(501).json({
        'error': {
            'code': ERROR_NOT_IMPLEMENTED,
            'message': 'This action is not implemented',
        },
    });
});

/* drop location of a node */
router.delete('/', function (req, res) {
    res.status(501).json({
        error: {
            code: ERROR_NOT_IMPLEMENTED,
            message: 'This action is not implemented',
        }
    });
});

/* get the k nearest  neighbors */
router.get('/knn', function (req, res) {
    res.status(501).json({
        error: {
            code: ERROR_NOT_IMPLEMENTED,
            message: 'This action is not implemented',
        }
    });
});

module.exports = router;
