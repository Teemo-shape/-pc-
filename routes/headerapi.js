
const router = require('koa-router')();
const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerIndex')
const configs = require('../config/config');
var config2 = function () {
    // dev true  测试环境
    // dev false 生产
    var env = '';
    if(configs.env == '开发' || configs.env =='测试') {
        env = 'dev';
    }else if(configs.env =='生产'){
        env = 'production';
    }else if(configs.env =='预发布') {
        env = 'release';
    }

    var result = {
        'rest':'http://www.tcl.com/rest',
        'path':'http://www.tcl.com',
        'port': 80,
        'curenv':'deploy'
    };
    if(env.trim() == 'dev') {
        // result['rest']='http://10.120.54.47/rest';
        // result['path']='http://10.120.54.47';
        result['rest']='http://testpc.tclo2o.cn/rest';
        result['path']='http://testpc.tclo2o.cn';
        result['port']= 80;
        result['curenv']= 'dev';
        result['ut'] = 'http://testuser.tclo2o.cn';
        result['fans'] = 'http://www.t-fans.net'
        result['jifen'] = 'http://jf.10get.com';
        
    }else if(env.trim() == 'release') {
        result['rest']='http://www.tcl.com/rest';
        result['path']='http://www.tcl.com';
        result['port']= 80;
        result['curenv']='deploy';
        result['ut'] = 'http://user.tcl.com';
        result['fans'] = 'http://fans.tcl.com';
        result['jifen'] = 'http://hy.tcl.com';

    }else if(env.trim() == 'production') {
        result['rest']='http://www.tcl.com/rest';
        result['path']='http://www.tcl.com';
        result['port']= 80;
        result['curenv']='deploy';
        result['ut'] = 'http://user.tcl.com';
        result['fans'] = 'http://fans.tcl.com';
        result['jifen'] = 'http://hy.tcl.com';
    }
    return result
}
var config = config2();
var basePath = config.rest,
_path = config.path,
_port = config.port;

const nav = require('./nav');
const $http = require('../modules/http');

var sysError = {};
async function __main__(ctx, next) {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;

    var a = await nav.getBars(token),
        b =  await nav.products();
    var ads = {"bars":a};
    var products = {"products":b};
   // var activeMain = await prList[prList.length-1];
    var result = {
        
    }
    if(configs.host == 'http://localhost/rest') {
        result.host = 'http://www.tcl.com'
    }else{
        result.host = 'http://testpc.tclo2o.cn'
    }
    var path = {path:_path+':'+_port,basePath: basePath, hostname: _path, curenv: config.curenv, ut:config.ut, host: result.host, result: config};
    var c = Object.assign(ads, products, path);

    await ctx.render('/components/headerapi/header', c)
}

router.get('/', async(ctx, next) => {
    await __main__(ctx, next)
});

module.exports = router;
