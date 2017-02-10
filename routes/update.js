var sysapp = require('../models/system/sysapp.js');
var DateUtils = require('../util/DateUtils.js');
module.exports = {
  getResult: function (req, callback) {
    if(sysapp.apps[req.params.APPID]){
      var datas = [];
      try{
        datas = JSON.parse(req.query.DATA);
      }catch(err){
        return callback({
          "ACT": req.params.ACTION,
          "MSG": "系统异常，请参考:解析JSON/XML内容错误",
          "TIMESTAMP": DateUtils.getTimestamp(),
          "CODE": '47001'
        });
      }
      sysapp.update(req.params.APPID,datas, function (err, results) {
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
        callback(json);
      });
    }else{
      callback({
        "ACT": req.params.ACTION,
        "MSG": "系统异常，请参考:不存在的元数据"+req.params.APPID,
        "TIMESTAMP": DateUtils.getTimestamp(),
        "CODE": '-1'
      });
    }
  }
};
