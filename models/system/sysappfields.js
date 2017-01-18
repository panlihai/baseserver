/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
var mysql = require('../service/mysql');
exports = {
    //tablename
    tableName: 'SYS_APPFIELDS',
    //the fields string
    fields: '`ID`, `APPID`, `FIELDCODE`, `FIELDNAME`, `FIELDDEFAULT`, `DICCODE`, `AUTOCODE`, `DBTYPE`, `LENGTH`, `SCALE`, `ISNULL`, `SORT`, `ENABLESEARCH`, `ENABLELOG`, `ENABLE`, `KEYSEQ`, `SHOWLIST`, `SHOWCARD`, `INPUTLIMIT`, `INPUTTYPE`, `LISTMAXLEN`, `ROWSPAN`, `COLSPAN`, `ROWNUM`, `COLNUM`, `CLASS`, `STYLE`, `PLACEHOLDER`',
    //init by appid
    initByAppid: function (appId, callback) {
        /**
         * 初始化元數據字段
         */
        var sql = "select " + this.fields + " from " + this.tableName + " where appid='" + appId + "'";
        mysql.execSql(mysql.masterConfig.poolId, sql, function (err, results) {
            if (err) {
                log.error("数据源初始化异常，请校验连接池配置信息是否正常");
                log.error(err);
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