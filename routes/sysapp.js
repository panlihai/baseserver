/**
 * Created by panlihai on 2017-01-12.
 */
var express = require('express');
var router = express.Router();
var mysql = require('./server/mysql');
exports.sysapps={};
exports.init = function (req, res) {
    var baseUrl = req.baseUrl.split('//');
    if(baseUrl.length==7){
        req.query.PID = b5aseUrl[3];
        req.query.SYSAPP = baseUrl[4];
        req.query.SUPERVISE = baseUrl[5];
        req.query.METHOD = baseUrl[6];
    }
};
