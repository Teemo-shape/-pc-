/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/12/4
 */
define('KUYU.userInfo',['KUYU.Service',  'KUYU.Store'], function() {
    var $http = KUYU.Service,
        $Store = KUYU.Store;
    var getUserInfo = function (cb) {
        var userinfo = {}
        var token = localStorage.getItem('istaff_token') ? localStorage.getItem('istaff_token') : null;
        $path = window.location.origin;

        if(token!=null){
            $http.get({
                url: "/usercenter/tclcustomer/userInfo",
                data: {
                    ranNum: Math.floor(Math.random() * 10000)
                },
                headers:{
                    'ihome-token' : token,
                },
                success: function(data) {
                    if(data.code == CODEMAP.status.success) {
                        var user=JSON.stringify(data.data)
                        //返利info
                        // var fanliInfo = data.data.fanliInfo;
                        // if(data.data.userType == 'FANLI') {
                        //     var _d = JSON.parse(fanliInfo);
                        //     _d.platform = _d.platform || 1;
                        //     _d.s_id = _d.s_id || 1846;
                        //     $.cookie('fanliCookie', JSON.stringify(_d),{ expires: 30, path: '/' })
                        // }else{
                        //     $.removeCookie("fanliCookie", { path: '/' })
                        // }
                        sessionStorage.setItem("userinfo",user);
                    }else{
                        localStorage.removeItem('istaff_token');
                        $.removeCookie("istaff_token", { path: '/' })
                        // $.removeCookie("fanliCookie", { path: '/' })
                        window.location.href="/sign";
                        if(Array.of)console.warn(data)
                    };
                    cb(data)
                }
            })
        }else{
            window.location.href=$path+"/sign";
        }

    };
    _APP.inject('KUYU.userInfo', getUserInfo);
})
