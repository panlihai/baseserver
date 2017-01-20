var sysapp = require('../models/system/sysapp.js');
var async = require('async');
module.exports = {
    getResult: function (req, callback) {
        sysapp.findInfoListWithQuery(req.params.APPID, req.query.WHERE, req.query.PAGENUM, req.query.PAGESIZE, req.query.ORDER, function (err, results) {
            var json;
            if (err) {
                json = {
                    "ACT": "INFOLIST",
                    "MSG": "系统异常，请参考:" + err,
                    "TIMESTAMP": req.query.TIMESTAMP,
                    "CODE": '-1'
                };
            } else {
                //res.render('create', {title: 'Express'});
                json = {
                    "ACT": "INFOLIST",
                    "MSG": "请求成功",
                    "TIMESTAMP": req.query.TIMESTAMP,
                    "DATA": results,
                    "CODE": '0'
                };
            }
            res.json(json);
        });
    },
};
