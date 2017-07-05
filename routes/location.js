var express = require('express');
var v = require('../middleware/validators/location');
var router = express.Router();
var location = require('../services/location');

const ERROR_INTERNAL_SERVER = 'internal-server-error';
const MSG_INTERNAL_ERROR = 'Internal server error';


/* set current location of a node. */
router.post('/', v.setLocation, function(req, res, next) {
    var success = function (inserted) {
        res.json({
            'result': inserted
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.setLocation(req.body.node, req.body.location)
        .then(success, fail);
});

/* get the current location of a node */
router.get('/', v.getLocation, function (req, res) {
    var success = function (locations) {
        res.json({
            'result': locations
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.getLocation(req.query.node, req.query.n)
        .then(success, fail);
});

/* drop location of a node */
router.delete('/', v.delete, function (req, res) {
    var success = function (deleted) {
        res.json({
            'result': !! deleted
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.delete(req.body.node).then(success, fail);
});

/* get the k nearest  neighbors */
router.get('/knn', v.knn, function (req, res) {
    var success = function (deleted) {
        res.json({
            'result': deleted
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.knn(req.query.lon, req.query.lat, req.query.radius, req.query.n)
        .then(success, fail);
});

module.exports = router;
