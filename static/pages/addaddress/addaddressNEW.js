require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder','KUYU.Store', 'KUYU.userInfo', 'KUYU.SlideBarLogin', 'KUYU.navFooterLink','KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service,
		$binder = KUYU.Binder,
		$init = KUYU.Init,
		$Store = KUYU.Store,
		userInfo = KUYU.userInfo,
		Header = KUYU.HeaderTwo,
		_env = KUYU.Init.getEnv(),
		navFooterLink = KUYU.navFooterLink;

		var locKey = $Store.get('istaff_token');
		if(!locKey) {
			$init.nextPage("login",'')
		} else {
			$binder.sync({'locKey':true})
		}

	// Header.menuHover();
    $init.Ready(function() {
        Header.menuHover();
    })
	Header.topSearch();
	navFooterLink();
	var checkedProvince = "";
	var checkedCity = "";
	var checkedRegion = "";
	var checkedStreet = "";
	$(function() {
			//获取用户地址信息列表
			$http.post({
					url: "/usercenter/customeraddress/toCustomerAddressKuyu",
					data: {ranNum : Math.random()},
					success: function(res) {
						if(res.code == "403" || res.code == "-6") {
							window.location.href = "{{login}}"
						}
						var html = "";
						if(res.data) {
							for(var i = 0; i < res.data.length; i++) {
								var list = res.data[i];
								html += '<li class="address_list" isdefalut=' + list.isDefault + '>' +
									'<h3>' + filterXSS(list.consignee) + '<span>' + list.mobile + '</span></h3>' +
									'<p>' + list.area + filterXSS(list.address)  //+'(' + filterXSS(list.zipcode) + ')'
								+'</p>'
								// if(list.isDefault == "1") {
								// 	html += '<a customeraddressuuid=' + list.uuid + '><span class="no_default_address" style="display: none;cursor:pointer;">设为默认</span>' +
								// 		'<span class="default_address" style="display: block;cursor:pointer;">默认地址</span></a>'
								// } else {
									html += '<a customeraddressuuid=' + list.uuid + '><span class="no_default_address" style="display: none;cursor:pointer;">设为默认</span>' +
										'<span class="default_address" style="display: none;cursor:pointer;">默认地址</span></a>'
								// }

								html +=
									'<span class="y_adressbtn y_deletbtn" customeraddressuuid=' + list.uuid + '>删除</span>'+
									'<span class="y_adressbtn y_editbtn" customeraddressuuid=' + list.uuid + '>修改</span></li>'
							}
						}
						$(".y_adresslist").prepend(html);
						show()
					}
				})
				//增加地址
			$(document).on('click', '.y_addlistbtn', function() {
				var el = $(this);
				$('#callForm').attr("action", "/usercenter/customeraddress/addAddress");
				showDialog(el);
				getPro();
			});
			//设置默认地址
			$(document).on('click', '.no_default_address', function() {
					var el = $(this);
					var uuid = $(this).parent().attr("customerAddressUuid");
					setDefault(uuid)
				})
				//取消弹出框
			$(document).on('click', '.y_editadressbx .y_close,.modal-backdrop', function() {
				$('.modal-backdrop').hide();
				$('.y_editadressbx').removeAttr('style');
				$("input[name=consignee]").val("")
				$("textarea[name=address]").val("")
				$("input[name=mobile]").val("")
				$("input[name=zipcode]").val("")
				$("input[name=telephone]").val("")
				$("#dv_province").empty();
				$("#dv_city").empty();
				$("#dv_region").empty();
				$("#dv_street").empty();
				$(".submit").addClass("y_btn_custom1");
			});
			//删除地址
			$(document).on('click', '.y_deletbtn', function() {
					var el = $(this);
					var uuid = $(this).attr("customerAddressUuid");
					Delete(uuid)
				})
				//编辑地址
			$(document).on('click', '.y_editbtn', function() {
				var el = $(this);
				var uuid = $(this).attr("customerAddressUuid");
				$http.post({
					url: "/usercenter/customeraddress/getAddressByuuid?uuid=" + uuid,
					data: {ranNum : Math.random()},
					success: function(res) {
						if(res.code == "403" || res.code == "-6") {
							window.location.href = "{{login}}"
						}
						$('#callForm').attr("action", "/usercenter/customeraddress/doEdit");
						$('#callForm').attr("uuid", uuid);
						$("input[name=consignee]").val(res.consignee)
						$("textarea[name=address]").val(res.address)
						$("input[name=mobile]").val(res.mobile)
						$("input[name=zipcode]").val(res.zipcode)
						$("input[name=telephone]").val(res.telephone)
						checkedProvince = res.province;
						checkedCity = res.city;
						checkedRegion = res.region;
						checkedStreet = res.street;
						$(document).on('change', '#provinceId', function() {
							var provinceId = $(this).val();
							if(provinceId) {
								showCity(provinceId, "");
								$("#dv_region").html("")
								$("#dv_street").html("");
							}else{
								$("#dv_city").html("");
								$("#dv_region").html("")
								$("#dv_street").html("");
							}
						})
						$(document).on('change', '#cityId', function() {
							var cityId = $(this).val();
							if(cityId) {
								showRegion(cityId, "");
								$("#dv_street").html("");

							}else{
								$("#dv_region").html("")
								$("#dv_street").html("");
							}
						})
						$(document).on('change', '#regionId', function() {
							var regionId = $(this).val();
							if(regionId) {
								showStreet(regionId, "");
							}else{
								$("#dv_street").html("");
							}
						})
						if("" != checkedCity) {
							showCity(checkedProvince, checkedCity);
						}
						if("" != checkedRegion) {
							showRegion(checkedCity, checkedRegion);
						}

						if("" != checkedStreet) {
							showStreet(checkedRegion, checkedStreet);
						}

						//获取省
						var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
						$http.post({
							async: false,
							url: "/usercenter/region/getAllProvince",
							data: {ranNum : Math.random()},
							success: function(data) {
								if(data.code == "403" || data.code == "-6") {
									window.location.href = "{{login}}"
								}
								if(data) {
									$.each(data, function(k, v) {
										var checked = "";
										if(v['uuid'] == checkedProvince) {
											checked = "selected";
										}
										provinceStr = provinceStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['provinceName'] + "</option>";
									})
								}
							}
						});
						provinceStr = provinceStr + "</select>";
						$("#dv_province").html(provinceStr);

						function showCity(provinceId, checkedCity) {
							var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
							$http.post({
								async: false,
								url: "/usercenter/region/getCitysByProvinceUuid",
								data: {
									provinceUuid: provinceId,
									ranNum : Math.random()
								},
								success: function(data) {
									if(data) {
										$.each(data, function(k, v) {
											var checked = "";
											if(v['uuid'] == checkedCity) {
												checked = "selected";
											}
											cityStr = cityStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['cityName'] + "</option>";
										})
									}
								}
							});
							cityStr = cityStr + "</select>";
							$("#dv_city").html(cityStr);
						}

						function showRegion(cityId, checkRegion) {
							var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
							$http.post({
								async: false,
								url: "/usercenter/region/getRegionsByCityUuid",
								data: {
									cityUuid: cityId,
									ranNum : Math.random()
								},
								success: function(data) {
									if(data) {
										$.each(data, function(k, v) {
											var checked = "";
											if(v['uuid'] == checkRegion) {
												checked = "selected";
											}
											regionStr = regionStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['regionName'] + "</option>";
										})
									}
								}
							});
							regionStr = regionStr + "</select>";
							$("#dv_region").html(regionStr);
						}

						function showStreet(regionId, checkStreet) {
							var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
							$http.post({
								async: false,
								url: "/usercenter/region/getStreetsByRegionUuid",
								data: {
									regionUuid: regionId,
									ranNum : Math.random()
								},
								success: function(data) {
									if(data) {
										$.each(data, function(k, v) {
											var checked = "";
											if(v['uuid'] == checkStreet) {
												checked = "selected";
											}
											streetStr = streetStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['streetName'] + "</option>";
										})
									}
								}
							});
							streetStr = streetStr + "</select>";
							$("#dv_street").html(streetStr);
						}
						showDialog(el);
					}
				});
			})

			//保存地址
			$(document).on('click', '.y_btn_custom1', function() {
				$(".submit").removeClass("y_btn_custom1");
				var formData = $('#callForm').serialize();
				var paramStrs = formData.split("&");
				var reg = /(^1[3|4|5|6|7|8|9]\d{9}$)/;
				var obj = {};
				for(var i = 0; i < paramStrs.length; i++) {
					var key = paramStrs[i].split("=")[0];
					var value = paramStrs[i].split("=")[1];
					obj[key] = filterXSS(value);
				}
				if(!obj.consignee) {
					Msg.Alert("","收货人不能为空!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				if($("#consignee").val().length > 10){
					Msg.Alert("","收货人姓名不能超过十个字符!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				if(!/^[^0-9]+/.test(obj.consignee)) {
					Msg.Alert("","请输入正确的收货人格式!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				if(!obj.province || !obj.city || !obj.region || !obj.street) {
					Msg.Alert("","收货地址选择有误!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				if($.trim(obj.mobile) == "") {
					Msg.Alert("","请输入手机号!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				if($.trim(obj.address) == "") {
					Msg.Alert("","请输入收货详细地址!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
                if($("#address").val().length > 40){
                    Msg.Alert("","详细地址不能超过四十个字符!",function(){});
                    $(".submit").addClass("y_btn_custom1");
                    return;
                }
				if(!reg.test(obj.mobile)) {
					Msg.Alert("","请输入正确的手机号!",function(){});
					$(".submit").addClass("y_btn_custom1");
					return;
				}
				var provinceText = $.trim($("#dv_province option:selected").text());
				var cityText = $.trim($("#dv_city option:selected").text());
				var regionText = $.trim($("#dv_region option:selected").text());
				var streetText = $.trim($("#dv_street option:selected").text());
				obj.area = provinceText + cityText + regionText + streetText;
				obj.uuid = $('#callForm').attr("uuid");
				var param1 = JSON.stringify(obj);
				var data = {};
				data.param = param1;
				var url1 = $('#callForm').attr("action");
				$http.post({
					url: url1,
					data: data,
					success: function(res) {
						if(res.code == "403" || res.code == "-6") {
							window.location.href = "{{login}}"
						}
						if(res.status == 1) {
						window.location.reload(true);
						}
						else{
							Msg.Alert("","添加或编辑地址失败，请重新再试",function(){});
							$(".submit").addClass("y_btn_custom1");
						}
					}
				})

			})

			//默认字样显示消失样式
			function show() {
				$(".address_list").mouseover(function() {
					if($(this).attr("isDefalut") != "1") {
						$(this).find(".no_default_address").show();
					} else {
						$(this).find(".default_address").show();
					}
				});
				$(".address_list").mouseout(function() {
					$(this).find(".no_default_address").hide();
				});
			}
			//点击新增和修改时，弹出框
			function showDialog(el) {
				var _this = el.parent("li");
				$('.modal-backdrop').show();
				$('.y_editadressbx').css({
					top: "35px",
					opacity: 1,
					zIndex: '1600',
					visibility: 'visible',
					display: 'block'
				});
			}
		})
		//删除地址
	function Delete(uuid) {
		Msg.Confirm("","确定删除地址吗？",function(){
			$http.post({
				url: "/usercenter/customeraddress/delDeliveryAddress?uuid=" + uuid,
				data: {ranNum : Math.random()},
				success: function(res) {
					if(res.code == "403" || res.code == "-6") {
						window.location.href = "{{login}}"
					}
					if(res == 'true') {
						window.location.reload();
					}
					else{
						Msg.Alert("","删除地址失败，请重新再试",function(){});
					}
				}
			})
		})
	}
	//设置会员默认收货地址
	function setDefault(uuid) {
		$http.post({
			url: "/usercenter/customeraddress/setDefault?uuid=" + uuid,
			data: {ranNum : Math.random()},
			success: function(res) {
				if(res.code == "403" || res.code == "-6") {
					window.location.href = "{{login}}"
				}
				if(res.code == 0) {
					window.location.reload();
				}
				else{
					Msg.Alert("","设置默认地址失败，请重新再试",function(){});
				}
			}
		})
	}

	$(document).on('change', '#provinceId', function() {
		var provinceId = $(this).val();
		if(provinceId) {
			showCity(provinceId, "");
			$("#dv_region").html("")
			$("#dv_street").html("");
		}else{
			$("#dv_city").html("");
			$("#dv_region").html("")
			$("#dv_street").html("");
		}
	})
	$(document).on('change', '#cityId', function() {
		var cityId = $(this).val();
		if(cityId) {
			showRegion(cityId, "");
			$("#dv_street").html("");

		}else{
			$("#dv_region").html("")
			$("#dv_street").html("");
		}
	})
	$(document).on('change', '#regionId', function() {
		var regionId = $(this).val();
		if(regionId) {
			showStreet(regionId, "");
		}else{
			$("#dv_street").html("");
		}
	})
	if("" != checkedCity) {
		showCity(checkedProvince, checkedCity);
	}
	if("" != checkedRegion) {
		showRegion(checkedCity, checkedRegion);
	}

	if("" != checkedStreet) {
		showStreet(checkedRegion, checkedStreet);
	}

	//获取省
	function getPro(){
	var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true'><option select value=''>--请选择--</option>";
	$http.post({
		async: false,
		url: "/usercenter/region/getAllProvince",
		data: {ranNum : Math.random()},
		success: function(data) {
			if(data.code == "403" || data.code == "-6") {
				window.location.href = "{{login}}"
			}
			if(data) {
				$.each(data, function(k, v) {
					var checked = "";
					if(v['uuid'] == checkedProvince) {
						checked = "selected";
					}
					provinceStr += "<option value='" + v['uuid'] + "'"  + ">" + v['provinceName'] + "</option>";
				})
			}
		}
	});
	provinceStr +=   "</select>";
	$("#dv_province").empty();
	$("#dv_province").html(provinceStr);
	}

	function showCity(provinceId, checkedCity) {
		var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
		$http.post({
			async: false,
			url: "/usercenter/region/getCitysByProvinceUuid",
			data: {
				provinceUuid: provinceId,
				ranNum : Math.random()
			},
			success: function(data) {
				if(data) {
					$.each(data, function(k, v) {
						var checked = "";
						if(v['uuid'] == checkedCity) {
							checked = "selected";
						}
						cityStr = cityStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['cityName'] + "</option>";
					})
				}
			}
		});
		cityStr = cityStr + "</select>";
		$("#dv_city").empty();
		$("#dv_city").html(cityStr);
	}

	function showRegion(cityId, checkRegion) {
		var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
		$http.post({
			async: false,
			url: "/usercenter/region/getRegionsByCityUuid",
			data: {
				cityUuid: cityId,
				ranNum : Math.random()
			},
			success: function(data) {
				if(data) {
					$.each(data, function(k, v) {
						var checked = "";
						if(v['uuid'] == checkRegion) {
							checked = "selected";
						}
						regionStr = regionStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['regionName'] + "</option>";
					})
				}
			}
		});
		regionStr = regionStr + "</select>";
		$("#dv_region").empty();
		$("#dv_region").html(regionStr);
	}

	function showStreet(regionId, checkStreet) {
		var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
		$http.post({
			async: false,
			url: "/usercenter/region/getStreetsByRegionUuid",
			data: {
				regionUuid: regionId,
				ranNum : Math.random()
			},
			success: function(data) {
				if(data) {
					$.each(data, function(k, v) {
						var checked = "";
						if(v['uuid'] == checkStreet) {
							checked = "selected";
						}
						streetStr = streetStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['streetName'] + "</option>";
					})
				}
			}
		});
		streetStr = streetStr + "</select>";
		$("#dv_street").empty();
		$("#dv_street").html(streetStr);
	}
})
