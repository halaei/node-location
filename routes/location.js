var express = require('express');
var router = express.Router();
redis = location = require('../services/location');

const ERROR_NOT_IMPLEMENTED = 'not-implemented';
const ERROR_INTERNAL_SERVER = 'internal-server-error';


/* push location of a node. */
router.post('/', function(req, res, next) {
    var success = function (len) {
        res.json({
            'result': len
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': 'Internal server error'
        });
    };
    location.push(req.body.node, req.body.location, success, fail);
});

/* get the last n location of a node */
router.get('/', function (req, res) {
    var success = function (locations) {
        res.json({
            'result': locations
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': 'Internal server error'
        });
    };
    location.last(req.query.node, req.query.n, success, fail);
});

/* drop location of a node */
router.delete('/', function (req, res) {
    var success = function (deleted) {
        res.json({
            'result': deleted
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': 'Internal server error'
        });
    };
    console.log(req.body);
    location.delete(req.body.node, success, fail);
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
