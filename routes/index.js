var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
      'result': 'Location service up and running!',
  });
});

router.get('/ping', function (req, res, next) {
    var redis = require('../services/redis');
    var elastic = require('../services/elasticsearch');
    var result = {};
    var status = 200;
    Promise.all([
        redis.client().pingAsync().then(function (body) {
            result.redis = {success: true, body: body};
        }, function (error) {
            result.redis = {success: false, error: error};
            status = 500;
        }),
        elastic.ping({
            requestTimeout: 30000,
        }).then(function (body) {
            result.elastic = {success: true, body: body};
        }, function (error) {
            result.elastic = {success: false, error: error};
            status = 500;
        })
    ]).then(function (v) {
        res.status(status).json({
            'result': result,
        });
    });
});

module.exports = router;
