const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerChannel')

const $http = require('../modules/http');
const nav = require('./nav');
const __Detail__ = require('./detail');
const __search__ = require('./search');
var sysError = {};

// function queryCategory(uuid) {
//     return $http.get('/servicecenter/getSecondParentCategory?productUuid='+uuid).then( res => {
//         var res = JSON.parse(res);
//         res.code == 9999 ? (sysError={code:9999, transId: res.transId}) : '';
//         return res;
//     })
// }
const queryCategory = async(uuid) => {
    return $http.get('/servicecenter/getSecondParentCategory?productUuid='+uuid)
}


async function __main__(ctx, next) {
    var _url = '',
        frontCategoryUuid = '',
        channlKeyWords = {};
    var param = 'null';
    var paramOne="null";
    var channlName = 'null';
    if (ctx.params.channelName) {
        param = ctx.params.channelName;
        channlName = ctx.params.channelName;
    }
    paramOne = param;
    //获取url的参数
    if(ctx.request.query){
        if(ctx.request.query.choose){
            paramOne=ctx.request.query.choose;
            //console.log(paramOne);
        }
    }
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var headers={
        'ihome-token' : token,
        'platform' : 'platform_tcl_staff',
    }

    //console.log('url=======paul' + channlName);

    if (paramOne == 'tv') {
        _url = '/newchannel/tv';

        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = '456a4e26d34540eab1b31c7212a5fd98';
        }
        
        channlKeyWords = {
            keywords: "TCL电视,TCL电视价格,TCL电视怎么样,T严选",
            title: '【TCL电视】TCL电视价格_TCL电视怎么样 – T严选',
            desc: 'TCL电视官方渠道售卖， T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL电视产品。全国包邮、正品低价、快速送达、提供电子发票。'
        };
    } else if (paramOne == 'mobile') {
        _url = '/newchannel/mobile';

        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = '9dcd3d03e0674150831553d1bcd86176';
        }
        
        channlKeyWords = {
            keywords: "TCL手机,TCL手机价格,TCL手机怎么样,T严选",
            title: '【TCL手机】TCL手机价格_TCL手机怎么样 – T严选',
            desc: 'TCL手机官方渠道售卖，T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL手机产品。全国包邮、正品低价、快速送达、提供电子发票。 '
        };
    } else if (paramOne == 'air') {
        _url = '/newchannel/air';
        
        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = '325fe3718b3f4d4f8abe611373df821a';
        }

        channlKeyWords = {
            keywords: "TCL空调,TCL空调价格,TCL空调怎么样,T严选",
            title: '【TCL空调】TCL空调价格_TCL空调怎么样 – T严选',
            desc: 'TCL空调官方渠道售卖，T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL空调产品。全国包邮、正品低价、快速送达、提供电子发票。 '
        };
    } else if (paramOne == 'refrigerator') {
        _url = '/newchannel/toIcebox';

        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = 'bbef5c0d59e74f04a1aadcc8003d9511';
        }

        channlKeyWords = {
            keywords: "TCL冰箱,TCL冰箱价格,TCL冰箱怎么样,T严选",
            title: '【TCL冰箱】TCL冰箱价格_TCL冰箱怎么样 – T严选',
            desc: 'TCL冰箱官方渠道售卖，T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL冰箱产品。全国包邮、正品低价、快速送达、提供电子发票。 '
        };
    } else if (paramOne == 'washer') {
        _url = '/newchannel/toIceWash';

        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = '51dc2554485d4c549503a63298c34fae';
        }

        channlKeyWords = {
            keywords: "TCL洗衣机,TCL洗衣机价格,TCL洗衣机怎么样,T严选",
            title: '【TCL洗衣机】TCL洗衣机价格_TCL洗衣机怎么样 – T严选',
            desc: 'TCL洗衣机官方渠道售卖，T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL洗衣机产品。全国包邮、正品低价、快速送达、提供电子发票。 '
        };
    } else if (paramOne == 'homeappliance') {
        _url = '/newchannel/toHealthEleKuyu';

        if(ctx.request.query.catId != null) {
            frontCategoryUuid = ctx.request.query.catId;
        } else {
            frontCategoryUuid = '778c3418ca0a459b925a1edd09620c88';
        }

        channlKeyWords = {
            keywords: "TCL健康电器,TCL空气净化器_TCL净水器等,T严选",
            title: '【TCL健康电器】TCL空气净化器_TCL净水器等 – T严选',
            desc: 'TTCL健康电器官方渠道售卖， T严选(staff.tcl.com)是TCL集团的员工购物商城，我们提供正品TCL电视产品。全国包邮、正品低价、快速送达、提供电子发票。'
        };

    } else {
        //url访问要确认
        _url = '/newchannel/'+ctx.params.channelName+'?catId='+ctx.request.query.catId+'&choose='+ctx.request.query.choose+'&keyword='+ctx.request.query.keyword;
        //定义keywork for search
        //paramOne="";
        //console.log('url=======' + _url);
        frontCategoryUuid = ctx.request.query.catId;
        channlKeyWords = {
            keywords: "T严选,TCL员工之家,TCL内部购物平台,TCL官方网上商城",
            title: 'T严选-TCL员工购物平台,TCL员工之家,TCL内部员工购物商城',
            desc: 'T严选商城隶属TCL集团电子商务中心（惠州酷友网络科技有限公司），是TCL员工专属购物平台，是TCL集团认证的官方商城。T严选商城所售商品均为原装正品，并开具电子发票，支持全国联保。'
        };
    }

    var queryAds = {
        pageNo:""
    }
    queryAds.pageNo=ctx.params.channelName;
    const list =[];


   // ctx.query.categoryUuid = frontCategoryUuid
    
    async function ads() {
        return $http.get('/bannerpic/getBannerPictures',queryAds,headers)
    };
    var maxPage = ctx.query.nowPage


    var queryList = {
        nowPage: maxPage || 1,//ctx.params.id || 1,
        pageShow:12,
        totalNum:ctx.query.totalNum?ctx.query.totalNum:100,
        keyword1:ctx.query.keyword?ctx.query.keyword:';;',
        categoryUuid:frontCategoryUuid,
        sortBy:ctx.query.sortBy?ctx.query.sortBy:'sortWeight',
        sortType:ctx.query.sortType?ctx.query.sortType:1,
        categorysStr:ctx.query.categorysStr?ctx.query.categorysStr:'',
        queryCondition:'attributePrice=' + (ctx.query.queryCondition?ctx.query.queryCondition:''),
    }
    async function getList() {
        return $http.get(_url,queryList,headers)
    }
    var getList = await getList();
    
    var maxPagelimit = Math.ceil(getList.totalNum / 12)
    if(queryList.nowPage > maxPagelimit) {
        queryList.nowPage = maxPagelimit
    }
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var getBars = await nav.getBars(token);
    var products = await nav.products();
    var ads = await ads();
    
    // console.log('getList detail', getList)
    
    var result = {
        "getActiveFirstBars": getBars,//获取导航商品
        "products": products,
        "ads": ads,//轮播图
        "getList": getList,
    };

    result.channlKeyWords = channlKeyWords;
    result.paramOne = paramOne;
    result.channlName = channlName;
    result.nowPage = queryList.nowPage;

    //传给html页面当前的地址
    var queryUrl = ctx.url;
    if(queryUrl.indexOf('?') == -1) {
        queryUrl = queryUrl + '?nowPage=1'  + '&totalNum=' + result.getList.totalNum;
    }
    if(queryUrl.indexOf('nowPage') == -1) {
        queryUrl = queryUrl.replace('?', '?nowPage=1&') + '&totalNum=' + result.getList.totalNum;
    }
    result.pageUrl = ctx.protocol + '://' + ctx.host + queryUrl;
    await ctx.render('components/channel/channel', { '__result__': result })
}

router.get('/:id?', async (ctx, next) => {
    var routeParams = {
        'tv':'tv',
        'mobile':'mobile',
        'air':'air',
        'refrigerator':'refrigerator',
        'washer': 'washer',
        'homeappliance':'homeappliance'
    }
    var param = {
        page: ctx.params.id ? ctx.params.id : 1,
        channelName: ctx.params.channelName
    }

    if(ctx.url.indexOf('/search/search') > -1) {
        await __search__(ctx, next);
        return false;
    }

    var uuid = param.channelName.length == 32 ? param.channelName : ( param.page.length == 32 ? param.page : '' );

    if(uuid) {
        var res = await queryCategory(uuid);
        if(res.code == 0 ) {
            if(param.channelName.length == 32) {
                await ctx.redirect('/'+res.data.nameEN+'/'+uuid ,{})
            }else if( !routeParams[param.channelName] && res.data.nameEN != 'other') {
                await ctx.redirect('/'+res.data.nameEN+'/'+uuid ,{})
            }else if( routeParams[param.channelName]!= res.data.nameEN && res.data.nameEN != 'other') {
                await ctx.redirect('/'+res.data.nameEN+'/'+uuid ,{})
            }else if( param.channelName != 'other' && routeParams[param.channelName]!= res.data.nameEN && res.data.nameEN == 'other') {
                await ctx.redirect('/'+res.data.nameEN+'/'+uuid ,{})
            }else{
                await __Detail__(ctx, next);
            }
         }else{
             await ctx.render('/404',{'msg':'接口查询不成功：servicecenter/getSecondParentCategory--id:'+res.transId })
         }
    }else {
   //     if(routeParams[param.channelName]) {
        var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
        if(token == null){
            await ctx.redirect("/sign");
        }else{
            await __main__(ctx, next)
        }
        // }else{
        //     await ctx.render('/404',{'msg': '找不到相应的频道'})
        // }
    }

    // if(param.channelName && !routeParams[param.channelName] && param.channelName.length == 32) { //这可能是个ID
    //     //单个uuid
    //     var res = await queryCategory(param.channelName);
    //     if(res.code == 0 ) {
    //        await ctx.redirect(res.data.nameEN+'/'+param.channelName ,{})
    //     }else{
    //         await ctx.render('/404',{'msg': res.transId})
    //     }
    // }else if(routeParams[param.channelName] && !!Number(param.page)) {
    //     //频道分页        
    //     await __main__(ctx, next);
    // }else if(routeParams[param.channelName] && param.page.length == 32){
    //     //类别+uuid
    //     await __Detail__(ctx, next);
    // }else{
    //     var uuid = param.page.length == 32 ? param.page : '';
    //     if(!uuid) {
    //         await ctx.render('/404',{'msg': 'URL ERROR'})
    //     } else{
    //         var res = await queryCategory(param.page);
    //         await ctx.redirect('/'+res.data.nameEN+'/'+param.page,{})
    //     }
    // }
});

module.exports = router;