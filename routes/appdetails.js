var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
    getResult: function (req, callback) {
        var app = sysapp.apps[req.query.APPCODE];
        var json;
        if (!app) {
            json = {
                "ACT": req.params.ACTION,
                "MSG": "系统异常，请参考:" + err,
                "TIMESTAMP": DateUtils.getTimestamp(),
                "CODE": '-1'
            };
        } else {
            json = {
                "ACT": req.params.ACTION,
                "MSG": "请求成功",
                "TIMESTAMP": DateUtils.getTimestamp(),
                "DATA": app,
                "CODE": '0'
            };
        }
        callback(json);
    }
};
