var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
    getResult: function (req, callback) {
        sysapp.findOneDetailsWithQuery(req.params.APPID, req.query.WHERE, req.query.LISTDETAILS, function (err, results) {
            var json;
            if (err) {
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
                    "DATA": results,
                    "CODE": '0'
                };
            }            
            callback(json);
        });
    }
};
