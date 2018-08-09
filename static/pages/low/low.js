/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/12/17
 */
require([ 'Plugin','KUYU.Store','KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.SlideBarLogin' ,'KUYU.Binder','KUYU.navHeader', 'KUYU.navFooterLink'],function() {
    var Store = KUYU.Store,
        $http = KUYU.Service,
        $init = KUYU.Init,
        navHeader = KUYU.navHeader,
        navFooterLink = KUYU.navFooterLink,
        slidBarLogin = KUYU.SlideBarLogin,
        $binder = KUYU.Binder,
        $scope = KUYU.RootScope,
        Header = KUYU.HeaderTwo,
        cartData = null,
        cartMap = {};

    //设置头部导航, nvaHeader(cb), 回调参数包含是否登录信息
    navHeader(function (res) {
        if (res.code == CODEMAP.status.success) {

        } else {

        }
    });


    Header.menuHover();
    Header.topSearch();

    // 页脚
    navFooterLink()
});