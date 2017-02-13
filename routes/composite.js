var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
var create = require('./create.js');
var update = require('./update.js');
var remove = require('./remove.js');
var listdetails = require('./listdetails.js');
var list = require('./list.js');
var info = require('./info.js');
var infodetails = require('./infodetails.js');
var count = require('./count.js');
var changelist = require('./changelist.js');
var async = require('async');
module.exports = {
  getResult: function (req, callback) {
    var composite = [];
    try{
      composite = JSON.parse(req.query.COMPOSITE);
    }catch(err){
      return callback({
        "ACT": req.params.ACTION,
        "MSG": "系统异常，请参考:解析JSON/XML内容错误",
        "TIMESTAMP": DateUtils.getTimestamp(),
        "CODE": '47001'
      });
    }
    //並發執行
    async.map(composite, function (act, cb) {      
      switch (act.ACT) {
          //新增接口
        case 'INSERT':
        case 'ADD':
        case 'CREATE':
          create.getResult(req, function (result) {
            cb.cb(result);
          });
          break;
          //修改接口
        case 'MODIFY':
        case 'UPDATE':
          update.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //删除接口
        case 'REMOVE':
        case 'DELETE':
          remove.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取列表内容及每列的子表内容
        case 'LISTDETAIL':
        case 'LISTDETAILS':
          listdetails.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取列表内容
        case 'LIST':
        case 'LISTINFO':
          list.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取一条记录的内容
        case 'INFO':
          info.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取一条记录的内容及各个子表内容
        case 'INFODETAIL':
        case 'INFODETAILS':
        case 'INFOLIST':
          infodetails.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取记录数
        case 'COUNT':
          count.getResult(req, function (result) {
            res.json(result);
          });
          break;
          //获取
        case 'CHANGELIST' :
          changelist.getResult(req, function (result) {
            res.json(result);
          });
          break;
        case 'APPDETAIL':
        case 'APPDETAILS':
          appdetails.getResult(req, function (result) {
            res.json(result);
          });
          break;
      }
    }, function (err, results) {
      callback(err, result);
    });
    sysapp.findInfoListWithQuery(req.params.APPID, req.query.WHERE, req.query.PAGENUM, req.query.PAGESIZE, req.query.ORDER, function (err, results) {
      var json;
      if (err) {
        json = {
          "ACT": req.params.ACTION,
          "MSG": "系统异常，请参考:" + err,
          "TIMESTAMP": DateUtils.getTimestamp(),
          "CODE": '-1'
        };
      } else {
        //res.render('create', {title: 'Express'});
        json = {
          "ACT": req.params.ACTION,
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
