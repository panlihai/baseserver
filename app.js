var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//接口处理
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
switch (app.get('env')) {
    case 'development':
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//同源策略
app.use('/server/api', require('cors'));



app.use('/server/api/:PID/:APPID/:SUPERVICE/INFO', infodetail);
app.use('/server/api/:PID/:APPID/:SUPERVICE/INFOLIST', infolist);
app.use('/server/api/:PID/:APPID/:SUPERVICE/LISTDETAIL', listdetail);
app.use('/server/api/:PID/:APPID/:SUPERVICE/LISTINFO', listinfo);
app.use('/server/api/:PID/:APPID/:SUPERVICE/CREATE', create);
app.use('/server/api/:PID/:APPID/:SUPERVICE/REMOVE', remove);
app.use('/server/api/:PID/:APPID/:SUPERVICE/UPDATE', update);
app.use('/server/api/:PID/:APPID/:SUPERVICE/APPDETAIL', appdetail);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//
module.exports = app;
