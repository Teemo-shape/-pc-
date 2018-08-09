const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerPolicy')


const api = {
    getPolicy:'/servicecenter/getPolicy',
    getStandard: '/servicecenter/getStandard',
    getContent:'/servicecenter/getContent'
};

const nav = require('./nav');
const $http = require('../modules/http');

const getPolicy = async(params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token
    };
    return $http.get(api.getPolicy, params, headers).then( res => {
        if(res.length) {
            return res
        }else{
            return [];
        }
    });
};
const getStandard = async(params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token
    };
    return $http.get(api.getStandard, params, headers).then( res => {
        if(res.length) {
            return res
        }else{
            return [];
        }
    });
};

const getContent = async(params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token
    };
    return $http.get(api.getContent, params, headers).then( res => {
        if(res.retData) {
            return res.retData;
        }else{
            return {};
        }
    });
};


async function __main__(ctx, next) {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;

    var params = {
        contentId: ctx.query.id,
        token: token
    }

    var title = {
        "56d4f28d21ca473f871a3b845f61aee9": "冰箱服务政策",
        "4ec8ff5fb69a4382b4008ed4c4dc090b": "空调服务政策",
        "4451a0cbd64449338a004b375a8a7532": "手机服务政策",
        "7ba60af1e98e40f5b5826c2857528d7c": "洗衣机服务政策",
        "b989ad6ab7184eba9e85136c2d100e55": "冰箱冰柜收费标准",
        "b6994033da2945b0932c0da55386f9c0": "洗衣机收费标准",
        "b989ad6ab7184eba9e85136c2d100e55": "冰箱冰柜收费标准",
        "81af0b47c94c4a238aff6aad03646617": "空调收费标准",
    }
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var getBars = await nav.getBars(token);
    var products = await nav.products();

    var policy = await getPolicy(params);
    var standard = await getStandard(params);
    var content = await getContent(params);

    var result = {
        "getActiveFirstBars": getBars,
        "products": products,
        "menus": policy.concat(standard),
        "content": content,
        "contentId": params.contentId,
        "title": title[params.contentId] ? title[params.contentId]: ''
    };

    await ctx.render('/components/policy/policy', {'__result__':result} )
}

router.get('/', async(ctx, next) => {
    await __main__(ctx, next)
});

module.exports = router;
