/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/12
 */
define('KUYU.Login',['KUYU.Service', 'Plugin', 'KUYU.Store', 'KUYU.Binder', 'base64'],function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $Store = KUYU.Store,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;
    var Login = {
        valid: function () {
            $("#loginForm").validate({ //验证表单
                rules: {
                    loginName: {
                        required: true
                    },
                    loginPwd: {
                        required: true
                    },
                    captchadata: {
                        required: true
                    }
                },
                messages: {
                    loginName: {
                        required: "请输入用户名！"
                    },
                    loginPwd: {
                        required: "请输入密码！"
                    },
                    captchadata: {
                        required: "请输入正确的验证码！"
                    }
                },
                errorClass: 'lable-tap', //输入错误时的提示标签类名
                submitHandler: function(form) {
                    Login.loginFunc();
                }
            });

        },
        getValidateCode: function () {

        },
        loginFunc: function() {
            var loginName = $("#loginName").val();
            var loginPwd = $("#loginPwd").val();
            var captchadata = $("#captchadata").val();
            var captchakey = $("#captchakey").val();
            var backUrl = $("#backUrl").val();
            var verifyCodeMsg = $("#verifyCodeMsg");
            var dvVerify = $(".dvVerify");
            loginName = base64encode(base64encode($init.createUid())+base64encode(String(loginName))+base64encode($init.createUid()))
            loginPwd = base64encode(base64encode($init.createUid())+base64encode(String(loginPwd))+base64encode($init.createUid()))
            var simpleDbCart = {};
            var carts = $Store.get('shoppingcart');
            if(carts) {
                var localData  = $Store.get('shoppingcart');
                var res = JSON.parse(localData);
                var list = res ? res.storeMap["03d03b6b05604c5cb065aef65b72972e"] : [];
                var cartNewMaps = {};
                var listMap = {};
                $.each(list, function (i , o) {
                    listMap[o.storeUuid] =  [];
                });
                $.each(list, function (i ,o ) {
                    if(listMap[o.storeUuid]) {
                        listMap[o.storeUuid].push(o)
                    }else{
                        listMap['03d03b6b05604c5cb065aef65b72972e'].push(o)
                    }
                })
                cartNewMaps["storeMap"] = listMap;
                simpleDbCart.storeMap= listMap
            } else {
                simpleDbCart.storeMap= {}
            }
            var _data  = {
                "loginName": loginName,
                "pwd": loginPwd,
                "captchadata": captchadata,
                "captchakey": captchakey,
                "backUrl": backUrl
            }
            $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
            $http.post({
                url:"/login/login",
                dataType:'json',
                data:JSON.stringify(_data),
                success: function (data) {
                    if(data.code == CODEMAP.status.success) {
                        $Store.set(data.token)
                        Login.mergeCart(simpleDbCart, data)
                        // $init.nextPage("Index",{})
                    }else if(data.code == CODEMAP.status.verifyCodeErr) {
                        $("#verifyCodeMsg").text("请输入正确的验证码");
                        dvVerify.css('display', 'block');
                        $("#imgcode").attr("src", data.url);
                        $("#captchakey").val(data.key);
                        Login.getValidateCode();
                    }else if(data.code == CODEMAP.status.reverifyCode) {
                        Login.getValidateCode();
                        $("#verifyCodeMsg").text("请输入正确的验证码");
                        $(".dvVerify").css('display', 'block');
                    }else if(data.code == CODEMAP.status.lock) {
                        Login.getValidateCode();
                        dvVerify.css('display', 'block');
                        $("#Msg").text("超过最大失败次数，已锁定");
                    }else if(data.code == 112) {
                        Login.getValidateCode();
                        dvVerify.css('display', 'block');
                        $("#Msg").text("该用户不存在，请重新输入");
                    }else if(data.code == 102) {
                        Login.getValidateCode();
                        dvVerify.css('display', 'block');
                        $("#Msg").text("该用户不符合规则，请重新输入");
                    }else{
                        Login.getValidateCode();
                        dvVerify.css('display', 'block');
                        $("#Msg").text("密码或用户名不正确");
                    }
                },
                error: function (res) {
                }
            });
        },
        mergeCart: function (simpleDbCart, data) {
            $http.post({
                url:'/login/mergeCart',
                data:JSON.stringify(simpleDbCart),
                success: function ( res ) {
                    if(res.code == CODEMAP.status.success) {
                        var result = data.data.injectSsoInfo;

                        $Store.remove('shoppingcart');

                        if (window._gsTracker) {
                            _gsTracker.track("/targetpage/loginOk");
                        }

                        if($Store.get('m18') == 1) {
                            $Store.set('m18',2);
                        }

                        var str = document.referrer;
                        var backUrl = $param.backUrl;
                        if(backUrl) {
                            window.location.href = backUrl;
                        }
                        if($param.from == 'unify') {
                           //console.log(base64encode(base64encode(loginMsg.token)))
                           var from = $param.url.indexOf('?')>0?$param.url.substring(0,$param.url.indexOf('?')): $param.url;
                           window.location.href = from;//+'?toMsg='+loginMsg.token;
                           return false;
                        }
                        if(str== "" || str.indexOf("login/login.html") > -1 || str.indexOf("fixpwd/fixpwd.html") > -1 || str.indexOf("register/register.html") > -1  ) {
                            if(window.location.href.indexOf("bulkpurchase/newBulkpurchase.html") > -1){
                                window.location.href = "../../pages/bulkpurchase/newBulkpurchase.html";
                            }else{
                                window.location.href = "../../pages/index/index.html";
                            }
                        }
                        else if(str.indexOf("cart/cart.html") > -1 && sessionStorage.getItem("order") =="order"){
                            window.location.href = "../../pages/orderList/orderList.html";
                        }
                        else if(str.indexOf("a.html") == -1){
                            if(window.location.href.indexOf("bulkpurchase/newBulkpurchase.html") > -1){
                                window.location.href = "../../pages/bulkpurchase/newBulkpurchase.html";
                            }else{
                                window.location.href = document.referrer;
                            }
                        }

                    }
                }
            })
        },
    };

    //消除提示
    function clear(){
    	$("input").focus(function(){
    		$('#verifyCodeMsg').text('');
            $('#Msg').text('');
    	})
    }
    clear()

    $scope.getValidateCode = Login.getValidateCode;

    $scope.goIndex = function () {
        $init.nextPage("Index", {})
    }
    $init.Ready(function(){
        $binder.init();
    });
    
    _APP.inject('KUYU.Login', Login);
});
