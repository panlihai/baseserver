/**
 * Created by panlihai on 2017-01-19.
 */
var express = require('express');
var log = require('../service/log.js');
var router = express.Router();
var create = require('./create.js');
var update = require('./update.js');
var remove = require('./remove.js');
var listdetails = require('./listdetails.js');
var list = require('./list.js');
var info = require('./info.js');
var infodetails = require('./infodetails.js');
var count = require('./count.js');
var changelist = require('./changelist.js');
var composite = require('./composite.js');
var upload = require('./upload.js');
var uploadfile = require('./uploadfile.js');
var register = require('./register.js');
var sendmsg = require('./sendmsg.js');
var telsms = require('./telsms.js');
var login = require('./login.js');
var resetpwd = require('./resetpwd.js');
var logout = require('./logout.js');
var checksms = require('./checksms.js');
var appdetails = require('./appdetails.js');
var execsql = require('./execsql.js');
var qntoken = require('./qntoken.js');

/* 路由配置 */
router.all('/:PID/:APPID/:SUPERVISE/:ACTION', function (req, res, next) {   
    switch (req.params.ACTION) {
        //新增接口
        case 'INSERT':
        case 'ADD':
        case 'CREATE':
            create.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //修改接口
        case 'MODIFY':
        case 'UPDATE':
            update.getResult(req.params,req.query,function (result) {
                res.json(result);
            });
            break;
        //删除接口
        case 'REMOVE':
        case 'DELETE':
            remove.getResult(req.params,req.query,function (result) {
                res.json(result);
            });
            break;
        //获取列表内容及每列的子表内容
        case 'LISTDETAIL':
        case 'LISTDETAILS':
            listdetails.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //获取列表内容
        case 'LIST':
        case 'LISTINFO':
            list.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //获取一条记录的内容
        case 'INFO':
            info.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //获取一条记录的内容及各个子表内容
        case 'INFODETAIL':
        case 'INFODETAILS':
        case 'INFOLIST':
            infodetails.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //获取记录数
        case 'COUNT':
            count.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        //获取
        case 'CHANGELIST' :
            changelist.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'COMPOSITE' :
            composite.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'UPLOAD' :
            upload.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'UPLOADFILE' :
            uploadfile.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'REGISTER':
            register.getResult(req.params,req.query,function (result) {
                res.json(result);
            });
            break;
        case 'SENDMSG':
            sendmsg.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'TELSMS':
            telsms.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'LOGIN':
            login.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'RESETPWD':
            resetpwd.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'LOGOUT':
            logout.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'CHECKSMS':
            checksms.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'APPDETAIL':
        case 'APPDETAILS':
            appdetails.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'EXECSQL':
            execsql.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        case 'QNTOKEN':
            qntoken.getResult(req.params,req.query, function (result) {
                res.json(result);
            });
            break;
        default:
            res.send(404, 'Error occureed：Api \'' + req.params.ACTION + '\' is not finded.')
    }
});
module.exports = router;
