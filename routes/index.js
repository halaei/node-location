var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
      'result': 'Location service up and running!',
  });
});

module.exports = router;
