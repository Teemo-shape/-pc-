const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerChannel')

const moment = require('moment');
const $http = require('../modules/http');
const nav = require('./nav');
const api = {
    detail: '/front/product/toProductKuyu',
    seckill: '/front/product/toLimitProductKuyu',
    babyset: '/front/product/babyset',
    getStorePromotion: '/front/product/getStorePromotion',
    productAttr: '/productAttr/getAttributes',
    getServicePolicies :'/front/product/getServicePolicies',
    getCommonProblems: '/front/product/getCommonProblems',
    comments: '/front/product/showProductComments'
    // suit: '/front/product/getSuitMainByRegion',
   // /productAttr/getAttributes?productUuid=&categoryUuid=&terminalType=
};

var sysError = {};

//服务政策
function getSerParams(name) {
    var types = [{
        name: '洗衣机',
        params: {
            wuliu: "neigouxiyijiwuliu",
            qianshou: "neigouxiyijiqianshou",
            anzhuang: "neigouxiyijianzhuang",
            fapiao: "neigouxiyijifapiao",
            shouhou: "neigouxiyijishouhou",
            zhifu: "neigouxiyijizhifu",
            contentId: 'neigouxiyijiwenti'
        },
        dom:{key: '<li>下单支付</li><li>物流配送</li><li class="active">商品签收</li> <li>产品安装</li><li>发票</li><li>售后服务</li>' }
    }, {
        name: ',健康电器,小家电,扫地机器人,空气净化器,净水机,除湿机,厨房电器',
        params: {
            wuliu: "neigouxiaojiadianwuliu",
            qianshou: "neigouxiaojiadianqianshou",
            anzhuang: "neigouxiaojiadiananzhuang",
            fapiao: "neigouxiaojiadianfapiao",
            shouhou: "neigouxiaojiadianshouhou",
            contentId: 'neigouxiaojiadianwenti'
        },
        dom:{key: '<li>物流配送</li><li class="active">商品签收</li> <li>产品安装</li><li>发票</li><li>售后服务</li>' }
    }, {
        name: ',3800,5800,6800,7800,8800,9700,9500,电视周边,大家电,电视,',
        params: {
            wuliu: "neigoudianshiwuliu",
            qianshou: "neigoudianshiqianshou",
            anzhuang: "neigoudianshianzhuang",
            fapiao: "neigoudianshifapiao",
            shouhou: "neigoudianshishouhou",
            contentId: 'neigoudianshiwenti'
        },
        dom:{key: '<li>物流配送</li><li class="active">商品签收</li> <li>产品安装</li><li>发票</li><li>售后服务</li>' }
    }, {
        name: '手机,智能穿戴,平板电脑,么么哒手机,TCL手机,手机周边,自拍杆,耳机,充电宝,',
        params: {
            wuliu: "neigoushoujiwuliu",
            qianshou: "neigoushoujiqianshou",
            xiazai: "neigoushoujixiazai",
            fapiao: "neigoushoujifapiao",
            shouhou: "neigoushoujishouhou",
            contentId: 'neigoushoujiwenti'
        },
        dom:{key: '<li>物流配送</li><li class="active">商品签收</li> <li>资源下载</li><li>发票</li><li>售后服务</li>'}
    }, {
        name: ',空调,定频,变频,',
        params: {
            wuliu: "neigoukongtiaowuliu",
            qianshou: "neigoukongtiaoqianshou",
            anzhuang: "neigoukongtiaoanzhuang",
            fapiao: "neigoukongtiaofapiao",
            shouhou: "neigoukongtiaoshouhou",
            contentId: 'neigoukongtiaowenti'
        },
        dom:{key:'<li>物流配送</li><li class="active">商品签收</li> <li>产品安装</li><li>发票</li><li>售后服务</li>' }
    }, {
        name: '冰箱',
        params: {
            wuliu: "neigoubingxiangwuliu",
            qianshou: "neigoubingxiangqianshou",
            anzhuang: "neigoubingxianganzhuang",
            fapiao: "neigoubingxiangfapiao",
            shouhou: "neigoubingxiangshouhou",
            zhifu: "neigoubingxiangzhifu",
            contentId: 'neigoubingxiangwenti'
        },
        dom:{key: '<li>下单支付</li><li>物流配送</li><li class="active">商品签收</li> <li>产品安装</li><li>发票</li><li>售后服务</li>'}
    }];
    var m = '';
    for (let value of types) {
            if(value.name.indexOf(name) > -1) {
                m = value;
            }
    }
    // $.each(types , function (i, o, arr) {
    //     if(o.name.indexOf(name) > -1) {
    //         m = o;
    //     }
    // });
    return m;
}


const getProduct = async(params) => {
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token,
        'platform' : 'platform_tcl_staff',
    };
    return $http.get(api.detail, params, headers);
};

const seckill = async(productToKuyu) => {
    if(!productToKuyu.promotionUuid && !productToKuyu.skuNo) return false;

    var params = {
        promotionUuid:productToKuyu.promotionUuid,
        skuNo:productToKuyu.skuNo,
    };
    return $http.get(api.seckill, params)
};

const babyset = async(params) => {
    var param = {
        productUuid: params.uuid
    };
    return $http.get(api.babyset, param)
};

const storePromotion = async(productToKuyu, params) => {
    if(productToKuyu.promotionUuid) return false;  //秒杀不显示促销
    var param = {
        productUuid: params.uuid,
        storeUuid: productToKuyu.productModel.productMain.storeUuid
    };
    var headers =  {
        'content-type': 'application/json;charset=UTF-8',
        'ihome-token': params.token,
        'platform' : 'platform_tcl_staff',
    };
    return $http.get(api.getStorePromotion, param, headers)
};

const productAttr = async(productToKuyu, params) => {
    var param = {
        productUuid: params.uuid,
        terminalType:'01',
        categoryUuid:  productToKuyu ? productToKuyu.productModel.productMain.categoryUuid : productToKuyu.productModel.productMain.categoryUuid
    };

    return $http.get(api.productAttr, param)
};

const servicePolicies = async(productToKuyu) => {
    var secondParentCategoryName = productToKuyu ? productToKuyu.secondParentCategoryName : productToKuyu.secondParentCategoryName;

    if(!secondParentCategoryName) return false;
    var params = getSerParams(secondParentCategoryName).params || '';
    return $http.get(api.getServicePolicies, params);
};

const commonProblems = async(productToKuyu) => {
    var secondParentCategoryName = productToKuyu ? productToKuyu.secondParentCategoryName : '';
    if(!secondParentCategoryName) return false;
    var params = {'contentId': getSerParams(secondParentCategoryName).params ? getSerParams(secondParentCategoryName).params.contentId : ''};
    if(params.contentId) {
        return $http.get(api.getCommonProblems, params);
    }
}

const comments = async(params,token) => {
    var param = {
        productUuid: params.uuid,
        nowPage: 1,
        pageShow: 5,
        ranNum: Math.random()
    };
    var headers={
        'ihome-token' : token,
        'platform' : 'platform_tcl_staff',
    }
    return $http.postForm(api.comments, param, headers).then( res => {
        var data = res;
        if(data){
            if(data.averagescore != null) {
                data.scorePercent = (data.averagescore / 5 ).toFixed(2) * 100;
                data.commentList.forEach(function(ele, index, arr) {
                    ele.firstShopComment.appTime = moment(ele.firstShopComment.appTime).format('YYYY-MM-DD');
                    ele.firstShopComment.comments = ele.firstShopComment.comments.replace(/\s+/ig,'');
                    if(ele.afterShopComment) {
                        ele.afterShopComment.appTime = moment(ele.afterShopComment.appTime).format('YYYY-MM-DD');
                        ele.afterShopComment.comments = ele.afterShopComment.comments.replace(/\s+/ig,'');
                    }
                })
                if(data.goodComment) {
                    data.goodComment.appTime = moment(data.goodComment.appTime).format('YYYY-MM-DD');
                    data.goodComment.comments= data.goodComment.comments.replace(/\s+/ig,'')
                }
                return data;
            }else{
                return res;
            }
        }
    });
}


async function __main__(ctx, next) {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    if(token == null){
        await ctx.redirect("/sign");
    }
    var params = {
        uuid : ctx.params.id,
        productUuid: ctx.params.id,
        token: token ? token : null
    };
    var productToKuyu = await getProduct(params);
    var getSeckill = await seckill(productToKuyu);
    var getBabyset = await babyset(params);
    var getStorePromotion = await storePromotion(productToKuyu, params);
    var proOrkill = getSeckill ? getSeckill :  productToKuyu;
    var getServicePolicies = await servicePolicies(proOrkill);


    var secondParentCategoryName = productToKuyu ? productToKuyu.secondParentCategoryName : productToKuyu.secondParentCategoryName;
    var  domPolicies = getSerParams(secondParentCategoryName).dom || {};
    getServicePolicies = Object.assign(getServicePolicies, domPolicies );

    var getCommonProblems = await commonProblems(proOrkill);
    var getComments = await comments(params,token);
    var getProductAttr = await productAttr(proOrkill, params)

    var getBars = await nav.getBars(token);
    var products = await nav.products();

    var result = {
        "getActiveFirstBars": getBars,
        "products": products,
        "toProductKuyu": productToKuyu,
        "getSeckill": getSeckill,
        "attrs": getBabyset,
        "getStorePromotion": getStorePromotion,
        "getServicePolicies": getServicePolicies,
        "getCommonProblems": getCommonProblems,
        "getComments": getComments,
        "productAttr": getProductAttr,
    };
    result['uuid'] = params.uuid;
    result['channelName'] = ctx.params.channelName;
    var channelDic = {
        "电视":'tv',
        "手机":'mobile',
        "空调":'air',
        "冰箱":'refrigerator',
        "洗衣机":'washer',
        "健康电器":'homeappliance'
    }

    if((result.toProductKuyu.returnCode && result.toProductKuyu.returnCode == 2) || (result.getSeckill && result.getSeckill.returnCode && result.getSeckill.returnCode == 2) ) {
        await ctx.render('/productSoldOut' , {'__result__':result})
    } else {
        var cName = channelDic[result.toProductKuyu.secondParentCategoryName] ? channelDic[result.toProductKuyu.secondParentCategoryName] : (result.getSeckill ? (channelDic[result.getSeckill.secondParentCategoryName] ? channelDic[result.getSeckill.secondParentCategoryName]: 'other') : 'other');
        if( cName != ctx.params.channelName ) {
            await ctx.render('/404',{'msg': 'URL ERROR'})
        }else{
            await ctx.render('components/detail/detail', {'__result__':result})
        }
    }
}

module.exports = __main__;
