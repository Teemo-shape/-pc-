require(['KUYU.Service', 'KUYU.SlideBarLogin', 'juicer','KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service;
	var $init = KUYU.Init;
	var slidBarLogin = KUYU.SlideBarLogin;
	var checkedProvince = "";
	var checkedCity = "";
	var checkedRegion = "";
	var checkedStreet = "";
	$(function() {
		$("#submitForm").addClass("disabled");
		$("#submitForm").html("提交订单");
		//删除地址
	// function Delete(uuid) {
	// 	Msg.Confirm("","确定删除地址吗？",function(){
	// 		$http.post({
	// 			url: "/usercenter/customeraddress/delDeliveryAddress?uuid=" + uuid,
	// 			data: {ranNum : Math.random()},
	// 			success: function(res) {
	// 				if(res.code == "403" || res.code == "-6") {
	// 					window.location.href = "{{login}}"
	// 				}
	// 				if(res == 'true') {
	// 					window.location.reload();
	// 				}
	// 				else{
	// 					Msg.Alert("","删除地址失败，请重新再试",function(){});
	// 				}
	// 			}
	// 		})
	// 	})
	// }
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
						$("#checkArea").val(list.uuid);
//						$("#electron_titleContent").val(list.consignee);
						changeAddress(list.uuid)
						$("#submitForm").removeClass("disabled");
						$("#submitForm").html("提交订单");
						return '<li class="item view address_list active"' + '" isdefalut=' + list.isDefault + ' customeraddressuuid=' + list.uuid + '>' +
							'<span class="view-stock"></span>' +
							'<span class="red"></span>' +
							'<p class="name-text">' +
							'<input type="hidden" name="area" value=' + list.uuid + '>' +
							'<span class="person">' + filterXSS(list.consignee) + '</span>' +
							'<span class="tel">' + filterXSS(list.mobile) + '</span>' +
							'</p>' +
							'<p class="addr-text">' +
							list.area + "　" + filterXSS(list.address) +
							'</p>' +
							'<input type="hidden" name="address" id="address" value="' + list.address + '">' +
							'<p class="edit-text">' +
							'<a customeraddressuuid=' + list.uuid + '><span class="no_default_address edit" style="display: none;">设为默认</span><span class="default_address edit" style="display: none;">已默认</span></a><a href="javascript:;" customeraddressuuid=' + list.uuid + '><span class="edit y_editbtn" customerAddressUuid=' + list.uuid + '><i class="icon iconfont-tcl icon-xiugai"></i>修改</span></a></p>' +
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
								'<span class="tel">' + filterXSS(list.mobile) + '</span>' +
								'</p>' +
								'<p class="addr-text">' +
								list.area + "　" + filterXSS(list.address) +
								'</p>' +
								'<p class="edit-text">'+
								'<a customeraddressuuid=' + list.uuid + '><span class="no_default_address edit" style="display: none;">设为默认</span><span class="default_address edit" style="display: none;">已默认</span></a>'
								 +'<a href="javascript:;" customeraddressuuid=' + list.uuid + '><span class="edit y_editbtn" customerAddressUuid=' + list.uuid + '><i class="icon iconfont-tcl icon-xiugai"></i>修改</span></a></p></li>'
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
//				$("#electron_titleContent").val(consignee0);
				$("#submitForm").removeClass("disabled");
				$("#submitForm").html("提交订单");
				changeAddress(uuid0);
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
		//编辑地址
		$(document).on('click', '.y_editbtn', function() {
				$("#addressDiv h3").html("修改地址");

				var uuid = $(this).attr("customerAddressUuid");
				$http.post({
					url: "/usercenter/customeraddress/getAddressByuuid?uuid=" + uuid,
					success: function(res) {
						$('#addAddressId').attr("action", "/usercenter/customeraddress/doEdit");
						$('#addAddressId').attr("uuid", uuid);
						$("input[name=consignee]").val(res.consignee)
						$("input[name=address]").val(res.address)
						$("input[name=mobile]").val(res.mobile)
						$("input[name=zipcode]").val(res.zipcode);
						var _setDefa = $('#setDefa');
						if(res.isDefault == 1){
								_setDefa.addClass('on');
						}else{
								_setDefa.removeClass('on');
						}
						//$("input[name=telephone]").val(res.telephone)
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
							if(provinceId) {
								showCity(provinceId, "");
							}else{
								$("#areasId").html("");
								$("#regionsId").html("");
								$("#streets").html("");
							}
						})
						$(document).on('change', '#cityId', function() {
							var cityId = $(this).val();
							if(cityId) {
								showRegion(cityId, "");
								$("#streets").html("");

							}else{
								$("#regionsId").html("");
								$("#streets").html("");
							}
						})
						$(document).on('change', '#regionId', function() {
							var regionId = $(this).val();
							if(regionId) {
								showStreet(regionId, "");
							}else{
								$("#streets").html("");
							}
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
						var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true' placeholder='选择省'><option value=''>选择省</option>";
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
							var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true' placeholder='选择市'><option value=''>选择市</option>";
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
							var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true' placeholder='选择区'><option value=''>选择区</option>";
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
							var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true' placeholder='选择街道'><option value=''>选择街道</option>";
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
				console.log(formData);
				var paramStrs = formData.split("&");
				var reg = /(^1[3|4|5|6|7|8|9]\d{9}$)/;
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
				if($.trim(obj.mobile) == "") {
					$("#address_mobile").text("请输入手机号");
					$("#mobile").focus();
					return;
				}
				if(!reg.test(obj.mobile)) {
					$("#address_mobile").text("请输入正确的手机号");
					$("#mobile").focus();
					return;
				}
				if(!obj.province || !obj.city || !obj.region || !obj.street) {
					$("#address_address4").text("请选择完整的省、市、区县、街道");
					$("#provinceId").focus();
					return;
				}
				if($.trim(obj.address) == "") {
					$("#address_address").text("请输入详细地址");
					$("#address").focus();
					return;
				}
				if($("#address").val().length>40) {
					$("#address_address").text("详细地址长度不能多于40个字符");
					$("#address").focus();
					return;
				}
				// if(obj.telephone && !/^([0]\d{2,3}-\d{7,8})$/.test(obj.telephone)) {
				// 	$("#address_telephone").text("请输入正确区号-电话号码");
				// 	$("#telephone").focus();
				// 	return;
				// };
				obj.telephone = '';//此参数不传接口没法调通
				$(".y_btn_custom1").attr("disabled",true)
				var provinceText = $.trim($("#provinces option:selected").text());
				var cityText = $.trim($("#areasId option:selected").text());
				var regionText = $.trim($("#regionsId option:selected").text());
				var streetText = $.trim($("#streets option:selected").text());
				obj.area = provinceText + cityText + regionText + streetText;
				obj.uuid = $('#addAddressId').attr("uuid");
				obj.isDefault = $('#setDefa').data('isdefault');
				var param1 = JSON.stringify(obj);
				var data = {};
				data.param = param1;
				var url1 = $('#addAddressId').attr("action");
				console.log(data);
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
		$('#setDefa').click(function(){
			let _this = $(this);
			_this.toggleClass('on');
			if(_this.data('isdefault') == 0){
					_this.data('isdefault',1)
			}else{
					_this.data('isdefault',0)
			}
		})
		//改变地址，重新验证地址库存拆单
		function changeAddress(uuid) {
			$init.getHeaders()['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			var chooseAddress = "/splitorder/chooseaddressNewKuyu";
			$http.post({
				url: chooseAddress,
				data: {
					addressUuid: uuid
				},
				success: function(res) {
					if(res.code == "1") {
						var infoTxt = "无货";
						$("#noStockShow").show();
						$(".font10.red").show();
                        $(".nogood").show();
                        $("li.item.active.view .view-stock").text(infoTxt);
						$("#submitForm").addClass("disabled");
						$("#submitForm").html(infoTxt);
						$(".submit").removeClass("submitForm");
						//遍历获取地址
						if(res.stockMap){
						$("dd[productuuid]").each(function(index, item) {
								var uuid = $(item).attr("productuuid");
								$("dd[productuuid='" + uuid + "']").html(res.stockMap[uuid]);
						})
						}
						//遍历是否有不可售商品混进来了
						function getNosale() {
							var warnFlag = 0;
							var warnStr = '';
							if(res.cartManagerList && res.cartManagerList.length > 0){
							for(var i = 0; i < res.cartManagerList.length; i++) {
								var list = res.cartManagerList[i];
								for(var j = 0; j < list.detailModelList.length; j++) {
									var list1 = list.detailModelList[j];
									if(list1.productWarning) {
										warnFlag = 1;
										warnStr = warnStr+list1.productName +",";
                                        $("#"+list1.uuid+"_hasGood").hide();
                                        $("#"+list1.uuid+"_noGood").show();
                                    }else {
                                        $("#"+list1.uuid+"_hasGood").show();
                                        $("#"+list1.uuid+"_noGood").hide();
                                    }
								}
							}
                                if (warnFlag == 1) {
                                    Msg.Alert("", warnStr + "<br/>在该地区不可售，请重新选择商品", function () {
                                    });
                                }
							}

						}
						setTimeout(getNosale, 800)
					}
					if(res.code == "0") {
						$("#noStockShow").hide();
						$(".font10.red").hide();
						$(".nogood").hide();
						$("li.item.view .view-stock").text('');
						$('#outOfStock').html("");
						$("#submitForm").removeClass("disabled");
						$("#submitForm").html("提交订单");
						$(".submit").addClass("submitForm");
						if(res.splitError == "error") {
							$("#submitForm").addClass("disabled");
							$("#submitForm").html("无货");
							$("li.item.active.view .view-stock").text("无货");
						}
						if(res.stockMap){
						$("dd[productuuid]").each(function(index, item) {
							var uuid = $(item).attr("productuuid");
							$("dd[productuuid='" + uuid + "']").html(res.stockMap[uuid]);
						});
						}
						//遍历是否有不可售商品混进来了
						function getNosale() {
                            var warnFlag = 0;
                            var warnStr = '';
							if(res.cartManagerList && res.cartManagerList.length > 0){
							for(var i = 0; i < res.cartManagerList.length; i++) {
								var list = res.cartManagerList[i];
								for(var j = 0; j < list.detailModelList.length; j++) {
									var list1 = list.detailModelList[j];
									if(list1.productWarning) {
//										$("dd[productuuid='" + list1.productUuid + "']").html("该地区不可售");
										$("#submitForm").addClass("disabled");
										$("#submitForm").html("无货");
										$("li.item.active.view .view-stock").text("无货");
//										alert(list1.productName +"在该地区不可售，请更换商品")
                                        warnFlag = 1;
                                        warnStr = warnStr+list1.productName +",";
                                        $("#"+list1.uuid+"_hasGood").hide();
                                        $("#"+list1.uuid+"_noGood").show();
									}else {
                                        $("#"+list1.uuid+"_hasGood").show();
                                        $("#"+list1.uuid+"_noGood").hide();
                                    }
								}
							}
                                if (warnFlag == 1) {
                                    Msg.Alert("", warnStr + "<br/>在该地区不可售，请重新选择商品", function () {
                                    });
                                }
							}

						}
						setTimeout(getNosale, 800)
					}
				}
			})
		}
		//取消弹出框
		$(document).on('click', '.disabled,.close,#mask-address', function() {
			$('.add-ress').hide();
			$("#addressDiv").hide()
			$('#mask-address').hide();
			$("input[name=consignee]").val("")
			$("input[name=address]").val("")
			$("input[name=mobile]").val("")
			$("input[name=zipcode]").val("")
			//$("input[name=telephone]").val("")
			$("#provinces").empty();
			$("#areasId").empty();
			$("#regionsId").empty();
			$("#streets").empty();
			$("#address_address4").text("");
			$("#address_address").text("")
			$("#address_consignee").text("")
			$("#address_mobile").text("")
//			$("#provinces option:selected").text("--请选择--");
//			$("#areasId option:selected").text("--请选择--");
//			$("#regionsId option:selected").text("--请选择--");
//			$("#streets option:selected").text("--请选择--");
		});

		//设置默认收货地址
		function setDefault(uuid) {
			$http.post({
				url: "/usercenter/customeraddress/setDefault?uuid=" + uuid,
				success: function(res) {
					window.location.reload();
				}
			})
		}
		//增加地址栏
        $(document).on('change', '#consignee', function() {
            var consignee = $('#consignee').val();
            if(/^[^0-9]+/.test(consignee)) {
                $("#address_consignee").text("");
            }
        });
        $(document).on('change', '#mobile', function() {
            var mobile = $('#mobile').val();
            if(/(^1[3|4|5|7|8]\d{9}$)/.test(mobile)) {
                $('#address_mobile').text("");
            }
        });
        $(document).on('change', '#address', function() {
            var address = $('#address').val();
            if(address) {
                $('#address_address').text("");
            }
        });
		$(document).on('change', '#provinceId', function() {
			var provinceId = $(this).val();
			if(provinceId) {
				showCity(provinceId, "");
			}else{
				$("#areasId").html("");
				$("#regionsId").html("");
				$("#streets").html("");
			}

		})
        $(document).on('change', '#provinces', function() {
            var provincesId = $(this).val();
            if(provincesId) {
                showCity(provincesId, "");
                $("#regionId").html("");
                $("#streets").html("");
            }else{
                $("#regionsId").html("");
                $("#streets").html("");
            }
        })
		$(document).on('change', '#cityId', function() {
			var cityId = $(this).val();
			if(cityId) {
				showRegion(cityId, "");
				$("#streets").html("");
			}else{
				$("#regionsId").html("");
				$("#streets").html("");
			}
		})
		$(document).on('change', '#regionId', function() {
			var regionId = $(this).val();

			if(regionId) {
				showStreet(regionId, "");
			}else{
				$("#streets").html("");
			}
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
		var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true'  placeholder='选择省'><option select value=''>选择省</option>";
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
			var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true' placeholder='选择市'><option value=''>选择市</option>";
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
        
        function showCity(provinceId, checkedCity) {
            var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true' placeholder='选择市'><option value=''>选择市</option>";
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
			var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true' placeholder='选择区'><option value=''>选择区</option>";
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
			var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true' placeholder='选择街道'><option value=''>选择街道</option>";
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
