require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var index = require('./routes/index');
var location = require('./routes/location');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator({
    customValidators: {
      isNodeId: function (value) {
        return ! Array.isArray(value) && ( typeof(value) === 'string' || parseInt(value) === value);
      },
      isLat: function (value) {
        return ! isNaN(value) && ! Array.isArray(value) && value >= -90 && value <= 90;
      },
      isLon: function (value) {
        return ! isNaN(value) && ! Array.isArray(value) && value >= -180 && value <= 180;
      },
      inRange: function (value, min, max) {
        console.log(value, min, max);
        return value >= min && value <= max;
      },
      isString: function (value, min, max) {
        return typeof(value) === 'string' && value.length <= max && value.length >= min;
      },
      isNullOrString: function (value, min, max) {
          return value === null || value === undefined || this.isString(value, min, max);
      }
    }
}));

app.use('/', index);
app.use('/location', location);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  res.locals.code = 'not-found';
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
      'code': res.locals.code,
      'message': res.locals.message,
      'info': {
        'stack': res.locals.error ? res.locals.error.stack.split("\n") : null,
      }
  });
});

module.exports = app;
