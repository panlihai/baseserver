var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
    getResult: function (params,query,callback) {
        sysapp.findWithQueryPaging(params.APPID, query.WHERE, query.PAGENUM, query.PAGESIZE, query.ORDER, function (err, results) {
            var json;
            if (err) {
                json = {
                    "ACT": params.ACTTION,
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
                    "ACT": params.ACTION,
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
    }
};
