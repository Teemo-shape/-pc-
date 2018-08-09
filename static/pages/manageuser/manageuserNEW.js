//接口文档在confluence上
require(['KUYU.Service',  'KUYU.userInfo','KUYU.HeaderTwo', 'KUYU.Binder','KUYU.HeaderTwo','KUYU.Store', 'KUYU.SlideBarLogin', 'juicer','KUYU.navFooterLink'], function() {

	var $http = KUYU.Service,
		$init = KUYU.Init,
		$binder = KUYU.Binder,
		userInfo = KUYU.userInfo,
		$Store = KUYU.Store,
		$scope = KUYU.RootScope,
		_env = KUYU.Init.getEnv(),
        Header = KUYU.HeaderTwo,
        navFooterLink =  KUYU.navFooterLink;
    Header.menuHover();
    Header.topSearch();
		navFooterLink();
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
        0:'验证码错误',
		'-1':'换绑失败'
	};

	var locKey = $Store.get('istaff_token');
	if(!locKey) {
		window.location.href=window.location.origin+"/sign"
	} else {
		$binder.sync({'locKey':true})
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
					$("#oldemail").val(bindMail)
				}
				else{
					$(".e_mail").val("")
				}
				if(bindPhone && bindPhone!="null" && bindMail!= null) {
					$(".e_phone").val(bindPhone)
						$("#oldmobile").val(bindPhone)
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
							$("#oldemail").val(bindMail)
					}
					else{
						$(".e_mail").val("")
					}
					if(bindPhone && bindPhone!="null" && bindMail!= null) {
						$(".e_phone").val(bindPhone)
						$("#oldmobile").val(bindPhone)
					}
					else{
						$(".e_phone").val("")
					}
				})
			}
			var _type = window.location.search.substring(1).split('=')[1];
			if(_type=="mail"){
				$('#bind_mailbox_mobile').hide();
				$('#bind_mailbox_mail').show()
				if($(".e_mail").val()!='') {
					$("#bindTit").html("修改邮箱账号");
					$('#oldemail').val($(".e_mail").val());
					$('#p1').show()
				} else {
					$("#bindTit").html("绑定邮箱");
					$('#p1').hide();
					$('#p2').show();
				}
			}else if(_type=='phone'){
				$('#bind_mailbox_mobile').show();
				$('#bind_mailbox_mail').hide()
				if($(".e_phone").val()!='') {
					$("#bindTit").html("修改手机绑定");
					$('#oldemobile').val($(".e_phone").val());
					$('#m1').show();
					$(".msendcode").click(function(){
                        sendCode1("mobile")
                        settime1($("#msendcode1")[0]);
					})
				} else {
					$("#bindTit").html("绑定手机");
					$('#m1').hide();
					$('#m2').show();
				}
			}




					//新绑邮箱
			if(bindMail == "" || bindMail == null || bindMail == "null") {
				$(document).on('click', '#btn_p2', function() {
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
					} else {
						var inputCode = $('#inputEmailvalidateCode4').val();
						if("" == inputCode || null == inputCode) {
							$('#CodeError4').text("请输入验证码");
							$('#CodeError4').css('display', 'block');
							return false;
						} else {
							bindEmailOrMobile1('email')
						}
						// if(!sendCode1('email')) {
						// 	return false;
						// } else {
						// 	$("#p2").hide();
						// 	$("#p3").show();
						// 	$('#fnt_inputMyNewEmail').html(inputMyNewEmail);
						// 	$(function() {
						// 		settime1($("#sendcode1")[0]);
						// 	})
						// }
					}
				});
				// $(document).on('click', '#btn_p3', function() {
				// 	var inputCode = $('#inputEmailvalidateCode4').val();
				// 	if("" == inputCode || null == inputCode) {
				// 		$('#CodeError4').text("请输入验证码");
				// 		$('#CodeError4').css('display', 'block');
				// 		return false;
				// 	} else {
				// 		bindEmailOrMobile1('email')
				// 	}
				// });
				$(document).on('click', '#btn_p3', function() {
					$(this).parents('#p3').hide().siblings("#p1").show();
					window.location.reload();
				});
				//新邮箱获取验证码
				$("#sendcode1").click(function() {
					checkEmail = sendCode1("email")
					if (checkEmail) {
                        settime1($("#sendcode1"));
                    }
				})
			}

					//新绑手机
			if(bindPhone == "" || bindPhone == null || bindPhone == "null") {
				$(document).on('click', '#btn_m2', function() {
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
					} else {
						var inputCode = $('#minputvalidateCode4').val();
						if(!inputCode) {
							$('#mvalidateCodeError4').text("请输入验证码");
							$('#mvalidateCodeError4').css('display', 'block');
							return false;
						} else {
							bindEmailOrMobile1('mobile')
						}
						// if(!sendCode1('mobile')) {
						// 	return false;
						// } else {
						// 	$("#m2").hide();
						// 	$("#m3").show();
						// 	$('#fnt_inputMyNewPhone').html(inputMyNewPhone);
						// 	$(function() {
						// 		settime1($("#msendcode1")[0]);
						// 	})
						// }
					}
				});
				// $(document).on('click', '#btn_m3', function() {
				// 	var inputCode = $('#minputvalidateCode4').val();
				// 	if(!inputCode) {
				// 		$('#mvalidateCodeError4').text("请输入验证码");
				// 		$('#mvalidateCodeError4').css('display', 'block');
				// 		return false;
				// 	} else {
				// 		bindEmailOrMobile1('mobile')
				// 	}
				// });
				$(document).on('click', '#btn_m3', function() {
					$(this).parents('#m3').hide().siblings("#m1").show();
				});
				//新手机重新获取验证码
				$("#msendcode1").click(function() {
					if($("#msendcode1").hasClass("disabled")){
						return
					}
					if(sendCode1("mobile")){
                        settime1($("#msendcode1"));
					}

				})
			}

			//验证新手机/邮箱是否已存在  同时发送验证码
			var checkEmail = true;

			function sendCode1(sendtype) {
				var username;
				var type;
				if('email' == sendtype) {
					username = $('#inputMyNewEmail').val();
					type = "email";
				} else if('mobile' == sendtype) {
					username = $('#inputMyNewPhone').val();
					type = "mobile";
				}
				var url = "/usercenter/customer/toBindMobileOrEmail";
				var checkEmail1 = false;
				$http.post({
					url: url,
					headers:{
							'platform' : 'platform_tcl_staff'
					},
					data: {
						"mobileOrEmail": username,
						"type": type,
						"ranNum": Math.random()
					},
					async: false,
					success: function(data) {
						console.log(data)
						if("1" == data.code) {
							checkEmail1 = true;

						} else {
							if('email' == sendtype) {
								if("2" == data.code) {
									$('#CodeError3').html("要绑定的邮箱或手机已经注册或绑定");
									$('#CodeError3').css('display', 'block');
									checkEmail1 = false;
								} else if("120" == data.code) {
									$('#CodeError3').html("一分钟之内已发过送验证码");
									$('#CodeError3').css('display', 'block');
									checkEmail1 = false;
                                } else if("-8" == data.code) {
                                    $('#CodeError3').html("您绑定的邮箱无法通过验证，请重新输入");
                                    $('#CodeError3').css('display', 'block');
                                    checkEmail1 = false;
								} else if("310" == data.code) {
									$('#CodeError3').html("用户已绑定过手机");
									$('#CodeError3').css('display', 'block');
									checkEmail1 = false;
								} else if("320" == data.code) {
									$('#CodeError3').html("用户已绑定过邮箱");
									$('#CodeError3').css('display', 'block');
									checkEmail1 = false;
								} else {
									$('#CodeError3').html("发送验证码失败，请稍后重试");
									$('#CodeError3').css('display', 'block');
									checkEmail1 = false;
								}
							} else if('mobile' == sendtype) {
								if("2" == data.code) {
									$('#mvalidateCodeError3').html("要绑定的邮箱或手机已经注册或绑定");
									$('#mvalidateCodeError3').css('display', 'block');
									checkEmail1 = false;
								} else if("120" == data.code) {
									$('#mvalidateCodeError3').html("一分钟之内已发过送验证码");
									$('#mvalidateCodeError3').css('display', 'block');
									checkEmail1 = false;
								} else if("310" == data.code) {
									$('#mvalidateCodeError3').html("用户已绑定过手机");
									$('#mvalidateCodeError3').css('display', 'block');
									checkEmail1 = false;
								} else if("320" == data.code) {
									$('#mvalidateCodeError3').html("用户已绑定过邮箱");
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
			function bindEmailOrMobile1(bindtype) {

				var newMobileOrEmail = "";
				var validCode = "";

				if('email' == bindtype) {
					validCode = $("#inputEmailvalidateCode4").val();
					newMobileOrEmail = $('#inputMyNewEmail').val();
				} else {
					validCode = $("#minputvalidateCode4").val();
					newMobileOrEmail = $('#inputMyNewPhone').val();
				}
				$http.post({
					url: "/usercenter/customer/bindInfo",
					headers:{
	            'platform' : 'platform_tcl_staff'
	        },
					data: {
						validcode: validCode,
						mobileOrEmail: newMobileOrEmail,
						type: bindtype,
						ranNum: Math.random()
					},
					success: function(data) {
						if(data.code == "1") {
							if('email' == bindtype) {
								$("#p3").show();
								$("#p2").hide();
								getUserInfo()
							} else {
								$("#m3").show();
								$('#m2').hide();
								getUserInfo()
							}
						} else {
						    var msg = statusCode[data.code] ? statusCode[data.code] : '系统错误 ';
                Msg.Alert('', msg , function (){});
						}
					}
				});
			}

		})
		//获取验证码的函数
	var countdown = 60;

	function settime1(val) {
		if(countdown == 0) {
			val.removeClass("disabled");
			val.html("重新发送验证码");
			countdown = 60;
			return true;
		} else {
			val.addClass("disabled");
			val.html("重新发送(" + countdown + ")");
			countdown--;
			setTimeout(function() {
				settime1(val)
			}, 1000);
		}
	};
		//更新之后及时获取用户信息
		function getUserInfo() {
			var userinfo = {}
			$http.get({
				url: "/usercenter/tclcustomer/userInfo",
        headers:{
            'platform' : 'platform_tcl_staff'
        },
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
