var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
    getResult: function (params,query, callback) {
        var listdetails = [];
        try{
            listdetails = JSON.parse(query.LISTDETAILS);            
        }catch(err){
            return callback({
                "ACT": params.ACTION,
                "MSG": "系统异常，请参考:解析JSON/XML内容错误",
                "TIMESTAMP": DateUtils.getTimestamp(),
                "CODE": '47001'
            });
        }       
        sysapp.findOneDetailsWithQuery(params.APPID, query.WHERE, listdetails, function (err, results) {
            var json;
            if (err) {
                json = {
                    "ACT": params.ACTION,
                    "MSG": "系统异常，请参考:" + err,
                    "TIMESTAMP": DateUtils.getTimestamp(),
                    "CODE": '-1'
                };
            } else {
                json = {
                    "ACT": params.ACTION,
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
