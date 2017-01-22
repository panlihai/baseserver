var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
    getResult: function (req,callback) {
        sysapp.findWithQueryPaging(req.params.APPID, req.query.WHERE, req.query.PAGENUM, req.query.PAGESIZE, req.query.ORDER, function (err, results) {
            var json;
            if (err) {
                json = {
                    "ACT": req.params.ACTTION,
                    "CODE": '-1',
                    "MSG": "系统异常，请参考:" + err,
                    "TIMESTAMP": DateUtils.getTimestamp()
                };
            } else {
                var data = results.DATA;
                var listsize = 0;
                if (data instanceof Array) {
                    listsize = data.length
                }
                json = {
                    "ACT": req.params.ACTION,
                    "CODE": '0',
                    "MSG": "请求成功",
                    "TIMESTAMP": DateUtils.getTimestamp(),
                    "TOTALSIZE": results.TOTALSIZE,
                    "LISTSIZE": listsize,
                    "DATA": data
                };
            }
            return callback(json);
        });
    },
};
