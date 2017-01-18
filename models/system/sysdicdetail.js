/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
var mysql = require('../../service/mysql');
exports = {
    //tablename
    tableName: 'SYS_MENU',
    //the fields string
    fields: '`ID`, `DICID`, `DICVALUE`, `DICDESC`, `SORT`, `REMARK`',
    //init by appid
    initByDicCode: function (dicId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where DICID='" + dicId + "'";
        mysql.execSql(mysql.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.err("数据源初始化异常，请校验连接池配置信息是否正常");
                log.err(err);
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },
    //insert default by dicId
    insertDefault: function (dicId) {

    }
};