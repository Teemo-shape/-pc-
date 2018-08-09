const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerIndex')

const nav = require('./nav');
const $http = require('../modules/http');


var sysError = {};

async function __main__(ctx, next) {

    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var headers={
        'ihome-token' : token,
        'platform' : 'platform_tcl_staff',
    }
    if(token == null){
        await ctx.redirect("/sign");
    }
    // const main2 = async() => {
    //     try {
    //        var m = await $http.get('/homePage/category/getActiveMain')
    //        return m;
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    //类目
    const activeMain = async() => {
        try {
           var m = await $http.get('/front/product/productcategoryfront/getAllNodesById?uuid=staff_pc','',headers)
           return m;
        } catch (error) {
            console.log(error)
        }
    }
    //获取推荐商品
    const allproduct = async() => {
        try {
            var m = await $http.get('/homePage/featured/getActiveFeatured','',headers)
            return m;
        } catch (error) {
            console.log(error)
        }
    }
    //获取查询轮播大图、三个常驻广告位和底部轮播广告
    const initAdvertisement = async() => {
        try {
            var m = await $http.get('/getIndexAdsStaff/pc','',headers);
            return m;
        } catch (error) {
            console.log(error)
        }
    }
    //明星产品，热门产品
    const initHotAdvertisement = async() => {
        try {
            var m = await $http.get('/homePage/featured/getActiveFeatured','',headers);
            return m;
        } catch (error) {
            console.log(error)
        }
    }

   // var Mdata = await main2();




    // const getList = async(item) => {
    //     Mdata["list"] = [];
    //     return $http.get('/homePage/category/getActiveContent?parentId='+item.uuid)
    //         .then( res => {
    //             if(res.retData && res.retData.product.length>0) {
    //                 if(res.retData.product[0].parentId == item.uuid) {
    //                     var  a= {};
    //                     a['key'] = [
    //                         res.retData.product,
    //                         res.retData.poster,
    //                     ]
    //                     a['index'] = item.orderNum;
    //                     Mdata.list.push(a);
    //                     Mdata.list.sort(function (a,b) {
    //                         return a.index - b.index;
    //                     })
    //                 }
    //             }
    //         return Mdata;
    //     }).catch(function(err) {
    //         console.log(err)
    //     });
    // }
    // var prList = [];
    // Mdata.retData.forEach(function (ele, i, arr) {
    //     var w =  getList(Mdata.retData[i]);
    //     prList.push(w);
    // })

    var getBars = await nav.getBars(token),
        products =  await nav.products(),
        getAllproduct =  await allproduct(),
        getInitAdvertisement = await initAdvertisement(),
        getInitHotAdvertisement = await initHotAdvertisement(),
        getActiveMain  = await activeMain()
   // var activeMain = await prList[prList.length-1];
    var result = {
        "getActiveFirstBars":  getBars,
        "products":  products,
        "getallproduct":  getAllproduct,
        "initAdvertisement":  getInitAdvertisement,
        "initHotAdvertisement":  getInitHotAdvertisement,
        "activeMain":  getActiveMain,
    }
    await ctx.render('/components/home/home', {'__result__':result})
}

router.get('/', async(ctx, next) => {
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
if(token == null){
    await ctx.redirect("/sign");
}else{
    await __main__(ctx, next)
}

});

module.exports = router;
