var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var async = require('async');
module.exports = {
  getResult: function (params,query, callback) {
    sysapp.findInfoListWithQuery(params.APPID, query.WHERE, query.PAGENUM, query.PAGESIZE, query.ORDER, function (err, results) {
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
          "DATA": results,
          "CODE": '0'
        };
      }
      res.json(json);
    });
  }
};
