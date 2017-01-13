'use strict';
var assert = require('chai').assert;
var http = require('http');
var rest = require('restler');

suite('API tests', function () {
    var sysapp = {
        lat: 45.516011,
        lng: -122.682062,
        name: '测试',
        description: 'Founded in 1892,there are six stories of modern art for your enjoyment.',
        email: '11140788@qq.com'
    };
    var base ="http://localhost:3000";
    test('should be able to add an attraction',function(done){
        rest.post(base+'/server/api/YNY/SYSAPP/123456/infolist',{APPID:'SYSAPP'}).on('success',function(data){
            assert.match(data.id,/\w/,'id must be set');
            done();
        });
    });
});