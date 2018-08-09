require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.Store','KUYU.userInfo', 'KUYU.SlideBarLogin','KUYU.navFooterLink','juicer','KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service,
		$init = KUYU.Init,
		$Store = KUYU.Store,
		$binder = KUYU.Binder,
		userInfo = KUYU.userInfo,
		_env = KUYU.Init.getEnv(),
		Header = KUYU.HeaderTwo,
		navFooterLink =  KUYU.navFooterLink;


		var locKey = $Store.get('_ihome_token_');
		if(!locKey) {
			$init.nextPage("login",'')
		} else {
			$binder.sync({'locKey':true})
		}

		Header.menuHover();
		Header.topSearch();
		navFooterLink();
	$(function() {
			//阻止表单提交
			document.onkeypress = function() {
					if(event.keyCode == 13) {
						return false;
					}
				}
				//获取发票设置列表
			$http.post({
				url: "/usercenter/electronInvoice/getByCustomerUuid",
				data: {ranNum : Math.random()},
				success: function(res) {
					if(res.code== "403"||res.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(res.data){
                        var html = "";
                        for(var i = 0; i < res.data.length; i++) {
                            var list = res.data[i];
                            html += '<tr><td>' + list.titleContent + '</td> <td class="y_intabedittd">' +
                                '<button type="button" customerAddressUuid="' + list.uuid + '" class="y_btn y_btn_custom3 y_editinvoice">编辑</button>' +
                                '<button type="button" customerAddressUuid="' + list.uuid + '" class="y_btn y_btn_custom2">删除</button></td></tr>'
                        }
                        $(".y_invoicetable").append(html)
					}
				}
			});
			//增加发票设置弹出框
			$(document).on('click', '.y_invoicebtn .y_btn_custom1', function() {

				$('#mainForm').attr("actio", "/usercenter/electronInvoice/create");
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
					url: "/usercenter/electronInvoice/getByUuid?uuid=" + uuid,
					data: {ranNum : Math.random()},
					success: function(res) {
						if(res.code== "403"||res.code== "-6"){
							window.location.href = "{{login}}"
						}
						if(res.code == 0){
                            $('#mainForm').attr("actio", "/usercenter/electronInvoice/update");
                            $('#mainForm').attr("uuid", uuid);
                            $('.modal-backdrop').addClass("y_show").show();
                            $('.y_editinvoicebx').css({
                                opacity: 1,
                                zIndex: '1600',
                                visibility: 'visible',
                                display: 'block'
                            }).addClass("vatInDialog");
                            var list = res.data
                            $("#titleContent").val(list.titleContent);
                            $("#electron_ratepayer").val(list.code);
						}
						else{
							Msg.Alert("","编辑发票失败，请重新再试",function(){});
						}
					}
				})
			});
			//保存发票
			$(document).on('click', '.y_editinvoicebx .y_btn_custom1', function() {
                if(titleTest() && checkElectron_ratepayer()) {
                    $(".submit").removeClass("y_btn_custom1");

                    var data1 = {};
                    data1.titleContent = filterXSS($("#titleContent").val());
                    data1.uuid = $('#mainForm').attr("uuid");
                    data1.electron_code = $("#electron_ratepayer").val();
                    var param1 = JSON.stringify(data1);
                    var data = {};
                    data.param = param1;
                    var url1 = $('#mainForm').attr("actio");
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
					$("#titleContent").val("");
                    $("#electron_ratepayer").val("");
                $(".submit").addClass("y_btn_custom1");
				})
				//抬头校验
			function titleTest() {
				var title = $("#titleContent").val();
				var titleReg = /^[a-zA-Z0-9|\u0391-\uFFE5]*$/;
                var err1 =$("#error1");
				if(title.length == 0) {
                    err1.html("请输入抬头").show();
					$(".submit").addClass("y_btn_custom1");
					return false;
				}else{
				    err1.hide();
                }
				if(!titleReg.test(title)) {
                    err1.html("请输入正确格式的抬头").show();
					$(".submit").addClass("y_btn_custom1");
					return false;
				}else{
                    err1.hide();
                }
				if(title.length > 30) {
                    err1.html("抬头应为30个字符内").show();
					$(".submit").addClass("y_btn_custom1");
					return false;
				}else{
                    err1.hide();
                }
				return true;
			}

			//验证纳税人识别号
			function checkElectron_ratepayer() {
				var electron_ratepayer = $("#electron_ratepayer").val();
				var err =  $("#eleratepayer");
				var reg = /^[0-9a-zA-Z]{15,20}$/g;
				if(electron_ratepayer) {
					if(reg.test(electron_ratepayer)) {
						err.text("");
						return true
					}else{
						err.text("请输入正确纳税人识别号字母或数字15-20位之间");
						return false;
					}
				}else{
					return true;
				}
			}
		})
		//删除发票设置
	function doDelete(uuid) {
		Msg.Confirm("","确定要删除该数据吗？",function(){
			$http.post({
				url: "/usercenter/electronInvoice/deleteByUuid?uuid=" + uuid,
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
