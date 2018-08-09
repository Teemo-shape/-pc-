/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/12/4
 */
define('KUYU.navHeader', ['KUYU.Service','KUYU.userInfo', 'KUYU.Binder', 'KUYU.navFooterLink'], function () {
    var userInfo = KUYU.userInfo,
        $scope = KUYU.RootScope,
        $init = KUYU.Init,
        navFooterLink = KUYU.navFooterLink,
        $http = KUYU.Service,
        $binder = KUYU.Binder;
        $init.cookie();
    navFooterLink()
    var navHeader = function (cb) {
        userInfo(function( res ) {
            if($.isFunction(cb)) cb(res);
            var data = res.data;
            // var tp = '<div class="order-operat">'
            //     +'    <p class="item"><a href="/pages/usercenterindex/usercenter.html">个人中心</a></p>'
            //     +'    <p class="item"><a href="/pages/productfavorite/productfavorite.html">我的收藏</a></p>'
            //     +'    <p class="item"><a href="/pages/manageuser/manageuser.html" target="_blank">账号管理</a></p>'
            //     +'    <p class="item"><a href="/pages/productappraise/productappraise.html">评价管理</a></p>'
            //     +'    <p class="item"><a id="exit" href="javascript:;">退出登录</a></p>'
            //     +'  </div>';

            // var html = '<div class="hea-box">'
            //             +'    <a href="/pages/index/index.html" class="logo"></a>'
            //             +'      '+(data && data.configTitle?data.configTitle:"我的购物车")+''
            //             +'</div>'
            //             +'<div class="fr">'
            //             +'    <div class="order-num"><span id="headerUserName">'+(data?data.customerName:"<a href='javascript:;' binder-event='click|navLogin'>登录</a> ")+'</span>'
            //             +'         '+(data?"<em class=arrow></em>":"")+''
            //             +'         '+(data?tp:"")+''
            //             +'    </div>'
            //             +'    <span class="order-num myorder"><a href="'+(data?"/pages/orderList/orderList.html":"{{login}}")+'">我的订单</a></span>'
            //             +'</div>';
            // $("#navHeader").html(html);
            $("#exit").on('click', function (){
                $http.get({
                    url: '/tclcustomer/logout',
                    success: function (data) {
                        if(data.code == CODEMAP.status.success || data.code == CODEMAP.status.TimeOut || data.code == 103) {
                            window.location.href = "../index/index.html"
                            localStorage.removeItem("CartNum");
                            localStorage.removeItem("istaff_token");
                            $.removeCookie("istaff_token", { path: '/' })
                            $.removeCookie("fanliCookie", { path: '/' })
                        }
                    }
                });
            })
            $binder.init();
            $scope.navLogin = function () {
                $init.nextPage("login",'')
            }
        });
    };
    _APP.inject('KUYU.navHeader', navHeader)
})