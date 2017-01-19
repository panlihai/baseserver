var express = require('express');
var router = express.Router();
var log = require('../service/log.js');
var sysapp = require('../models/system/sysapp.js');
/* GET home page. */
router.get('/', function (req, res, next) {
    sysapp.findWithQuery(req.query.APPID, function (err, results) {
        if (err) {
            log.err(err);
            req.JSON(err);
        } else {
            req.JSON(results);
        }
    })

    // mysql.query(null, '*', 'SYS_APP', " ENABLE='Y' ", 0, 200, function (err, results, fields) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         req.JSON(results);
    //     }
    // });

});

module.exports = router;
