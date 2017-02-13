/**(
 * Created by panlihai on 2017-01-13.
 */
var mysql = require('../../service/mysql.js');
var Sqlstring = require('sqlstring');
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
/**
 * 插入数据，支持多条数据的插入格式为DATA:[{字段1:值1,字段2:值2},{字段1:值1}]
 * @param appid 元数据编码
 * @param datas 值字符串
 * @param callback 回调函数，加入默认值后，原样返回。
 */
var insert = function (appid, datas, callback) {
    var app = apps[appid];
    var fields = app.appfields;
    var sql = "insert into " + app.MAINTABLE + "(";
    fields.forEach(function (field) {
        sql += field.FIELDCODE + ",";
    });
    sql = sql.substring(0, sql.length - 1);
    sql += ") values";
    datas.forEach(function (data) {
        sql += "(";
        fields.forEach(function (field) {
            if (data.hasOwnProperty(field.FIELDCODE)) {
                sql += Sqlstring.escape(data[field.FIELDCODE]) + ",";
            } else if (field.FIELDCODE == 'ID') {
                var uuid = ToolUtils.getUUID();
                sql += "'" + uuid + "',";
                data.ID = uuid;
            } else {
                sql += "null,";
            }
        });
        sql = sql.substring(0, sql.length - 1);
        sql += "),";
    });
    sql = sql.substring(0, sql.length - 1);
    mysql.insertOne(app.DATASOURCE, sql, function (err, results, fields) {
        if (err) {
            log.err(err);
            return callback(err, null);
        }
        callback(null, datas);
    });
};
/**
 * 更新数据，支持多条数据的更新，更新格式为DATA:[{字段1:值1,字段2:值2},{字段1:值1}],其中字段必须包含ID或WHERE，否则忽略本对象更新
 * @param appid
 * @param datas 值字符串 必须包含id 或者WHERE
 * @param callback
 */
var update = function (appid, datas, callback) {
    var app = apps[appid];
    var fields = app.appfields;
    var sqls = [];
    datas.forEach(function (data) {
        var sql = "UPDATE " + app.MAINTABLE + " SET ";
        var value = [];
        fields.forEach(function (field) {
            if (data.hasOwnProperty(field.FIELDCODE)) {
                sql += field.FIELDCODE + "=?,";
                value.push(data[field.FIELDCODE]);
            }
        });
        sql = sql.substring(0, sql.length - 1);
        if (data.hasOwnProperty('ID')) {
            sql += ' WHERE id =?';
            value.push(data.ID);
            sqls.push(Sqlstring.format(sql, value));
        } else if (data.hasOwnProperty('WHERE')) {
            if (data.WHERE.trim().substring(0, 3).toUpperCase() == 'AND') {
                sql += ' WHERE 1=1 ' + data.WHERE;
            } else {
                sql += ' WHERE ' + data.WHERE;
            }
            sqls.push(Sqlstring.format(sql, value));
        }
    });
    if (sqls.length > 0) {
        mysql.updateMany(app.DATASOUSE, sqls, function (err, results, fields) {
            return callback(err, results);
        })
    }
};
/**
 * 删除数据，支持多条数据的删除，删除格式为DATA:[{字段1:值1,字段2:值2},{字段1:值1}],其中字段必须包含ID或WHERE，否则忽略本对象删除
 * @param appid
 * @param datas 值字符串 必须包含id 或者WHERE
 * @param callback
 */
var remove = function (appid, datas, callback) {
    var app = apps[appid];
    var fields = app.appfields;
    var sqls = [];
    datas.forEach(function (data) {
        var sql = "DELETE FROM " + app.MAINTABLE + " WHERE ";
        var value = [];
        fields.forEach(function (field) {
            if (data.hasOwnProperty(field.FIELDCODE)) {
                sql += field.FIELDCODE + "=? and ";
                value.push(data[field.FIELDCODE]);
            }
        });
        sql += "1=1 ";
        if (data.hasOwnProperty('WHERE')) {
            if (data.WHERE.trim().substring(0, 3).toUpperCase() == 'AND') {
                sql += data.WHERE;
            } else {
                sql += ' AND ' + data.WHERE;
            }
        }
        sqls.push(Sqlstring.format(sql, value));
    });
    if (sqls.length > 0) {
        mysql.removeMany(app.DATASOUSE, sqls, function (err, results, fields) {
            return callback(err, results);
        })
    }
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
        if (linkapp) {
            //生成sql条件
            var where = ' 1=1 ';
            where += SysappUtils.getSqlWhereByLinkApp(mainApp, detail.APPID, linkapp);
            if (detail.WHERE && detail.WHERE.length != 0) {
                where += ' and ' + detail.WHERE;
            }
            findWithQueryPaging(detail.APPID, where, detail.PAGENUM, detail.PAGESIZE, detail.ORDER,
                function (err, detailResult) {
                    result[detail.APPID] = detailResult;
                    cb(err, detailResult);
                });
        }
    }, function (err, results) {
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
module.exports.update = update;
module.exports.remove = remove;
module.exports.findOneWithQuery = findOneWithQuery;
module.exports.findOneDetailsWithQuery = findOneDetailsWithQuery;
module.exports.findWithQueryPaging = findWithQueryPaging;
module.exports.findListdetailWithQueryPaging = findListdetailWithQueryPaging;
module.exports.apps = apps;
module.exports.initAll = initAll;
module.exports.initByAppid = initByAppid;
module.exports.initAppDetail = initAppDetail;
module.exports.getAppByAppid = getAppByAppid;