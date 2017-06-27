var express = require('express');
var v = require('../middleware/validators/location');
var router = express.Router();
var location = require('../services/location');

const ERROR_NOT_IMPLEMENTED = 'not-implemented';
const ERROR_INTERNAL_SERVER = 'internal-server-error';
const MSG_INTERNAL_ERROR = 'Internal server error';

/* push location of a node. */
router.post('/', v.push, function(req, res, next) {
    var success = function (len) {
        res.json({
            'result': len
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.push(req.body.node, req.body.location, success, fail);
});

/* get the last n location of a node */
router.get('/', v.last, function (req, res) {
    var success = function (locations) {
        res.json({
            'result': locations
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.last(req.query.node, req.query.n, success, fail);
});

/* drop location of a node */
router.delete('/', v.delete, function (req, res) {
    var success = function (deleted) {
        res.json({
            'result': deleted
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.delete(req.body.node, success, fail);
});

/* get the k nearest  neighbors */
router.get('/knn', v.knn, function (req, res) {
    var success = function (deleted) {
        res.json({
            'result': deleted
        });
    };
    var fail = function(error) {
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.knn(
        req.query.lon, req.query.lat, req.query.radius,
        req.query.n,
        success, fail);
});

module.exports = router;
