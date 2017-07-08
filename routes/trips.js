var express = require('express');
var v = require('../middleware/validators/trips');
var router = express.Router();
var trips = require('../services/trips');

router.post('/', v.beginEndTrip, function (req, res) {
    trips.beginTrip(req.body.node_id, req.body.trip_id)
        .then(function (result) {
            res.json({
                result: result,
            })
        });
});

router.get('/', function (req, res) {
    trips.getTrip(req.query.node_id, req.query.trip_id)
        .then(function (result) {
            res.json({
                result: result,
            })
        });
});

router.delete('/', v.beginEndTrip, function (req, res) {
    trips.endTrip(req.body.node_id, req.body.trip_id)
        .then(function (result) {
            res.json({
                result: result,
            })
        });
});

module.exports = router;