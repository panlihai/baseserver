var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
module.exports = {
    getResult: function (params,query, callback) {
        if (sysapp.apps[params.APPID]) {
            var datas = [];
            try {
                datas = JSON.parse(query.DATA);
            } catch (err) {
                return callback({
                    "ACT": params.ACTION,
                    "MSG": "系统异常，请参考:解析JSON/XML内容错误",
                    "TIMESTAMP": DateUtils.getTimestamp(),
                    "CODE": '47001'
                });
            }
            sysapp.update(params.APPID, datas, function (err, results) {
                var json;
                if (err) {
                    json = {
                        "ACT": params.ACTION,
                        "MSG": "系统异常，请参考:" + err,
                        "TIMESTAMP": DateUtils.getTimestamp(),
                        "CODE": '-1'
                    };
                } else {
                    //res.render('create', {title: 'Express'});
                    json = {
                        "ACT": params.ACTION,
                        "MSG": "请求成功",
                        "TIMESTAMP": DateUtils.getTimestamp(),
                        "CODE": '0'
                    };
                }
                callback(json);
            });
        } else {
            callback({
                "ACT": params.ACTION,
                "MSG": "系统异常，请参考:不存在的元数据" + params.APPID,
                "TIMESTAMP": DateUtils.getTimestamp(),
                "CODE": '-1'
            });
        }
    }
};
