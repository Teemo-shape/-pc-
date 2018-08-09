require(['KUYU.Service',  'KUYU.Binder',KUYU.HeaderTwo','KUYU.navFooterLink', 'placeholder'], function() {
	 var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
		navFooterLink = KUYU.navFooterLink,
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        $scope = KUYU.RootScope;
    var path = _sever[_env.sever];
    var UUID = $init.createUid();

		navFooterLink();
	var checkusernameR; //判断昵称 返回值
	var checkphoneR; //判断手机号  返回值
	var checkvalidatecodeR; //判断验证码  返回值
	var safycodeR; //手机/邮箱安全码
	// JavaScript Document
	$(function() {
		getLocalCaptchaCodecont();
		//重新绑定注册下一步按钮事件
		$(document).off('click', '.next');
		if($("#password")) {
			$("#password").keyup(function(evt) {
				evt = (evt) ? evt : ((window.event) ? window.event : "") //兼容IE和Firefox获得keyBoardEvent对象  
				var key = evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值  
				if(key == 13) { //判断是否是回车事件。  
					checkpassword();
					return false; //return false是为了停止表单提交，如果return true或者不写的话，表单照样是会提交的。  
				}
			});
		}
		enterCheck('username'); //回车提交表单
		enterCheck('validateCode'); //回车提交表单
		enterCheck('validatecodes'); //回车提交表单	
	});
	//表单聚焦错误提示消失
	$("input").focus(function(){
		$("#nameerror").hide();
		$('#error').hide();
		$('#cerror').hide();
		$('#codeerror').hide();
//		$('#passerror').hide();
//		$('#registererror').hide();
//		$('#passworderror').hide();
		$("#username").css('border', '')
		$("#validateCode").css('border', '')
		$("#validatecodes").css('border', '')
	})
	//重新发送验证码
	var countdown = 60; //设置倒计时
	function settime(val) {
		if(countdown == 0) {
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
	// :获取本地验证码
	function getLocalCaptchaCodecont() {
		$http.get({
                url:'/tclcustomerregist/getcaptcha',
                data: {ranNum : Math.random()},
                success: function (json) {
                    if(json.status == 1 ) {
                        $("#cont_code_img").attr("src",json.url);
						$("#verificationKeycontent").val(json.key);
                    }
                }
            })
	}
	//判断图片验证码是否输入正确
	function checkCaptcha() {
		var icaptchakey = $("#verificationKeycontent").val();
		var icaptchadata = $("#validateCode").val();
		var result;
		if("" == $.trim(icaptchadata)) {
			$('#codeerror').html("请输入图片验证码");
			$('#codeerror').show();
			checkvalidatecodeR = false;
			result = false;
		}
		else{
		$http.post({
			url: '/tclcustomerregist/checkcaptcha',
			data: {
				captchakey: icaptchakey,
				captchadata: icaptchadata,
				ranNum : Math.random()
			},
			dataType: 'json',
			async: false,
			success: function(res) {
				if(res.status =="1") {
					$('#codeerror').hide();
					$('#validateCode').css('border', '');
					result = true;
				} else {
					$('#codeerror').html("验证码输入错误，请重新输入");
					$('#validateCode').css('border', '1px solid red');
					$('#codeerror').show();
//					getLocalCaptchaCodecont();
					result = false;
				}
			}
		});
		}
		return result;
	}
	// :验证手机号和邮箱是否存在
	function checkusername() {
		var username = $("#username").val();
		var result;
		if("" == $.trim(username)) {
			$('#nameerror').html("请输入邮箱/手机号");
			$('#username').css('border', 'solid 1px red');
			$('#nameerror').show();
			checkphoneR = false;
			result = false;
		}
		$http.post({
			url: '/tclcustomerregist/checkusername',
			data: {
				username: username,
				ranNum : Math.random()
			},
			dataType: 'json',
			async: false,
			success: function(json) {
				// 存在用户名
				if('1' == json.code) {
					$('#nameerror').hide();
					$('#username').css('border', '');
					result = true;
				} else {
					$('#nameerror').html("您输入的账号不存在，请重新输入");
					$('#nameerror').show();
					$('#username').css('border', 'solid 1px red');
					result = false;
				}
			}
		});
		return result;
	}
	//向手机或邮箱发送安全码
	function sendcode() {
		var result;
		if(!checkusername()) {
			return;
		}
		if(!checkCaptcha()) {
			return;
		}
		var icaptchakey = $("#verificationKeycontent").val();
		var icaptchadata = $("#validateCode").val();
		var username = $("#username").val();
		var type;
		var reg = /^1[3456789]\d{9}$/; // 手机号
		var regemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
		if(!(reg.test(username)) && !(regemail.test(username))) {
			$('#nameerror').html("邮箱/手机号格式不正确");
			$('#username').css('border', 'solid 1px red');
			$('#nameerror').show();
			checkphoneR = false;
			result = false;
		}
		if(reg.test(username)) {
			type = 3;
		}
		if(regemail.test(username)) {
			type = 2;
		}
		$http.post({
			url: '/tclcustomerresetpassword/sendSafetyCode',
			data: {
				username: username,
				captchakey: icaptchakey,
				captchadata: icaptchadata,
				"img-key": UUID,
				ranNum : Math.random()
			},
			dataType: 'json',
			success: function(data) {
				if(data.status == 1) {
					if("2" == type) {
						$("#msgShowInfo").html('我们已经发送一封验证邮件至' + '<span id="phoneorEmail" style="color:blue;">邮箱：' + username + '</span></div>');
						$("#msgShowMar").html('请输入邮件中的验证码');
						
					}
					if("3" == type) {
						$("#msgShowInfo").html('我们已经发送一条验证短信至' + '<span id="phoneorEmail" style="color:blue;">手机：' + username + '</span></div>');
						$("#msgShowMar").html('请输入短信中的验证码');
					}
					settime($("#sendcode")[0])
				} else {
					if(data.status == 1214){
						$('#error').html("今日验证码发送次数达到上限，请稍后再试");
						$('#error').show();
					}
					else if(data.status == -5){
						$('#error').html("验证码填写错误");
						$('#error').show();
					}
					else if(data.status == 3){
						$('#error').html("用户不存在");
						$('#error').show();
					}
					else if(data.status == -5){
						$('#error').html("服务器异常找回失败");
						$('#error').show();
					}
				}
			}
		});
	};
	//发送手机验证码
	$("#sendcode").click(function(){
		sendcode();
	})
	 //判断手机验证码输入是否正确
	function checkvalidatecodes() {
		var result;
		var inputcode = $('#validatecodes').val();
		var username = $('#username').val();
		var type = $('#type').val();
		if("" == $.trim(inputcode)) {
			$('#cerror').html("请输入验证码");
			$('#validatecodes').css('border', 'solid red 1px');
			$('#cerror').show();
			return false;
		} else {
			$http.post({
				url: '/tclcustomerresetpassword/checkSafeCode',
				async: false,
				data: {
					"safecode": inputcode,
					"username": username,
					ranNum : Math.random()
				},
				success: function(data) {
					if(data.status == "1") {
						$('#code').val(data.code);
						$('#validatecodes').css('border', '');
						$('#cerror').hide();
						safycodeR = true;
						result = true;
					} else {
						$('#cerror').html("手机验证码输入错误，请重新输入");
						$('#validatecodes').css('border', 'solid red 1px');
						$('#cerror').show();
						safycodeR = false;
						result = false;
					}
				}
			});

		}
	}
	//第一步里面的下一步
	function check1() {
		if(!checkusername()) {
			return;
		}
		checkvalidatecodes();
		var username = $('#username').val();
		var result;
		if(safycodeR) {
			$('#thirdbox').css('display', 'block');
			$('#secondbox').css('display', 'none');
			$('#zhanghao').html(username);
			result = true;
		} else {
			checkvalidatecodes();
			result = false;
		}
		return result;
	}

	//检查密码
	function checkpassword() {
		var reg1 = /^[0-9]+$/; // 只有数字
		var reg2 = /^[a-zA-Z]+$/; // 只有母字
		var reg3=/^[~!@#$%^&*?]+$/;  //只有特殊字符
		var reg4=/^.{8,}$/;  //长度不少于8位
//		var reg3 = /^.{8,16}$/;
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
	function checkpass() {
		var pass = $('#pass').val();
		var password = $('#password').val();
		if("" == $.trim(pass)) {
			$('#passerror').text("请再次输入密码");
			$('#nickname').css('border', 'solid 1px red');
			$('#passerror').show();
			return false;
		}
		if(pass != password) {
			$('#passerror').text("两次输入的密码不一样，请重新输入");
			$('#passerror').show();
			$('#pass').css('border', 'solid 1px red');
			return false;
		} else {
			$('#passerror').hide();
			$('#pass').css('border', '');
			return true;
		}
	};
	//第二个页面里面的确定修改密码
	function checkp() {
		if(checkpassword() && checkpass()) {
			//重置密码
		 var username=$('#username').val();
		 var safecode=$('#validatecodes').val();
		 var newPassword=$('#password').val();

		//  用户名和密码加密
		username = $init.enCode(username);
		newPassword = $init.enCode(newPassword);

			$http.post({
				url: '/tclcustomerresetpassword/resetPassword',
				data: {
					username:username,
					safecode:safecode,
					newPassword:newPassword,
					ranNum : Math.random()
				},
				dataType: 'json',
				success: function(json) {
					if("1" == json.status) {
						$('#fourthbox').css('display', 'block');
						$('#thirdbox').css('display', 'none');
					} else {
						if(json.status==4){
							$('#registererror').html("密码格式不正确");
							$('#registererror').show();
						}
						else if(json.status==0){
							$('#registererror').html("手机安全码错误，请重新获取手机安全码");
							$('#registererror').show();
						}
						else if(json.status==13){
							$('#registererror').html("密码不能与原始密码相同");
							$('#registererror').show();
						}else if(json.status == 0) {
							$('#registererror').html("服务器异常");
							$('#registererror').show();
						}else if(json.status == -1) {
							$('#registererror').html("安全码错误");
							$('#registererror').show();
						}else if(json.status == -2) {
							$('#registererror').html("验证码错误超过5次");
							$('#registererror').show();
						}
					}
				}
			});
			return true;
		} else {
			checkpass();
			checkpassword();
			return false;
		}
	}
	//回车提交表单
	function enterCheck(id) {
		var id = id
		if($("#" + id)) {
			$("#" + id).keyup(function(evt) {
				evt = (evt) ? evt : ((window.event) ? window.event : "") //兼容IE和Firefox获得keyBoardEvent对象  
				var key = evt.keyCode ? evt.keyCode : evt.which; //兼容IE和Firefox获得keyBoardEvent对象的键值  
				if(key == 13) { //判断是否是回车事件。  
					check1();
					return false; //return false是为了停止表单提交，如果return true或者不写的话，表单照样是会提交的。  
				}
			});
		}
	}
	//进入下一步
	$(".checknext").click(function(){
		check1()
	})
	$(".checkpwd").click(function(){
		checkp()
	})



//	$scope.register = sendcode;
	$scope.getLocalCaptchaCodecont = getLocalCaptchaCodecont;
	$scope.checkusername = checkusername;
//	$scope.checkCaptcha = checkCaptcha;
	$scope.sendcode = sendcode;
	$scope.checkvalidatecodes = checkvalidatecodes;
	$scope.check1 = check1;
	$scope.checkpassword = checkpassword;
	$scope.checkpass = checkpass;
	$scope.checkp = checkp;

	$init.Ready(function() {
		$binder.init();
		if(!Array.isArray) {
        	$("input[type='text'], input[type='password'], textarea").placeholder();
    	}
	});
})