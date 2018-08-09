require(['KUYU.Service', 'KUYU.Binder', 'juicer','KUYU.HeaderTwo', 'KUYU.navHeader', 'KUYU.navFooterLink', 'KUYU.plugins.alert','xss'], function() {
	var $http = KUYU.Service,
		$init = KUYU.Init,
		$binder = KUYU.Binder,
		Map = $init.Map(),
		$param = KUYU.Init.getParam(),
		_env = KUYU.Init.getEnv(),
		_sever = KUYU.Init.getService(),
		path = _sever[_env.sever],
		navHeader = KUYU.navHeader,
		$scope = KUYU.RootScope;
		$init.cookie();
	var globalParam = {};
		globalParam.skuNo = $param.skuNo,
		globalParam.promotionUuid = $param.promotionUuid;
	var param = {};
	
	if($.cookie('fanliCookie')){
    	var all = JSON.parse($.cookie('fanliCookie'));
	    param.channel_id = all.channel_id;
	    param.tc = all.tc;
	    param.uid = all.uid;
	    param.s_id = all.s_id;
	    param.uname = all.uname;
	    param.platform = all.platform;
    }

	navHeader(function(res) {
		res.data.configTitle = "订单信息填写";
		if(res.code == CODEMAP.status.TimeOut || res.code == CODEMAP.status.notLogin) {
            window.location.href=window.location.origin+"/sign";
		}
	})

	//fastBuyLimitProduct?skuNo=P001010101010100066&areaId=14995&promotionUuid=d56b5e64ace3495095a603c9cbd88d9a
	var getFastBuyLimit = {
		getInfo: function() {
			$http.get({
				url: '/front/product/fastBuyLimitProduct',
				data: {
					skuNo: globalParam.skuNo,
					areaId: globalParam.areaId,
					promotionUuid: globalParam.promotionUuid
				},
				success: function(data) {
					getFastBuyLimit.createList(data);
					getFastBuyLimit.submit(data);

				}
			})
		},
		createList: function(res) {
			var list = res.cartManagerList[0].detailModelList[0],
				proList = $("#proList"),
				showTotalMoney = $("#showTotalMoney");
			if(res.cartManagerList && list) {
				var htm = ' <dl class="count-item clearfloat">' +
					'      <dt class="pro-text">' +
					'      <span class="limit">秒杀</span>' +
					'          <img src="' + list.productImg + '" style="width:50px;height:50px">' + list.productName +
					'      </dt>' +
					'      <dd class="num-text">' +
					'          ' + list.basePrice + '元 x 1' +
					'       </dd>' +
					'         <dd class="goo-text">' +
					'        </dd>' +
					'         <dd class="pri-text">' + list.totalPrice + '元' +
					'        <span class="num-tip">秒杀价</span>' +
					'       </dd>' +
					'   </dl>';

				var tpl = '<div class="fl item-wid">' +
					'  <p class="text">商品件数： <span class="red fr" id="real_total_num">' + list.buyNum + '件</span></p>' +
					'  <p class="text">金额合计： <span class="red fr" id="real_total_money">' + list.basePrice + '元 </span> </p>' +
					'  <p class="text">活动优惠： <span class="red fr" id="promotion_reduce_money">' + (list.nowPrice - list.basePrice) + '元 </span> </p>' +
					'  <p class="text">优惠券抵扣：<span class="red fr" id="coupon_reduce_money">-0.00元</span></p>' +
					'  <p class="text"> 运费:<span class="red fr"> 0.00元  </span> </p>' +
					'  <p class="text red pay"> 应付总额： <span class="font24 fr">    <input type="hidden" value="1199.00" name="totalMoneyShow" id="totalMoney" /> <strong id="totalMoneyShow" orginValue="1199.00">' + list.totalPrice + '元</strong>    </span> </p>' +
					'</div>';
				proList.html(htm);
				showTotalMoney.html(tpl)
			}

		},
		submit: function(res) {
			param.productBuyNum = res.productBuyNum;
			param.promotionUuid = globalParam.promotionUuid;
			param.productSku = res.skuNo;
			param.totalMoneyShow = res.cartManagerList[0].detailModelList[0].totalPrice;
			param['productNowPrice_' + res.skuNo] = res.cartManagerList[0].detailModelList[0].totalPrice;
			param['affix_' + res.cartManager.storeUuid] = res.cartManager.affix || 0; //少字段
			param['hipType_' + res.cartManager.storeUuid] = 1;
			//          param['cartTotal_'+res.cartManager.storeUuid] = res.cartManager.totalMoney||0; //这个有问题
			param['cartTotal_' + res.cartManager.storeUuid] = res.cartManagerList[0].detailModelList[0].totalPrice;; //这个有问题
			param['storeReduce_' + res.cartManager.storeUuid] = res.cartManager.reduceMoney || 0;
			param['productPrice_' + res.skuNo] = res.cartManagerList[0].detailModelList[0].nowPrice;
			param['productBasePrice_' + res.skuNo] = res.cartManagerList[0].detailModelList[0].basePrice;

			$(document).on('click', '.submitForm', function() {
				if($("#electron_titleContent").val() == "" && $("#invoiceCate").val() =="2"){
		    		Msg.Alert("","请填写电子发票！",function(){});
		    		return
		    	}else{
				$(".submit").removeClass("submitForm");
				$(".submit").addClass("disabled");
				var checkArea = $("#checkArea").val();
				var area = $("input[name='area']").val();
				var invoiceUuid = $("#electron_titleContent").attr("uuid")?$("#electron_titleContent").attr("uuid"):""
				var electron_titleContent = filterXSS($("#electron_titleContent").val());
				var electron_invoiceContent = $("#electron_invoiceContent").val();
				var add_uuid = $("#add_uuid").val();
				var add_companyName = filterXSS($("#add_companyName").val());
				var add_code = filterXSS($("#add_code").val());
				var add_address = filterXSS($("#add_address").val());
				var add_registerMobile = filterXSS($("#add_registerMobile").val());
				var add_bankName = filterXSS($("#add_bankName").val());
				var add_bankNo = filterXSS($("#add_bankNo").val());
				var invoiceCate=$("#invoiceCate").val();
                var electron_code = $("#electron_ratepayer").val();
				if(invoiceCate == "2") {
					param.invoiceUuid = invoiceUuid
					param.electron_titleContent = electron_titleContent;
					param.electron_invoiceContent = electron_invoiceContent;
					param.electron_code = electron_code;
				} else if(invoiceCate == "3") {
					param.invoiceUuid = add_uuid;
					param.add_companyName = add_companyName;
					param.add_code = add_code;
					param.add_address = add_address;
					param.add_registerMobile = add_registerMobile;
					param.add_bankName = add_bankName;
					param.add_bankNo = add_bankNo;
				}
					param.invoiceCate=invoiceCate;
					param.checkArea= $("#checkArea").val();
				setTimeout(function(){
					$http.post({
						url: '/order/checkCanSaveLimitOrder',
						data: {
							productSkuNo:$param.skuNo,
							promotionUuid:$param.promotionUuid
						},
						success: function(res) {
							if(res.code=="0"){
								$http.post({
									url: '/cart/saveLimitOrder',
									data: param,
									success: function(res) {
										if(res.code == "only_one") {
											Msg.Alert("","只能购买一件!",function(){});
											$(".submit").removeClass("disabled");
											$(".submit").addClass("submitForm");
										}
										else if(res.code == "no_stock") {
											Msg.Alert("","库存不足!",function(){});
											$(".submit").removeClass("disabled");
											$(".submit").addClass("submitForm");
										}
										else if(res.code == "0") {
											var payOrderId = res.data.payOrderId;
											var isGroup = res.data.isGroup;
											url = "/orderpay/toOrderPayKuyu";
											$http.post({
												url: url,
												data: {
													payOrderUuid: payOrderId,
													payOrderType: isGroup
												},
												success: function(res) {
													if(res.code == "403" || res.code == "-6") {
														window.location.href = "{{login}}"
													}
													if(res.code == "1"){
														Msg.Alert("","下单成功!",function(){});
						                        		window.location.href = '../orderList/orderList.html?1'
						                        	}
						                        	if(res.code == "0"){
						                        		var a = new Date().getTime();
							                            var res = JSON.stringify(res);
							                            sessionStorage.setItem("cl" + a, res);
							                            window.location.href = "../toOrderPayKuyu/toOrderPayKuyu.html?cl" + a;
						                        	}
												}
											});
										}
										else{
											Msg.Alert("","下单失败!",function(){});
											$(".submit").removeClass("disabled");
											$(".submit").addClass("submitForm");
										}
									}
								})
							}
							else{
								$(".submit").removeClass("disabled");
								$(".submit").addClass("submitForm");
								Msg.Alert("","不能重复提交!",function(){});
							}
						}
					})
				},10)
			}
			})
		}

	};
	getFastBuyLimit.getInfo()
})