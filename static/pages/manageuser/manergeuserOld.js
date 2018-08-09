//接口文档在confluence上
require(['KUYU.Service',  'KUYU.userInfo', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'juicer', 'KUYU.plugins.alert'], function() {
	var $http = KUYU.Service,
		$init = KUYU.Init,
		$binder = KUYU.Binder,
		userInfo = KUYU.userInfo,
		$scope = KUYU.RootScope;
	var UUID = $init.createUid();

	var statusCode = {
		101: '用户名为空',
		102: 'token为空',
		104: '用户名不存在',
		103: 'token验证失败',
		15: '应用编号格式错误',
		21: '应该编号未在TCL注册',
		31:'检查应用编号异常',
		45:'无效值',
		141:'身份未验证或超时',
		4:'手机或邮箱已经被绑定过',
		5:'验证码错误次数超过上限',
		10:'已经通过验证邮箱只能换绑',
		110:'验证码错误',
		123:'验证码错误',
		'-1':'换绑失败'
	}

	$(function() {
		//从本地获取参数
		var user;
		user = JSON.parse(sessionStorage.getItem('userinfo'));
		if(user && user != null) {
			var bindMail = user.bindMail;
			var bindPhone = user.bindPhone;
			if(bindMail && bindMail!="null" && bindMail!= null) {
					$(".e_mail").val(bindMail)
			}
			else{
					$(".e_mail").val("")
				}
			if(bindPhone && bindPhone!="null" && bindMail!= null) {
				$(".e_phone").val(bindPhone)
			}
			else{
				$(".e_phone").val("")
			}
		} else {
			userInfo(function(res) {
				user = JSON.parse(sessionStorage.getItem('userinfo'));
				var bindMail = user.bindMail;
				var bindPhone = user.bindPhone;
				if(bindMail && bindMail!="null" && bindMail!= null) {
					$(".e_mail").val(bindMail)
				}
				else{
					$(".e_mail").val("")
				}
				if(bindPhone && bindPhone!="null" && bindMail!= null) {
					$(".e_phone").val(bindPhone)
				}
				else{
					$(".e_phone").val("")
				}
			})
		}
		//表单聚焦时候，所有错误提示都清空
		$("input").focus(function(){
			clear()
		})
		//清空错误提示码
		function clear(){
			$('#validateCodeError1').hide();
			$('#CodeError4').hide();
			$("#mvalidateCodeError4").hide();
			$("#mvalidateCodeError1").hide();
			$("#CodeError3").hide();
			$("#CodeError3").html("");
			$("#mvalidateCodeError3").hide();
			$("#mvalidateCodeError3").html("");
		}


		if(bindMail && bindMail !=null && bindMail !="null") {
			//换绑邮箱
			$('#p1').show()
				//已有邮箱获取验证码
			$("#sendcode").click(function() {
				if($("#sendcode").hasClass("disabled")){
					return
				}
					sendCode("email")
				})
				//已有邮箱判断验证码是否正确
			$(document).on('click', '#btn_p1', function() {
					var inputcode = $('#validateCodefirst').val();
					var username = user.bindMail; //邮箱
					var flag;
					if("" == inputcode || null == inputcode) {
						$('#validateCodeError1').text("请输入验证码");
						$('#validateCodeError1').css('display', 'block');
						return false;
					} else {
						$http.post({
							url: '/usercenter/customer/checkValidcode',
							headers:{
			            'platform' : 'platform_tcl_staff'
			        },
							data: {
								"validcode": inputcode,
								"type": 2,
								"username": username,
								"ranNum": Math.random()
							},
							success: function(res) {
								if(res.status == "1") {
									$("#p1").hide();
									$("#p2").show();
									//										$(this).parents('.bind_mailbox').addClass('m_mobile');
								} else {
									$('#validateCodeError1').text("验证码输入错误");
									$('#validateCodeError1').css('display', 'block');
								}
							}
						});
					}
				}) //绑定新邮箱进行下一步
				.on('click', '#btn_p2', function() {
					var inputMyNewEmail = $('#inputMyNewEmail').val();
					var regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱

					console.log("新邮箱："+inputMyNewEmail);
					if("" == inputMyNewEmail || null == inputMyNewEmail) {
						$('#CodeError3').text("请输入邮箱");
						$('#CodeError3').css('display', 'block');
						return false;
					}
					if(!(regemail.test(inputMyNewEmail))) {
						$('#CodeError3').text("邮箱格式不正确，请重新输入");
						$('#CodeError3').css('display', 'block');
						return false;
					}

					var inputCode = $('#inputEmailvalidateCode4').val();
					if("" == inputCode || null == inputCode) {
						$('#CodeError4').text("请输入验证码");
						$('#CodeError4').css('display', 'block');
					} else {
						bindEmailOrMobile("email")
					}
				})
				.on('click', '#btn_p3', function() {
						$(this).parents('#p3').hide().siblings("#p1").show();
						window.location.reload();
				});
			//新邮箱获取验证码
			$("#sendcode1").click(function() {
					var inputMyNewEmail = $('#inputMyNewEmail').val();
					var regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //邮箱
					if("" == inputMyNewEmail || null == inputMyNewEmail) {
						$('#CodeError3').text("请输入邮箱");
						$('#CodeError3').css('display', 'block');
						return false;
					} else if(!(regemail.test(inputMyNewEmail))) {
						$('#CodeError3').text("邮箱格式不正确，请重新输入");
						$('#CodeError3').css('display', 'block');
						return false;
					} else if(checkuser(inputMyNewEmail)) {
						if($("#sendcode1").hasClass("disabled")){
							return
						}
						sendCode1("email")
						settime($("#sendcode1"));
					}
			})
		}
		if(bindPhone && bindPhone != null && bindPhone != "null") {
			//换绑手机
			$('#m1').show();
				//已有手机获取验证码
			$("#msendcode").click(function() {
                if($("#msendcode").hasClass("disabled")){
                	return
				}
					sendCode("mobile");
				})
				//已有手机判断验证码
			$(document).on('click', '#btn_m1', function() {
					var code = $('#mcode').val();
					var inputcode = $('#minputvalidateCode').val();
					var username = user.bindPhone;
					var flag;
					if("" == inputcode || null == inputcode) {
						$('#mvalidateCodeError1').text("请输入验证码");
						$('#mvalidateCodeError1').css('display', 'block');
						return false;
					} else {
						$http.post({
							url: '/usercenter/customer/checkValidcode',
							headers:{
			            'platform' : 'platform_tcl_staff'
			        },
							data: {
								"validcode": inputcode,
								"type": 3,
								"username": username,
								"ranNum": Math.random()
							},
							success: function(res) {
								if(res.status == "1") {
									$("#bind_mailbox_mobile .m_firststep").hide();
									$("#bind_mailbox_mobile .m_thirdstep").show();
								} else {
									$('#mvalidateCodeError1').text("验证码输入错误");
									$('#mvalidateCodeError1').css('display', 'block');
									return false;
								}
							}
						});
					}
				})
				//绑定新手机进行下一步
			$(document).on('click', '#btn_m2', function() {
				if($('#minputvalidateCode4').val()=='') {
					$('#mvalidateCodeError4').text("请输入验证码");
					$('#mvalidateCodeError4').css('display', 'block');
				} else {
					bindEmailOrMobile("mobile")
				}
			})
			.on('click', '#btn_m3', function() {
				$(this).parents('#m3').hide().siblings("#m1").show();
				window.location.reload();
			});
			//新手机重新获取验证码
			$("#msendcode1").click(function() {
				var inputMyNewPhone = $('#inputMyNewPhone').val();
				var reg = /^1[3456789]\d{9}$/; // 手机号
				if("" == inputMyNewPhone || null == inputMyNewPhone) {
					$('#mvalidateCodeError3').text("请输入手机号");
					$('#mvalidateCodeError3').css('display', 'block');
					return false;
				} else if(!(reg.test(inputMyNewPhone))) {
					$('#mvalidateCodeError3').text("手机号格式不正确，请重新输入");
					$('#mvalidateCodeError3').css('display', 'block');
					return false;
				} else if(checkuser(inputMyNewPhone)) {
					sendCode1("mobile")
					settime($("#msendcode1"));
				}
			})
		}
		//已有手机或者邮箱获取验证码
		function sendCode(sendtype) {
			var type;
			var username;
			if('email' == sendtype) {
				type = "2"; //邮箱
				username = $(".e_mail").val();
			} else if('mobile' == sendtype) {
				type = "3"; //手机
				username = $(".e_phone").val()
			}
			$http.post({
				url: '/usercenter/customer/sendValidcodeToOld',
				data: {
					username: username,
					type: type
				},
				headers:{
            'platform' : 'platform_tcl_staff'
        },
				success: function(res) {
					var map = {
                        "-1":"发送验证码失败",
                        "5":"24小时之内发送超过5次验证码，请稍后再试",
                        "15":"应用编号格式错误",
                        "21":"应用编号未在TCL注册",
                        "31":"检查应用编号时服务异常",
                        "101":"用户名为空",
                        "104":"用户名不存在",
                        "120":"用户在两分钟之内已发送过验证码，请稍后再试",
                        "123":"用户输入的type不合法",
                        "410":"用户未绑过手机号",
                        "420":"用户未绑定过邮箱",
                        "1214":"应用今日短信量达到上限"
                    }
					if(res.status == "1") {
						if(type == "2") {
							set1($("#sendcode"))
							$('#validateCodeError1').html("验证码已发送，请输入验证码");
							$('#validateCodeError1').css('display', 'block');
						}
						if(type == "3") {
                            settime($("#msendcode"));
							$('#mvalidateCodeError1').html("验证码已发送，请输入验证码");
							$('#mvalidateCodeError1').css('display', 'block');
						}

					} else {
						if(type == "2") {
							if(map[res.status]){
                                set1($("#sendcode"))
								$('#validateCodeError1').html(map[res.status]);
								$('#validateCodeError1').css('display', 'block');
							}
							else{
								$('#validateCodeError1').html("发送验证码失败，请稍后重试");
								$('#validateCodeError1').css('display', 'block');
							}

						}
						if(type == "3") {
							if(map[res.status]){
                                set1($("#sendcode"))
							$('#mvalidateCodeError1').html(map[res.status]);
							$('#mvalidateCodeError1').css('display', 'block');
							}
							else{
								$('#mvalidateCodeError1').html("发送验证码失败，请稍后重试");
								$('#mvalidateCodeError1').css('display', 'block');
							}
						}
					}

				}
			});
		}

		//验证新手机/邮箱是否已存在  同时发送验证码
		var checkEmail = false;

		function sendCode1(sendtype) {
			var username;
			var type;
			if('email' == sendtype) {
				username = $('#inputMyNewEmail').val();
				type = 2;
			} else if('mobile' == sendtype) {
				username = $('#inputMyNewPhone').val();
				type = 3;
			}
			var url = "/usercenter/customer/sendVerifycodeToNew";
			var checkEmail1 = false;
			$http.post({
				url: url,
				data: {
					"bindValue": username,
					"type": type,
					"ranNum": Math.random()
				},
				headers:{
						'platform' : 'platform_tcl_staff'
				},
				async: false,
				success: function(data) {
					if("1" == data.status) {
						checkEmail1 = true;
					} else {
						if('email' == sendtype) {
							if("911" == data.status) {
								$('#CodeError3').html("用户名为空");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("120" == data.status) {
								$('#CodeError3').html("两分钟之内已发过送验证码");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("5" == data.status) {
								$('#CodeError3').html("24小时之内发送验证码超过五次");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("0" == data.status) {
								$('#CodeError3').html("服务器异常,发送激活码失败");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("1214" == data.status) {
								$('#CodeError3').html("应用今日短信量达到上限");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							} else {
								$('#CodeError3').html("发送验证码失败，请稍后重试");
								$('#CodeError3').css('display', 'block');
								checkEmail1 = false;
							}
						} else if('mobile' == sendtype) {
							if("911" == data.status) {
								$('#mvalidateCodeError3').html("用户名为空");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("120" == data.status) {
								$('#mvalidateCodeError3').html("两分钟之内已发过送验证码");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("5" == data.status) {
								$('#mvalidateCodeError3').html("24小时之内发送验证码超过五次");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("0" == data.status) {
								$('#mvalidateCodeError3').html("服务器异常,发送激活码失败");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							} else if("1214" == data.status) {
								$('#mvalidateCodeError3').html("应用今日短信量达到上限");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							} else {
								$('#mvalidateCodeError3').html("发送验证码失败，请稍后重试");
								$('#mvalidateCodeError3').css('display', 'block');
								checkEmail1 = false;
							}
						}
					}
				}
			});
			return checkEmail1;
		}

		//绑定邮箱或者手机
		function bindEmailOrMobile(bindtype) {
			var type;
			var newMobileOrEmail = "";
			var validCode = "";
			var username;
			if('email' == bindtype) {
				validCode = $("#inputEmailvalidateCode4").val();
				newMobileOrEmail = $('#inputMyNewEmail').val();
				type = 2;
				username = $(".e_mail").val();
			} else {
				validCode = $("#minputvalidateCode4").val();
				newMobileOrEmail = $('#inputMyNewPhone').val();
				type = 3;
				username = $(".e_phone").val();
			}

			$http.post({
				url: "/usercenter/customer/changeBind",
				data: {
					validcode: validCode,
					bindValue: newMobileOrEmail,
					type: type,
					username: username,
					ranNum: Math.random()
				},
				headers:{
						'platform' : 'platform_tcl_staff'
				},
				success: function(data) {
					if(data.code == "0") {
						if('email' == bindtype) {
							//$("#bind_mailbox_mail .m_fourthstep").hide();
							$("#p3").show();
							$("#p2").hide();
							getUserInfo()
						} else {
						//	$("#bind_mailbox_mobile .m_fourthstep").hide();
							$("#m3").show();
							$('#m2').hide();
							getUserInfo()
						}
					} else {
						var msg = statusCode[data.code] ? statusCode[data.code] : '系统错误 '

						Msg.Alert('', msg , function (){})
						return false;
					}
				}
			});
		}

		//判断用户名是否存在
		function checkuser(username) {
			var result;
			$http.post({
				url: '/usercenter/customer/checkBindStatus',
				data: {
					bindValue: username,
					ranNum : Math.random()
				},
				headers:{
						'platform' : 'platform_tcl_staff'
				},
				dataType: 'json',
				async: false,
				success: function(res) {
					// 存在用户名
					if('0' == res.status) {
						result = true;
					} else if ('2'== res.status){
                        $("#CodeError3").show();
                        $("#CodeError3").html("你绑定的账号未能通过验证，请重新输入");
                        $("#mvalidateCodeError3").show();
                        $("#mvalidateCodeError3").html("你绑定的账号未能通过验证，请重新输入");
                        result = false;
					} else {
						$("#CodeError3").show();
						$("#CodeError3").html("你注册的账号已存在，请重新输入");
						$("#mvalidateCodeError3").show();
						$("#mvalidateCodeError3").html("你注册的账号已存在，请重新输入");
						result = false;
					}
				}
			});
			return result;
		}

		//获取验证码的函数
		var countdown = 60;
		var countdown1 = 60;
		var countdown2 = 60;

		function settime(val) {
			if(countdown == 0) {
				val.removeClass("disabled");
				val.html("重新发送验证码");
				countdown = 60;
				return true;
			} else {
				val.addClass("disabled", true);
				val.html("重新发送(" + countdown + ")");
				countdown--;
				setTimeout(function() {
					settime(val)
				}, 1000);
			}
		};

		function set1(val) {
			if(countdown1 == 0) {
				val.removeClass("disabled");
				val.html ( "重新发送验证码");
				countdown1 = 60;
				return true;
			} else {
				val.addClass("disabled", true);
				val.html ("重新发送(" + countdown1 + ")");
				countdown1--;
				setTimeout(function() {
					set1(val)
				}, 1000);
			}
		};
		function set2(val) {
			if(countdown2 == 0) {
				val.removeClass("disabled");
				val.html("重新发送验证码");
				countdown2 = 60;
				return true;
			} else {
				val.addClass("disabled", true);
				val.html("重新发送(" + countdown2 + ")");
				countdown2--;
				setTimeout(function() {
					set2(val)
				}, 1000);
			}
		};
		//更新之后及时获取用户信息
		function getUserInfo() {
			var userinfo = {}
			$http.get({
				url: "/usercenter/tclcustomer/userInfo",
				data: {
					ranNum: Math.floor(Math.random() * 10000)
				},
				success: function(data) {
					if(data.code == CODEMAP.status.success) {
						var user = JSON.stringify(data.data)
						sessionStorage.setItem("userinfo", user);
					};
				}
			})
		}
	})
})
