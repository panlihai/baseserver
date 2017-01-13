/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
exports = {
    //tablename
    tableName: 'SYS_APP',
    //all apps
    apps: {},
    //the fields string
    fields: "`ID`, `APPID`, `APPNAME`, `ENABLE`, `APPURL`, `APPMODEL`, `APPTYPE`, `DATASOURCE`, `SOURCETYPE`,`MAINTABLE`, `TABLETYPE`, `APPFILTER`, `PAGESIZE`, `LISTPAGE`, `CARDPAGE`, `CARDCOLS`, `SORTBY`, `ENABLELOG`, `SERVICECLASS`,`ENABLECACHE`, `REMARK`",
    //init all apps from db
    initAll: function () {
        /**
         * 初始化元數據
         */
        var appSql = "select " + this.fields + " from " + this.tableName + " where ENABLE='Y'";
        execSql(masterConfig.poolId, appSql, function (err, results) {
            if (err) {
                log.err("数据源初始化异常，请校验连接池配置信息是否正常");
                log.err(err);
                return;
            }
            /**
             * 加载元数据
             */
            results.forEach(function (item) {
                this.apps[item.APPID] = item;
            });
        });
    },
    //init app by appid
    initByAppid:function(appid){
        /**
         * 初始化元數據
         */
        var appSql = "select " + this.fields + " from " + this.tableName + " where appid='"+appid+"'";
        execSql(masterConfig.poolId, appSql, function (err, results) {
            if (err) {
                log.err("数据源初始化异常，请校验连接池配置信息是否正常");
                log.err(err);
                return;
            }
            /**
             * 加载元数据
             */
            results.forEach(function (item) {
                this.apps[item.APPID] = item;
            });
        });
    },
    //get a app object by appid
    getAppByAppid: function (appid) {
        return this.apps[appid];
    }
};