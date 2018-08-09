require(['KUYU.Service','KUYU.plugins.alert', 'KUYU.HeaderTwo','KUYU.Binder', 'KUYU.navHeader','xss'], function() {
	var $http = KUYU.Service,
		$binder = KUYU.Binder,
		$init = KUYU.Init,
		navHeader = KUYU.navHeader,
		$scope = KUYU.RootScope,
	$param = KUYU.Init.getParam();
	var skuNo = $param.skuNo;
	var productId = $param.productId;
	var buyNum = $param.buyNum;
	var area = {};
	var storeNote = $param.storeNote;
	var submodelUuid = $param.submodelUuid;
	var rushBuyBeginTime = $param.rushBuyBeginTime;
	var checkedProvince = "";
	var checkedCity = "";
	var checkedRegion = "";
	var checkedStreet = "";
    var secondParentCategoryName = $param.secondParentCategoryName; //预约页面用到的商品名称

	$(function() {
		navHeader(function(res) {
			if(res.code == CODEMAP.status.success) {
				res.data.title = $param.title;
				$binder.sync(res)
			} else if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) {
                window.location.href=window.location.origin+"/sign";
			}
		});
		//获取用户地址信息列表
		$http.post({
				url: "/usercenter/customeraddress/toCustomerAddressKuyu",
				data: {},
				success: function(res) {
					var html = "";
					html += '<li class="addr-li active" customeraddressuuid=' + res.data[0].uuid + '>' +
						'<h3>' + filterXSS(res.data[0].consignee) + '</h3>' +
						'<p>' + res.data[0].mobile + '</p>' +
						'<p>' + res.data[0].area + '</p>' +
						'<p>' + filterXSS(res.data[0].address) + '(' + res.data[0].zipcode + ')</p>' +
						'<span class="y_adressbtn y_editbtn"> </span>'
					for(var i = 1; i < res.data.length; i++) {
						var list = res.data[i];
						html += '<li class="addr-li" customeraddressuuid=' + list.uuid + '>' +
							'<h3>' + filterXSS(list.consignee) + '</h3>' +
							'<p>' + list.mobile + '</p>' +
							'<p>' + list.area + '</p>' +
							'<p>' + filterXSS(list.address) + '(' + list.zipcode + ')</p>' +
							'<span class="y_adressbtn y_editbtn"> </span>'
					}
					$(html).insertBefore(".new")
					area.areaId = res.data[0].uuid;
				}
			})
			//增加地址
		$(document).on('click', '.y_addlistbtn', function() {
			clear();
			var el = $(this);
			$('#callForm').attr("action", "/usercenter/customeraddress/addAddress");
			showDialog(el);
            getPro();
		});

		$(document).on('click', '.y_editadressbx .y_close,.modal-backdrop', function() {
			$('.modal-backdrop').removeClass("y_show").hide();
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
//			$("#dv_province option:selected").text("--请选择--");
//			$("#dv_city option:selected").text("--请选择--");
//			$("#dv_region option:selected").text("--请选择--");
//			$("#dv_street option:selected").text("--请选择--");
		});

		function clear(){
 			$("#address_consignee").html('')
 			$("#address_address4").html('')
 			$("#address_address").html('')
 			$("#address_mobile").html('')
 		}
		//编辑地址
		$(document).on('click', '.y_editbtn', function(event) {
			clear();
			event.stopPropagation();
			var el = $(this);
			var uuid = $(this).parents("li").attr("customerAddressUuid");
			$http.post({
				url: "/usercenter/customeraddress/getAddressByuuid?uuid=" + uuid,
				success: function(res) {
					$('#callForm').attr("action", "/usercenter/customeraddress/doEdit");
					$('#callForm').attr("uuid", uuid);
					$("input[name=consignee]").val(res.consignee)
					$("textarea[name=address]").val(res.address)
					$("input[name=mobile]").val(res.mobile)
					$("input[name=zipcode]").val(res.zipcode)
					$("input[name=telephone]").val(res.telephone)
					if(res.province<10&&res.province.length==1){
							checkedProvince = "0"+res.province;
					}else{
							checkedProvince = res.province;
					}
					checkedCity = res.city;
					checkedRegion = res.region;
					checkedStreet = res.street;
					$(document).on('change', '#provinceId', function() {
						var provinceId = $(this).val();
						showCity(provinceId, "");
						$("#dv_region").html("");
						$("#dv_street").html("");
					})
					$(document).on('change', '#cityId', function() {
						var cityId = $(this).val();
						showRegion(cityId, "");
						$("#dv_street").html("");
					})
					$(document).on('change', '#regionId', function() {
						var regionId = $(this).val();
						showStreet(regionId, "");
					})
					$(document).on('change', '#street', function() {
						$("#address_address4").text("");
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
						success: function(data) {
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
								provinceUuid: provinceId
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
								cityUuid: cityId
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
								regionUuid: regionId
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
			var formData = $('#callForm').serialize();
			var paramStrs = formData.split("&");
			var reg = /(^1[3|4|5|7|8]\d{9}$)/;
			var obj = {};
			for(var i = 0; i < paramStrs.length; i++) {
				var key = paramStrs[i].split("=")[0];
				var value = paramStrs[i].split("=")[1];
				obj[key] = filterXSS(value);
			}
			if(!obj.consignee) {
                Msg.Alert("","收货人不能为空！",function(){});
				return;
			}
			if(!/^[^0-9]+/.test(obj.consignee)) {
				$("input[name='consignee']").css({'borderColor':'#f00'})
				Msg.Alert("","请输入正确的收货人格式！",function(){});
				return;
			}
			if(!obj.province || !obj.city || !obj.region || !obj.street) {
                Msg.Alert("","收货地址选择有误！",function(){});
				return;
			}
			if($.trim(obj.mobile) == "") {
                Msg.Alert("","请输入手机号！",function(){});
				return;
			}
			if($.trim(obj.address) == "") {
				$("textarea[name='address']").css({'borderColor':'#f00'})
				Msg.Alert("","请输入收货详细地址！",function(){});
				return;
			}
			if(!reg.test(obj.mobile)) {
				$("input[name='mobile']").css({'borderColor':'#f00'})
				Msg.Alert("","请输入正确的手机号！",function(){});
				return;
			}
			if(obj.telephone && !/^([0]\d{2,3}-\d{7,8})$/.test(obj.telephone)) {
				$("input[name='telephone']").css({'borderColor':'#f00'})
				Msg.Alert("","请输入正确区号-电话号码！",function(){});
				return;
			};
			$(this).attr('disabled','true')
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
                            $(".y_btn_custom1").attr('disabled','false')
						}
						else{
                            Msg.Alert("","添加或编辑地址失败，请重新再试",function(){});
                            $(".y_btn_custom1").attr('disabled','false')
                        }
				},
				error: function(res) {
					alert("error")
				}
			})

		})

		//点击获取地址信息
		$(document).on('click', '.addr-li', function() {
			$(this).addClass("active").siblings("li").removeClass("active");
			var uuid = $(this).attr("customeraddressuuid")
			area.areaId = uuid;
		});

		//点击新增和修改时，弹出框
		function showDialog(el) {
			var _this = el.parent("li");
			$('.modal-backdrop').addClass("y_show").show();
			$('.y_editadressbx').css({
				top: "95px",
				opacity: 1,
				zIndex: '1600',
				visibility: 'visible',
				display: 'block'
			});
		}

		$(document).on('change', '#provinceId', function() {
			var provinceId = $(this).val();
			showCity(provinceId, "");
			$("#dv_region").html("");
			$("#dv_street").html("");
		})
		$(document).on('change', '#cityId', function() {
			var cityId = $(this).val();
			showRegion(cityId, "");
			$("#dv_street").html("");
		})
		$(document).on('change', '#regionId', function() {
			var regionId = $(this).val();
			showStreet(regionId, "");
		})
		$(document).on('change', '#street', function() {
			$("#address_address4").text("");
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
			success: function(data) {
				if(data) {
					$.each(data, function(k, v) {
						var checked = "";
						if(v['uuid'] == checkedProvince) {
							checked = "selected";
						}
						provinceStr = provinceStr + "<option value='" + v['uuid'] + "'" + ">" + v['provinceName'] + "</option>";
					})
				}
			}
		});
		provinceStr = provinceStr + "</select>";
		$("#dv_province").empty();
		$("#dv_province").html(provinceStr);
		}

		function showCity(provinceId, checkedCity) {
			var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
			$http.post({
				async: false,
				url: "/usercenter/region/getCitysByProvinceUuid",
				data: {
					provinceUuid: provinceId
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
					cityUuid: cityId
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
					regionUuid: regionId
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

		//reserve/createReserveOrderKuyu
		$("#submitForm").on("click", function () {
			$http.post({
				url: '/reserve/createReserveOrderKuyu',
				data: {
					skuNo: $param.skuNo,
					productId: $param.productId,
					buyNum: $param.buyNum,
					area: area.areaId,
					storeNote: $param.storeNote,
					submodelUuid: $param.submodelUuid,
					rushBuyBeginTime: $param.rushBuyBeginTime,
					checkArea: area.areaId
				},
				success: function(data) {
					if(data.code == "0") {
						window.location.href="success.html?rushBuyBeginTime="+rushBuyBeginTime+"&secondParentCategoryName="+secondParentCategoryName;
					} else{
						Msg.Alert("",data.msg,function(){});
					}
				}
			})
		});

		$binder.init();
	})
})