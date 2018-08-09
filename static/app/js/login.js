require(['KUYU.Service', 'KUYU.plugins.alert', 'placeholder','KUYU.Store','base64','KUYU.userInfo'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        $getUserInfo=KUYU.userInfo
    _env = KUYU.Init.getEnv(),
        $param = KUYU.Init.getParam(),
        _sever = KUYU.Init.getService();
    var path = _sever[_env.sever];
    var UUID = $init.createUid();

    function getValidateCode(){
        $(".ImgCodeshow").eq(0).attr("src","/rest/login/staff/getImageValidateCode?img-key="+UUID);
    }

    $(function(){
        //获取验证码
        getValidateCode()
    })
    $(".J-Login").click(function(){
        var loginName =  $.trim($(".J-UserName").val());
        var loginPwd =  $.trim($(".J-PassWord").val());

        console.log(loginName);
        console.log(base64encode($init.createUid()).length);
        var ImgCode =$.trim($(".J-ImgCode").val());
        if(""== loginName){
           $(".J-UserLoginHint").html("账号不能为空");
            return
        }else{
            $(".J-UserLoginHint").html("");
        }
        if(""== loginPwd){
            $(".J-UserPassHint").html("密码不能为空");
            return
        }else{
            $(".J-UserPassHint").html("");
        }
         if(""== ImgCode){
            $(".J-ImgCodeHint").html("验证码不能为空");
            return
        }else{
            $(".J-ImgCodeHint").html("");
             $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
             $http.get({
                 url: "/login/staff/checkImageValidateCode?img-key="+UUID+"&captchadata="+ImgCode,
                 headers:{ 'platform' : ''},
                 success: function (res) {
                     if(res.code == 0) {
                         var postdata={};
                         loginName = base64encode(base64encode($init.createUid())+base64encode(String(loginName))+base64encode($init.createUid()));
                         loginPwd = base64encode(base64encode($init.createUid())+base64encode(String(loginPwd))+base64encode($init.createUid()));
                         postdata['loginName']=loginName;
                         postdata['pwd']=loginPwd;
                         $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
                         $http.post({
                             url:'/login/staff/login',
                             dataType:'json',
                             data:JSON.stringify(postdata),
                             success: function ( res ) {
                                 if(res.code== 0){

                                     $Store.set(res.token);
                                     if(localStorage) {
                                         localStorage.setItem('istaff_token', res.token);
                                     } else {
                                         Array.of ? console.warn("can't store") : '';
                                     }
                                     if($.cookie) {
                                         $.cookie('istaff_token',res.token, {
                                             expires: 1
                                         });
                                     } else {
                                         Array.of ? console.warn("can't store") : '';
                                     }

                                     $getUserInfo(res.token);
                                     Msg.Alert("","登录成功，正在跳转",function(){});
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
                                     window.location.href = "/"

                                 }else{
                                     if (res.code== '-9')
                                     {
                                         Msg.Alert("", "账号被冻结", function () {
                                         });
                                         UUID = $init.createUid();
                                         getValidateCode();
                                     }else {
                                         Msg.Alert("", "非员工账号或密码不正确", function () {
                                         });
                                         UUID = $init.createUid();
                                         getValidateCode();
                                     }
                                 }

                             }
                         })
                     }else{
                         $(".J-ImgCodeHint").html("验证码不正确");
                         UUID = $init.createUid();
                         getValidateCode();
                         return
                     }
                 }
             });

        }

    });

    $(".ImgCodeshow").click(function(){
        UUID = $init.createUid();
        getValidateCode()
    });


    $init.Ready(function (){

    });


});
