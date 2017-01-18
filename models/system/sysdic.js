/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
var async = require('async');
var mysql = require('../../service/mysql.js');
var sysDicDetails = require('./sysdicdetail.js');
exports = {
    //tablename
    tableName: 'SYS_DIC',
    //the fields string
    fields: '`ID`, `DICID`, `DICNAME`, `DICTYPE`',
    //init by appid
    initByAppid: function (appId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where dicid in (select diccode from sys_appfields where APPID='" + appId + "')";
        mysql.execSql(mysql.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.error("数据源初始化异常，请校验连接池配置信息是否正常");
                log.error(err);
                callback(err, null);
            } else {
                var initsFunc = [];
                async.parallel(initsFunc);

                results.forEach(function (dic) {
                    //获取数据字典
                    var fnc=sysDicDetails.initByDicCode(dic.DICID,callback);
                });
                callback(null, null);
            }
        });
    },
    finishOneDetails: function (dicId, callback) {

    },
    //insert default by appId
    insertDefault: function (appId) {

    }
};
exports.initByAppid('SYSAPP',function(err,result){
   if(err){
       log.error(err);
   } else{
       log.log(result);
   }
});