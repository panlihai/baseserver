/**
 * Created by panlihai on 2017-01-13.
 */
var log = require('debug');
var mysql = require('../../service/mysql.js');
var appFields = require('./sysappfields.js');
var appButtons = require('./sysappbuttons.js');
var appLinks = require('./sysapplinks.js');
var appInterfaces = require('./sysinterface.js');
var appDics = require('./sysdic');
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
        mysql.execSql(mysql.masterConfig.poolId, appSql, function (err, results) {
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
                //加载明细选项
                this.initAppDetail(item);
            });
        });
    },
    //init app by appid
    initByAppid: function (appid) {
        /**
         * 初始化元數據
         */
        var appSql = "select " + this.fields + " from " + this.tableName + " where appid='" + appid + "'";
        mysql.execSql(mysql.masterConfig.poolId, appSql, function (err, results) {
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
                //加载明细选项
                this.initAppDetail(item);
            });
        });
    },
    initAppDetail: function (app) {
        //加载字段内容
        appFields.initByAppid(app.APPID, function (err, results) {
            if (err) {
                log.error(err);
            } else {
                this.apps[app.APPID].appfields = results;
            }
        });
        //加载appButtons
        appButtons.initByAppid(app.APPID, function (err, results) {
            if (err) {
                log.error(err);
            } else {
                this.app[app.APPID].appbuttons = results;
            }
        });
        //加载appLinks
        appLinks.initByAppid(app.APPID, function (err, results) {
            if (err) {
                log.error(err);
            } else {
                this.app[app.APPID].applinks = results;
            }
        });
        //加载appInterfaces
        appInterfaces.initByAppid(app.APPID, function (err, results) {
            if (err) {
                log.error(err);
            } else {
                this.app[app.APPID].appinterfaces = results;
            }
        });
        //加载appDics
        appDics.initByAppid(app.APPID, function (err, results) {
            if (err) {
                log.error(err);
            } else {
                this.app[app.APPID].appinterfaces = results;
            }
        });
    },
    //get a app object by appid
    getAppByAppid: function (appid) {
        return this.apps[appid];
    }
};