require(['KUYU.Service', 'KUYU.plugins.alert', 'placeholder', 'KUYU.Store', 'base64'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        _env = KUYU.Init.getEnv(),
        $param = KUYU.Init.getParam(),
        _sever = KUYU.Init.getService();
    var path = _sever[_env.sever];
    var test = true;
    var imgCodechecked = false;
    var UUID = "";
    var wayselect = "email";
    var loginName = "";
    var sendName1 = "";
    var sendName2 = "";
    var password = "";
    var type = 2;
    var sendcode = true;
    var sendcodetwo = true;
    var UUIDTwo = $init.createUid(); //账号验证用的
    var UUIDThree = $init.createUid(); //个人信息用的
    var UUIDSend = "";
    var UUIDSendTwo = "";
    var reg = /^1[3456789]\d{9}$/; // 手机号
    var regemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
    var isFirst = false;
    var truephone = '';
    var userName1 = '';
    $(".j-get-pass-code").click(function() {
        getValidatePassCode();
    });
    $(".j-get-pass-code-two").click(function() {
        getValidatePassCodeTwo();
    });
    $('.j-agree-apply').click(function(e) {
        if ($('.j-agree-apply').is(':checked')) {
            $('.j-checkinfo.buy').css('background-color', 'red')
        } else {
            $('.j-checkinfo.buy').css('background-color', '#b1b0b0')
        }
    })

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

    function imgCodechecke(a, callback) {
        var ImgCode = '';
        if (a == 1) {
            ImgCode = $.trim($(".J-ImgCode").eq(0).val());
        } else if (a == 2) {
            ImgCode = $.trim($(".J-ImgCode").eq(1).val());
        } else {
            ImgCode = $.trim($(".J-ImgCode").eq(0).val());
        }
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
                    }
                }
            });
        }
    }

    $(".j-checkinfo").click(function() {
        loginName = $.trim($("#" + wayselect).val());
        var ImgCode = $.trim($(".J-ImgCode").eq(1).val());
        var checkCode = $.trim($("#captchadata").val());
        if ($('.j-agree-apply').is(':checked')) {
            emailChecked(loginName)
            if (test) {
                if (checkCode !== "") {
                    var paramsTwo = {};
                    paramsTwo['userName'] = $.trim($("#" + wayselect).val());
                    paramsTwo['key'] = UUIDTwo;
                    paramsTwo['inputCode'] = checkCode;
                    paramsTwo['fromType'] = 1;
                    $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
                    $http.get({ //验证手机 or email 码
                        url: "/login/staff/checkValidateCode",
                        headers: { 'platform': '' },
                        dataType: 'json',
                        data: paramsTwo,
                        success: function(res) {
                            if (res.code == "0") {
                                getValidateCode();
                                if (!$('.j-agree-apply').is(':checked')) {
                                    Msg.Alert("", "请勾选服务协议!", function() {});
                                    return
                                };
                                if (checkpassword()) {
                                    //个人信息确认
                                    $(".applyBase").addClass('hide');
                                    $(".applyDetailInfo").removeClass('hide');
                                    if (type == 1) {
                                        $(".j-user-phone").addClass('hide');
                                    }
                                    $(".title").html("个人信息");
                                    imgCodechecked = false;
                                    $(".j-comfrim-info").click(function() {
                                        collectInfo();
                                    });
                                }
                            } else {
                                Msg.Alert("", res.msg, function() {});
                                return
                            }
                        }
                    });
                } else {
                    Msg.Alert("", "请输入验证码!", function() {});
                }
            }
        } else {
            if (checkpassword()) {
                //个人信息确认
                $(".applyBase").addClass('hide');
                $(".applyDetailInfo").removeClass('hide');
                if (type == 1) {
                    $(".j-user-phone").addClass('hide');
                }
                $(".title").html("个人信息");
                $(".j-comfrim-info").click(function() {
                    collectInfo();
                });
            }
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
            type = 2;
            for (var i = 0; i < $(".j-way").length; i++) {
                $(".j-way").eq(i).addClass('hide');
            }
            $(".j-email").eq(0).removeClass('hide');
        }
    })

    function getValidateCode() {
        UUID = $init.createUid();
        $(".imgcode").attr("src", "/rest/login/staff/getImageValidateCode?img-key=" + UUID);
    }
    $(".imgcode").click(function() {
        UUID = $init.createUid();
        getValidateCode()
    });

    $(".j-cTip").click(function() {
        $("#mask-ele").removeClass("hide");
        $("body").css("overflow", "hidden");
        $(".J-Agreement").removeClass("hide");
    });
    $(".J-ProtocolClose").click(function() {
        $("#mask-ele").addClass("hide");
        $("body").css("overflow", "auto");
        $(".J-Agreement").addClass("hide");
    });
    $("#mask-ele").click(function() {
        $("#mask-ele").addClass("hide");
        $("body").css("overflow", "auto");
        $(".J-Agreement").addClass("hide");
    });
    $(".J-ProtocolSubmit").click(function() {
        $("#mask-ele").addClass("hide");
        $("body").css("overflow", "auto");
        $(".J-Agreement").addClass("hide");
        $(".j-agree-apply").attr('checked', true);
        $('.j-checkinfo.buy').css('background-color', 'red')
    });

    //重新发送验证码
    var countdown = 60; //设置倒计时
    function settime(val) {
        if (countdown == 0) {
            val.removeAttribute("disabled");
            val.value = "重新发送验证码";
            countdown = 60;
            $("#validateCode").val("");
            getLocalCaptchaCodecont();
            return false;
        } else {
            val.setAttribute("disabled", true);
            val.value = "重新发送(" + countdown + ")";
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
        password = $('#pswone').val();
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

    function collectInfo() {
        var username = loginName;
        var realName = $.trim($("#truename").val());
        var mobile = $.trim($("#truephone").val());
        var password = $.trim($("#pswone").val());
        var companyName = $.trim($("#truecompany").val());
        var departmentName = $.trim($("#department").val());
        var params = {};

        if ("" == realName) {
            Msg.Alert("", "真实姓名不能为空!", function() {});
            return
        }
        if (type == 2) {
            if (!reg.test(mobile)) {
                Msg.Alert("", "请输入正确的手机号!", function() {});
                return
            }
        }
        if ("" == companyName) {
            Msg.Alert("", "公司名称不能为空!", function() {});
            return
        }
        if ("" == departmentName) {
            Msg.Alert("", "部门名称不能为空!", function() {});
            return
        }
        if (mobile != userName1) {
            Msg.Alert("", "更换了手机号，请重新获取验证码", function() {});
            return
        }
        params['type'] = type;
        params['username'] = base64encode(base64encode($init.createUid()) + base64encode(String(username)) + base64encode($init.createUid()));
        params['realName'] = realName;
        params['password'] = base64encode(base64encode($init.createUid()) + base64encode(String(password)) + base64encode($init.createUid()));
        params['mobile'] = mobile;
        params['companyName'] = companyName;
        params['departmentName'] = departmentName;

        if (type == 2) {
            var checkCode2 = $.trim($("#captchakeytwo").val());
            var paramsTwo = {};
            paramsTwo['userName'] = $.trim($("#truephone").val());
            paramsTwo['key'] = UUIDSendTwo;
            paramsTwo['inputCode'] = checkCode2;
            paramsTwo['fromType'] = 2;
            $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
            $http.get({ //验证手机码
                url: "/login/staff/checkValidateCode",
                headers: { 'platform': '' },
                dataType: 'json',
                data: paramsTwo,
                success: function(res) {
                    if (res.code == "0") {
                        applyAccountAndModifyCustomerInfo(params);
                    } else {
                        Msg.Alert("", res.msg, function() {});
                    }
                }
            });
        } else {
            applyAccountAndModifyCustomerInfo(params);
        }

    }

    function applyAccountAndModifyCustomerInfo(params) {
        $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
        $http.post({
            url: "/login/staff/applyAccountAndModifyCustomerInfo",
            // headers:{ 'platform' : '','ihome-token':'1111'},
            dataType: 'json',
            data: JSON.stringify(params),
            success: function(res) {
                if (res.code == 0) {
                    // Msg.Alert("",res.msg+"!",function(){
                    //    window.location.href = "/sign";
                    // });
                    // setTimeout(function(){
                    //    window.location.href = "/sign";
                    // },3000)
                    //自动登录
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
                                $(".title").html("账号申请")
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
    //重新发送验证码
    var countdown = 60; //设置倒计时
    function settime(val) {
        if (countdown == 0) {
            sendcode = true;
            val.html("重新发送验证码");
            countdown = 60;
            //   $("#validateCode").val("");
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
    //重新发送验证码
    var countdowntwo = 60; //设置倒计时
    function settimetwo(val) {
        if (countdowntwo == 0) {
            sendcodetwo = true;
            val.html("重新发送验证码");
            countdowntwo = 60;
            // $("#validateCode").val("");
            return false;
        } else {
            sendcodetwo = false
            val.html("重新发送(" + countdowntwo + ")");
            countdowntwo--;
            setTimeout(function() {
                settimetwo(val)
            }, 1000);
        }
    }

    function getValidatePassCode() {
        if (sendcode == false) {
            Msg.Alert("", "请稍等!", function() {});
            return
        }
        UUIDTwo = $init.createUid();
        var params = {};
        var loginName = $.trim($("#" + wayselect).val());
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
        checkParams["username"] = loginName;
        checkParams["type"] = type;
        // $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
        if (isFirst) {
            return;
        }
        isFirst = true;
        $http.get({
            url: "/login/staff/checkMailOrPhoneExistApply",
            dataType: 'json',
            data: checkParams,
            success: function(res) {
                isFirst = false;
                if (res.code == 0) {
                    if (!$('.j-code-msg').eq(0).hasClass('hide')) {
                        imgCodechecke(1, function() {
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
                    Msg.Alert("", res.msg || res.message, function() {});
                }
            }
        });
    }

    function sendMsgToPhoneOrEmail() {
        var data = {
            key: UUIDTwo,
            userName: $.trim($("#" + wayselect).val()),
            type: type,
            fromType: 1,
            inputCode: $.trim($(".J-ImgCode").eq(0).val()),
            inputCodeKey: UUID
        }
        if (isFirst) {
            return;
        }
        isFirst = true;
        $http.get({
            url: "/login/staff/sendMsgToPhoneOrEmail",
            dataType: 'json',
            data: data,
            headers: { 'platform': '' },
            success: function(res) {
                UUIDSend = UUIDTwo;
                isFirst = false;
                if (res.code == 0) {
                    sendName1 = loginName;
                    var timeHTML = $(".j-get-pass-code");
                    settime(timeHTML);
                } else {
                    $('.j-code-msg').eq(0).removeClass('hide');
                    getValidateCode();
                    $('.J-ImgCode').eq(0).focus();
                    if (res.code != '-23') {
                        Msg.Alert("", res.message || res.msg, function() {});
                    }
                }
            }
        });
    }

    function sendMsgToPhoneOrEmail2() {
        userName1 = $('#truephone').val();
        var params = {
            key: UUIDThree,
            userName: userName1,
            type: 1,
            fromType: 2,
            inputCode: $.trim($(".J-ImgCode").eq(1).val()),
            inputCodeKey: UUID
        }
        $http.get({
            url: "/login/staff/sendMsgToPhoneOrEmail",
            dataType: 'json',
            data: params,
            headers: { 'platform': '' },
            success: function(res) {
                UUIDSendTwo = UUIDThree;
                if (res.code == 0) {
                    sendName2 = truephone;
                    var timeHTML = $(".j-get-pass-code-two");
                    settimetwo(timeHTML);
                } else {
                    $('.j-code-msg').eq(1).removeClass('hide');
                    getValidateCode();
                    $('.J-ImgCode').eq(1).focus();
                    if (res.code != '-23') {
                        Msg.Alert("", res.message || res.msg, function() {});
                    }
                }
            }
        });

    }

    function getValidatePassCodeTwo() {
        if (sendcodetwo == false) {
            Msg.Alert("", "请稍等!", function() {});
            return
        }
        UUIDThree = $init.createUid();
        var params = {};
        truephone = $.trim($("#truephone").val());
        if (!reg.test(truephone)) {
            Msg.Alert("", "请输入正确的手机号!", function() {});
            return false
        }

        if (!$('.j-code-msg').eq(1).hasClass('hide')) {
            imgCodechecke(2, function() {
                if (!imgCodechecked) {
                    Msg.Alert("", '请输入正确的图片验证码！！', function() {});
                    return false;
                } else {
                    sendMsgToPhoneOrEmail2();
                }
            });
        } else {
            sendMsgToPhoneOrEmail2()
        }
    }

    // $init.Ready(function() {
    //     getValidateCode();
    // });
});