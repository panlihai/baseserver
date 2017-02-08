/**
 * Created by panlihai on 2017-01-13.
 */
var mysql = require('../../service/mysql.js');
var appFields = require('./sysappfields.js');
var appButtons = require('./sysappbuttons.js');
var appLinks = require('./sysapplinks.js');
var appInterfaces = require('./sysinterface.js');
var SysappUtils = require('../../util/SysappUtils.js');
var ToolUtils = require('../../util/ToolUtils.js');
var appDics = require('./sysdic');
var async = require('async');
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
            log.err(err);
        } else {
            app.appfields = results;
        }
    });
    //加载appButtons
    appButtons.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            app.appbuttons = results;
        }
    });
    //加载appLinks
    appLinks.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            app.applinks = results;
        }
    });
    //加载appInterfaces
    appInterfaces.initByAppid(app.APPID, function (err, results) {
        if (err) {
            log.err(err);
        } else {
            app.appinterfaces = results;
        }
    });
};
//get a app object by appid
var getAppByAppid = function (appid) {
    return apps[appid];
};
var insert =function(appid,data){
    var app = apps[appid];
    var fields = app.appfields;
    var sql = "insert into "+app.MAINTABLE+" set ID=?,";
    var value = [ToolUtils.getUUID()];
    fields.forEach(function(field){
        if(data.hasOwnProperty(field.FIELDCODE)){
            sql+="?,";
            value.push(data[field.FIELDCODE]);
        }
    });
};
/**查询元数据的内容，按app配置信息
 *
 * @param appid 元数据
 * @param where where条件
 * @param callback 回调函数
 * @returns {*}
 */
var findOneWithQuery = function (appid, where, callback) {
    var app = getAppByAppid(appid);
    if (!app) {
        return callback("不存在的元数据", null);
    }
    mysql.queryOne(app.DATASOURCE, " * ", app.MAINTABLE, where, function (err, result) {
        if (err) {
            log.err(err);
            return callback(err, null);
        }
        callback(err, result);
    });
};
/**
 * 查询元数据明细表内容。
 * @param result
 * @param details
 * @param callback
 */
var findOneDetailsWithObj = function (mainAppId, result, details, callback) {
    //获取主元数据对象
    var mainApp = apps[mainAppId];
    //並發執行
    async.map(details, function (detail, cb) {
        //获取appid关联appid并根据关联条件生成关联sql条件
        var linkapp = appLinks.getLinkAppObj(mainApp, detail.APPID);
        //生成sql条件
        var where = ' 1=1 ';
        where += SysappUtils.getSqlWhereByLinkApp(mainApp, detail.APPID, linkapp);
        if(detail.WHERE&&detail.WHERE.length!=0){
            where +=' and '+ detail.WHERE;
        }
        findWithQueryPaging(detail.APPID, where, detail.PAGENUM, detail.PAGESIZE, detail.ORDER,
            function (err, detailResult) {
                result[detail.APPID] = detailResult;
                cb(err, detailResult);
            });
    }, function (err, results) {
        log.log(results);
        callback(err, result);
    });
};
/**查询元数据的内容，按app配置信息
 *
 * @param appid 元数据
 * @param where where条件
 * @param details 子表明细内容
 * @param callback 回调函数
 * @returns {*}
 */
var findOneDetailsWithQuery = function (appid, where, details, callback) {
    findOneWithQuery(appid, where, function (err, result) {
        if (err) {
            log.err(err);
            return callback(err, null);
        }
        details = JSON.parse(details);
        if (result.length > 0) {
            findOneDetailsWithObj(appid, result[0], details, function (err, results) {
                if (err) {
                    log.err(err);
                    return callback(err, null);
                }
                return callback(err, results);
            });
        }
    });
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
var findWithQueryPaging = function (appid, where, pageNum, pageSize, orderby, callback) {
    var app = getAppByAppid(appid);
    if (!app) {
        return callback("不存在的元数据", null);
    }
    if (!pageNum) {
        pageNum = 0;
    }
    if (!pageSize) {
        pageSize = app.PAGESIZE;
    }
    if (!orderby && app.SORT) {
        orderby = app.SORTBY;
    }
    mysql.queryPaging(app.DATASOURCE, " * ", app.MAINTABLE, where, pageNum, pageSize, orderby, function (err, results) {
        if (err) {
            log.err(err);
            return callback(err, null);
        }
        callback(err, results);
    });
};
/**查询元数据的内容，按app配置信息
 *
 * @param appid 元数据
 * @param where where条件
 * @param pageNum 分页数
 * @param pageSize 分页大小
 * @param orderby 排序
 * @param details 子表详情
 * @param callback 回调函数
 * @returns {*}
 */
var findListdetailWithQueryPaging = function (appid, where, pageNum, pageSize, orderby, details, callback) {
    var app = getAppByAppid(appid);
    if (!app) {
        return callback("不存在的元数据", null);
    }
    if (!pageNum) {
        pageNum = 0;
    }
    if (!pageSize) {
        pageSize = app.PAGESIZE;
    }
    if (!orderby && app.SORT) {
        orderby = app.SORTBY;
    }
    mysql.queryPaging(app.DATASOURCE, " * ", app.MAINTABLE, where, pageNum, pageSize, orderby, function (err, results) {
        if (err) {
            log.err(err);
            return callback(err, null);
        }
        async.map(results, function (result, cb) {
            findOneDetailsWithObj(appid, result, details, function (err, detailResults) {
                cb(err, detailResults);
            })
        }, function (err, detailResult) {
            callback(err, results);
        });
    });
};
module.exports.insert = insert;
module.exports.findOneWithQuery = findOneWithQuery;
module.exports.findOneDetailsWithQuery = findOneDetailsWithQuery;
module.exports.findWithQueryPaging = findWithQueryPaging;
module.exports.findListdetailWithQueryPaging = findListdetailWithQueryPaging;
module.exports.apps = apps;
module.exports.initAll = initAll;
module.exports.initByAppid = initByAppid;
module.exports.initAppDetail = initAppDetail;
module.exports.getAppByAppid = getAppByAppid;