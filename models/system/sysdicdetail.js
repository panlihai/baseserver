/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('../../service/log.js');
var mysql = require('../../service/mysql');
module.exports = {
    //tablename
    tableName: 'SYS_DICDETAIL',
    //the fields string
    fields: '`ID`, `DICID`, `DICVALUE`, `DICDESC`, `SORT`, `REMARK`',
    //init by appid
    initByDicCode: function (dicId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where DICID='" + dicId + "'";
        mysql.execSql(mysql.cfg.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.err(err);
                callback(err, dicId, null);
            } else {
                callback(null, dicId, results);
            }
        });
    },
    //insert default by dicId
    insertDefault: function (dicId) {

    }
};