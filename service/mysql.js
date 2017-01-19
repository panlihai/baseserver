'use strict';
/**
 * Created by panlihai on 2017-01-10.
 */
var log = require('./log.js');
var mysql = require('mysql');
var cfg = require('../config.js');
var sysapp = require('../models/system/sysapp.js');
//连接池集合
var pools = {};

/**
 * 根据配置文件获取连接池
 * @param id 连接池Id
 * @param config 配置文件
 * @returns {Pool}
 */
var createPool = function (poolId, config) {
    return mysql.createPool(config);
};
/**
 * 核心服务的连接池
 * @type {Pool}
 */
var masterPool = mysql.createPool('baseServer', cfg.masterConfig);
/**
 * 执行查询，通过回调函数返回结果
 * @param poolId 连接池ID
 * @param sql
 * @param callback
 */
var execSql = function (poolId, sql, callback) {
    if (!pools[poolId]) {
        poolId = cfg.masterConfig.poolId;
    }
    /**
     * 获取连接池并从连接池中获取链接，并执行sql
     */
    var p = pools[poolId];
    p.getConnection(function (err, conn) {
        if (err) {
            log.err(err);
            callback(err, null, null);
        } else {
            log.info(sql);
            conn.query(sql, function (qerr, vals, fields) {
                conn.release();
                callback(qerr, vals, fields);
            });
        }
    });

};
/**
 * 查询sql语句
 * @param poolId 连接池id
 * @param fields 字段字符串 `字段名`,`字段名`
 * @param tableName 表名
 * @param where 不带and的where条件
 * @param pageNum 分页数
 * @param pageSize 页大小
 * @param callback 回调函数
 */
var query = function (poolId, fields, tableName, where, pageNum, pageSize,orderby, callback) {
    if (!tableName) {
        callback('表名不能为空', null, null);
    }
    if (!fields) {
        fields = " * ";
    }
    var sql = 'select ' + fields + ' from ' + tableName + ' ';
    if (!where && where.length > 0) {
        sql += 'where ' + where;
    }
    if (pageNum && pageSize) {
        sql += " limit " + pageNum + "," + pageSize;
    }
    if(orderby){
        sql += " order by "+ orderby;
    }
    execSql(poolId, sql, callback);
};
/**
 * 查询sql语句,获取一条数据
 * @param poolId 连接池id
 * @param fields 字段字符串 `字段名`,`字段名`
 * @param tableName 表名
 * @param where 不带and的where条件
 * @param callback 回调函数
 */
var queryOne = function (poolId, fields, tableName, where, callback) {
    this.query(poolId, fields, tablaName, 0, 1, where,null, callback);
};
/**
 * 插入一条记录
 * @param poolId 连接池id
 * @param tableName 表名
 * @param fields 字段的个数，有几个字段就几个问号
 * @param values 字段值对象{字段名称：字段值,字段名称：字段值}
 * @param callback 回调函数
 */
var insertOne = function (poolId, tableName, fields, values, callback) {
    if (!pools[poolId]) {
        poolId = cfg.masterConfig.poolId;
    }
    /**
     * 获取连接池并从连接池中获取链接，并执行sql
     */
    var p = pools[poolId];
    p.getConnection(function (err, conn) {
        if(err){
            log.err(log);
            return callback(err,null);
        }
        var insertSql ='INSERT INTO ' + tableName + ' SET ' + fields;
        log.info(insertSql);
        conn.query(insertSql,values, function (err, results, fields) {
            conn.release();
            if (err) {
                log.err(err);
                throw err;
            } else {
                log.log(result.toString());
                callback(qerr, results, fields);
            }
        })
    })
};
/**
 * 初始化工作，包含连接池配置，核心连接池配置
 * config {poolId: string, host: string, port: number, user: string, password: string, database: string}
 * @param config
 */
var initPools = function (config) {
    if (!config) {
        config = cfg.masterConfig;
    }
    if (!config.poolId) {
        log.err('连接池poolId不能为空！');
        return;
    }
    //获取核心服务的连接池
    var pool = createPool(config.poolId, config);
    //默认把核心连接池中写入到pools中
    pools[config.poolId] = pool;
    //初始化所有系统的连接池
    execSql(cfg.masterConfig.poolId, "select DSID,HOSTS,PORTS,DBNAME,USER,PASSWORD from SYS_DATASOURCE where ENABLE='Y' and DSTYPE='DB'",
        function (err, results, fields) {
            if (err) {
                log.err("数据源初始化异常，请校验连接池配置信息是否正常");
                log.err(err);
                return;
            }
            results.forEach(function (item) {
                var p = createPool(item.DSID, {
                    poolId: item.DSID,
                    host: item.HOSTS,
                    port: item.PORTS,
                    user: item.USER,
                    password: item.PASSWORD,
                    database: item.DBNAME
                });
                pools[item.DSID] = p;
                log.log(item.DSID + "数据源初始化成功");
            });
        });
    //初始化应用程序
    sysapp.initAll();
};
//封装异步调用
var smooth = function (method) {
    return function () {
        var deferred = new Deferred();
        var args = Array.prototype.slice.call(arguments, 0);
        args.push(deferred.callback());
        method.apply(null, args);
        return deferred.promise;
    };
};

module.exports.cfg = cfg;
module.exports.smooth = smooth;
module.exports.execSql = execSql;
module.exports.queryOne = queryOne;
module.exports.query = query;
module.exports.insertOne = insertOne;
module.exports.initPools = initPools;
