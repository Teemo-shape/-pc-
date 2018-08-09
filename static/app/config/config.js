var CODEMAP = {
    "status": { // 状态码
        success: 0,         // 成功, -1//fail
        TimeOut: 403,       // 链接超时
        notLogin: -6,
        reverifyCode: -5,  // 没刷新验证码
        verifyCodeErr: -4,  // 验证码错误
        nameOrpassErr: -1,  // 用户名或密码错误
        lock: 4,            //超过最大失败次数
        isNone: 12          //用户不存在
    }
};
var from = encodeURIComponent(location.href) ? encodeURIComponent(location.href) : '';
require.config({
    waitSeconds: 0
});
KUYU.Init.config({
    env: {
        runev: 'pc',
        sever: 'dev',
        test:  false,  //测试true 上生产 false
    },
    services: {
        dev: '/rest',
        test: '/rest',
        ABtest: '',
        deploy: '/rest',
        downldUrl:'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/handbook/',
        thirdLogin:{
            "dev": "https://logintest.tclclouds.com/account/thirdParty/login?from=",
            "deploy": "https://login.tclclouds.com/account/thirdParty/login?from="
        },
        thridBack:{
            "dev": "https://logintest.tclclouds.com/account/injectSSOInfo",
            "deploy": "https://login.tclclouds.com/account/injectSSOInfo"
        },
        tk: ''//api/getToken
    },
    load: {
        baseUrl: '../../app',
        apiConfig: {
            'login': {
                url: '../sign',
                security: true
            }
        },
        paths: {
            'KUYU.Service': 'js/service',
            'KUYU.netBridge': 'js/netBridge',
            'KUYU.Util': 'js/util',
            'KUYU.Control': 'js/control',
            'KUYU.Binder': 'js/binder',
            'KUYU.Filter': 'js/filter',
            'KUYU.Login': 'js/login',
            'KUYU.Forget': 'js/forget',
            'KUYU.ApplyAccount': 'js/applyAccount',
            'KUYU.ApplyAccountInfo': 'js/applyAccountInfo',
            'KUYU.Header': 'js/header',
            'KUYU.HeaderTwo': 'js/headerTwo',
            'KUYU.Store': 'js/store',
            'KUYU.userInfo': 'js/userInfo',
            'KUYU.navHeader': 'js/navHeader',
            'KUYU.navFooterLink': 'js/navFooterLink',
            'KUYU.navFooter': 'js/navFooter',
            'KUYU.SlideBarLogin': 'js/slideBarLogin',
            'KUYU.plugins.alert': 'plugins/alert/alert',
            'lightbox': 'js/lightbox',
            'placeholder': 'js/placeholder',
            'xss': 'js/xss',
            'juicer': 'plugins/juicer',
            'base64': 'plugins/base64',
            'loadPlate': 'plugins/loadPlate',
            'platHead': 'plugins/platHead',
            'platTopCart': 'plugins/platTopCart',
            'Plugin': 'js/Plugin',
            'comm': 'js/comm',
            'index': 'js/index',
            'coupons':'../pages/productInfo/coupons',
            'jquery.flexslider-min': 'js/jquery.flexslider-min',
            'limitOrder': 'js/limitOrder',
            'opCookieUtil': 'js/opCookieUtil',
            'y_member': 'js/y_member',
            'lazyload': 'js/jquery.lazyload-min',
            'base': 'js/base',
            'validate': 'js/jquery.validate.min',
            'aebiz.validate.expand': 'js/aebiz.validate.expand',
            'ajaxfileupload': 'js/ajaxfileupload',
            'OrderRefundService': 'js/OrderRefundService'
        }
    },
    headers: {
        'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, zh-Hans;q=0.7, zh-Hant;q=0.6, ja;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    route: {
        "Index": "/",
        "userCenter": "../usercenterindex/usercenter.html",
        "login": "sign?"+from,
        "reg": "applyAccount?from="+from,
        "forgetPass": '../forgetPass/forgetPass.html',
        "toBindRegist": '../register/toBindRegist.html',
        "cart": '/pages/cart/cart.html',
        "addProductToOrderKuyu": '/pages/addProductToOrderKuyu/addProductToOrderKuyu.html?title&secondParentCategoryName&skuNo&productId&buyNum&storeNote&submodelUuid&rushBuyBeginTime',
        "addProductToOrder": '../addProductToOrder/addProductToOrder.html',
        "perserveBuyKuyu": '/pages/perserveBuyKuyu/perserveBuyKuyu.html?productUuid&reserveOrderId&skuNo',
        "productInfo": '../productInfo/productInfo.html',
        "fastBuyLimitProduct": "../fastBuyLimitProduct/fastBuyLimitProduct.html?skuNo&promotionUuid&areaId",//秒杀
        "addaddress":"../addaddress/addaddress.html",
        "addinvoice":"../addinvoice/addinvoice.html",
        "aftersale":"../aftersale/aftersale.html",
        "afterSaleService":"../afterSaleService/afterSaleService.html",
        "bindThird":"../bindThird/bindThird.html",
        "bulkpurchase":"../bulkpurchase/bulkpurchase.html",
        "channel":"../channel/channel.html",
        "connectWithUs":"../connectWithUs/connectWithUs.html",
        "coupondetails":"../coupondetails/coupondetails.html",
        "customerServiceKuyu":"../customerServiceKuyu/customerServiceKuyu.html",
        "elinvoice":"../elinvoice/elinvoice.html",
        "fixpwd":"../fixpwd/fixpwd.html",
        "IntegralDetail":"../IntegralDetail/IntegralDetail.html",
        "limitProduct":"../limitProduct/limitProduct.html",
        "content":"../low/content.html",
        "manageuser":"../manageuser/manageuser.html",
        "orderDetail":"../orderDetail/orderDetail.html",
        "orderList":"../orderList/orderList.html",
        "PayAgainSuccess":"../PayAgainSuccess/PayAgainSuccess.html",
        "PayResult":"../PayResult/PayResult.html",
        "personal":"../personal/personal.html",
        "productappraise":"../productappraise/productappraise.html",
        "productDetail":"../productDetail/productDetail.html",
        "productfavorite":"../productfavorite/productfavorite.html",
        "producthistory":"../producthistory/producthistory.html",
        "productSoldOut":"../productSoldOut/productSoldOut.html",
        "register":"../register/register.html",
        "reserveorder":"../reserveorder/reserveorder.html",
        "search":"../search/search.html",
        "service":"../service/service.html",
        "toAppraise":"../toAppraise/toAppraise.html",
        "toOrderRefund":"../toOrderRefund/toOrderRefund.html",
        "usercenter":"../usercenterindex/usercenter.html",
        "userimg":"../userimg/userimg.html",
        "cloudLogin":"../cloudLogin/cloudLogin.html?msg",
        "regpurchaseSucc": "../regpurchase/regpurchaseSucc.html",
        "regpurchase": "../regpurchase/regpurchase.html",
        "newBulkpurchase": "../bulkpurchase/newBulkpurchase.html",
        "404": "../404/404.html"
    },
    version: '0.0.1',
})