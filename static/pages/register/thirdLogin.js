/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/16
 */
require(['KUYU.Binder', 'KUYU.Service','KUYU.HeaderTwo', 'Plugin', 'KUYU.plugins.alert'], function () {

    var $binder = KUYU.Binder,
        urlparam = KUYU.Init.getParam("detail"),
        $http = KUYU.Service,
        $init = KUYU.Init,
        $scope = KUYU.RootScope,
        UUID = $init.createUid(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        $param = KUYU.Init.getParam(),
        path = _sever[_env.sever];
        getparam = JSON?JSON.parse(urlparam.detail):(new Function("return" + urlparam.detail))();

    var secondParams = {};

    var tab = function () {
        var li = $(".y_logintab li"),
            y_tabpane = $(".y_tabpane ");
        $.each(li, function (i, o) {
            $(this).on("click", function () {
                li.removeClass("active");
                $(this).addClass("active");
                y_tabpane.hide();
                y_tabpane.eq(i).show()
            })

        })
    }

    var sp = {
        userName: false,
        message: false,
        passWd: false,
        passWdrepeat: false,
        code: false,
        hasUser: false,
        checkpass: false,
        type:null
    }
// :获取本地验证码
function getLocalCaptchaCodecont22() {
    var uuid = UUID+Math.random();
    secondParams.captchakey = uuid;
    $("#cont_code_img2").eq(0).attr("src",  path+"/getCustomerRegCode?img-key="+ uuid +'&'+Math.random()).show();
};
KUYU.getLocalCaptchaCodecont22 = getLocalCaptchaCodecont22;
    function sendMessagetoPhoneOrEmail() {
        var username=$('#phone').val();
        //发送验证码
        var type="";
        if(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(username)){
            type="3";  //手机
            sp.type = 3;
        }else{
            type="2";  //邮箱
            sp.type = 2;
        }
        $('#type').val(type);
        if(type=='2'){
            $("#messageOrEmail").html("一封验证邮件");
            $('#phoneoremail').html("邮箱+"+username);
            $("#msgOrEmail").html("邮件");
        }else if(type=='3'){
            $("#messageOrEmail").html("一条验证短信");
            $('#phoneoremail').html("手机+"+username);
            $("#msgOrEmail").html("短信");
        }
        $http.post({
            url :'/tclcustomerregist/sendMessagetoPhoneOrEmail',
            async: false,
            data : {
                username:username,
                type:type,
                "img-key": UUID,
                "captchakey": secondParams.captchakey,
                "captchadata": secondParams.captchadata,
            },
            success : function(data) {
                if(data.code == 0) {
                    $("#alertcodeerror").html("<span class='prompt-img'></span>验证码已发送，请等待").show();
                    $('.y_codets').css('display','block');
                    $("#codeerror").hide();
                    secondParams.flag = true;
                    sp.message = true;
                    thridBind.settime(val)
                }else{
                    $("#alertcodeerror").html("<span class='prompt-img'></span>"+data.msg).show();
                    secondParams.flag = 'false';
                    sp.message = false;
                }
            }
        });
    }

    var thridBind = {
        checkUserName: function (cb) {
            //拷贝于旧代码
            var username =$("#phone").val();
            if(!username){
                $('.phoneerror').html("<span class='prompt-img'></span>请输入邮箱/手机号");
                $('.phoneerror').show();
            }
            var reg = /^1[3456789]\d{9}$/; // 手机号
            var regemail=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱
            if(!(reg.test(username))&&!(regemail.test(username))){
                $('.phoneerror').html("<span class='prompt-img'></span>邮箱/手机号格式不正确");
                $('.phoneerror').show();
                checkphoneR= false;
                return false;
            }else{
                $('.phoneerror').hide();
            }
            $http.post({
                type : 'POST',
                url :'/tclcustomerregist/checkusername',
                data : {
                    username:username
                },
                success : function(data) {
                    // 存在用户名
                    if(data.code == '1'){
                        $('.phoneerror').html("<span class='prompt-img'></span>邮箱/手机号已被注册，请重新输入或直接绑定");
                        $('.phoneerror').show();
                        sp.userName =  false;
                        return false;
                    }else{
                        if(cb) {
                            cb();
                        }
                        $('.phoneerror').hide();
                        sp.userName =  true;
                        return true;
                    }
                }
            });
        },
        getMessage: function (e){
            val	= e;
            //拷贝于旧代码
            thridBind.checkUserName(function () {
                $(".m_backdrop,.cover_code").addClass("in");
                var vadliboxtu = $(".vadliboxtu");
                vadliboxtu.show();
                var doms = "<div class='alertValidBox'><input type='text' id='validCode2' style='height: 55px;border: 1px solid #999;padding: 5px;' placeholder='输入验证码' ><img style='width: 152px;height: 55px;border: 1px solid #999;border-left: 0;' onclick='KUYU.getLocalCaptchaCodecont22()'  id='cont_code_img2' src=''/><p id='alertcodeerror' style='color: red; display: none; text-align: left; margin-left: 25px;'>验证码不能为空</p></div>"
                Msg.Confirm('', doms, function () {
                    var dom = $("#validCode2");
                    secondParams.captchadata = dom.val();

                    sendMessagetoPhoneOrEmail();

                    return secondParams.flag;
                });
                getLocalCaptchaCodecont22();
            })

        },
        checkpassword: function(){
           var reg1 = /^[0-9]+$/; // 只有数字
			var reg2 = /^[a-zA-Z]+$/; // 只有母字
			var reg3=/^[~!@#$%^&*?]+$/;  //只有特殊字符
			var reg4=/^.{8,}$/;  //长度不少于8位
            var password=$('#password').val();
            if((reg1.test(password))||(reg2.test(password))||(reg3.test(password))||(!(reg4.test(password)))) {
			$('.pserror').html("密码不能全是数字或全是字母，长度不能少于8位")
                            .attr("style","color:red;")
                            .show();
                sp.passWd = false;
			} else {
				 $('.pserror').hide();
	                sp.passWd = true;
			}
        },
        checkCode: function(e){
            var validateCode = $("#validateCode").val();
            var username=$('#phone').val(),
                codeerror = $("#codeerror")
            if(!validateCode){
                codeerror.html("请输入验证码");
                codeerror.show();
                sp.code= false;
                return false;
            } else {
                $http.post({
                    url :'/tclcustomerregist/checkValidateCode',
                    data : {
                        "inputcode":validateCode,
                        "phoneOrEmail":username,
                        "ranNum":Math.random(),
                        "img-key":UUID
                    },
                    success : function(data) {
                        console.log(data)
                        if (data.code == CODEMAP.status.success) {
                            codeerror.hide();
                            sp.code= true;
                        }
                        else{
                            codeerror.html("验证码输入错误，请重新输入");
                            codeerror.show();
                            sp.code= false;
                        }
                    }
                });
            }
        },
        checkagainp: function () {
            var againp=$('#password').val()?$('#password').val().trim():undefined;
            var password=$('#repPassWd').val();
            if(!againp){
                $('#apserror').html("请输入确认密码");
                $('#apserror').show();
                $('#apserror').attr("style","color:red;");
                sp.passWdrepeat = false;
            }else if(againp!=password){
                $('#apserror').html("两次输入不一样，请检查后输入");
                $('#apserror').show();
                $('#apserror').attr("style","color:red;");
                sp.passWdrepeat = false;
            }else{
                $('#apserror').html("");
                $('#apserror').hide();
                sp.passWdrepeat = true;
            }
        },
        settime: function(val) {
            var shade = $("#shade")
            var tim = 60;
            var timer = setInterval(function () {
                tim --;
                if(tim <= 0) {
                    clearInterval(timer)
                    shade.css("zIndex","-1");
                    $(".codeerror").hide();
                    val.innerHTML = "获取验证码";
                }else {
                    shade.css("zIndex","1")
                    val.innerHTML =  tim + '秒后重新发送';
                }
            },1000)
        }
    }
    //注册
    $scope.register = function () {
        if(!sp.userName && !sp.code) {
            thridBind.checkUserName()
            thridBind.checkCode()
        }
        if(sp.userName && sp.message && sp.passWd && sp.passWdrepeat && sp.code) {
            var _data = {
                "type": sp.type,
                "platformId": getparam.user.thirdUser.platformId,
                "thirdPartyId": getparam.user.thirdUser.thirdPartyId,
                "thirdPartyNickname": getparam.user.thirdUser.thirdPartyNickname,
                "token": getparam.token,
                "phone": $("#phone").val(),
                "key": UUID,
                "code": $("#validateCode").val() ,
                "password": $('#password').val()
            }
            $http.post({
                url: '/tclcustomer/toBindRegist',
                data:_data,
                success: function (data) {
                    if(data.code == CODEMAP.status.success ) {
                        $init.nextPage("toBindRegist",{})
                    } else {
                        plugin.Alert("绑定失败",{}, function() { });
                    }
                }
            })
        }
    }

    //立即登录检查用户名
     function checkuser(e) {
        var user=$("#checkuser").val(),
            uerror = $('.uerror');
         if(!user){
            uerror.text("请输入用户名");
            uerror.show();
            return;
        }else {
            uerror.hide();
        }
        $http.post({
            url :'/tclcustomerregist/checkusername',
            async:false,
            data : {
                username:user
            },
            success : function(data) {
                // 存在用户名
                if(data.code == '1' ){  //0表示没被占用，1表示被占用
                    uerror.hide();
                    sp.hasUser = true;
                }else{
                    uerror.html("输入的用户不存在，请重新输入");
                    uerror.show();
                    sp.hasUser = false;
                }
            }
        });
    }
    $scope.checkuser = checkuser;
    $scope.checkpass = function (e) {
        var password = $(e).val().trim(),
            uperror  = $('.uperror');
        if(!password){
            uperror.text("请输入密码");
            uperror.show();
            sp.checkpass = false;
        }else{
            uperror.hide();
            sp.checkpass = true;
        }
    }
    //立即绑定
    $scope.loginbindbut = function () {
        if(!sp.hasUser) checkuser();
        if(sp.hasUser && sp.checkpass) {
            var _data = {
                "platformId": getparam.user.thirdUser.platformId,
                "thirdPartyId": getparam.user.thirdUser.thirdPartyId,
                "token": getparam.token,
                "phone": $("#checkuser").val(),
                "password": $('#checkpass').val()
            }
            $http.post({
                url: '/tclcustomer/toBind',
                data:_data,
                success: function (data) {
                    if(data.code == CODEMAP.status.success) {
                        $init.nextPage("toBindRegist",{})
                    }else{
                        plugin.Alert("绑定失败"+data.msg,{}, function() { });
                    }
                }
            })
        }
    }

    $scope.checkUserName = thridBind.checkUserName;
    $scope.getMessage = thridBind.getMessage;
    $scope.checkpassword = thridBind.checkpassword;
    $scope.checkCode = thridBind.checkCode;
    $scope.checkagainp = thridBind.checkagainp;
    tab();

})
