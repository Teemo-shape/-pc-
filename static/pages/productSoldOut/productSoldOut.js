/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/14
 */
require(['KUYU.Service', 'KUYU.HeaderTwo','KUYU.navFooterLink', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'KUYU.Store'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        Map = $init.Map(),
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
         path = _sever[_env.sever],
        $scope = KUYU.RootScope;
        $header.menuHover();
        $header.topSearch();
        navFooterLink();

        $(function(){
            //取上个页面的title
            var title = sessionStorage.getItem("title");
            if(title &&  title !='undefined'){
                title = JSON.parse(title)
                $("head title").html(title);
            }

            function run(){
                var s = $("#time").text();
                if(s == 0){
                    window.location.href='/';
                    return false;
                }
                $("#time").text(s * 1 - 1);
            }
            window.setInterval(run, 1000);

        })





});