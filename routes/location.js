var express = require('express');
var v = require('../middleware/validators/location');
var router = express.Router();
var location = require('../services/location');

const ERROR_INTERNAL_SERVER = 'internal-server-error';
const MSG_INTERNAL_ERROR = 'Internal server error';


/* set current location of a node. */
router.post('/', v.setNodeLocation, function(req, res) {
    var success = function (node) {
        res.json({
            'result': node
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.setNodeLocation(req.body.id, req.body.location)
        .then(success, fail);
});

/* set current state of a node. */
router.post('/state', v.setNodeState, function(req, res) {
    var success = function (node) {
        res.json({
            'result': node
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.setNodeState(req.body.id, req.body.state)
        .then(success, fail);
});

/* get the node */
router.get('/', v.getNode, function (req, res) {
    var success = function (node) {
        res.json({
            'result': node
        });
    };
    var fail = function(error) {
        console.log(error);
        res.status(500).json({
            'code': ERROR_INTERNAL_SERVER,
            'message': MSG_INTERNAL_ERROR
        });
    };
    location.getNode(req.query.id)
        .then(success, fail);
});

/* delete a node */
router.delete('/', v.deleteNode, function (req, res) {
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
    location.deleteNode(req.body.id).then(success, fail);
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
    location.knn(req.query.lon, req.query.lat, req.query.radius, req.query.k, req.query.state)
        .then(success, fail);
});

module.exports = router;
