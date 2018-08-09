// const request = require('request-promise');
const request = require('superagent');
const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('HTTP-request')

const config = require("../config/config");
const basePath = config.host;
const timeout = 15*1000;
module.exports = {
    get: function (url, params, headers) {
        var _get = request.get(basePath+url).timeout(timeout);
        var start = Date.now();
        if(params) {
            _get.query(params)
        }
        if(headers) {
            _get.set(headers)
        }
        return _get.then( res => {
            if(res.status == 200) {
                
                if(res.body.code == 9999) {
                    logger.error('HTTP:'+ basePath+url +' - code:9999 - transID:'+ res.body.transId)
                }else{
                    return res.body
                }
                
                //var ms = Date.now()-start
                //console.log(url+'耗时：'+ ms +'ms')
            }else{
                logger.error('HTTP:'+ basePath+url +'STATUS:'+ res.status)
            }
        });
    },
    post: function (url, params, headers) {

        var _get = request.post(basePath+url).timeout(timeout);
        if(params) {
            _get.query(params)
        }
        if(headers) {
            _get.set(headers)
        }
        var start = Date.now();
        return _get.then( res => {
            if(res.status == 200) {
                if(res.body.code == 9999) {
                    logger.error('HTTP:'+ basePath+url +' - code:9999 - transID:'+ res.body.transId)
                }else{
                    return res.body
                }
            
                //var ms = Date.now()-start
                //console.log(url+'耗时：'+ ms +'ms')
            }else{
                logger.error('HTTP:'+ basePath+url +'STATUS:'+ res.status)
            }
        });

    },
    postForm: function (url, params, headers) {
        // var options = {
        //     method:'POST',
        //     uri:basePath+url,
        //     formData:params,
        // }
        // headers ? options['headers'] = headers : '';
        // return request(options)
        var _get = request.post(basePath+url).type('form').timeout(timeout);
        if(params) {
            _get.send(params)
        }
        if(headers) {
            _get.set(headers)
        }
        return _get.then( res => {
            if(res.status == 200) {
                if(res.body.code == 9999) {
                    logger.error('HTTP:'+ basePath+url +' - code:9999 - transID:'+ res.body.transId)
                }else{
                    return res.body
                }
            }else{
                logger.error('HTTP:'+ basePath+url +'STATUS:'+ res.status)
            }
       });
    }
};
