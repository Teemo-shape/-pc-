/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/30
 */
require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.HeaderTwo','KUYU.Binder','KUYU.navHeader', 'KUYU.Filter','juicer','xss'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        navHeader = KUYU.navHeader,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        $filter = KUYU.Filter,
        path = _sever[_env.sever],
        $scope = KUYU.RootScope;
        $init.cookie();
        navHeader();
    var Map = $init.Map();

    var formatPrice = function (val) {
        return $filter.toFiexd(val)
    }
    var invoice = {};
    var addinvoice = {};
    var globalField = {
        productUuid: $param.productUuid,
        reserveOrderId: $param.reserveOrderId,
        skuNo: $param.skuNo
    };
    var globalName = {'data':{},'ele':{},invoiceCate:2};

    var preserverBuy = {
        getPerseve: function () {
            $http.post({
                url:'/usercenter/reserveorder/perserveBuyKuyu',
                data:globalField,
                success: function (data) {
                    if(data.code == CODEMAP.status.success) {
                        $binder.sync(data)
                        var res = data.data;
                        preserverBuy.createAddress(res);
                        preserverBuy.getPrice(res);
                        globalField.addressId = res.addressId
                    } else if(data.code == '-2') {
                        Msg.Alert("","已经抢购过！",function(){
                            window.location.href = "../reserveorder/reserveorder.html"
                        });
                    } else if (data.code == CODEMAP.status.TimeOut) {
                        Msg.Alert("","登录超时，重新登录！",function(){
                            window.location.href=window.location.origin+"/sign";
                        });
                    }
                }
            })
        },
        createAddress: function (res) {
            /*var tpl = ' {@each addressList as it}'
                    +'      {@if it.isDefault == 1}'
                    +'          ${it.consignee|set} ${it.area} ${it.mobile} 86${it.mobile}'
                    +'          <span class="tips_warn">地址信息无法更改</span>'
                    +'      {@/if}'
                    +'  {@/each}';
            var set =function (data) {
                globalName.name = data;
                return data;
            }
            juicer.register('set',set);
            var html = juicer(tpl, res);*/
            if(res.addressList.length > 0){
                var addressId = res.addressId;
                for(var i = 0;i < res.addressList.length;i++){
                    var addressList = res.addressList[i];
                    if(addressId == addressList.uuid){ //addressId 为预约时候的标示，此处拿到预约地址
                        var html = "";
                        html = addressList.consignee+'&nbsp;&nbsp; '+addressList.area+'&nbsp;&nbsp;'+addressList.mobile+'&nbsp;&nbsp;&nbsp;';
                        globalName.name = addressList.consignee;
                    }
                    /*if(addressList.isDefault == "1"){
                        var html = "";
                        html = addressList.consignee+'&nbsp;&nbsp; '+addressList.area+'&nbsp;&nbsp;'+addressList.mobile+'&nbsp;&nbsp;&nbsp; 86'+addressList.mobile;
                        globalName.name = addressList.consignee;
                    }*/
                    /*if(i = res.addressList.length){
                        html = res.addressList[0].consignee+'&nbsp;'+ res.addressList[0].area+'&nbsp;'+ res.addressList[0].mobile+'&nbsp;86'+ res.addressList[0].mobile;
                        globalName.name =  res.addressList[0].consignee;
                    }*/
                }

            }
            //判断地址是否有效,无效不提交
            if(html){
                $("#createAddress").html(html);
                ///$("#electron_titleContent").val(globalName.name);
            }else{
                $(".submitForm").addClass("disabled");
                $(".submit").removeClass("submitForm");
            }
        },
        getPrice: function (res) {
            var tpl = '<p class="text">商品件数： <span class="red fr" id="real_total_num">${subModel.buyNum}件</span></p>'
                    +'<p class="text">金额合计： <span class="red fr" id="real_total_money">${m.shopPrice|formatPrice}元</span> </span> </p>'
                    +'<p class="text">活动优惠： <span class="red fr" id="promotion_reduce_money">0.00元</span></p>'
                    +'<p class="text">优惠券抵扣：<span class="red fr" id="coupon_reduce_money">0.00元</span></p>'
                    +'<p class="text"> 运费:<span class="red fr"> 0.00元  </span> </p>'
                    +'<p class="text red pay"> 应付总额： <span class="font24 fr">    <input type="hidden" value="1199.00" name="totalMoneyShow" id="totalMoney" /> <strong id="totalMoneyShow" orginValue="1199.00">${m.shopPrice|formatPrice}元</strong>    </span> </p>'
            juicer.register("formatPrice", formatPrice);
            var html = juicer(tpl, res);
            $("#getPrice").html(html);
            preserverBuy.submit();
        },
        submit: function () {
        	$(document).on('click', '.submitForm', function() {
				if($("#electron_titleContent").val() == "" && globalName.invoiceCate  =="2"){
		    		Msg.Alert("","请填写电子发票！",function(){});
		    		return
		    	}else{
	            	$(".submitForm").addClass("disabled");
					$(".submit").removeClass("submitForm");
	                var req = {};
	                if(globalName.invoiceCate ==2) {//电子发票
	                    globalName.ele.electron_titleContent = filterXSS($("#electron_titleContent").val());
	                    globalName.ele.reserveOrderId = globalField.reserveOrderId;
	                    globalName.ele.payType = "1"; //这个目前没啥乱用
	                    globalName.ele.address = globalField.addressId;
	                    globalName.ele.invoiceCate = 2;
	                    globalName.ele.invoiceUuid =  globalName.ele.invoiceUuid;
	                    globalName.ele.ranNum =  Math.random();
                        globalName.ele.electron_code = $("#electron_ratepayer").val();
	                    if($.cookie('fanliCookie')){
					    	var all = JSON.parse($.cookie('fanliCookie'));
						    globalName.ele.channel_id = all.channel_id;
						    globalName.ele.tc = all.tc;
						    globalName.ele.uid = all.uid;
						    globalName.ele.s_id = all.s_id;
						    globalName.ele.uname = all.uname;
						    globalName.ele.platform = all.platform;
					    }
	                    var str = JSON.stringify(globalName.ele);
	                    req.paramStr =str;

	                }else if(globalName.invoiceCate ==3) {//增值税发票
	                    globalName.data.invoiceCate = 3;
	                    globalName.data.invoiceUuid = globalName.data.invoiceUuid;
	                    globalName.data.ranNum =  Math.random();
	                    if($.cookie('fanliCookie')){
					    	var all = JSON.parse($.cookie('fanliCookie'));
						    globalName.data.channel_id = all.channel_id;
						    globalName.data.tc = all.tc;
						    globalName.data.uid = all.uid;
						    globalName.data.s_id = all.s_id;
						    globalName.data.uname = all.uname;
						    globalName.data.platform = all.platform;
					    }
	                    var str = JSON.stringify(globalName.data);
	                    req.paramStr =str;
	                }
                    setTimeout(function(){
                        $http.post({
                            url:"/usercenter/reserveorder/saveReserOrderKuyu",
                            data:req,
                            success: function(data) {
                                if(data.code == "0") {
                                    var _data = data.data;
                                    $http.post({
                                        url: "/orderpay/toOrderPayKuyu",
                                        data:{
                                            dealerBcustomerUuid:"",
                                            payOrderUuid: _data.payOrderId,
                                            payOrderType: 2,  //1是组合 /2是单品
                                            pagename:_data.param3
                                        },
                                        success: function (res) {
                                            if(res.code == '403' || res.code == '-6'){
                                                window.location.href = "{{login}}"
                                            }
                                            if(res.code == CODEMAP.status.success) {
                                                var a = new Date().getTime();
                                                var data = JSON.stringify(res);
                                                sessionStorage.setItem("cl"+a,data);
                                                window.location.href = '../toOrderPayKuyu/toOrderPayKuyu.html?cl'+a;
                                            }
                                        }
                                    })
                                }else{
                                    $(".submit").addClass("submitForm");
                                    $(".submit").removeClass("disabled");
                                    Msg.Alert("","商品库存不足或您已经抢购",function(){});
                                }
                            }
                        });
                    },300)
                }
            })
        }
    };
    $binder.init()
    preserverBuy.getPerseve()

	//点击发票显示隐藏说明
		$(".elehide").click(function() {
			$(".tip-dialog").toggle()
			event.stopPropagation();
		})
			//点击空白地方隐藏说明
		$("body").click(function() {
			$(".tip-dialog").hide()
		})
    //电子发票
    $(function() {
        //获取发票设置列表
        $http.post({
            url: "/usercenter/electronInvoice/getByCustomerUuid",
            success: function(res) {
                if(res.data&&res.data.length>0){
                    //					$('#orderForm').attr("uuid",)
                    var tpl = ['{@each data as list}',
                        '$${list|getEle}',
                        '{@/each}',
                    ].join('');
                    var getEle = function getEle(list) {
                        return '<li class="select-item j-select-item" code='+(list.code ? list.code : '""' )+' customerAddressUuid=' + list.uuid + '>' + list.titleContent + '</li>'
                    }
                    juicer.register('getEle', getEle);
                    globalName.ele.invoiceUuid = res.data[0].uuid;
                    var result = juicer(tpl, res)
                    $("#myul").append(result)

                    $("#electron_titleContent").val(res.data[0].titleContent);
                    $("#electron_titleContent").attr("uuid",res.data[0].uuid);
                    $("#electron_ratepayer").val(res.data[0].code)

                    Map.put('name', res.data[0].code)

                }

            }
        });
        //保存发票
        $(document).on('click', '.y_btn_custom11', function() {
            if(titleTest() && checkElectron_ratepayer()) {
                $(".order-but").removeClass("active")
                $(".order-but").eq(0).addClass("active")
                $('.i-ele').hide();
                $("#addele").hide()
                $('#mask').hide();
                globalName.invoiceCate =2;

            }
        })
        //点进电子发票显示下拉框
        $(document).on('click', '.select-item', function() {
            var html = $(this).html(),uuid = $(this).attr("customerAddressUuid"),code = $(this).attr("code");
           // $("#electron_titleContent").val(globalName.name)
            globalName.ele.invoiceUuid=uuid;
            $("#electron_titleContent").val(html)

            $("#electron_titleContent").attr("uuid",uuid);
            $("#electron_ratepayer").val(code)

            $("#myul").hide()
        })
        //滑动时候下拉框颜色
        $(document).on('click', '.j-select-arrow', function(event) {
            $("#myul").show()
            var self = $(this).next();
            if(self.next().find('.select-item').length > 0 && self.next('.select-list').hasClass('active')) {
                self.next('.j-select-list').removeClass('active');
                return false;
            } else if(self.next().find('.select-item').length > 0 && !self.next('.select-list').hasClass('active')) {
                self.next('.j-select-list').addClass('active');
                return false;
            }
        })
        //编辑发票设置
        $(document).on('click', '#elei', function() {
            $('.ele').show();
            $("#addele").show()
            $('#mask').css({
                opacity: 1,
                zIndex: '1501',
                visibility: 'visible',
                display: 'block'
            });
            invoice.electron_titleContent= $("#electron_titleContent").val();
        });

        $(document).on('click', function (e) {
            e.stopPropagation();
            $("#myul").hide()
        })
        //去掉弹出框
        $(document).on('click', '#addele .y_close,#mask,#addele .close', function() {
            $('.i-ele').hide();
            $("#addele").hide()
            $('#mask').hide();
            var err =  $("#eleratepayer");
            $("#electron_titleContent").val(invoice.electron_titleContent);
            err.hide();
            var electron_ratepayer = $("#electron_ratepayer")
            if(Map.get('name') != electron_ratepayer.val()) {
                electron_ratepayer.val('');
            }
        })
        //抬头校验
        function titleTest() {
            var eletitle = $("#electron_titleContent").val();
            var err = $("#eletitle");
            if(!eletitle) {
                err.text("请输入电子发票抬头").show();
                $("#electron_titleContent").addClass("active");
                $("#electron_titleContent").focus();
                return false;
            } else {
                $("#electron_titleContent").removeClass("active");
                err.hide();
                return true
            }
        }

    });
    //增值发票
    $(function() {
        //获取发票设置列表
        $http.post({
            url: "/usercenter/addInvoice/getByCustomerUuid",
            data: {},
            success: function(res) {
                if(res.data.length>0){
                    var data=res.data[0];
                    globalName.data.invoiceUuid = data.uuid;
                    globalName.data.add_invoiceContent = "商品明细";
                    globalName.data.add_companyName = data.companyName;
                    globalName.data.add_code = data.code
                    globalName.data.add_address = data.address
                    globalName.data.add_registerMobile = data.registerMobile
                    globalName.data.add_bankName = data.bankName
                    globalName.data.add_bankNo = data.bankNo
                    globalName.data.reserveOrderId = globalField.reserveOrderId
                    globalName.data.payType = '1';  //在线支付1,货到付款2
                    globalName.data.address = data.address;
                    $('#orderForm').attr("uuid", data.uuid);
                    $("#add_companyName").val(data.companyName);
                    $("#add_code").val(data.code);
                    $("#add_address").val(data.address);
                    $("#add_registerMobile").val(data.registerMobile);
                    $("#add_bankName").val(data.bankName);
                    $("#add_bankNo").val(data.bankNo);
                    $("#add_uuid").val(data.uuid);
                    //设置隐藏域。保存值，判断是否新建增值发票
                   /* $("#acompanyName").val(data.companyName);
                    $("#acode").val(data.code);
                    $("#aaddress").val(data.address);
                    $("#aregisterMobile").val(data.registerMobile);
                    $("#abankName").val(data.bankName);
                    $("#abankNo").val(data.bankNo);*/
                }
            }
        });
        //点击显示增值发票
        $(document).on('click', '#inci', function(){
            $('#orderForm').attr("action", "/usercenter/addInvoice/createAddInvoiceSetting");
            $('#addinc').show();
            $('.i-inc').show()
            $('#mask1').css({ opacity: 1, zIndex: '1501', visibility: 'visible', display: 'block' });
            addinvoice.add_companyName=$("#add_companyName").val();
			addinvoice.add_code=$("#add_code").val();
			addinvoice.add_address=$("#add_address").val();
			addinvoice.add_registerMobile=$("#add_registerMobile").val();
			addinvoice.add_bankName=$("#add_bankName").val();
			addinvoice.add_bankNo=$("#add_bankNo").val();
        })
        //保存发票
        $(document).on('click', '.y_btn_custom2', function() {
            if((companyTest()) && (codeTest()) && (addressTest()) && (registerMobileTest()) && (bankNameTest()) && (bankNoTest())) {
                globalName.data.invoiceUuid = $('#orderForm').attr("uuid")?$('#orderForm').attr("uuid"):"";  //必须传的参数，没有为空
                globalName.data.add_invoiceContent = "商品明细";
                globalName.data.add_companyName = $("#add_companyName").val();
                globalName.data.add_code = $("#add_code").val();
                globalName.data.add_address = $("#add_address").val();
                globalName.data.add_registerMobile = $("#add_registerMobile").val();
                globalName.data.add_bankName = $("#add_bankName").val();
                globalName.data.add_bankNo = $("#add_bankNo").val();
                globalName.data.reserveOrderId = globalField.reserveOrderId
                globalName.data.payType = '1';  //在线支付1,货到付款2
                globalName.data.address = $("#add_address").val();
                /* var data1 = {};
                data1.companyName = filterXSS($("#add_companyName").val());
                data1.code = filterXSS($("#add_code").val());
                data1.address = filterXSS($("#add_address").val());
                data1.registerMobile = filterXSS($("#add_registerMobile").val());
                data1.bankName = filterXSS($("#add_bankName").val());
                data1.bankNo = filterXSS($("#add_bankNo").val());
                data1.uuid = $('#orderForm').attr("uuid");
                var param1 = JSON.stringify(data1);
                var url1 = $('#orderForm').attr("action");
                var data = {};
                data.param = param1;
                if(
                    $("#add_companyName").val() != $("#acompanyName").val() || $("#add_code").val() != $("#acode").val() || $("#add_address").val() != $("#add_address").val() ||
                    $("#add_registerMobile").val() != $("#aregisterMobile").val() || $("#add_bankName").val() != $("#abankName").val() || $("#add_bankNo").val() != $("#abankNo").val()
                ) {
                    $http.post({
                        url: url1,
                        data: data,
                        success: function(res) {
                            if(res.code=="0"){
                                //隐藏域取值判断是不是新增
                                $("#acompanyName").val(res.data.companyName);
                                $("#acode").val(res.data.code);
                                $("#aaddress").val(res.data.address);
                                $("#aregisterMobile").val(res.data.registerMobile);
                                $("#abankName").val(res.data.bankName);
                                $("#abankNo").val(res.data.bankNo);
                                //更新发票内容
                                $("#add_companyName").val(res.data.companyName);
                                $("#add_code").val(res.data.code);
                                $("#add_address").val(res.data.address);
                                $("#add_registerMobile").val(res.data.registerMobile);
                                $("#add_bankName").val(res.data.bankName);
                                $("#add_bankNo").val(res.data.bankNo);
                                $("#add_uuid").val(res.data.uuid);
                                globalName.data.invoiceUuid = res.data.uuid;*/
                                $("#invoiceCate").val("3");
                                globalName.invoiceCate = '3';
                                $(".mar-l span").removeClass("active");
                                $(".mar-l span:eq(1)").addClass("active");

                                $('#addinc').hide();
                                $('.i-inc').hide();
                                $('#mask1').hide();
                                $("#errortxt").text("");

                       /* },
                        error: function(res) {
                            alert("error")
                        }
                    })
               /!* }
                else{
                    $('#addinc').hide();
                    $('.i-inc').hide();
                    $('#mask1').hide();
                    $(".mar-l span").removeClass("active");
                    $(".mar-l span:eq(1)").addClass("active");
                    $("#invoiceCate").val("3");
                    globalName.invoiceCate = '3';
                }*/

            }
        })
        //去掉弹出框
        $(document).on('click', '#addinc .y_close,#mask1,#addinc .close', function(){
            $('#addinc').hide();
            $('.i-inc').hide()
            $('#mask1').hide();
            $("#add_companyName").val(addinvoice.add_companyName);
			$("#add_code").val(addinvoice.add_code);
			$("#add_address").val(addinvoice.add_address);
			$("#add_registerMobile").val(addinvoice.add_registerMobile);
			$("#add_bankName").val(addinvoice.add_bankName);
			$("#add_bankNo").val(addinvoice.add_bankNo);
        })
    })
    //抬头校验
    function companyTest() {
        var addtitle = $("#add_companyName").val();
        if(addtitle == ""){
            $("#errortxt").text("请输入公司名称");
            $("#add_companyName").addClass("active");
            $("#add_companyName").focus();
            return false;
        }else{
            $("#add_companyName").removeClass("active");
            return true;
        }
    }
    //纳税人识别号校验
    function codeTest() {
        var addcode = $("#add_code").val();
        var err = $("#errortxt");
        var reg = /^[0-9a-zA-Z]{15,20}$/g;
        if(addcode) {
            if(reg.test(addcode)) {
                err.text("");
                $("#add_code").removeClass("active");
                return true
            }else{
                err.text("请输入正确纳税人识别号字母或数字15-20位之间").show();
                $("#add_code").addClass("active");
                $("#add_code").focus();
                return false;
            }
        }else{
            $("#add_code").removeClass("active");
             return true;
        }
    }
    //注册地址校验
    function addressTest() {
        var address = $("#add_address").val();
        if(address == ""){
            $("#errortxt").text("请输入注册地址");
            $("#add_address").addClass("active");
            $("#add_address").focus();
            return false;
        }else{
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

    //验证纳税人识别号
    function checkElectron_ratepayer() {
        var electron_ratepayer = $("#electron_ratepayer").val();
        var err =  $("#eleratepayer");
        var reg = /^[0-9a-zA-Z]{15,20}$/g;
        if(electron_ratepayer) {
            if(reg.test(electron_ratepayer)) {
                err.text("");
                Map.put('name', electron_ratepayer)
                return true
            }else{
                err.text("请输入正确纳税人识别号字母或数字15-20位之间").show();
                return false;
            }
        }else{
            Map.set('name', '')
            return true;
        }
    }
	$("p").on('keyup', '#add_bankNo', function(event) {
		if(bankNoTest()){
			$("#errortxt").text("");
			$("#add_bankNo").removeClass("active");
		}
	});
})
