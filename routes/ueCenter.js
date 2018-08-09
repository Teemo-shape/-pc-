const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerUeCenter')

const nav = require('./nav');
const $http = require('../modules/http');
const config = require('../config/config');

const api = {
   banner:'/bannerpic/getBannerPicList',
   community: '/usercenter/tclcustomer/getDigestPost',
   activity: '/usercenter/tclcustomer/getHotActivity',
   integoods: '/integral/getHotGoods',
   phoneBinder: '/usercenter/tclcustomer/getBindState',
   qiandao: '/usercenter/tclcustomer/getSignStatus',
   mageData:'/userexp/listManagerData',
   listPresaleFeedback: '/userexp/listPresaleFeedback',
   listAftersaleFeedback: '/userexp/listAftersaleFeedback',
   listFeedback: '/userexp/listFeedback',
   listOptimizeLog: '/userexp/listOptimizeLog'

};

const banners = async () => {
    return $http.get(api.banner, {type: 1} ).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
}

const community = async () => {
    return $http.get(api.community).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
}

const activity = async () => {
    return $http.get(api.activity).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
}

const integoods = async () => {
    return $http.get(api.integoods).then( res => {
        if(res.code === '0') {
            return (res.data.length ? res.data: []);
        }
    });
}

const phoneBinder = async (params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token
    };
    return $http.get(api.phoneBinder,{},headers).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: '');
        }
    });
}

const qiandao = async (params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token
    };
    return $http.get(api.qiandao, {} ,headers).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: '');
        }
    });
}

const mageData = async (params) => {
    return $http.get(api.mageData).then( res => {
        if(res.code === '0') {
            res.data.forEach(function (item, index, arr) {
                var t = new Date(item.starttime*1000);
                item.st = t.getMonth()+1+'月'+(t.getDate()<10? ('0'+t.getDate()) : t.getDate() )+'日 '+' '+(t.getHours()<10 ? ('0'+t.getHours()) : t.getHours() )+':'+ (t.getMinutes()<10 ? ('0'+t.getMinutes()) : t.getMinutes() );
            });
            return (res.data ? res.data : []);
        }
    });
}
//listPresaleFeedback

const listPresaleFeedback = async (params) => {
    return $http.get(api.listPresaleFeedback).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: []);
        }
    });
}

const listAftersaleFeedback = async (params) => {
    return $http.get(api.listAftersaleFeedback).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: []);
        }
    });
}

//listFeedback
const listFeedback = async (params) => {
    return $http.get(api.listFeedback).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: []);
        }
    });
}
//listOptimizeLog
const listOptimizeLog = async (params) => {
    return $http.get(api.listOptimizeLog).then( res => {
        if(res.code === '0') {
            return (res.data ? res.data: []);
        }
    });
}

async function __main__(ctx, next) {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var params = {
        'token': token
    }

    var getBars = await nav.getBars(token),
     products = await nav.products(),
     getBanner = await banners(),
     getCommunity = await community(),
     getActivity = await activity(),
     getIntegoods = await integoods(),
     getPhoneBinder = await phoneBinder(params),
     getQiandao = await qiandao(params),
     getMageData = await mageData(),
     getListPresaleFeedback = await listPresaleFeedback(),
     getListAftersaleFeedback = await listAftersaleFeedback(),
     getListFeedback = await listFeedback();
     getListOptimizeLog = await listOptimizeLog();

    var result = {
        getActiveFirstBars: getBars,
        products: products,
        ads: getBanner,
        community: getCommunity,
        activity: getActivity,
        inteGoods: getIntegoods,
        phoneBinder: getPhoneBinder,
        qiandao: getQiandao,
        mageData: getMageData,
        listAftersaleFeedback: getListAftersaleFeedback,
        listPresaleFeedback: getListPresaleFeedback,
        listAftersaleFeedback: getListAftersaleFeedback,
        listFeedback: getListFeedback,
        listOptimizeLog: getListOptimizeLog,
        env:config.env
    };
    await ctx.render('/components/ueCenter/ueCenter', {'__result__':result} )
}

router.get('/', async(ctx, next) => {
    await __main__(ctx, next)
});

module.exports = router;
