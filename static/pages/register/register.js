require(['KUYU.Service', 'Plugin','KUYU.navFooterLink', 'KUYU.Binder','KUYU.HeaderTwo','placeholder', 'KUYU.plugins.alert', ],function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        $scope = KUYU.RootScope;
    var path = _sever[_env.sever];
    var UUID = $init.createUid();
    navFooterLink()

    var secondParams = {
        falg :"false"
        };
    // JavaScript Document
    $(function() {
        getLocalCaptchaCodecont();
        //重新绑定注册下一步按钮事件
        $(document).off('click', '.next');
        //回车提交表单
        enterCheck();
    });

    var checkusernameR;  //判断昵称 返回值
    var checkphoneR;  //判断手机号  返回值
    var checkvalidatecodeR;  //判断验证码  返回值
    var sendcode;   //给手机或邮箱发送验证码
//重新发送验证码
    var countdown = 60;
    function settime(val) {
        if (countdown == 0) {
            val.removeAttribute("disabled");
            val.value = "重新发送验证码";
            countdown = 60;
            return false;
        } else {
            val.setAttribute("disabled", true);
            val.value = "重新发送(" + countdown + ")";
            countdown--;
            setTimeout(function() {
                settime(val)
            }, 1000);
        }
    };
	$("input").focus(function(){
		$("#nameerror").hide();
		$('#codeerror').hide();
		$('#error').hide();
		$('#cerror').hide();
//		$('#passerror').hide();
//		$('#passworderror').hide();

		$("#username").css('border', '')
		$("#validateCode").css('border', '')
		$("#validatecodes").css('border', '')
	})

    // :获取本地验证码
    function getLocalCaptchaCodecont() {
        $("#cont_code_img").eq(0).attr("src",  path+"/getCustomerRegCode?img-key="+ UUID +'&'+Math.random()).show();
    }

    // :获取本地验证码
    function getLocalCaptchaCodecont2() {
        var uuid = UUID+Math.random();
        secondParams.captchakey = uuid;
        $("#cont_code_img2").eq(0).attr("src",  path+"/getCustomerRegCode?img-key="+ uuid +'&'+Math.random()).show();
    }
    KUYU.getLocalCaptchaCodecont2 = getLocalCaptchaCodecont2;
    //判断昵称是否被占用
    function checknickname(){
        var username =$("#username").val();
        if(""== $.trim(username)){
            $('#nameerror').html("请输入邮箱/手机号");
            $('#nameerror').show();
            $('#username').css('border','solid 1px red');
            return false;
        }else{
        	$('#nameerror').html("");
            $('#nameerror').hide();
            $('#username').css('border','');
        }
        var result;
//      $http.post({
//          url : '/tclcustomerregist/checkusername',
//          data : {
//              username:username
//          },
//          dataType : 'json',
//          success : function(json) {
//              // 存在用户名
//              if (json.code == '0') {
//                      $('#nameerror').html("");
//                      $('#nameerror').hide();
//                      $('#username').css('border', '');
//                  }else{
//                  	$('#nameerror').html("邮箱/手机号已被注册，请重新输入");
//                      $('#nameerror').show();
//                      $('#username').css('border', 'solid 1px red');
//              }
//          }
//      });
        return result;
    }
    //失焦判断用户名是否存在
    $("#username").blur(function(){
    	checknickname()
    })
//检查密码
    function checkpassword(){
        var reg1 = /^[0-9]+$/; // 只有数字
		var reg2 = /^[a-zA-Z]+$/; // 只有母字
		var reg3=/^[~!@#$%^&*?]+$/;  //只有特殊字符
		var reg4=/^.{8,}$/;  //长度不少于8位
		var password = $('#password').val();
		if("" == $.trim(password)) {
			$('#passworderror').html("请输入密码");
			$('#passworderror').show();
			$('#password').css('border', 'solid 1px red');
			$('#passworderror').css('color', 'red');
			return false;
		}
		if((reg1.test(password))||(reg2.test(password))||(reg3.test(password))||(!(reg4.test(password)))) {
			$('#passworderror').html("密码不能全是数字或全是字母，长度不能少于8位");
			$('#passworderror').show();
			$('#passworderror').css('color', 'red');
			$('#password').css('border', 'solid 1px red');
			return false;
		} else {
			$('#passworderror').html("密码通过");
			$('#passworderror').show();
			$('#passworderror').css('color', 'green');
			$('#password').css('border', '');
			return true;
		}


    }
//再次输入密码
    function checkpass(){
        var pass=$('#pass').val();
        var password=$('#password').val();
        if(""== $.trim(pass)){
            $('#passerror').text("请再次输入密码");
            $('#nickname').css('border','solid 1px red');
            $('#passerror').show();
            return false;
        }
        if(pass!=password){
            $('#passerror').text("两次输入的密码不一样，请重新输入");
            $('#passerror').show();
            $('#pass').css('border','solid 1px red');
            return false;
        }
        else{
            $('#passerror').hide();
            $('#pass').css('border','');
            return true;
        }
    };
//是否同意协议
    function checkagree(){
        var btnNext = $(".buy.next");
        if($('.clause-checkbox').is(':checked')){
            btnNext.removeClass("btn_disabled").attr("disabled" , false);
            return true;
        }else{
            btnNext.addClass("btn_disabled").attr("disabled" , true);
            return false;
        }
    };
    $('.clause-checkbox').click(function(){
        checkagree();
    })


    function sendcode(btn){
        localStorage.setItem("img-key",UUID)
        // :验证手机号和邮箱是否已经存在
        var username =$("#username").val();
        secondParams.username = username;
        if(""== $.trim(username)){
            $('#nameerror').html("请输入邮箱/手机号");
            $('#nameerror').show();
            $('#username').css('border','solid 1px red');
            return false;
        }
        var reg = /^1[3456789]\d{9}$/; // 手机号
        var regemail=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱
        if(!(reg.test(username))&&!(regemail.test(username))){
            $('#nameerror').html("邮箱/手机号格式不正确");
            $('#nameerror').show();
            $('#username').css('border','solid 1px red');
            $('#codeerror').html("");
            $('#validateCode').css('border', '');
            $('#codeerror').hide();
            return false;
        }
        if(reg.test(username)){
            $('#type').val(3);
        }
        if(regemail.test(username)){
            $('#type').val(2);
        }
        // :验证验证码是否输入正确
        var icaptchakey  = $("#verificationKeycontent").val();
        var icaptchadata = $("#validateCode").val();
        if(""== $.trim(icaptchadata)){
            $('#codeerror').html("请输入图片验证码");
            $('#validateCode').css('border', '1px solid red');
            $('#codeerror').show();
            return false;
        }

        // :是否同意协议
        var btnNext = $(".buy.next");
        if($('.clause-checkbox').is(':checked')){
            $('#error').hide();
            btnNext.removeClass("btn_disabled");
            btnNext.attr("disabled" , false);
        }else{
            $('#error').html("你还没有阅读并同意用户服务条款和隐私政策");
            $('#error').show();
            btnNext.addClass("btn_disabled");
            btnNext.attr("disabled" , true);
            return false;
        }

        var type = $('#type').val();
        secondParams.type = type;
        $http.post({
            url : '/tclcustomerregist/checkRegisterParam',
            data : {
                username:username,
                captchakey:icaptchakey,
                captchadata:icaptchadata,
                type:type,
                "img-key":UUID
            },
            success : function(json) {
                if (json.code == '0') {
                    $('#firstbox').css('display', 'none');
                    $('#secondbox').css('display', 'block');
                    /* $('#code').val(res.code);*/

                    if ("2" == type) {
                        $("#messageOrEmail").html("一封验证邮件");
                        $('#phoneorEmail').html("邮箱：" + json.mobileOrEmail);
                        $("#msgOrEmail").html("邮件");
                    }
                    if ("3" == type) {
                        $("#messageOrEmail").html("一条验证短信");
                        $('#phoneorEmail').html("手机：" + json.mobileOrEmail);
                        $("#msgOrEmail").html("短信");
                    }
                    settime($("#sendcode")[0]);

                    $(btn).parents('.reg-box').hide();
                    $(btn).parents('.reg-box').next('.reg-box').show();
                } else {
                    getLocalCaptchaCodecont();
                    $('#validateCode').val("");
                    // 存在用户名
                    if (json.code == '-4') {
                        $('#nameerror').html("邮箱/手机号已被注册，请重新输入");
                        $('#nameerror').show();
                        $('#username').css('border', 'solid 1px red');
                        $('#validateCode').css('border', '');
                        $('#codeerror').hide();
                        return false;
                    } else if (json.code == '-1' ||  json.status == '-5') {
                        $('#nameerror').html("注册操作太频繁，请稍后重试");
                        $('#nameerror').show();
                        $('#username').css('border', 'solid 1px red');
                        return false;
                    }else if (json.code == '-2') {
                        $('#nameerror').html("注册操作太频繁，请1分钟后重试");
                        $('#nameerror').show();
                        $('#username').css('border', 'solid 1px red');
                        return false;
                    } else if (json.code == '-3') {
                        $('#codeerror').html("验证码输入错误，请重新输入");
                        $('#validateCode').css('border', '1px solid red');
                        $('#codeerror').show();
                        return false;
                    } else if (json.code == '-8') {
                        $('#cerror').html("超过验证码发送最大次数，请明天再试");
                        $('#cerror').show();
                        return false;
                    } else {
                        $('#cerror').html("操作失败，请稍后重试！");
                        $('#cerror').show();
                        return false;
                    }
                }
            }
        });
    }

    /**
     * 判断手机验证码输入是否正确
     * @returns {Boolean}
     */
    function checkvalidatecodes(){
        var inputcode=$('#validatecodes').val();
        var code=$('#code').val();
        var username=$('#username').val();
        var type=$('#type').val();
        if(""== $.trim(inputcode)){
            $('#cerror').html("请输入验证码");
            $('#validatecodes').css('border','solid red 1px');
            $('#cerror').show();
            return false;
        }else{
            $http.post({
                url : '/tclcustomerregist/checkValidateCode',
                async:false,
                data : {
                    "inputcode":inputcode,
                    "phoneOrEmail":username,
                    "ranNum":Math.random(),
                    "img-key": UUID,
                },
                success : function(data) {
                    if(data.code == CODEMAP.status.success){
                        $('#code').val(data.code);
                        $('#validatecodes').css('border','');
                        $('#cerror').hide();
                        result = true;
                    }else{
                        $('#cerror').html("验证码输入错误，请重新输入");
                        $('#validatecodes').css('border','solid red 1px');
                        $('#cerror').show();
                        result = false;
                    }
                }
            });

        }
        return result;
    }

    $scope.nextCheck = function () {
        var username=$('#username').val();
        if(checkvalidatecodes()){
            $('#thirdbox').css('display','block');
            $('#secondbox').css('display','none');
            $('#zhanghao').html(username);
            return true;
        }else{
            // checkvalidatecodes();
            return false;
        }
    }

     function checkp() {
        if(checkpassword()&&checkpass()){
            //注册
            var username=$('#username').val();
            var type=$('#type').val();
            var password=$('#password').val();
            var pass=$('#pass').val();//确认密码
            var code =  $('#validatecodes').val();
            username = username;
            password = password;
            pass = pass;
            type = type;
            //  用户名和密码加密
            username = $init.enCode(username);
            password = $init.enCode(password);
            pass = $init.enCode(pass);

            $http.post({
                url : '/tclcustomerregist/cloudRegister',
                data : {
                    username:username,
                    type:type,
                    password:password,
                    pass:pass,
                    inputcode:code,
                    key: UUID,
                },
                success : function(data) {
                	if(data.code == 1) {
                        $('#thirdbox').css('display','none');
                        if($param.from == 'procurement') {
                            $('#fivethbox').css('display','block');
                            var d =$("#fiveTime");
                            var t = 3;
                            var tt = setInterval(function () {
                                t--;
                                d.html(t)
                                if(t<=0) {
                                    clearInterval(tt);
                                     $init.nextPage('newBulkpurchase',{})
                                }
                            },1000);

                            if (window._gsTracker) {
                                _gsTracker.track("/targetpage/regOk");
                            }

                        } else {
                            $('#fourthbox').css('display','block');
                        }

                    }
                    else if(data.code == 5){
                        $('#registererror').html("邮箱格式不正确");
                        $('#registererror').show();
                    }
                    else if(data.code == 7){
                        $('#registererror').html("手机格式不正确");
                        $('#registererror').show();
                    }
                    else if(data.code == 2){
                        $('#registererror').html("用户名已存在,请重试");
                        $('#registererror').show();
                    }
                    else if(data.code == 0){
                        $('#registererror').html("服务器错误,请稍后重试");
                        $('#registererror').show();
                    }
                    else if(data.code == 1214){
                        $('#registererror').html("应用今日短信量达到上限");
                        $('#registererror').show();
                    }
                    else{
                        $('#registererror').html("注册失败，请重试");
                        $('#registererror').show();
                    }
                }
            });
            return true;
        }else{
            checkpass();
            checkpassword();
            return false;
        }
    }

    KUYU.checkpassword = checkpassword;
    KUYU.checkpass = checkpass;


    /**
     * [showloading description]
     * @Author:zhengguomin
     * @date:2016-07-29
     * @function enter keyup submit form for register page
     * @return   {[type]} [description]
     */
    function enterCheck(){
        if($("#validateCode")){
            $("#validateCode").keyup(function(evt){
                evt = (evt) ? evt : ((window.event) ? window.event : "") //兼容IE和Firefox获得keyBoardEvent对象
                var key = evt.keyCode?evt.keyCode:evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
                if(key == 13){ //判断是否是回车事件。
                    sendcode(this);
                }
            });
        }
        if($("#username")){
            $("#username").keyup(function(evt){
                evt = (evt) ? evt : ((window.event) ? window.event : "") //兼容IE和Firefox获得keyBoardEvent对象
                var key = evt.keyCode?evt.keyCode:evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值
                if(key == 13){ //判断是否是回车事件。
                    sendcode(this);
                }
            });
        }

    }
    /*用户服务条款和隐私政策弹窗 Linxh*/
    $(document).on('click', '.reg-box .agree-text', function(){
        $('.agreement').show().css({opacity: 1, zIndex: 500});
        $('#mask').css({ opacity: 1, zIndex: '499', visibility: 'visible', display: 'block' });
    }).on('click', '.agreement .agree', function(){
        $('.agreement').css({opacity: 0, zIndex: -1});
        $('#mask').hide();
        $('.clause-checkbox').prop('checked',true);
        $('.reg-cont .buy').removeClass("btn_disabled").attr("disabled" , false);
    }).on('click','.agreement .close,.mask',function(){
        $('.agreement').css({opacity: 0, zIndex: -1});
        $('#mask').hide();
    });

    function sendMessagetoPhoneOrEmail(params){
        var username=$('#username').val();
        var type;
        var reg = /^1[3456789]\d{9}$/; // 手机号
        var regemail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;  //邮箱
        if(!(reg.test(username))&&!(regemail.test(username))){
            $('#nameerror').html("邮箱/手机号格式不正确");
            $('#nameerror').show();
            checkphoneR= false;
            return false;
        }
        if(reg.test(username)){
            type=3;
        }
        if(regemail.test(username)){
            type=2;
        }
        $http.post({
            url : '/tclcustomerregist/sendMessagetoPhoneOrEmail',
            async: false,
            data : {
                username:username,
                type:type,
                "img-key": UUID,
                "captchakey": secondParams.captchakey,
                "captchadata": secondParams.captchadata,
            },
            dataType : 'json',
            success : function(res) {
                if(res.code != CODEMAP.status.success){
                    var map = {
                        "0": "操作成功",
                        "-1":"注册验证用户名操作太频繁，请稍后重试",
                        "-2":"注册验证用户名发送验证码操作太频繁，请稍后重试",
                        "-3":"验证码输入错误，请重新输入",
                        "-4":"邮箱/手机号已被注册，请重新输入",
                        "-6":"发送邮箱验证码错误，请稍后重试!",
                        "-7":"手机号禁止发短信/失败",
                        "-8":"一个小时内，一个手机号，错误次数不能超过十次",
                        "-9":"每次发送时间间隔为50秒",
                        "-11":"验证失败",
                        "-100":"服务端错误"
                    }
                    if( map[res.code] ) {
                        // secondParams.captchakey = '';
                        // secondParams.captchadata = '';
                      //  $('#cerror').html(map[res.code]);
                        $("#alertcodeerror").html(map[res.code]).show();
                     //   $('#cerror').show();
                        secondParams.flag = 'false';

                    }
                }else{
                    secondParams.flag = true;
                    secondParams.captchakey = '';
                    secondParams.captchadata = '';
                	settime($("#sendcode")[0]);
                }

            }
        });

    };
    //点击下一步
    $("#next").click(function(){
    	sendcode()
    })

    //点击重新发送验证码
    $("#sendcode").click(function(){

        var vadliboxtu = $(".vadliboxtu");
        vadliboxtu.show();
        var doms = "<div class='alertValidBox'><input type='text' id='validCode2' placeholder='输入验证码' ><img style='width: 152px;height: 55px' onclick='KUYU.getLocalCaptchaCodecont2()'  id='cont_code_img2' src=''/><p id='alertcodeerror' style='color: red; display: none; text-align: left; margin-left: 25px;'>验证码不能为空</p></div>"
        if( !secondParams.captchadata) {
            Msg.Alert('', doms , function () {
                var dom = $("#validCode2");
                console.log(secondParams.flag)
                if(!dom.val()) {
                    secondParams.flag = 'false';
                    $("#alertcodeerror").show();
                }else{
                    secondParams.captchadata = dom.val();
                    $("#alertcodeerror").hide();
                    sendMessagetoPhoneOrEmail();
                }
                return secondParams.flag;
            });
        }
        getLocalCaptchaCodecont2();

    })
    //点击下一步注册
    $(".checkpwd").click(function(){
    	checkp()
    })
//  $scope.register = sendcode;
//  $scope.sendMessagetoPhoneOrEmail=sendMessagetoPhoneOrEmail;
    $scope.getLocalCaptchaCodecont = getLocalCaptchaCodecont;

    $init.Ready(function(){
        $binder.init();
    });
    //为了IE8
    if(!Array.isArray) {
        $("input[type='text'], input[type='password'], textarea").placeholder();
    }
    /*用户服务条款和隐私政策弹窗內容 Linxh*/
    var agreeHtml = '<div class="mask j-mask" id="mask"></div><div class="agreement"><h3>协议说明<span class="close">&#xe60f;</span></h3><div class="agr-main"><div class="content"><dl><dt>TCL用户协议</dt><dd class="infomation infomation-pc policy_info"><b></b><br><div style="text-align: left; line-height: 1.7;"><div><span>客户在接受商品订购与送货的同时，有义务遵守以下交易条款。您在TCL官方商城下订单之前或接受TCL官方商城送货之前，请您仔细阅读以下条款：</span></div><strong><div><strong>一、本站服务条款的确认和接纳</strong></div></strong><div><span>&nbsp;本站的各项电子服务的所有权和运作权归本站。本站提供的服务将完全按照其发布的服务条款和操作规则严格执行。用户必须完全同意所有服务条款并完成注册程序，才能成为本站的正式用户及TCL集团的普通会员。用户确认：本协议条款是处理双方权利义务的当然约定依据，除非违反国家强制性法律，否则始终有效。在下订单的同时，您也同时承认了您拥有购买这些产品的权利能力和行为能力，并且将您对您在订单中提供的所有信息的真实性负责。</span></div><strong><div><strong>二、服务简介</strong></div></strong><div><span>本站运用自己的操作系统通过国际互联网络为用户提供网络服务。同时，用户必须：</span></div><div><span>&nbsp;1.自行配备上网的所需设备，包括个人电脑、调制解调器或其他必备上网装置。</span></div><div><span>2.自行负担个人上网所支付的与此服务有关的电话费用、网络费用。</span></div><div><span>3.基于本站所提供的网络服务的重要性，用户应同意：提供详尽、准确的个人资料；不断更新注册资料，符合及时、详尽、准确的要求。</span></div><div><span>4.为使您感受到更好的会员服务，TCL集团可能会委托相关合作方向您提供一部分会员服务而无须经过您的同意或特别告知您；对此，您完全理解并予以同意。</span></div><strong><div><strong>三、价格和数量</strong></div></strong><div><span>本站将尽最大努力保证您所购商品与网站上公布的价格一致，但价目表和声明并不构成要约。商品的价格都包含了增值税。如果发生了意外情况，在确认了您的订单后，由于供应商提价，税额变化引起的价格变化，或是由于网站的错误等造成商品价格变化，您有权取消您的订单，并希望您能及时通过电子邮件或电话通知本站客户服务部。</span></div><div><span>由于市场变化及各种以合理商业努力难以控制的因素的影响，本站无法承诺用户通过提交订单所希望购买的商品都会有货，用户订购的商品如果发生缺货，用户和本站皆有权取消该订单。同时，本站保留对产品订购数量的限制权。</span></div><strong><div><strong>四、送货及费用</strong></div></strong><div><span>本站将会把产品送到您所指定的送货地址。所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。送货费用根据您选择的配送方式的不同而异。</span></div><div><span>请清楚准确地填写您的真实姓名、送货地址及联系方式。因如下情况造成订单延迟或无法配送等，本站将不承担责任：</span></div><div><span>1.客户提供错误信息和不详细的地址；</span></div><div><span>2.货物送达无人签收，由此造成的重复配送所产生的费用及相关的后果。</span></div><div><span>3.不可抗力，例如：自然灾害、交通戒严、突发战争等。</span></div><strong><div><strong>五、服务条款的修改</strong></div></strong><div><span>本站将可能不定期的修改本用户协议的有关条款，一旦条款及服务内容产生变动，本站将会在重要页面上提示修改内容。您应经常访问本页面了解这些内容，一旦接受本条款，即意味着您已经同时详细阅读并接受了服务条款的变动。</span></div><div><span>如果不同意本站对条款内容所做的修改，用户可以主动取消获得的网络服务。</span></div><strong><div><strong>&nbsp;六、用户隐私制度</strong></div></strong><div><span>本站尊重并保护用户的个人隐私权。本站将以高度的勤勉、审慎义务对待用户的资料信息，除在如下情况下，本站依据您的个人意愿或法律的规定外，不会将这些信息对外披露或向第三方提供：</span></div><div><span>1.经您事先同意，向第三方披露；</span></div><div><span>2.根据法律的有关规定，或者行政司法机构的要求，向第三方或者行政、司法机构披露；</span></div><div><span>3.为提供您所要求的产品和服务，而必须向第三方分享您的个人信息；</span></div><div><span>4.其他本站根据法律、法规或者网站政策认为合适的披露。</span></div><strong><div><strong>七、用户的帐号，密码和安全性</strong></div></strong><div><span>用户一旦注册成功，成为本站的合法用户，将得到一个密码和用户名。您可随时根据指示改变您的密码。用户将对用户名和密码安全负全部责任。另外，每个用户都要对以其用户名进行的所有活动和事件负全责。用户若发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通告本站。</span></div><strong><div><strong>八、不承诺提供担保</strong></div></strong><div><span>用户个人对网络服务的使用承担风险。除非另有明确的书面说明，本站及其所包含的其他方式通过本站提供给您的全部信息、内容、商品（包括软件）和服务，是在“现状”和“现存”的基础上提供的。除非另有明确的书面说明，我们不对本网站的运营及包含在本网站上的信息、内容、商品（包括软件）或服务作任何形式的、明示或默示的声明或担保，且不会承诺其提供给用户的全部信息或发出的电子邮件没有病毒或其他有害成分。在适用法律所允许的最大限度内，我们不承诺所有明示或默示的担保，包括但不限于对适销性和满足特定目的的默示担保。您明确同意自担风险使用本网站。</span></div><strong><div><strong>九、责任限制</strong></div></strong><div><span>本站对因不可抗力或其他无法控制的原因（如本站销售服务系统异常或无法使用导致网上交易无法完成或丢失有关的信息、记录等），应尽可能合理地协助处理善后事宜，努力使客户免受经济损失。用户因使用本站而引起的损害或经济损失，本站将依据相应的法律规定承担合理的责任，但承担的全部责任均不超过用户所购买的与该索赔有关的商品价格。</span></div><strong><div><strong>十、对用户信息的存储和限制</strong></div></strong><div><span>本站有判定用户的行为是否符合本站服务条款的要求和精神的保留权利，如果用户违背了服务条款的规定，本站有中断对其提供网络服务的权利。对有违反法律法规、捏造事实、恶意诋毁等行为的，本站有停止传输并删除其信息，禁止用户发言，限制用户订购，注销用户账户并向相关机关进行披露。</span></div><strong><div><strong>十一、用户管理</strong></div></strong><div><span>用户单独承担发布内容的责任。用户对服务的使用是根据所有适用于本站的国家法律、地方法律和国际法律标准的。用户必须遵循：</span></div><div><span>&nbsp;1.从中国境内向外传输技术性资料时必须符合中国有关法规。</span></div><div><span>2.使用网络服务不作非法用途。</span></div><div><span>3.不干扰或混乱网络服务。</span></div><div><span>4.遵守所有使用网络服务的网络协议、规定、程序和惯例。</span></div><div><span>用户须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐性的、伤害性的、庸俗的，淫秽等信息资料。</span></div><div><span>另外，用户也不能传输何教唆他人构成犯罪行为的资料；不能传输助长国内不利条件和涉及国家安全的资料；不能传输任何不符合当地法规、国家法律和国际法律的资料。</span></div><div><span>未经许可而非法进入其它电脑系统是禁止的。</span></div><div><span>若用户的行为不符合以上提到的服务条款，本站将作出独立判断立即取消用户服务帐号。</span></div><div><span>用户需对自己在网上的行为承担法律责任。用户若在本站上散布和传播反动、色情或其他违反国家法律的信息，本站的系统记录有可能作为用户违反法律的证据。</span></div><strong><div><strong>十二、保障用户</strong></div></strong><div><span>同意保障和维护本站全体成员的利益，负责支付由用户使用超出业务范围引起的律师费用，违反服务条款的损害补偿费用等。</span></div><strong><div><strong>十三、终止服务</strong></div></strong><div><span>在下列情况下，本站可以通过注销账户的方式终止服务，同时保留对用户的违法行为追究法律责任的权利：</span></div><div><span>1.用户违反法律法规及本协议相关条款规定；</span></div><div><span>2.用户注册信息中的内容虚假；</span></div><div><span>3.用户提供的注册信息填写的联系方式不存在或无效；</span></div><div><span>4.本协议条款更新时，用户明示不愿接受新的条款；</span></div><div><span>5.用户对本站实施欺诈、胁迫、恶意攻击等行为；</span></div><div><span>6.本站认为需要终止服务的其他情况。</span></div><strong><div><strong>十四、通告</strong></div></strong><div><span>所有发给用户的通告都可通过重要页面的公告或电子邮件或常规的信件传送。用户协议条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</span></div><strong><div><strong>十五、参与广告策划</strong></div></strong><div><span>用户在他们发表的信息中加入宣传资料或参与广告策划，在本站的免费服务上展示他们的产品，任何这类促销方法，包括运输货物、付款、服务、商业条件、担保及与广告有关的描述都只是在相应的用户和广告销售商之间发生。本站不承担任何责任，本站没有义务为这类广告销售负任何一部分的责任。</span></div><strong><div><strong>十六、网络服务内容的所有权</strong></div></strong><div><span>本站定义的网络服务内容包括：文字、软件、声音、图片、录象、图表、广告中的全部内容；电子邮件的全部内容；本站为用户提供的其他信息。所有这些内容受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在本站和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。本站所有的文章版权归原文作者和本站共同所有，任何人需要转载本站的文章，必须征得原文作者或本站授权。</span></div><strong><div><strong>十七、法律管辖和适用</strong></div></strong><div><span>本协议的订立、执行和解释及争议的解决均应适用中国法律。</span></div><div><span>如发生本站服务条款与中国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它合法条款则依旧保持对用户产生法律效力和影响。</span></div><div><span>本协议的规定是可分割的，如本协议任何规定被裁定为无效或不可执行，该规定可被删除而其余条款应予以执行。</span></div><div><span>如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向本站所在地的人民法院提起诉讼。</span></div></div></dd><dd></dd></dl></div><div class="agree-box"><button class="agree">同意</button></div></div></div>';
    $('body').append(agreeHtml);
});
