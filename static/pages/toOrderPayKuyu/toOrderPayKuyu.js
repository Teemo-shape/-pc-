require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.HeaderTwo','KUYU.navHeader', 'KUYU.navFooterLink',  'KUYU.Binder', 'KUYU.SlideBarLogin','xss'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        path = _sever[_env.sever],
        navFooterLink = KUYU.navFooterLink,
        $scope = KUYU.RootScope;
    navHeader = KUYU.navHeader;
    navHeader();
    var indent= {};
    $(function() {
        //用户获取邮箱信息
        // var user;
        // user = JSON.parse(sessionStorage.getItem('userinfo'));
        // if(user) {
        //     if(user.bindPhone) {
        //         $(".infoname").html(user.bindPhone)
        //     }
        //     if(user.bindMail) {
        //         $(".infoname").html(user.bindMail)
        //     }
        // }
        //获取前一页面传过来的数据
        var u = location.search;
        var num = u.substr(1);
        if(num.indexOf("cl") > -1) {
            var info = sessionStorage.getItem(num);
            info = JSON.parse(info);
            var info = info.retData;
            var html = '';
            html += '<div class="address clearfloat"><i class="icon iconfont-tcl icon-danxuankuang_xuanzhong"></i><div class="title">'
            if(info.pagename == 1) {
                html += '订单未支付!'
                if('3' == info.order.orderType && '1' == info.order.willType && '2' == info.order.state) {
                    html += '(请支付尾款)'
                }
            }
            if(info.pagename != 1) {
                html += '订单提交成功!'
            }
            html += '</div>'
                +'<p class="pay-text">请在<i>'+(info.orderCloseTime?info.orderCloseTime*24:48)+'小时</i>内完成支付,超时后将取消订单<span class="sum">应付总额：<em>￥' + parseFloat(info.orderMoney).toFixed(2) + '</em></span></p>' +'<p class="pay-text par-mar">收货信息：';
            if(info.orderMainAddressModel) {
                html += ' <span>' + filterXSS(info.orderMainAddressModel.name)+'&nbsp;' + info.orderMainAddressModel.mobile+'&nbsp;' + filterXSS(info.orderMainAddressModel.address) + '</span>';
            }
            html += ' <span class="fr j-slide" id="slide">订单详情' +
                ' <em class="arrow j-slide"></em></span>' +
                ' </p>' +
                ' <div class="order-info">'
            if('1' == info.payOrderType) {
                html += ' <div class="info-item">订单号：' +
                    ' <span class="red" id="dOrder">' + info.payOrderUuid + '</span></div>'
            }
            if('1' != info.payOrderType) {
                if(info.orderId) {
                    html += '<div class="info-item">订单号：' +
                        '<span class="red">' +
                        info.orderId +
                        '</span>' +
                        '</div>'
                }
            }
            // html += '<div class="info-item">收货信息：';
            // if(info.orderMainAddressModel) {
            //     html += ' <span>' + filterXSS(info.orderMainAddressModel.name)+'&emsp;' + info.orderMainAddressModel.mobile+'&emsp;' + filterXSS(info.orderMainAddressModel.address) + '</span></div>';
            // }
            if(info.orderList) {
                if(info.orderList.length == 1){
                    for(var i = 0; i < info.orderList.length; i++) {
                        var olist = info.orderList[i];
                        html += '<div class="info-item">商品名称：' +
                            '<span>' + info.orderList[0].detailList[0].productName + 'x' + info.productMap[info.orderList[0].detailList[0].productUuid] + '</span>'
                        for(var j = 1; j < olist.detailList.length; j++) {
                            if(olist.detailList.length > 1) {
                                html += '<span class="pad">' + olist.detailList[j].productName + 'x' + info.productMap[olist.detailList[j].productUuid] + '</span>'
                            }
                        }
                        html +='</div>'
                    }
                }
                if(info.orderList.length != 1){
                    html += '<div class="info-item">商品名称：<span>' + info.orderList[0].detailList[0].productName + 'x' + info.productMap[info.orderList[0].detailList[0].productUuid] + '</span>'
                    for(var i = 1;i<info.orderList[0].detailList.length;i++){
                        html +=	'<span class="pad">' + info.orderList[0].detailList[i].productName + 'x' + info.productMap[info.orderList[0].detailList[i].productUuid] + '</span>'
                    }
                    for(var j = 1; j < info.orderList.length; j++) {
                        var list = info.orderList[j];
                        for(var k = 0; k < list.detailList.length; k++) {
                            html += '<span class="pad">' + list.detailList[k].productName + 'x' + info.productMap[list.detailList[k].productUuid] + '</span>'
                        }
                    }
                    html +='</div>'
                }
            }
            if('3' == info.orderList[0].orderType) {
                if(info.orderList[0].willType) {
                    if('1' == info.orderList[0].willType) {
                        if('1' == info.orderList[0].state) {
                            html += '<div class="info-item">第一阶段，预付定金</div>'
                            indent.orderId=info.order.orderId
//							$("#dOrder").html(info.order.orderId);
                        }
                    }
                }
            }
            html += '<div class="info-item">' +
                '发票抬头：' +
                '<span>'
            if(info.invoice) {
                if(info.invoice.invoiceType == 1) {
                    html += info.invoice.invoiceTitle + '（普通发票 ）'
                }
                if(info.invoice.invoiceType == 2) {
                    html += filterXSS(info.invoice.invoiceTitle) + '（电子发票）'
                }
                if(info.invoice.invoiceType == 3) {
                    html += filterXSS(info.invoice.companyName) + '（增值税发票）'
                } else {
                    html += ''
                }
            }

            html += '</span>' +
                '</div>'
            if(info.invoice) {
                if(info.invoice.ratePayCode){
                    html +='<div class="info-item">纳税人识别号: '+info.invoice.ratePayCode+ '</div>';
                }
            }

            html +=' </div>' +
                '</div>'

            $("#orderBox").html(html)
            if(info.orderList) {
                if(info.orderList.length > 1) {
                    $("#dOrder").html(info.order.orderGroupUuid)
                }
            }
            $("#dOrder").html(indent.orderId);
            setTimeout(function () {
                var nickName = $("#onlyName").text();
                NTKF_PARAM && NTKF && NTKF.im_updatePageInfo({
                    uid:info.cam.customerUuid,		                 //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
                    uname:nickName,		     //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
                    isvip:"0",                           //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
                    userlevel:"1",		                 //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
                    erpparam:"abc",                      //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
                    orderid: info.orderId,		         //订单ID
                    orderprice: info.orderMoney		             //订单总价
                });
            },1e3)

            //国双统计
            function _gsCallback() {
                if (window._gsTracker) {
                    _gsTracker.addOrder(info.orderId, null);
                    // 当订单包含多种商品时，请相应地多次调用addProduct函数
                    // 如不需要跟踪订单内的产品购买信息，则可以不调用addProduct函数
                    _gsTracker.addProduct(info.orderId, info.orderList[0].detailList[0].productName, null, null, info.productMap[info.orderList[0].detailList[0].productUuid], null);
                    _gsTracker.addProduct(info.orderId, info.orderList[0].detailList[0].productName, null, null, info.productMap[info.orderList[0].detailList[0].productUuid], null);
                    // 更多addProduct
                    _gsTracker.trackECom();
                }
            }
        }
        //点击显示隐藏信息
        $(document).on('click', '#slide', function() {
            $(".order-info").stop().slideToggle();
        })
        if(info.order) {
            var payOrderUuid = info.payOrderUuid;
            var orderId = payOrderUuid;
            var paytype = info.order.paytype;
            var orderType = info.order.orderType;
            var state = info.order.state;
        }
        var html = "";
        html += '<div class="info-box clearfloat mybox"><h3>在线支付</h3>'

              +'<div class="item zfb">' + // onclick="javascript:choosePayType('05')"
            '<span class="item-pay saoma-pay"></span></div>' +
            // '    <div class="item myitem">' +
            // '       <span class="item-pay yinglian-pay">' +
            // '           <a style="position: absolute;width: 100%;height: 100%;" href="UPOP"  target="_blank"></a>' +
            // '       </span>' +
            // '   </div>' +
                /*'   <div class="item myitem">' +
                 '       <span class="item-pay zhifubao-pay">' +
                 '           <a style="position: absolute;width: 100%;height: 100%;" href="ALIPAY"  target="_blank"></a>' +
                 '       </span>' +
                 '   </div>' +*/
            '<div class="item wx">' + // onclick="javascript:choosePayType('03')"
            ' <span class="item-pay weixin-pay"></span></div>' +
            '</div>' +
                //测试环境显示假支付按钮start
            ''+(_env['sever'] != "deploy" ? "<button class = 'jiazhifu' style='cursor:pointer;width:192px;height:60px;background:#f00;color:#fff;font-size:1.5em; '>支付测试</button>" : "")+''+
            // ' <div class="title">银行借记卡及信用卡<span class="font">（大额支付推荐使用支付宝）</span></div>' +
            '<div class="info-box clearfloat mybox"><h3>网银支付</h3>'+
            '   <div class="ylPay"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><a style="display:block;width:100%;heigth:100%" href="UPOP"  target="_blank"><span class="item-pay yinglian-pay"></span></a></div>（大额支付推荐使用银联支付）</div>' +
            '<div class="banklist"><a href="pingan"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay pingan-pay"></span></div></a>' +
            '   <a href="citic"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay zhongxin-pay"></span></div></a>' +//IE
            '   <a href="cgb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay guangfa-pay"></span></div></a>' +
            '   <a href="icbc"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay gongshang-pay"></span></div></a>' +//IE
            '   <a href="bos"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay shanghai-pay"></span></div></a>' +
            '   <a href="psbc"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay youzheng-pay"></span></div></a>' +
            '   <a href="comm"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay jiaotong-pay"></span></div></a>' +
            '   <a href="spdb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay pufa-pay"></span></div></a>' +
            '   <a href="cmb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay zhaoshang-pay"></span></div></a>' +
            '   <a href="abc"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay nongye-pay"></span></div></a>' +
            '   <a href="hxb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay huaxia-pay"></span></div></a>' +
            '   <a href="ccb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay jianshe-pay"></span></div></a>' +
            '   <a href="ceb"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay guangda-pay"></span></div></a>' +
            '   <a href="cmbc"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay mingsheng-pay"></span></div></a>' +
            '   <a href="cib"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay xingye-pay"></span></div></a>' +
            '   <a href="boc"  target="_blank"><i class="icon iconfont-tcl icon-danxuankuang_weixuanzhong"></i><div class="item"><span class="item-pay zhongguo-pay"></span></div></a></div>' +
            '<a href="javascript:;" class="toPay">去支付</a><input type="hidden" id="target"></div>';
        $("#informat").append(html);
        //扫码付款点击
        $("#informat").on("click", ".info-box .saoma-pay", function() {
            choosePayType('05');
        });
        //微信点击
        $("#informat").on("click", ".info-box .weixin-pay", function() {
            choosePayType('03');
        });

        //"我的订单"点击跳转
        // $('span.order-num').click(function() {
        //     window.location.href = '../orderList/orderList.html';
        // });
        var timer1;
        var popHtml = $("#codePay").prop("outerHTML"); //保存原有的弹窗正在加载的html，每次打开弹窗首先初始化成原有的html
        var pop1Html = $("#codePay1").prop("outerHTML"); //保存原有的弹窗正在加载的html，每次打开弹窗首先初始化成原有的html
        function choosePayType(payType) {
            if(payType == '03' || payType == '05') {
                //检测订单是否可以进行支付
                var url = "/allinpay/checkOrderState";
                $http.post({
                    url: url,
                    data: {
                        orderId: orderId,
                        ranNum: Math.random()
                    },
                    success: function(data) {
                        if("0" != data.code) {
                            Msg.Alert("","该订单不符合支付条件！",function(){});
                            return;
                        } else {
                            //支付宝扫码和微信扫码
                            var url = "/allinpay/submitScanCodePayNewKuyu";
                            popup(payType);
                            $http.post({
                                url: url,
                                data: {
                                    orderId: payOrderUuid,
                                    payType: payType,
                                    ranNum: Math.random()
                                },
                                success: function(data) {
                                    $("#codePay").find("img").attr("src", path + "/allinpay/createQrCode?code=" + data.data.qrCodeUrl); //replaceWith(data.data.qrCodeUrl);
                                    timer1 = setInterval(checkOrderState, 4000);
                                }
                            })
                        }
                    }
                })
            } else {
                Msg.Alert("", "该订单不符合支付条件！",function(){});
            }
        }
        //调用支付弹出框方法
        function popup(payType) {
            $("#codePay").replaceWith(popHtml);
            clearInterval(timer1);
            var payTypeName = "";
            if(payType == "05") {
                payTypeName = "支付宝";
            } else {
                payTypeName = "微信";
            }
            $("#codePay").find(".title").html(payTypeName + "扫码支付");
            $("#codePay").find(".align").html("使用手机" + payTypeName + "扫码完成支付");
            $("#codePay").show();
            $(".j-mask").show();
        }
        //假支付功能
        $(document).on("click",".jiazhifu",function(){
            $http.post({
                url:"/pay/submitorderKuyuTest",
                data:{
                    orderId:orderId,
                    payType:"ALIPAY",
                    ranNum:Math.random()
                },
                success:function(res){
                    if(res.code == "60002" || res.code =="60001"){
                        Msg.Alert("", res.msg || "该订单不符合支付条件！",function(){});
                    }else{
                        try{
                            //_smq.push(['custom', 'PC', 'order', orderId]); //ad
                            res.payway = '扫码支付';
                            sessionStorage.setItem("rst",JSON.stringify(res));
                            window.location.href = "../PayResult/PayResult.html?rst";
                        }catch(e){
                            throw(e)
                        }
                    }
                }
            })
        })
        //检查订单支付状态
        function checkOrderState(){
            var orderState = state;
            var url = "/allinpay/checkOrderStateKuyu";
            $http.post({
                url:url,
                data:{
                    orderId:orderId,
                    orderState:orderState,
                    ranNum:Math.random()
                },
                success:function(res){
                    if("0"==res.code) {
                        var orderId = payOrderUuid;
                        if(orderType == "3"){
                            if(orderState == "1"){
                                orderId = orderId + "A";
                            }
                            else if(orderState == "2"){
                                orderId = orderId + "B";
                            }
                        }
                        //跳转到订单支付成功页面的接口，获取订单信息的
                        $http.post({
                            url:"/allinpay/scanCodePayReturnKuyu",
                            data:{
                                orderId :orderId,
                                ranNum:Math.random()
                            },
                            success:function(res){
                                if(res.code == "60002" || res.code =="60001"){
                                    Msg.Alert("","该订单不符合支付条件！",function(){});
                                }else{
                                    try{
                                      //  _smq.push(['custom', 'PC', 'order', orderId]); //ad
                                        res.payway = '扫码支付';
                                        sessionStorage.setItem("rst",JSON.stringify(res));
                                        window.location.href = "../PayResult/PayResult.html?rst";
                                    }catch(e){
                                        throw(e)
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
        $(document).on("click", ".j-close", function() {
            $("#codePay").hide();
            $("#codePay1").hide();
            $(".j-mask").hide();
        })
        $(document).on("click", ".j-mask", function() {
            $("#codePay").hide();
            $("#codePay1").hide();
            $(".j-mask").hide();
        })
        //第三方支付
        //支付宝、银联
        // $(".myitem").on("click", "a", function(e) {
        //     e.preventDefault();
        //     var payType = $(this).attr("href");
        //     payOther(orderId, payType)
        //     $("#codePay1").show();
        //     $(".j-mask").show();
        // })
        //银行支付
        $(".info-box").on("click", ".ylPay", function(e) {
            e.preventDefault();
            $(this).find('i').addClass('on');
            $(".banklist a").removeClass('on');
            var payType = $(this).attr("href");
            $('#target').val(payType)
            //payOther(orderId, payType)
            //$("#codePay1").show();
            //$(".j-mask").show();
        })
        $(".banklist").on("click", "a", function(e) {
            e.preventDefault();
            $('.ylPay').find('i').removeClass('on');
            $(this).addClass('on').siblings('a').removeClass('on');
            var payType = $(this).attr("href");
            $('#target').val(payType)
            //payOther(orderId, payType)
            //$("#codePay1").show();
            //$(".j-mask").show();
        })
        $('.info-box').on("click", ".toPay", function() {
            if(($('.banklist a.on').length<=0)&&($('.ylPay i.on').length<=0)){
                Msg.Alert("","请至少选择一种银行付款方式！",function(){});
                return;
            }
            payOther(orderId, $('#target').val())
            $("#codePay1").show();
            $(".j-mask").show();
        })
        function payOther(orderId, payType) {
            $http.post({
                url: "/allinpay/submitorderKuyu",
                data: {
                    orderId: orderId,
                    payType: payType,
                    ranNum: Math.random()
                },
                success: function(data) {
                    if(data) {
                        doPayResponse(data)
                    }
                }
            })
        }
        function doPayResponse(res) {
            if(res.data) {
                var data = res.data;
            }
            if(data.payUrl) {
                var url = data.payUrl;
                $("#formSubmit").attr("action", url);
            }
            /*$("input[name='charset']").attr("value", data.charset)
             $("input[name='version']").attr("value", data.version)
             $("input[name='sign_type']").attr("value", data.sign_type)
             $("input[name='service']").attr("value", data.service)
             $("input[name='merchant_code']").attr("value", data.merchant_code)
             $("input[name='merchant_sign']").attr("value", data.merchant_sign)
             $("input[name='merchant_cert']").attr("value", data.merchant_cert)
             $("input[name='request_id']").attr("value", data.request_id)
             $("input[name='buyer_id']").attr("value", data.buyer_id)
             $("input[name='out_trade_no']").attr("value", data.out_trade_no)
             $("input[name='order_time']").attr("value", data.order_time)
             $("input[name='total_amount']").attr("value", data.total_amount)
             $("input[name='time_expire']").attr("value", data.time_expire)
             $("input[name='validNum']").attr("value", data.validNum)
             $("input[name='show_url']").attr("value", data.show_url)
             $("input[name='product_name']").attr("value", data.product_name)
             $("input[name='product_id']").attr("value", data.product_id)
             $("input[name='product_desc']").attr("value", data.product_desc)
             $("input[name='attach']").attr("value", data.attach)
             $("input[name='channel_code']").attr("value", data.channel_code)
             $("input[name='merchant_name']").attr("value", data.merchant_name)
             $("input[name='app_no']").attr("value", data.app_no)
             $("input[name='return_url']").attr("value", data.return_url)
             $("input[name='notify_url']").attr("value", data.notify_url)
             $("input[name='spbill_create_ip']").attr("value", data.spbill_create_ip)
             $("input[name='currency']").attr("value", data.currency)
             $("input[name='out_msg_type']").attr("value", data.out_msg_type)*/
            //更换支付平台
            $("input[name='inputCharset']").attr("value", data.inputCharset)
            $("input[name='pickupUrl']").attr("value", data.pickupUrl)
            $("input[name='receiveUrl']").attr("value", data.receiveUrl)
            $("input[name='version']").attr("value", data.version)
            $("input[name='language']").attr("value", data.language)
            $("input[name='signType']").attr("value", data.signType)
            $("input[name='payType']").attr("value", data.payType)
            $("input[name='merchantId']").attr("value", data.merchantId)
            $("input[name='orderNo']").attr("value", data.orderNo)
            $("input[name='orderAmount']").attr("value", data.orderAmount)
            $("input[name='orderCurrency']").attr("value", data.orderCurrency)
            $("input[name='orderDatetime']").attr("value", data.orderDatetime)
            $("input[name='productName']").attr("value", data.productName)
            $("input[name='productDesc']").attr("value", data.productDesc)
            $("input[name='ext2']").attr("value", data.ext2)
            $("input[name='signMsg']").attr("value", data.signMsg)
            $("input[name='issuerId']").attr("value", data.issuerId)
            $("#formSubmit").submit();
        }
    })
})
