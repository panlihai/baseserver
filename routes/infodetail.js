/**
 *
 */
var express = require('express');
var router = express.Router();
var mysql = require('../service/mysql.js');
var sysapp = require('../models/system/sysapp.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {CODE: '0',DATA:sysapp.apps[req.params.APPID]});
});
module.exports = router;
