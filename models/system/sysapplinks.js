/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
var mysql = require('../service/mysql');
exports = {
    //tablename
    tableName: 'SYS_APPLINKS',
    //the fields string
    fields: '`ID`, `LINKID`, `LINKNAME`, `MAINAPP`, `ITEMAPP`, `LINKTYPE`, `LINKFILTER`, `VIEWPOSITION`, `SORTBY`, `ENABLE`, `REMARK`',
    //init by appid
    initByAppid: function (appId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where appid='" + appId + "'";
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
    //insert default by appId
    insertDefault: function (appId) {

    }
};
