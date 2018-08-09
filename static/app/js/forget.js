require(['KUYU.Service', 'KUYU.plugins.alert', 'placeholder', 'KUYU.Store', 'base64'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        _env = KUYU.Init.getEnv(),
        $param = KUYU.Init.getParam(),
        _sever = KUYU.Init.getService();
    var path = _sever[_env.sever];
    var UUID = $init.createUid();
    var UUIDTwo = $init.createUid();
    var wayselect = "email";
    var loginName = "";
    var sendName = "";
    var password = "";
    var type = "2";
    var sendcode = true;
    var reg = /^1[3456789]\d{9}$/; // 手机号
    var regemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
    var imgCodechecked = false;
    var loginName = '';
    $(".J-GetImgCode").click(function() {
        getValidateCode()
    });
    $(".j-select-wap").click(function() {
        var getway = $("input[name='getway']:checked").val();
        wayselect = getway;
        if (getway == undefined) {
            Msg.Alert("", "请选择找回密码方式", function() {});
            return
        } else {
            $(".forget-step-one").eq(0).addClass("hide");
            $(".forget-step-two").eq(0).removeClass("hide");
            getValidateCode();
        }
        if (getway == "phone") {
            type = "1";
            for (var i = 0; i < $(".j-way").length; i++) {
                $(".j-way").eq(i).addClass('hide');
            }
            $(".j-phone").eq(0).removeClass('hide');
        }
        // if(getway=="workid"){
        //     for(var i=0;i<$(".j-way").length;i++){
        //         $(".j-way").eq(i).addClass('hide');
        //     }
        //     $(".j-workid").eq(0).removeClass('hide');
        // }
        if (getway == "email") {
            type = "2";
            for (var i = 0; i < $(".j-way").length; i++) {
                $(".j-way").eq(i).addClass('hide');
            }
            $(".j-email").eq(0).removeClass('hide');
        }
    });

    function emailChecked(loginName) {
        if (wayselect == "email") {
            if (!regemail.test(loginName)) {
                Msg.Alert("", "请输入正确的邮箱!", function() {});
                return
            }
        } else if (wayselect == "phone") {
            if (!reg.test(loginName)) {
                Msg.Alert("", "请输入正确的手机号!", function() {});
                return
            }
        }
    }
    //TCL集团邮箱第一次验证(失焦)
    $("#email").blur(function() {
            loginName = $.trim($("#" + wayselect).val());
            emailChecked(loginName)
        })
        // $("#captchadata").focus(function() {
        //     imgCodechecke()
        // })
        // $("#J-ImgCode").blur(function() {
        //     imgCodechecke()
        // })

    function imgCodechecke(callback) {
        var ImgCode = $.trim($("#J-ImgCode").val())
        if (ImgCode == "") {
            // Msg.Alert("", "请输入图型验证码!", function() {});
            callback && callback();
        } else {
            $http.get({
                url: "/login/staff/checkImageValidateCode?img-key=" + UUID + "&captchadata=" + ImgCode,
                headers: { 'platform': '' },
                success: function(res) {
                    if (res.code == 0) { //验证图形验证码
                        imgCodechecked = true;
                        callback && callback();
                    } else {
                        Msg.Alert("", "图型验证码不正确!", function() {
                            getValidateCode();
                        });
                        return
                    }
                }
            });
        }
    }
    $(".j-get-pass-code").click(function() {
        if (sendcode == false) {
            Msg.Alert("", "请稍等!", function() {});
            return
        }
        UUIDTwo = $init.createUid();
        var params = {};
        loginName = $.trim($("#" + wayselect).val());
        params['key'] = UUIDTwo;
        if (wayselect == "email") {
            if (!regemail.test(loginName)) {
                Msg.Alert("", "请输入正确的邮箱!", function() {});
                return false
            }
        } else if (wayselect == "phone") {
            if (!reg.test(loginName)) {
                Msg.Alert("", "请输入正确的手机号!", function() {});
                return false
            }
        }
        var checkParams = {};
        checkParams['username'] = loginName;
        checkParams['type'] = type;
        $init.getHeaders()['Content-Type'] = 'application/x-www-form-urlencoded';

        $http.get({
            url: "/login/staff/checkMailOrPhoneExistPsw",
            dataType: 'json',
            data: checkParams,
            success: function(res) {
                if (res.code == 0) {
                    if (!$('.j-code-msg').hasClass('hide')) {
                        imgCodechecke(function() {
                            if (!imgCodechecked) {
                                Msg.Alert("", '请输入正确的图片验证码！！', function() {});
                                return false;
                            } else {
                                sendMsgToPhoneOrEmail();
                            }
                        });
                    } else {
                        sendMsgToPhoneOrEmail()
                    }
                } else {
                    Msg.Alert("", res.message || res.msg, function() {});
                }
            }
        });

    });

    function sendMsgToPhoneOrEmail() {
        var data = {
            key: UUIDTwo,
            userName: loginName,
            type: type,
            fromType: 3,
            inputCode: $.trim($("#J-ImgCode").val()),
            inputCodeKey: UUID
        }
        $http.post({
            url: "/login/staff/sendMsgToPhoneOrEmail",
            headers: { 'platform': '', 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data,
            success: function(res) {
                if (res.code == 0) {
                    // $('.j-code-msg').addClass('hide');
                    sendName = loginName;
                    var timeHTML = $(".j-get-pass-code");
                    settime(timeHTML);
                } else {
                    $('.j-code-msg').removeClass('hide');
                    $('#J-ImgCode').focus();
                    if (res.code != '-23') {
                        Msg.Alert("", res.message || res.msg, function() {});
                    }
                }
            }
        });
    }
    $(".j-forget-info").click(function() {
        loginName = $.trim($("#" + wayselect).val());
        var ImgCode = $.trim($("#J-ImgCode").val());
        var checkCode = $.trim($("#captchadata").val());
        if (wayselect == "email") {
            if (!regemail.test(loginName)) {
                Msg.Alert("", "请输入正确的邮箱!", function() {});
                return
            }
        } else if (wayselect == "phone") {
            if (!reg.test(loginName)) {
                Msg.Alert("", "请输入正确的手机号!", function() {});
                return
            }
        }
        if (sendName == loginName) {
            var paramsTwo = {};
            paramsTwo['userName'] = $.trim($("#" + wayselect).val());
            paramsTwo['type'] = type;
            paramsTwo['inputCode'] = checkCode;
            paramsTwo['fromType'] = 3;
            paramsTwo['key'] = UUIDTwo;
            $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
            $http.get({
                url: "/login/staff/checkValidateCode",
                headers: { 'platform': '' },
                data: paramsTwo,
                dataType: 'json',
                success: function(res) {
                    if (res.code == 0) {
                        if (checkpassword()) {
                            var username = $.trim($("#" + wayselect).val());
                            var password = $.trim($('#pswone').val());
                            var params = {};
                            params['password'] = base64encode(base64encode($init.createUid()) + base64encode(String(password)) + base64encode($init.createUid()));
                            params['username'] = base64encode(base64encode($init.createUid()) + base64encode(String(username)) + base64encode($init.createUid()));
                            params['type'] = type;
                            $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
                            $http.get({
                                url: "/login/staff/savePassword",
                                dataType: 'json',
                                data: params,
                                success: function(res) {
                                    if (res.code == 0) {
                                        // Msg.Alert("","修改密码成功!",function(){
                                        //     window.location.href = "/sign";
                                        // });
                                        // setTimeout(function(){
                                        //     window.location.href = "/sign";
                                        // },3000)
                                        $(".forget-step-two").addClass("hide");
                                        $(".forget-succ").removeClass("hide");
                                        $(".title").html("找回成功");
                                        //自动登录下
                                        var loginParams = {};
                                        loginParams['loginName'] = params.username;
                                        loginParams['pwd'] = params.password;
                                        $http.post({
                                            url: "/login/staff/login",
                                            // headers:{ 'platform' : '','ihome-token':'1111'},
                                            dataType: 'json',
                                            data: JSON.stringify(loginParams),
                                            success: function(res) {
                                                if (res.code == 0) {
                                                    $Store.set(res.token);
                                                    if (localStorage) {
                                                        localStorage.setItem('istaff_token', res.token);
                                                    } else {
                                                        Array.of ? console.warn("can't store") : '';
                                                    }
                                                    if ($.cookie) {
                                                        $.cookie('istaff_token', res.token, {
                                                            expires: 1
                                                        });
                                                    } else {
                                                        Array.of ? console.warn("can't store") : '';
                                                    }
                                                    $(".applyDetailInfo").addClass("hide");
                                                    $(".forget-succ").removeClass("hide");
                                                    $(".title").html("忘记密码")
                                                } else {
                                                    Msg.Alert("", res.msg, function() {});
                                                }
                                            }
                                        });
                                    } else {
                                        Msg.Alert("", res.msg, function() {});
                                    }
                                }
                            });
                        }
                    } else {
                        Msg.Alert("", "短信验证码不正确!", function() {});
                        return
                    }
                }
            });
        } else {
            Msg.Alert("", "短信验证码不正确!", function() {});
            return
        }
    });

    $(".j-select-apply-way").click(function() {
        wayselect = $(this).attr("data-rela");
        var id = $(this).attr("data-rela");

        if (id == "phone") {
            type = 1;
            for (var i = 0; i < $(".j-way").length; i++) {
                $(".j-way").eq(i).addClass('hide');
            }
            $(".j-phone").eq(0).removeClass('hide');
        }
        // if(id=="workid"){
        //     for(var i=0;i<$(".j-way").length;i++){
        //         $(".j-way").eq(i).addClass('hide');
        //     }
        //     $(".j-workid").eq(0).removeClass('hide');
        // }
        if (id == "email") {
            type = "2";
            for (var i = 0; i < $(".j-way").length; i++) {
                $(".j-way").eq(i).addClass('hide');
            }
            $(".j-email").eq(0).removeClass('hide');
        }
    })

    function getValidateCode() {
        UUID = $init.createUid();
        $("#imgcode").eq(0).attr("src", "/rest/login/staff/getImageValidateCode?img-key=" + UUID);
    }
    $(".imgcode").click(function() {
        UUID = $init.createUid();
        getValidateCode()
    });
    //重新发送验证码
    var countdown = 60; //设置倒计时
    function settime(val) {
        if (countdown == 0) {
            sendcode = true;
            val.html("重新发送验证码");
            countdown = 60;
            $("#validateCode").val("");
            return false;
        } else {
            sendcode = false
            val.html("重新发送(" + countdown + ")");
            countdown--;
            setTimeout(function() {
                settime(val)
            }, 1000);
        }
    }
    //
    //     //检查密码
    function checkpassword() {
        var reg1 = /^[0-9]+$/; // 只有数字
        var reg2 = /^[a-zA-Z]+$/; // 只有母字
        var reg3 = /^[~!@#$%^&*?]+$/; //只有特殊字符
        var reg4 = /^.{8,}$/; //长度不少于8位
        var reg3 = /^.{8,16}$/;
        var reg5 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        password = $.trim($('#pswone').val());
        if ("" == $.trim(password)) {
            Msg.Alert("", "请输入密码!", function() {});
            return false;
        }
        if (reg5.test(password)) {
            Msg.Alert("", "密码格式错误，不能含有特殊字符!", function() {});
            return false;
        }
        if ((reg1.test(password)) || (reg2.test(password)) || (!reg3.test(password)) || (!(reg4.test(password)))) {
            Msg.Alert("", "密码不能全是数字或全是字母，长度不能少于8位!", function() {});
            return false;
        } else {
            if (checkpass()) {
                return true
            } else {
                return false
            }
        }

    }
    //再次输入密码
    function checkpass() {
        var pass = $('#pswone').val();
        password = $('#pswtwo').val();
        if ("" == $.trim(pass)) {
            Msg.Alert("", "请再次输入密码!", function() {});
            return false;
        }
        if (pass != password) {
            Msg.Alert("", "两次输入的密码不一样，请重新输入", function() {});
            return false;
        }
        return true;
    };

});