var express = require('express');
var router = express.Router();
var mysql = require('../service/mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    mysql.query(null,'*','SYS_APP'," ENABLE='Y' ",0,200,function(err,results,fields){
        if(err){
            console.log(err);
        }else{
           res.JSON(results);
        }
    });

});

module.exports = router;
