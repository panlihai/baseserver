var express = require('express');
var router = express.Router();
var mysql = require('../server/mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    var param = req.body;
    res.render('index', {title: 'Express'});
});

module.exports = router;
