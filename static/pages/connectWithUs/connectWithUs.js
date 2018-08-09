/*
 * author: linxiaohu
 * data: 2016-12-08
 * */
require(['KUYU.Service', 'KUYU.HeaderTwo','KUYU.SlideBarLogin','KUYU.navFooterLink'],function(){
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        Map = $init.Map(),
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        path = _sever[_env.sever],
        $scope = KUYU.RootScope,
        slidBarLogin = KUYU.SlideBarLogin,
        navFooterLink = KUYU.navFooterLink;
    $header.menuHover();
    $header.topSearch();
    navFooterLink();
})