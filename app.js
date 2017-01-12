var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var infodetail = require('./routes/infodetail');
var infolist = require('./routes/infolist');
var listdetail = require('./routes/listdetail');
var listinfo = require('./routes/listinfo');
var create = require('./routes/create');
var update = require('./routes/update');
var remove = require('./routes/remove');
var appdetail = require('./routes/appdetail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/server/api/*/*/*/infodetail', infodetail);
app.use('/server/api/*/*/*/infolist', infolist);
app.use('/server/api/*/*/*/listdetail', listdetail);
app.use('/server/api/*/*/*/listinfo', listinfo);
app.use('/server/api/*/*/*/create', create);
app.use('/server/api/*/*/*/remove', remove);
app.use('/server/api/*/*/*/update', update);
app.use('/server/api/*/*/*/appdetail', appdetail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.render('error');
});

module.exports = app;
