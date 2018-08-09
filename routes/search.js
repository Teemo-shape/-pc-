const router = require('koa-router')();

const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerSearch')

const nav = require('./nav');
const $http = require('../modules/http');
var sysError = {};

function filterEs(es) {
    if(es[0] != '<' || es[1] != 'a'){
        return es;
    }
    var tmp = '';
    var filter = false;
    var findEnd = false;
    var htmlStart = false;
    for(var i in  es){
        var c = es[i];
        // if(findEnd){
        // 	tmp += c;
        // 	continue;
        // }
        if(c == '>'){
            if(!filter){
                htmlStart = false;
                tmp += c;
            }
            filter = false;
            continue;
        }
        if(c == '<'){
            if(htmlStart){
                filter = true;
                continue;
            }else{
                htmlStart = true;
            }
        }
        // if(c == '【'){
        // 	findEnd = true;
        // 	tmp += '【';
        // 	continue;
        // }
        if(!filter){
            tmp += c;
        }

    }
    return tmp;
}

async function __main__(ctx, next) {
    var params = {
        nowPage: ctx.query.nowPage?ctx.query.nowPage:1,
        pageShow: ctx.query.pageShow?ctx.query.pageShow:12,
        totalNum: ctx.query.totalNum,
        queryCondition:'keywords2=&attributePrice=' + (ctx.query.queryCondition ? ctx.query.queryCondition : 0),
        keyword: decodeURI(ctx.query.keyword),
        //firstCategoryId: ctx.query.firstCategoryId,
        sortBy: ctx.query.sortBy,
        sortType: ctx.query.sortType,
        //productPicType: ctx.query.productPicType
    }
    var token = ctx.cookies.get('istaff_token') ? ctx.cookies.get('istaff_token') : null;
    var headers={
        'ihome-token' : token,
        'platform' : 'platform_tcl_staff',
    }

    const  searchList = async() => {
        return $http.get('/itemsearch/toProductList', params, headers)
            .then( res => {
                var list = res.list;
                list.forEach(function (ele, i ,arr) {
                    ele.recommend = filterEs(ele.recommend)
                    ele.displayPrice = (ele.price > ele.promotionPrice && ele.promotionPrice > 0)?ele.promotionPrice:ele.price;
                    if(ele.displayPrice){
                        ele.displayPrice = ele.displayPrice.toFixed(2)
                    }
                });
                return res;
            }).catch (function(error){
                console.error(error);
            });
    }
    
    var getActiveFirstBars = await nav.getBars(token),
        products = await nav.products(),
        getSearchList = await searchList()

    var result = {
        "getActiveFirstBars": getActiveFirstBars,
        "products": products,
        "searchList": getSearchList
    }
    
    result.searchList['queryCondition'] = ctx.query.queryCondition;
    await ctx.render('components/search/search', {
        '__result__': result
    })
}

module.exports = __main__;
