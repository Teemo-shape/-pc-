/**
 * Created by 18776978844 on 2016/11/30.
 */
require(['KUYU.Service', 'KUYU.Binder','KUYU.HeaderTwo', 'KUYU.navHeader','KUYU.navFooterLink','KUYU.plugins.alert','xss'], function () {

    var $http = KUYU.Service,
        $init = KUYU.Init,
        navHeader = KUYU.navHeader,
        navFooterLink = KUYU.navFooterLink;
        $init.cookie();
        //抬头校验
      function companyTest() {
      	var addtitle = $("#add_companyName").val();
      	if(addtitle == "") {
      		$("#errortxt").text("请输入发票抬头");
      		$("#add_companyName").addClass("active");
      		$("#add_companyName").focus();
      		return false;
      	} else {
      		$("#add_companyName").removeClass("active");

      		return true;
      	}
      }
      //纳税人识别号校验
      function codeTest() {
      	var addcode = $("#add_code").val();
      	var err = $("#errortxt");
      	var reg = /^[0-9a-zA-Z]{15,20}$/g;
      	if(addcode==''||!reg.test(addcode)) {
            err.text("请输入正确纳税人识别号字母或数字15-20位之间").show();
      			$("#add_code").addClass("active");
      			$("#add_code").focus();
      			return false;
      	}else{
          err.text("");
      		$("#add_code").removeClass("active");
      		return true;
      	}
      }
      //注册地址校验
      function addressTest() {
      	var address = $("#add_address").val();
      	if(address == "") {
      		$("#errortxt").text("请输入注册地址");
      		$("#add_address").addClass("active");
      		$("#add_address").focus();
      		return false;
      	} else {
      		$("#add_address").removeClass("active");
      		return true;
      	}
      }
      //注册电话校验
      var titlemobile_Reg =  /^(1[3|4|5|7|8][0-9]\d{8})$|^([0]\d{2,3}-\d{7,8})$/
      function registerMobileTest() {
      	var mobile = $("#add_registerMobile").val();
      	if(mobile == "") {
      		$("#errortxt").text("请输入注册电话");
      		$("#add_registerMobile").addClass("active");
      		$("#add_registerMobile").focus();
      		return false;
      	}else if(!titlemobile_Reg.test(mobile)) {
      		$("#errortxt").text("请输入正确的注册电话手机或座机如:0755-1234567");
      		$("#add_registerMobile").addClass("active");
      		$("#add_registerMobile").focus();
      		return false;
      	}
      	else {
      		$("#add_registerMobile").removeClass("active");

      		return true;
      	}
      }
      $("p").on('keyup', '#add_registerMobile', function(event) {
      	if(registerMobileTest()){
      		$("#errortxt").text("");
      		$("#add_registerMobile").removeClass("active");
      	}
      });

      //开户行校验
      var titleReg = /^[a-zA-Z0-9|\d|\u0391-\uFFE5]*$/;
      function bankNameTest() {
      	var bankname = $("#add_bankName").val();
      	if(bankname == "") {
      		$("#errortxt").text("请输入开户银行");
      		$("#add_bankName").addClass("active")
      		$("#add_bankName").focus();
      		return false;
      	}
      	else if(!titleReg.test(bankname)) {
      			$("#errortxt").text("请输入正确的开户行");
      			$("#add_bankName").addClass("active")
      			$("#add_bankName").focus();
      			return false;
      	} else {
      		$("#add_bankName").removeClass("active");
      		return true;
      	}
      }

      //银行账户校验
      function bankNoTest() {
      	 var bank =  /^\d{16,19}$/;
      	var bankno = $("#add_bankNo").val();
      	if(bankno == "") {
      		$("#errortxt").text("请输入银行账户");
      		$("#add_bankNo").addClass("active");
      		$("#add_bankNo").focus();
      		return false;
      	}else if(!bank.test(bankno)) {
      		$("#errortxt").text("请输入正确的银行账户");
      		$("#add_bankNo").addClass("active")
      		$("#add_bankNo").focus();
      		return false;
      	}
      	else {
      		$("#add_bankNo").removeClass("active");
      		return true;
      	}
      }

    $(function(){
        navHeader(function (res) {
        	res.data.configTitle = "订单提交信息";
            if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) {
                window.location.href=window.location.origin+"/sign";
            }
        });
    });

    //提交订单需要的参数，下面是返利网需要的参数
    var params = {
    };

    if($.cookie('fanliCookie')){
    	var all = JSON.parse($.cookie('fanliCookie'));
	    params.channel_id = all.channel_id;
	    params.tc = all.tc;
	    params.uid = all.uid;
	    params.s_id = all.s_id;
	    params.uname = all.uname;
	    params.platform = all.platform;
    }

    //字数
    $(document).on('keyup change','#buyerMsg',function(){
      let _this = $(this),_len = _this.val().length;
      if(_len > 500) return false;
      _this.next('#zishu').children('i').text(_len);
    })

    $(document).on('click', '#submitForm', function() {
    	if($("#invoiceCate").val() =="2"){
        if($('#enterCate').val() == '0'){
          if($("#electron_titleContent").val() == ""){
            $("#eletitle").text("请填写电子发票抬头！").show();
            return
          }
        }
        if($('#enterCate').val() == '1'){
          if($("#electron_titleContent").val() == ""){
            $("#eletitle").text("请填写电子发票抬头！").show();
        		return
          }
            let electron_ratepayer = $("#electron_ratepayer").val(),err = $("#eletitle"),reg = /^[0-9a-zA-Z]{15,20}$/g;
            if(!reg.test(electron_ratepayer)){
                err.text("请输入正确纳税人识别号15-20位").show();
                return
            }
        }
    	}
        if($("#invoiceCate").val() =="3"){

            if((!companyTest()) || (!codeTest()) || (!addressTest()) || (!registerMobileTest()) || (!bankNameTest()) || (!bankNoTest())){
              //Msg.Alert("","请填写增值税专用发票！",function(){});
          		return
            }
        }
        //_smq.push(['custom', 'PC', 'tijiao']); //ad
    	   //$(".submit").removeClass("submitForm");
		       //$(".submit").addClass("disabled");
        var checkArea = $("#checkArea").val();
        var area = $("input[name='area']").val();
        var invoiceCate = $("#invoiceCate").val();
        var invoiceUuid = $("#electron_titleContent").attr("uuid")?$("#electron_titleContent").attr("uuid"):""
        var electron_titleContent = filterXSS($("#electron_titleContent").val());
        var electron_invoiceContent = $("#electron_invoiceContent").val();
        var electron_ratepayer = $("#electron_ratepayer").val(); //纳税人识别号
        var add_uuid = $("#add_uuid").val();
        var add_companyName = filterXSS($("#add_companyName").val());
        var add_code = filterXSS($("#add_code").val());
        var add_address = filterXSS($("#add_address").val());
        var add_registerMobile = filterXSS($("#add_registerMobile").val());
        var add_bankName = filterXSS($("#add_bankName").val());
        var add_bankNo = filterXSS($("#add_bankNo").val());
        var jifenPromotionUUID = $("#jifenPromotionUUID").val();
        var integralReduceNum = $("#integralReduceNum").val();
        var totalMoneyShow = parseFloat($("#totalMoneyShow").attr("orginvalue"));

        var productPrice_List = $("input[name ^='productPrice_']");
        var productBasePrice_List = $("input[name ^='productBasePrice_']");
        var productNowPrice_List = $("input[name ^='productNowPrice_']");
        var affix_List = $("input[name ^='affix_']");
        var shipType_List = $("input[name ^='shipType_']");
        var cartTotal_List = $("input[name ^='cartTotal_']");
        var storeReduce_List = $("input[name ^='storeReduce_']");
        var storePromotion_List = $("input[name ^='storePromotion_']");
        var productGiftIds_List = $("input[name ^='productGiftIds_']");
        var productNum_List = $("input[name ^='productNum_']");
        var productDetail_List = $("input[name ^='productDetail_']");
        var suitNum_List = $("input[name ^='suitNum_']");

        params.checkArea = checkArea;
        params.area = area;
        params.invoiceCate = invoiceCate;
        params.jifenPromotionUUID =jifenPromotionUUID;
        params.integralReduceNum =integralReduceNum;
        params.totalMoneyShow = totalMoneyShow;

        var storeUuid = $("#storeUuid").val();
        var affix_storeUuid = $("#affix_" + storeUuid).val();
        var shipType_storeUuid = $("#shipType_storeUuid_" + storeUuid).val();
        var cartTotal_ = $("#cartTotal_" + storeUuid).val();



        if (invoiceCate == "2") {  //电子发票
        	params.invoiceUuid = invoiceUuid
            params.electron_titleContent = electron_titleContent;
            params.electron_invoiceContent = electron_invoiceContent;
            params.electron_code = electron_ratepayer;
        }
        else if (invoiceCate == "3") {
            params.invoiceUuid = add_uuid;
            params.add_companyName = add_companyName;
            params.add_code = add_code;
            params.add_address = add_address;
            params.add_registerMobile = add_registerMobile;
            params.add_bankName = add_bankName;
            params.add_bankNo = add_bankNo;
        }

        //获取商品价格信息;
        $.each(productPrice_List, function (key, productPrice) {
            params[productPrice.name] = productPrice.value;
        });

        $.each(productBasePrice_List, function (key, productBasePrice) {
            if (productBasePrice.value) {
                params[productBasePrice.name] = productBasePrice.value;
            }
        });

        $.each(productNowPrice_List, function (key, productNowPrice) {
            params[productNowPrice.name] = productNowPrice.value;
        });

        $.each(cartTotal_List, function (key, cartTotal) {
            params[cartTotal.name] = cartTotal.value;
        });

        $.each(affix_List, function (key, affix) {
            params[affix.name] = affix.value;
        });

        $.each(shipType_List, function (key, shipType) {
            params[shipType.name] = shipType.value;
        });

        $.each(storeReduce_List, function (key, storeReduce) {
            params[storeReduce.name] = storeReduce.value;
        });

        $.each(storePromotion_List, function (key, storePromotion) {
            params[storePromotion.name] = storePromotion.value;
        });

         $.each(productNum_List, function (key, productNum_) {
            params[productNum_.name] = productNum_.value;
        });

        $.each(productGiftIds_List, function (key, productGiftIds) {
       		params[productGiftIds.name] = productGiftIds.value;
        });

        $.each(productDetail_List, function (key, productDetail) {
       		params[productDetail.name] = productDetail.value;
        });

        $.each(suitNum_List, function (key, suitNum) {
       		params[suitNum.name] = suitNum.value;
        });
        //买家留言
        //storeNote
        params['storeNote_'+storeUuid] = $('#buyerMsg').val();

        //优惠券
        // $(".m_odd").each(function (key, value) {
        //     if ($(this).hasClass("active")) {
        //         params['storeCoupon_'+$(this).attr("storeUuid")] = $(this).attr("id");
        //         params['storeCouponReduce_'+$(this).attr("storeUuid")] = $("#couponemmoney").val();
        //     }
        // });
// console.log(params,'哈哈');
// return
        var url = '/cart/saveOrderKuyu';
        $init.getHeaders()['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        setTimeout(function(){
	        $http.post({
	            url: url,
	            data: params,
	            success: function (res) {
	            	if(res.code== "403"||res.code== "-6"){
						window.location.href = "{{login}}";
					}
	            	else if(res.code == 10){
	            		if(res.message=="库存不足"){
	            			Msg.Alert("","该区域库存不足!",function(){});
	            			$(".submit").removeClass("disabled");
	                		$(".submit").addClass("submitForm");
	            		}else{
	            			window.location.href = "backcart.html";
	            		}
	                }
	                else if (res.code == 0) {

	                    var payOrderId = res.payOrderId;
	                    var isGroup = res.isGroup;

                      //  _smq.push(['custom', 'PC', 'order', payOrderId]); //ad

                      //  _gsq.push(["T", "GWD-002914-F6ABA6", "addOrder",payOrderId , totalMoneyShow]);

                        // if(typeof beheActiveEvent == 'function') {
                        //     beheActiveEvent({at:"buy1",src:"1697009386",cid:"",sid:"27295.25156",orderid: payOrderId,cost:totalMoneyShow})
                        // }

                        url = "/orderpay/toOrderPayKuyu";
	                    $init.getHeaders()['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	                    $http.post({
	                        url: url,
	                        data: {
	                            payOrderUuid: payOrderId,
	                            payOrderType: isGroup
	                        },
	                        success: function (res) {
	                        	if(res.code== "403"||res.code== "-6"){
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
	                else {
	                	if(!res.message){
	                		Msg.Alert("",res.msg || '系统出错',function(){});
                            params = {}
	                	}
	                	else{
	                		Msg.Alert("",res.message || '系统出错' ,function(){});
                            params = {}
	                	}
	                    $(".submit").removeClass("disabled");
	                	$(".submit").addClass("submitForm");
	                }
	            },
	            error: function (res) {

	            }
	        })
	        },10)

    })

   if(!Array.isArray) {
        $("input[type='text'], input[type='password'], textarea").placeholder();
   }
});
