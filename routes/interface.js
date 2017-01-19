/**
 * Created by panlihai on 2017-01-19.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/:ACT', function(req, res, next) {
    switch(ACT){
        case 'CREATE':
            res.render('create', { title: 'Express' });
            break;
        case 'INFO':
            res.render('create', { title: 'Express' });
            break;
        case 'INFOLIST':
            res.render('create', { title: 'Express' });
            break;
        case 'LISTINFO':
            res.render('create', { title: 'Express' });
            break;
        case 'LISTDETAIL':
            res.render('create', { title: 'Express' });
            break;
        case 'REMOVE':
            res.render('create', { title: 'Express' });
            break;
        case 'UPDATE':
            res.render('create', { title: 'Express' });
            break;
        case 'APPDETAIL':
            res.render('create', { title: 'Express' });
            break;
    }
    res.render('create', { title: 'Express' });
});

module.exports = router;
