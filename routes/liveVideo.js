const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerUeCenter')

const nav = require('./nav');
const $http = require('../modules/http');
const config = require('../config/config');

const api = {
   banner: '/bannerpic/getBannerPicList',
};

const banners = async () => {
    return $http.get(api.banner, {type: 6} ).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
}

const banners2 = async () => {
    return $http.get(api.banner, {type: 7} ).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
};

const banners3 = async () => {
    return $http.get(api.banner, {type: 8} ).then( res => {
        if(res.code === '0') {
            var result = [];
            if(res.data.length) {
                for(var i=0,len=res.data.length;i<len;i+=6){
                    result.push(res.data.slice(i,i+6));
                }
                return result;
            }else{
                return [];
            }
        }
    });
};

async function __main__(ctx, next) {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var params = {
        'token': token
    }

    var getBars = await nav.getBars(token),
        getBanner = await banners(),
        getBanner2 = await banners2(),
        getBanner3 = await banners3(),
        products = await nav.products();

    var result = {
        getActiveFirstBars: getBars,
        products: products,
        ads: getBanner,
        ads2: getBanner2,
        ads3: getBanner3,
        env:config.env
    };
    await ctx.render('/components/liveVideo/index', {'__result__':result} )
}

router.get('/', async(ctx, next) => {
    await __main__(ctx, next)
});

module.exports = router;
