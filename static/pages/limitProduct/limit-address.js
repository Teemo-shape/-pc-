require(['KUYU.Service', 'KUYU.SlideBarLogin', 'juicer','KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service;
	var slidBarLogin = KUYU.SlideBarLogin;
	var $param = KUYU.Init.getParam();
	var checkedProvince = "";
	var checkedCity = "";
	var checkedRegion = "";
	var checkedStreet = "";
	var parama={
    		productSku:$param.skuNo,
    		promotionUuid:$param.promotionUuid,
    	}
	$(function() {
		$("#submitForm").addClass("disabled");
		$("#submitForm").html("立即下订单");
		//获取默认用户地址信息列表
		$http.post({
			url: "/usercenter/customeraddress/toCustomerAddressKuyu",
			async: false,
			success: function(res) {
				var tpl = ['{@each data as list}',
					'$${list|getAddress1}',
					'{@/each}',
				].join('');
				var getAddress1 = function(list) {
					//如果默认地址是1，电子发票抬头为收货人姓名

					if(list.isDefault == "1") {
						changeAddress(list.uuid)
						$("#checkArea").val(list.uuid);
//						$("#electron_titleContent").val(list.consignee);
						$("#submitForm").removeClass("disabled");
						return '<li class="item view address_list active"' + '" isdefalut=' + list.isDefault + ' customeraddressuuid=' + list.uuid + '>' +
							'<span class="view-stock"></span>' +
							'<span class="red"></span>' +
							'<p class="name-text">' +
							'<input type="hidden" name="area" value=' + list.uuid + '>' +
							'<span class="person">' + filterXSS(list.consignee) + '</span>' +
							'</p>' +
							'<p class="addr-text">' +
							list.area + "　" + filterXSS(list.address) +
							'</p>' +
							'<input type="hidden" name="address" id="address" value="' + list.address + '">' +
							'<p class="edit-text">' +
							'<a href="javascript:;" customeraddressuuid=' + list.uuid + '>' +
							'<span class="fr edit y_editbtn" customerAddressUuid=' + list.uuid + '>修改</span>' +
							'</a>' +
							'</p><br>' +
							'<p class="edit-text">' +
							'<a customeraddressuuid=' + list.uuid + '><span class="no_default_address fr edit" style="display: none;">设为默认</span>' +
							'<span class="default_address fr edit" style="display: none;">已默认</span></a> ' +
							'</a>' +
							'</p><br>' +
							'<input type="hidden" name="mobile" id="mobile" value="' + list.mobile + '">' +
							'</li>'
					}

				};
				juicer.register('getAddress1', getAddress1);
				var result = juicer(tpl, res);
				$(result).insertBefore(".new");
				show()
			}
		});
		//获取没有默认的用户地址信息列表
		$http.post({
				url: "/usercenter/customeraddress/toCustomerAddressKuyu",
				async: false,
				success: function(res) {
					var tpl = ['{@each data as list}',
						'$${list|getAddress0}',
						'{@/each}',
					].join('');
					var getAddress0 = function(list) {

						if(list.isDefault == "0") {
							return '<li class="item view address_list" isdefalut=' + list.isDefault + ' customeraddressuuid=' + list.uuid + '>' +
								'<span class="view-stock"></span>' +
								'<span class="red"></span>' +
								'<p class="name-text">' +
								'<input type="hidden" name="area" value=' + list.uuid + '>' +
								'<span class="person">' + filterXSS(list.consignee) + '</span>' +
								'</p>' +
								'<p class="addr-text">' +
								list.area + "　" + filterXSS(list.address) +
								'</p>' +
								'<p class="edit-text">' +
								'<a href="javascript:;" customeraddressuuid=' + list.uuid + '>' +
								'<span class="fr edit y_editbtn" customerAddressUuid=' + list.uuid + '>修改</span>' +
								'</a>' +
								'</p><br>' +
								'<p class="edit-text">' +
								'<a customeraddressuuid=' + list.uuid + '><span class="no_default_address fr edit" style="display: none;">设为默认</span>' +
								'<span class="default_address fr edit" style="display: none;">已默认</span></a> ' +
								'</a>' +
								'</p><br>' +
								'</li>'
						}
					}
					juicer.register('getAddress0', getAddress0);
					var result = juicer(tpl, res)
					$(result).insertBefore(".new")
					show()
				}
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
		//遍历地址节点,没有默认地址时候默认第一个为选中地址
		$('li.address_list').each(function(index) {
			var defalut = $(this).attr("isdefalut");
			if(defalut == 1) {
				return false
			} else {
				var uuid0 = $(".address_list").eq(0).attr("customeraddressuuid");
				var consignee0 = $(".address_list").eq(0).find(".person").html();
				$(".address_list").eq(0).addClass("active");
				$("#checkArea").val(uuid0);
				changeAddress(uuid0)
//				$("#electron_titleContent").val(consignee0);
				$("#submitForm").removeClass("disabled");
				$("#submitForm").html("立即下订单");
				return false;
			}
			return false;
		})

		//点击选取收获地址信息
		$(document).on('click', '.address .view', function() {
//			$("#electron_titleContent").attr("uuid","")
			$(this).addClass("active").siblings("li").removeClass("active");
//			$("#electron_titleContent").val($(this).find(".person").html())
			var uuid = $(this).attr("customeraddressuuid")
			$(this).siblings().find(".view-stock").text('');
			changeAddress(uuid)
			$("#checkArea").val(uuid)
			$("#submitForm").removeClass("disabled");
		});
		//点击发票显示隐藏说明
		$(".elehide").click(function() {
				$(".tip-dialog").toggle()
				event.stopPropagation();
			})
			//点击空白地方隐藏说明
		$("body").click(function() {
			$(".tip-dialog").hide()
		})

		//点击新增按钮
		$(document).on('click', '.add-address', function() {
				clear();	
			$('.add-ress').show();
			$("#addressDiv").show()
			$('#mask-address').css({
				opacity: 1,
				zIndex: '1501',
				visibility: 'visible',
				display: 'block'
			});
			$('#addAddressId').attr("action", "/usercenter/customeraddress/addAddress");
			$("#addressDiv h3").html("添加地址");
			getPro();
		});
		function clear(){
 			$("#address_consignee").html('')
 			$("#address_address4").html('')
 			$("#address_address").html('')
 			$("#address_mobile").html('')
 		}
		//编辑地址
		$(document).on('click', '.y_editbtn', function() {
				clear();	
				$("#addressDiv h3").html("修改地址");
				var uuid = $(this).attr("customerAddressUuid");
				$http.post({
					url: "/usercenter/customeraddress/getAddressByuuid?uuid=" + uuid,
					success: function(res) {
						$('#addAddressId').attr("action", "/usercenter/customeraddress/doEdit");
						$('#addAddressId').attr("uuid", uuid);
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
							$("#regionsId").html("");
							$("#streets").html("");
						})
						$(document).on('change', '#cityId', function() {
							var cityId = $(this).val();
							showRegion(cityId, "");
							$("#streets").html("");
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
						$("#provinces").html(provinceStr);

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
							$("#areasId").html(cityStr);
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
							$("#regionsId").html(regionStr);
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
							$("#streets").html(streetStr);
						}
						$('.add-ress').show();
						$("#addressDiv").show()
						$('#mask-address').show();
					}
				});
			})
			//保存地址
		$(document).on('click', '.y_btn_custom1', function() {
				var formData = $('#addAddressId').serialize();
				var paramStrs = formData.split("&");
				var reg = /(^1[3|4|5|7|8]\d{9}$)/;
				var obj = {};
				for(var i = 0; i < paramStrs.length; i++) {
					var key = paramStrs[i].split("=")[0];
					var value = paramStrs[i].split("=")[1];
					obj[key] = filterXSS(value);
				}
				if(!obj.consignee) {
					$("#address_consignee").text("收货人不能为空");
					$("#consignee").focus();
					return;
				}
				if($("#consignee").val().length>10) {
					$("#address_consignee").text("收货人长度不能多于10个字符");
					$("#consignee").focus();
					return;
				}
				if(!/^[^0-9]+/.test(obj.consignee)) {
					$("#address_consignee").text("请输入正确的收货人格式");
					$("#consignee").focus();
					return;
				}
				if(!obj.province || !obj.city || !obj.region || !obj.street) {
					$("#address_address4").text("请选择完整的省、市、区县、街道");
					$("#provinceId").focus();
					return;
				}
				if($.trim(obj.mobile) == "") {
					$("#address_mobile").text("请输入手机号");
					$("#mobile").focus();
					return;
				}
				if($.trim(obj.address) == "") {
					$("#address_address").text("请输入详细地址");
					$("#address").focus();
					return;
				}
				if(!reg.test(obj.mobile)) {
					$("#address_mobile").text("请输入正确的手机号");
					$("#mobile").focus();
					return;
				}
				$(".y_btn_custom1").attr("disabled",true)
				var provinceText = $.trim($("#provinces option:selected").text());
				var cityText = $.trim($("#areasId option:selected").text());
				var regionText = $.trim($("#regionsId option:selected").text());
				var streetText = $.trim($("#streets option:selected").text());
				obj.area = provinceText + cityText + regionText + streetText;
				obj.uuid = $('#addAddressId').attr("uuid");
				var param1 = JSON.stringify(obj);
				var data = {};
				data.param = param1;
				var url1 = $('#addAddressId').attr("action");
				$http.post({
					url: url1,
					data: data,
					success: function(res) {
						if(res.status == 1) {
						window.location.reload(true);
						}
						else{
							Msg.Alert("","添加或编辑地址失败，请重新再试",function(){});
							$(".y_btn_custom1").attr("disabled",false)
						}
					},
					error: function(res) {
						alert("error")
					}
				})

			})
			//设置默认地址
		$(document).on('click', '.no_default_address', function() {
			var index = $(this).index()
			var el = $(this).parents(".view").attr("isdefalut");
			var uuid = $(this).parent().attr("customerAddressUuid");
			setDefault(uuid)
		});
		//取消弹出框
		$(document).on('click', '.disabled,.close,#mask-address', function() {
			$('.add-ress').hide();
			$("#addressDiv").hide()
			$('#mask-address').hide();
			$("input[name=consignee]").val("")
			$("textarea[name=address]").val("")
			$("input[name=mobile]").val("")
			$("input[name=zipcode]").val("")
			$("input[name=telephone]").val("")
			$("#provinces").empty();
			$("#areasId").empty();
			$("#regionsId").empty();
			$("#streets").empty();
//			$("#provinces option:selected").text("--请选择--");
//			$("#areasId option:selected").text("--请选择--");
//			$("#regionsId option:selected").text("--请选择--");
//			$("#streets option:selected").text("--请选择--");
		});
		//改变地址验证库存
		function changeAddress(uuid) {
			parama.addressUuid=uuid;
			var chooseAddress = "/splitorder/findStockNum";
			$http.post({
				url: chooseAddress,
				data:parama,
				success: function(res) {
					if(res.retData.split_error == "error"){
						$("#submitForm").addClass("disabled");
						$(".submit").removeClass("submitForm");
						$("#submitForm").html("无货");
					}
					else{
						$("#submitForm").removeClass("disabled");
						$("#submitForm").html("立即下订单");
						$(".submit").addClass("submitForm");
					}
					
				}
			});
		}
		
		
		//设置默认收货地址
		function setDefault(uuid) {
			$http.post({
				url: "/usercenter/customeraddress/setDefault?uuid=" + uuid,
				success: function(res) {
					window.location.reload();
				}
			})
		}

		$(document).on('change', '#provinceId', function() {
			var provinceId = $(this).val();
			showCity(provinceId, "");
			$("#regionsId").html("");
			$("#streets").html("");
		})
		$(document).on('change', '#cityId', function() {
			var cityId = $(this).val();
			showRegion(cityId, "");
			$("#streets").html("");
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
						provinceStr = provinceStr + "<option value='" + v['uuid'] + "'"  + ">" + v['provinceName'] + "</option>";
					})
				}
			}
		});
		provinceStr = provinceStr + "</select>";
		$("#provinces").empty();
		$("#provinces").html(provinceStr);
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
			$("#areasId").empty();
			$("#areasId").html(cityStr);
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
			$("#regionsId").empty();
			$("#regionsId").html(regionStr);
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
			$("#streets").empty();
			$("#streets").html(streetStr);
		}
	})
})