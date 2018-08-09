require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.Store','KUYU.userInfo', 'KUYU.SlideBarLogin','KUYU.navFooterLink','KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service,
		$binder = KUYU.Binder,
		$init = KUYU.Init,
		$Store = KUYU.Store,
		userInfo = KUYU.userInfo,
		Header = KUYU.HeaderTwo,
		navFooterLink =  KUYU.navFooterLink;

		var locKey = $Store.get('istaff_token');
		if(!locKey) {
			$init.nextPage("login",'')
		} else {
			$binder.sync({'locKey':true})
		}
	Header.menuHover();
	Header.topSearch();
	 navFooterLink();
	$(function() {
			//获取发票设置列表
			$http.post({
				url: "/usercenter/addInvoice/getByCustomerUuid",
				data: {ranNum : Math.random()},
				success: function(res) {
					if(res.code== "403"||res.code== "-6"){
						window.location.href = "{{login}}"
					}
					var html = "";
					for(var i = 0; i < res.data.length; i++) {
						var list = res.data[i];
						html += '<tr><td>' + list.companyName + '</td> <td class="y_intabedittd">' +
							'<button type="button" customerAddressUuid="' + list.uuid + '" class="y_btn y_btn_custom3 y_editinvoice">编辑</button>' +
							'<button type="button" customerAddressUuid="' + list.uuid + '" class="y_btn y_btn_custom2">删除</button></td></tr>'
					}
					$(".y_invoicetable").append(html)
				}
			});
			//增加发票设置弹出框
			$(document).on('click', '.y_invoicebtn .y_btn_custom1', function() {
				$('#mainForm').attr("action", "/usercenter/addInvoice/createAddInvoiceSetting");
				$('.modal-backdrop').addClass("y_show").show();
				$('.y_editinvoicebx').css({
					opacity: 1,
					zIndex: '1600',
					visibility: 'visible',
					display: 'block'
				}).addClass("vatInDialog");
			});
			//编辑发票设置
			$(document).on('click', '.y_intabedittd .y_btn_custom3', function() {
				var uuid = $(this).attr("customerAddressUuid");
				$http.post({
					url: "/usercenter/addInvoice/getByUuid?uuid=" + uuid,
					data: {ranNum : Math.random()},
					success: function(res) {
						if(res.code== "403"||res.code== "-6"){
							window.location.href = "{{login}}"
						}
						if(res.code== "0"){
							$('#mainForm').attr("action", "/usercenter/addInvoice/update");
							$('#mainForm').attr("uuid", uuid);
							$('.modal-backdrop').addClass("y_show").show();
							$('.y_editinvoicebx').css({
								opacity: 1,
								zIndex: '1600',
								visibility: 'visible',
								display: 'block'
							}).addClass("vatInDialog");
							var list = res.data
							$("#companyName").val(list.companyName)
							$("#code").val(list.code)
							$("#address").val(list.address)
							$("#registerMobile").val(list.registerMobile)
							$("#bankName").val(list.bankName)
							$("#bankNo").val(list.bankNo)
						}
						else{
							Msg.Alert("","编辑发票失败，请重新再试",function(){});
						}
					}
				})
			});
			//保存发票
			$(document).on('click', '.y_editinvoicebx .y_btn_custom1', function() {
					$(".submit").removeClass("y_btn_custom1");
					if((companyTest()) && (codeTest()) && (addressTest()) && (registerMobileTest()) && (bankNameTest()) && (bankNoTest())) {
						var data1 = {};
						data1.companyName = filterXSS($("#companyName").val());
						data1.code = filterXSS($("#code").val());
						data1.address = filterXSS($("#address").val());
						data1.registerMobile = filterXSS($("#registerMobile").val());
						data1.bankName = filterXSS($("#bankName").val());
						data1.bankNo = filterXSS($("#bankNo").val());
						data1.uuid = $('#mainForm').attr("uuid");
						var param1 = JSON.stringify(data1);
						var data = {};
						data.param = param1;
						var url1 = $('#mainForm').attr("action");
						$http.post({
							url: url1,
							data: data,
							success: function(res) {
								if(res.code== "403"||res.code== "-6"){
									window.location.href = "{{login}}"
								}
								if(res.code == 0) {
									window.location.reload(true);
								}
								else{
									Msg.Alert("","添加或编辑发票失败，请重新再试",function(){});
									$(".submit").addClass("y_btn_custom1");
								}
							}
						})
					}
				})
				//删除发票
			$(document).on('click', '.y_btn_custom2', function() {
					var el = $(this);
					var uuid = $(this).attr("customerAddressUuid");
					doDelete(uuid)
				})
				//去掉弹出框
			$(".y_close").click(function() {
				$('.modal-backdrop').removeClass("y_show").hide();
				$('.y_editinvoicebx').removeAttr('style');
				$("#companyName").val("");
				$("#code").val("");
				$("#address").val("");
				$("#registerMobile").val("");
				$("#bankName").val("");
				$("#bankNo").val("");
				$(".submit").addClass("y_btn_custom1");
			})

			//抬头校验
			var titleReg = /^[a-zA-Z0-9|\d|\u0391-\uFFE5]*$/;
			function companyTest() {
				var company = $("#companyName").val();
				if(company.length == 0) {
					$("#error1").html("请输入公司名称");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				if(!titleReg.test(company)) {
					$("#error1").html("请输入正确的公司名称");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				$("#error1").html("");
				return true;
			}

			//纳税人识别号校验
			function codeTest() {
				var code = $("#code").val();
				var err = $("#error2");
				var reg = /^[0-9a-zA-Z]{15,20}$/g;
				if(code) {
					if(reg.test(code)) {
						err.text("");
						$(".submit").removeClass("y_btn_custom1");
						return true
					}else{
						err.text("请输入正确纳税人识别号字母或数字15-20位之间").show();
						$(".submit").addClass("y_btn_custom1");
						$("#add_code").focus();
						return false;
					}
				}else{
					$(".submit").removeClass("y_btn_custom1");
					return true;
				}
			}

			//注册地址校验
			function addressTest() {
				var address = $("#address").val();
                if(address.length == 0) {
					$("#error3").html("请输入注册地址");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				if(!titleReg.test(address)) {
					$("#error3").html("请输入正确的注册地址");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				$("#error3").html("");
				return true;
			}

			//注册电话校验
			function registerMobileTest() {
				var titlemobile_Reg = /^(1[3|4|5|7|8][0-9]\d{8})$|^([0]\d{2,3}-\d{7,8})$/
				var registerMobile = $("#registerMobile").val();
				if(registerMobile.length == 0) {
					$("#error4").html("请输入注册电话");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				if(!titlemobile_Reg.test(registerMobile)) {
					$("#error4").html("请输入正确的注册电话手机或座机如:0755-1234567");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				$("#error4").html("");
				return true;
			}

			//开户行校验
			function bankNameTest() {
				var bankName = $("#bankName").val();
				if(bankName.length == 0) {
					$("#error5").html("请输入开户行");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				if(!titleReg.test(bankName)) {
					$("#error5").html("请输入正确的开户行");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				$("#error5").html("");
				return true;
			}

			//银行账户校验
			function bankNoTest() {
				var bank =  /^\d{16,19}$/;
				var bankNo = $("#bankNo").val();
				if(bankNo.length == 0) {
					$("#error6").html("请输入银行账户");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				if(!bank.test(bankNo)) {
					$("#error6").html("请输入正确的银行账户");
					$(".submit").addClass("y_btn_custom1");
					return false;
				}
				$("#error6").html("");
				return true;
			}
		})
		//删除发票设置
	function doDelete(uuid) {
		Msg.Confirm("","确定要删除该数据吗？",function(){
			$http.post({
				url: "/usercenter/addInvoice/deleteByUuid?uuid=" + uuid,
				data: {ranNum : Math.random()},
				success: function(res) {
					if(res.code== "403"||res.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(res.code == 0) {
						window.location.reload();
					}
					else{
						Msg.Alert("","删除发票失败，请重新再试",function(){});
					}
				}
			})
		})
	}
})
