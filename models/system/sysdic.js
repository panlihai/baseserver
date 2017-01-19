/**
 * Created by panlihai on 2017-01-13.
 */
var async = require('async');
var mysql = require('../../service/mysql.js');
var log = require('../../service/log.js');
var sysDicDetails = require('./sysdicdetail.js');
module.exports = {
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
        mysql.execSql(mysql.cfg.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.err("数据源初始化异常，请校验连接池配置信息是否正常");
                log.err(err);
                callback(err, null);
            } else {
                var initsFunc = [];
                async.eachLimit(results, 8, function (result, callback) {
                    sysDicDetails.initByDicCode(result.DICID, function (err, backResult) {
                        if (err) {
                            log.err(err);
                        } else {
                            callback(null, backResult);
                        }
                    });
                })
            }
        })
    },
    finishOneDetails: function (dicId, callback) {

    },
    //insert default by appId
    insertDefault: function (appId) {

    }
};