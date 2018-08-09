/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/7
 */
define('KUYU.SlideBarLogin', ['KUYU.Service', 'KUYU.Binder', 'KUYU.Store', 'KUYU.userInfo', 'juicer', 'placeholder','base64'], function () {
    var $http = KUYU.Service,
        $scope = KUYU.RootScope,
        $binder = KUYU.Binder,
        getUserInfo = KUYU.userInfo,
        $init = KUYU.Init,
        _env = KUYU.Init.getEnv(),
        $Store = KUYU.Store,
        $param = KUYU.Init.getParam(),
        _sever = KUYU.Init.getService();
        $init.cookie()
    //var path = window.location.origin;
    var path ;
    if ( window.location.port ) {
        path = window.location.protocol + "//" + window.location.hostname  + ":"  +window.location.port;
    }else {
        path = window.location.protocol + "//" + window.location.hostname
    }
    var slideBarLogin = {

    }
    _APP.inject('KUYU.SlideBarLogin', slideBarLogin);
});
