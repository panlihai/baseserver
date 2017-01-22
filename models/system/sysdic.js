/**
 * Created by panlihai on 2017-01-13.
 */
var async = require('async');
var mysql = require('../../service/mysql.js');
var log = require('../../service/log.js');
var sysDicDetails = require('./sysdicdetail.js');
module.exports = {
    dics: {},
    //tablename
    tableName: 'SYS_DIC',
    //the fields string
    fields: '`ID`, `DICID`, `DICNAME`, `DICTYPE`',
    //init by appid
    initAll: function () {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName;
        mysql.execSql(mysql.cfg.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.err(err);
                return callback(err, null);
            } else {
                results.forEach(function (dic) {
                    module.exports.dics[dic.DICID] = dic;
                    if (dic.DICTYPE == 'LISTVALUE') {
                        sysDicDetails.initByDicCode(dic.DICID, function (err, dicid, backResult) {
                            if (err) {
                                log.err(err);
                            } else {
                                module.exports.dics[dicid].dicdetail = backResult;
                            }
                        });
                    } else {

                    }
                });
            }
        })
    },
    finishOneDetails: function (dicId, callback) {

    },
    //insert default by appId
    insertDefault: function (appId) {

    }
};