/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('../../service/log.js');
var mysql = require('../../service/mysql');
module.exports = {
    //tablename
    tableName: 'SYS_INTERFACE',
    //the fields string
    fields: '`ID`, `PID`, `APPID`, `IMPLID`, `IMPLNAME`, `REQURL`, `REQWAY`, `REQTYPE`, `VERSION`, `REMARK`, `AUTHOR`, `ENABLE`, `SORT`, `REQCASE`, `RTNCASE`, `LANGUAGE`, `NEEDUSERTOKEN`, `ISLIB`, `NEEDLNG`, `NEEDTIMESTAMP`, `NEEDLAT`, `INTEGRALTYPE`, `USERINTEGRALVALUE`, `INTEGRALVALUE`, `CORPINTEGRALVALUE`',
    //init by appid
    initByAppid: function (appId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where appid='" + appId + "'";
        mysql.execSql(mysql.cfg.masterConfig.poolId, sql, function (err, results) {
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
