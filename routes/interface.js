/**
 * Created by panlihai on 2017-01-19.
 */
var express = require('express');
var router = express.Router();
var infolist = require('./infolist.js');
var listinfo = require('./listinfo.js');
/* GET home page. */
router.all('/:PID/:APPID/:SUPERVISE/:ACTION', function (req, res, next) {
    switch (req.params.ACTION) {
        case 'CREATE':
            res.render('create', {title: 'Express'});
            break;
        case 'INFO':
            res.render('create', {title: 'Express'});
            break;
        case 'INFOLIST':
            res.render('create', {title: 'Express'});
            break;
        case 'LISTINFO':
            listinfo.getResult(req,res,function(result){
                res.json(result);
            });
            break;
        case 'LISTDETAIL':
            res.render('create', {title: 'Express'});
            break;
        case 'REMOVE':
            res.render('create', {title: 'Express'});
            break;
        case 'UPDATE':
            res.render('create', {title: 'Express'});
            break;
        case 'APPDETAIL':
            res.render('create', {title: 'Express'});
            break;
    }
    
});

module.exports = router;
