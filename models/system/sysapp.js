/**
 * Created by panlihai on 2017-01-13.
 */
var mysql = require('../../service/mysql.js');
var appFields = require('./sysappfields.js');
var appButtons = require('./sysappbuttons.js');
var appLinks = require('./sysapplinks.js');
var appInterfaces = require('./sysinterface.js');
var appDics = require('./sysdic');
var log = require('../../service/log.js');
var apps = {};

//tablename
var tableName = 'SYS_APP';
//the fields string
var fields = "`ID`, `APPID`, `APPNAME`, `ENABLE`, `APPURL`, `APPMODEL`, `APPTYPE`, `DATASOURCE`, `SOURCETYPE`,`MAINTABLE`, `TABLETYPE`, `APPFILTER`, `PAGESIZE`, `LISTPAGE`, `CARDPAGE`, `CARDCOLS`, `SORTBY`, `ENABLELOG`, `SERVICECLASS`,`ENABLECACHE`, `REMARK`";
//init all apps from db
var initAll = function () {
    /**
     * 初始化元數據
     */
    var appSql = "select " + fields + " from " + tableName + " where ENABLE='Y'";
    mysql.execSql(mysql.cfg.masterConfig.poolId, appSql, function (err, results) {
        if (err) {
            log.err("数据源初始化异常，请校验连接池配置信息是否正常");
            log.err(err);
            return;
        }
        /**
         * 加载元数据
         */
        results.forEach(function (item) {
            apps[item.APPID] = item;
            //加载明细选项
            initAppDetail(item);
        });
    });
};
//init app by appid
var initByAppid = function (appid) {
    /**
     * 初始化元數據
     */
    var appSql = "select " + this.fields + " from " + this.tableName + " where appid='" + appid + "'";
    //log.log(appSql);
    mysql.execSql(mysql.masterConfig.poolId, appSql, function (err, results) {
        if (err) {
            log.error("数据源初始化异常，请校验连接池配置信息是否正常");
            log.error(err);
            return;
        }
        /**
         * 加载元数据
         */
        results.forEach(function (item) {
            apps[item.APPID] = item;
            //加载明细选项
            initAppDetail(item);
        });
    });
};
//init initAppdetail by App
var initAppDetail = function (app) {
    //加载字段内容
    appFields.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.error(err);
        } else {
            apps[app.APPID].appfields = results;
        }
    });
    //加载appButtons
    appButtons.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            apps[app.APPID].appbuttons = results;
        }
    });
    //加载appLinks
    appLinks.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            apps[app.APPID].applinks = results;
        }
    });
    //加载appInterfaces
    appInterfaces.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            apps[app.APPID].appinterfaces = results;
        }
    });
    //加载appDics
    appDics.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            apps[app.APPID].appinterfaces = results;
        }
    });
};
//get a app object by appid
var getAppByAppid = function (appid) {
    return this.apps[appid];
};
/**查询元数据的内容，按app配置信息
 *
 * @param appid 元数据
 * @param where where条件
 * @param pageNum 分页数
 * @param pageSize 分页大小
 * @param orderby 排序
 * @param callback 回调函数
 * @returns {*}
 */
var findWithQuery = function (appid, where,pageNum,pageSize,orderby,callback) {
    var app = getAppByAppid(appid);
    if(!app){
        return callback("不存在的元数据",null);
    }
    if(!pageNum){
        pageNum = 0;
    }
    if(!pageSize){
        pageSize = app.PAGESIZE;
    }
    if(!orderby&&app.SORT){
        orderby = app.SORTBY;
    }
    mysql.query(app.DATASOURCE," * ",app.MAINTABLE,where,pageNum,pageSize,orderby,function(err,results){
        if(err){
            log.err(log);
            return callback(err,null);
        }
        callback(err,results);
    });
};
module.exports.findWithQuery = findWithQuery;
module.exports.apps = apps;
module.exports.initAll = initAll;
module.exports.initByAppid = initByAppid;
module.exports.initAppDetail = initAppDetail;
module.exports.getAppByAppid = getAppByAppid;