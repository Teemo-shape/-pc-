require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'juicer', 'KUYU.navFooterLink', 'xss'], function() {
    var $http = KUYU.Service,
        slidBarLogin = KUYU.SlideBarLogin,
        Header = KUYU.HeaderTwo,
        navFooterLink = KUYU.navFooterLink;
    Header.menuHover()
    Header.topSearch();
    navFooterLink();
    var str = document.referrer;
    //页面加载发起请求
    $(function() {
        //秒杀定：剩余时间
        var remain;
        //别的页面传的参数
        var href = "";
        href = location.search.split("?")[1];
        var orderId = "";
        orderDetails()
        var ohtml = "";
        
        //:订单详情
        function orderDetails() {
            var url = "/usercenter/order/ajaxviewKuyu?uuid=" + href;
            $http.post({
                url: url,
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if(res) {
                        ohtml = $("#mian_right").html();
                        doOrderDetailsResponse(res);
                        getOrderstate()
                        if(res.data.deliveryOrder) {
                            var sendTime = res.data.deliveryOrder.sendTime
                            var state = res.data.m.state
                            autoclickConfirm(sendTime, state)
                        }
                    }
                }
            });
        }
        
        //确认收货
        $(document).on("click", "#ConfirmReceive", function() {
            var uuid = $(this).attr("data-id");
            ConfirmReceiveGoods(uuid);
        });
        //付尾款
        $(document).on("click", ".fail", function() {
            Msg.Alert("", "已过期!请重新抢购!", function() {
            });
        })
        //去付款、付定金、付尾款页面请求
        $(document).on("click", ".goPay", function() {
            var state = $(this).attr("state");
            var payOrderUuid = $(this).attr("orderId");
            var payOrderType = $(this).attr("orderType");
            payOrderType = "2"
            var pagename = "";
            
            var ajaxToOrderPayKuyu = toOrderPayKuyu(payOrderUuid, payOrderType);
            if(!ajaxToOrderPayKuyu) {
                payOrderUuid = $(this).attr("orderGroupUuid");
                payOrderType = "1";
                toOrderPayKuyu(payOrderUuid, payOrderType);
            }
        })
        
        //去付款,接上面
        function toOrderPayKuyu(payOrderUuid, payOrderType) {
            url = "/orderpay/toOrderPayKuyu";
            $http.post({
                url: url,
                async: false,
                data: {
                    dealerBcustomerUuid: "",
                    payOrderUuid: payOrderUuid,
                    payOrderType: payOrderType,
                    pagename: ""
                },
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                        return ture;
                    }
                    var data = res.retData.nextMethod;
                    //支付订单uuid
                    uuid = res.retData.payOrderUuid;
                    if(data == "toOrderPayKuyu") {
                        return false;
                    }
                    if(data == "OrderPay") {
                        var a = new Date().getTime();
                        var res = JSON.stringify(res);
                        sessionStorage.setItem("cl" + a, res);
                        window.location.href = "../toOrderPayKuyu/toOrderPayKuyu.html?cl" + a;
                        return ture;
                    }
                    if(data == "toLogin") {
                        window.location.href = "{{login}}";
                        return ture;
                    }
                    if(data == "PayAgainSuccess") {
                        window.location.href = "../PayAgainSuccess/PayAgainSuccess.html?" + payOrderUuid + "&" + state;
                        return ture;
                    }
                }
            })
        }
        
        //确认收货 （拷贝详情页面确认收货逻辑）
        function ConfirmReceiveGoods(uuid) {
            Msg.Confirm("", "确认收货后不能修改，您确定要收货吗？", function() {
                var orderUuid = uuid;
                var url = "/usercenter/order/reveiveKuyu";
                $http.post({
                    url: url,
                    data: {
                        orderUuid: orderUuid,
                        password: "123456"
                    },
                    success: function(data) {
                        if(data.code == "403" || data.code == "-6") {
                            window.location.href = "{{login}}"
                        }
                        if("success" == data.msg) {
                            Msg.Alert("", "确认收货成功!", function() {
                                window.location.reload(true);
                            });
                        } else {
                            Msg.Alert("", "确认收货失败，请稍后重试", function() {
                                window.location.reload();
                            });
                        }
                    }
                    
                });
            });
        }
        
        //    自动点击收货
        function autoclickConfirm(sendTime, state) {
            var orderUuid = $('#ConfirmReceive').attr("data-id");
            var sendTime = sendTime.replace(/-/g, "/")
            var time = new Date(sendTime).getTime() + 7 * 24 * 60 * 60 * 1000 - new Date().getTime()
            var url = "/usercenter/order/reveiveKuyu";
            if(time <= 0 && state === "6") {
                $http.post({
                    url: url,
                    data: {
                        orderUuid: orderUuid,
                        password: "123456"
                    },
                    success: function(data) {
                        if(data.code == "403" || data.code == "-6") {
                            window.location.href = "{{login}}"
                        }
                        if("success" == data.msg) {
                            window.location.reload();
                        } else {
                            console.log('确认收货失败，请稍后重试')
                        }
                    }
                });
            }
        }
        
        //根据状态判断订单的详情
        function getOrderstate() {
            var mClass = $(".m_placean .m_state").attr("class");
            if(mClass) {
                var mStep = mClass.split("m_state ")[1];
                if(mStep) {
                    var index = mStep.split("m_statebg_")[1];
                    $(".m_state_box.progress_box span:lt(" + index + ")").addClass("active")
                }
            }
        }
        
        //页面展示
        function doOrderDetailsResponse(res) {
            var res = res.data;
            var tpl = '<div class="m_content">' +
                '<h3>订单详情</h3>' +
                '<div class="m_customer">' +
                '<div class="m_orderno_time">$${m,flastPayEndTime,firstPayEndTime|orderTime}' + //<%--activeTime:定金支付标识   factiveTime：尾款支付标识--%>
                '</div>' +
                '<div class="m_orderno">' +
                '<div class="fl">订单号 :$${m.orderId}</div>' +
                '<div class="fr button">$${m,activeTime,deliveryOrder|btn}</div>' +
                '</div>' +
                '<div class="m_placean">' +
                '<h4>订单状态' +
                '</h4>$${m|time}' + //<%-- 1:等待买家付款   * 2.等待支付尾款：预售订单才会有此状态<br /> 4:等待卖家发货 5:卖家备货中 6:卖家已发货 7:交易成功 --%>
                //		<!-- 普通订单 -->
                '$${m | commomOrder}' +
                //		  <!-- 预定订单 -->
                '$${m | reserveOrder}' +
                '</div>' +
                '<div class="m_state_information bor-bott">' +
                '<div class="m_tit mt">' +
                '$${m ,deliveryOrder,activeTime| productInfo}' +
                '<p><span class="state-time">$${m.orderTime}</span>您的订单下单成功</p>' +
                '</div>' +
                '</div>' +
                '$${detailList,omdmList,m | product}' +
                ' <div class="receiving_information bor-bott">' +
                '<h4>收货信息</h4>' +
                ' <div class="m_receiving">' +
                '$${omam | person}' +
                '</div>' +
                '</div>' + //<!--receiving_information end--->
                '$${m,ordernaryInvoice,onlineInvoice | invoiceType}' +
                '<div class = "receiving_information bor-bott">' +
                '<h4>买家留言</h4>' +
                ' <div class="m_receiving">' +
                '$${m | note}' +
                '</div>' +
                '</div>' +
                '<div class="m_detailed">' +
                ' <h4>支付明细</h4>' +
                '<div class="m_tit">' +
                '<div class="fr">' +
                //优惠信息支付明细
                '$${m | info}' +
                '<p>订单金额：<span>$${m|orderPayMoneyStr}元</span></p>' +
                '<p class="m_p">' +
                '实付${m|presell_paymsg}金额：<span><b>$${m|payMoneyStr}</b>元</span>' +
                ' </p>' +
                '</div>' +
                '</div>' + //<!--m_detailed html end--->
                '</div>' +
                '</div>' +
                '</div>'
            '</div>'
            
            //秒杀点单支付剩余时间
            var orderTime = function(m, flastPayEndTime, firstPayEndTime) {
                if(m.orderType == '3' && m.state == '1') {
                    if(m.firstPayTime && !firstPayEndTime) {
                        return '<div class="m_orderno_time"><span>定金支付截止时间：</span><span>' + m.firstPayTime + '</span></div>'
                    }
                    else {
                        return '<div class="m_orderno_time"><span>定金支付截止时间：</span><span>' + firstPayEndTime + '</span></div>'
                    }
                }
                if(m.orderType == '3' && m.state == '2') {
                    if(m.lastPayTime && !flastPayEndTime) {
                        return '<div class="m_orderno_time"><span>尾款支付截止时间：</span><span>' + m.lastPayTime + '</span></div>'
                    }
                    else {
                        return '<div class="m_orderno_time"><span>尾款支付截止时间：</span><span>' + flastPayEndTime + '</span></div>'
                    }
                }
            }
            juicer.register('orderTime', orderTime);
            //判断是哪种提交按钮
            
            var btn = function(m, activeTime, deliveryOrder) {
                if(m.state == '1' && m.orderType == '3') {
//					if(m.resfirstPayState != "noo"){
                    if(activeTime == 'yoo') {
                        return '<a  class="btn fr cursor" state="' + m.state + '" orderType="' + m.orderType + '" orderGroupUuid="' + m.orderGroupUuid + '" orderId="' + m.orderId + '"  orderUuid="' + m.uuid + '" >支付定金</a>';
                    }
                    else {
                        return ''
                    }
                }
                if(m.state == '2' && m.orderType == '3') {
                    if(m.ucenterButton.payLastButton) {
                        return '<a  class="btn fr cursor" state="' + m.state + '" orderType="' + m.orderType + '" orderGroupUuid="' + m.orderGroupUuid + '" orderId="' + m.orderId + '"  orderUuid="' + m.uuid + '" >支付尾款</a>';
                    }
                    else {
                        return ''
                    }
                }
                if(m.state == '1' && m.orderType == '1') {
                    if(m.limitRemainPayTime == null || m.limitRemainPayTime > 0) {
                        return '<a  class="btn fr cursor goPay" state="' + m.state + '" orderType="' + m.orderType + '" orderGroupUuid="' + m.orderGroupUuid + '" orderId="' + m.orderId + '"  orderUuid="' + m.uuid + '" >去付款</a>';
                    }
                    else {
                        return ''
                    }
                }
                if(m.state == '6') {
                    var timeSeparte = function(t) {
                        var time = {}
                        time.day = Math.floor(t / 86400000)
                        time.hour = Math.floor((t % 86400000) / 3600000);
                        time.minute = Math.floor(((t % 86400000) % 3600000) / 60000);
                        time.second = Math.floor((((t % 86400000) % 3600000) % 60000) / 1000);
                        $('.fr.button').empty()
                        $('.fr.button').append('<div class="order-time">还剩<span class="order-restdate">' + time.day + '</span>天<span class="order-resthour">' + time.hour + '</span>时<span class="order-restminute">' + time.minute + '</span>分<span class="order-restsecond">' + time.second + '</span>秒自动收货</div>' +
                            '<a class="btn fr cursor" id="ConfirmReceive" data-id="' + m.uuid + '">确认收货</a>')
                    }
                    var sendTime = deliveryOrder.sendTime.replace(/-/g, "/")
                    var time = new Date(sendTime).getTime() + 7 * 24 * 60 * 60 * 1000 - new Date().getTime()
                    var secondTime = time / 1000
                    setTimeout(function() {
                        timeSeparte(time)
                    }, 0)
                    function CountDown() {
                        if(secondTime > 0) {
                            var t = secondTime * 1000
                            timeSeparte(t)
                            secondTime --
                        } else {
                            clearInterval(timer)
                        }
                    }
                    var timer = setInterval(function() {
                        CountDown()
                    }, 1000)
                    // var sendTime = deliveryOrder.sendTime.replace(/-/g, "/")
                    // var time = new Date(sendTime).getTime() + 7 * 24 * 60 * 60 * 1000 - new Date().getTime()
                    // var day = Math.floor(time / 86400000)
                    // var hour = Math.floor((time % 86400000) / 3600000);
                    // var minute = Math.floor(((time % 86400000) % 3600000) / 60000);
                    // var second = Math.floor((((time % 86400000) % 3600000) % 60000) / 1000);
                    // return '<div class="order-time">还剩<span class="order-restdate">' + day + '</span>天<span class="order-resthour">' + hour + '</span>时<span class="order-restminute">' + minute + '</span>分<span class="order-restsecond">' + second + '</span>秒自动收货</div>' +
                    //     '<a class="btn fr cursor" id="ConfirmReceive" data-id="' + m.uuid + '">确认收货</a>';
                }
                if(m.state == '7' && m.commentState == '1') {
                    return '<a href="../productappraise/commentDetail.html?' + m.uuid + '" class="btn fr cursor">写评价</a>';
                }
                if(m.state == '7' && m.commentState == '2') {
                    return '<a href="../productappraise/commentDetail.html?' + m.uuid + '" class="btn fr cursor">查看评价</a>';
                }
            }
            juicer.register('btn', btn);
            
            // 秒杀订单支付剩余时间
            var time = function(m) {
                if(m.state == '1' && m.limitPromotion == true) {
                    remain = m.limitRemainPayTime / 1000;
                    //				var remainHour = (m.limitRemainPayTime - m.limitRemainPayTime % (1000 * 60 * 60)) / (1000 * 60 * 60) % 24;
                    //				var remainMinute = (m.limitRemainPayTime - m.limitRemainPayTime % (1000 * 60)) / (1000 * 60) % 60;
                    var html = '<h4 class="limitRemainPayTimeSpan" status="' + m.state + '" orderUuid="' + m.uuid + '"> 等待付款';
                    
                    if(remain > 0) {
                        var minute = Math.ceil(remain / 60);
                        html += '<span class="red-litter-txt">付款时间还剩<font class="minute">' + minute + '</font>分钟 超时将关闭订单</span>'
                    }
                    if(remain <= 0) {
                        html += '<span  status="' + m.state + '" orderUuid="' + m.uuid + '" class="red-litter-txt limitPayTimeOut">已过期</span>';
                    }
                    return html + '</h4>'
                }
            }
            juicer.register('time', time);
            //普通订单
            var commomOrder = function(m) {
                var html = '<div class="m_state_box progress_box">' +
                    '<span>下单</span>' +
                    '<span class="m_span1">付款</span>' +
                    '<span class="m_span2">发货</span>' +
                    '<span class="m_span3">交易成功</span>' +
                    '<span class="m_span4">评价</span>' +
                    '</div>'
                if(m.state != '8' && m.orderType == '1') {
                    if(m.state == '1') {
                        return '<div class="m_state m_statebg_1">' + html
                    }
                    if(m.state == '4' || m.state == '5') {
                        return '<div class="m_state m_statebg_2">' + html
                    }
                    if(m.state == '7' && m.commentState != '2') {
                        return '<div class="m_state m_statebg_4">' + html
                    }
                    if(m.state == '6') {
                        return '<div class="m_state m_statebg_3">' + html
                    }
                    if(m.state == '7' && m.commentState == '2') {
                        return '<div class="m_state m_statebg_5">' + html
                    } else {
                        return '<div class="m_state">' + html
                    }
                }
                
            }
            juicer.register('commomOrder', commomOrder);
            //预定订单,分两步的
            var reserveOrder = function(m) {
                var html = '<div class="m_state_box six progress_box">' +
                    '<span>下单</span>' +
                    '<span class="m_span1">付定金</span>' +
                    '<span class="m_span2">付尾款</span>' +
                    '<span class="m_span3">发货</span>' +
                    '<span class="m_span4">交易成功</span>' +
                    '<span class="m_span5">评价</span>' +
                    '</div>'
                if(m.state != '8' && m.orderType == '3') {
                    if(m.state == '1') {
                        return '<div class="m_state m_statebg_1">' + html
                    }
                    if(m.state == '2') {
                        return '<div class="m_state m_statebg_2">' + html
                    }
                    if(m.state == '4' || m.state == '5') {
                        return '<div class="m_state m_statebg_3">' + html
                    }
                    if(m.state == '7' && m.commentState != '2') {
                        return '<div class="m_state m_statebg_5">' + html
                    }
                    if(m.state == '6') {
                        return '<div class="m_state m_statebg_4">' + html
                    }
                    if(m.state == '7' && m.commentState == '2') {
                        return '<div class="m_state m_statebg_6">' + html
                    } else {
                        return '<div class="m_state">' + html
                    }
                }
            }
            juicer.register('reserveOrder', reserveOrder);
            //商品状态判断及收货信息显示
            var productInfo = function(m, deliveryOrder, activeTime) {
                if(m.state == '8' && (m.orderType == '1' || m.orderType == '3')) {
                    return '<p>交易已关闭。</p>'
                }
                if(m.state == '1') {
                    if(m.orderType == '3' && '1' == m.willType) {
                        return '<p class="red">订单等待支付定金哦。</p>';
                    } else {
                        return '<p class="red">订单还没支付哦。</p>';
                    }
                }
                if(m.orderType == '3' && '1' == m.willType && '2' == m.state) {
                    var html = '<p><span class="state-time">' + m.firstMoneyPaySuccessTime + '</span> 您的订单定金支付成功，等待支付尾款。';
                    if(m.orderType == '3' && m.state == '2' && activeTime == 'yoo') {
                        return html += '(尾款支付开始时间是' + m.lastStartPayTime + '，尾款支付结束时间是' + m.lastPayTime + ')';
                    }
                    if(m.orderType == '3' && m.state == '2' && activeTime != 'yoo') {
                        return html += '(尾款支付开始时间是' + m.lastStartPayTime + ')';
                    }
                }
                if(m.state == '4' || m.state == '5') {
                    if(m.payTime) {
                        return '<p><span class="state-time">' + m.payTime + '</span>您的订单支付成功。</p>';
                    }
                }
                if(m.state == '8' && m.orderType == '3' && activeTime == 'noo') {
                    return '<p class="red">订单超过支付时间。</p>';
                }
                if(m.state == '6' || m.state == '7') {
                    var htmlInfo = "";
                    htmlInfo += '<div id="expressTraceList"></div>';
                    if(deliveryOrder) {
                        htmlInfo += '<p><span class="state-time">' + deliveryOrder.opeTime + '</span>物流公司：' + deliveryOrder.logisCompany + '</span><span>; 物流单号：' + deliveryOrder.logicNo + '</span></p>';
                    }
                    if(m.outWareTime) {
                        htmlInfo += '<p><span class="state-time">' + m.outWareTime + '</span></c:if>商家正通知快递公司揽件</p>';
                    }
                    if(m.payTime) {
                        htmlInfo += '<p><span class="state-time">' + m.payTime + '</span>您的订单支付成功</p>';
                    }
                    return htmlInfo;
                    
                }
            }
            
            juicer.register('productInfo', productInfo);
            //收货信息
            var person = function(omam) {
                if(omam) {
                    return '<p>姓       名：' + filterXSS(omam.name) + '</p>' +
                        '<p>联系电话：' + omam.mobile.substr(0, 3) + '****' + omam.mobile.substr(7) + '</p>' +
                        '<p>收货地址：' + filterXSS(omam.address) + '</p>'
                }
            }
            juicer.register('person', person);
            //发票类型
            var invoiceType = function(m, ordernaryInvoice, onlineInvoice) {
                var htmlInvoice = ""
                if(m.invoiceType) {
                    htmlInvoice += '<div class="m_invoice bor-bott"><h4>发票信息</h4><div class="m_receiving">'
                    if(ordernaryInvoice && m.invoiceType == '1') {
                        htmlInvoice += '<p>发票类型： 普通发票</p> <p>发票抬头： ' + filterXSS(ordernaryInvoice.invoiceTitle) + '</p> <p>发票内容： ' + ordernaryInvoice.invoiceContent + '</p><p>纳税人识别号： ' + (ordernaryInvoice.ratePayCode ? filterXSS(ordernaryInvoice.ratePayCode) : '无') + '</p>';
                    }
                    if(onlineInvoice && m.invoiceType == '2') {
                        htmlInvoice += '<p>发票类型： 电子发票</p> <p>发票抬头： ' + filterXSS(onlineInvoice.invoiceTitle) + '</p> <p>发票内容： 商品明细</p><p>纳税人识别号： ' + (ordernaryInvoice.ratePayCode ? filterXSS(ordernaryInvoice.ratePayCode) : '') + '</p>	'
                        if(m.orderTime > '2016-06-28 00:00:00' && '8' > m.state && '5' < m.state) {
                            htmlInvoice += '<p><a class="red" target="_blank" href="http://www.chaxunfapiao.com/?orderno=' + m.orderId + '" id="eleInvoiceOrder">点击查看发票</a></p>';
                        }
                    }
                    if(ordernaryInvoice && m.invoiceType == '3') {
                        htmlInvoice += '<p>发票类型：	增值税发票</p> ' +
                            '<p>发票抬头： ' + filterXSS(ordernaryInvoice.companyName) + '</p>' +
                            '<p>发票内容： ' + filterXSS(ordernaryInvoice.invoiceContent) + '</p>' +
                            '<p>纳税人识别号： ' + filterXSS(ordernaryInvoice.ratePayCode) + '</p>' +
                            '<p>注册地址： ' + filterXSS(ordernaryInvoice.companyAddress) + '</p>' +
                            '<p>注册电话： ' + filterXSS(ordernaryInvoice.companyMobile) + '</p>' +
                            '<p>开户银行： ' + filterXSS(ordernaryInvoice.companyAccountBank) + '</p>' +
                            '<p>银行账户： ' + filterXSS(ordernaryInvoice.companyAccount) + '</p>'
                    }
                }
                return htmlInvoice + '</div></div>'
                
            }
            juicer.register('invoiceType', invoiceType);
            
            var note = function(m) {
                if(m) {
                    note = filterXSS(m.note);
                    note = note.replace(/& lt;/g, "<").replace(/& gt;/g, ">").replace(/& #40;/g, "(").replace(/& #41;/g, ")").replace(/& #39;/g, "'");
                    return note + '</p>';
                }
            }
            juicer.register('note', note);
            
            
            //支付详情
            var payMoneyStr = function(m) {
                var payMoneyStr = '';
                var presell_paymsg = '';
                var orderPayMoneyStr = '';
                if(m.orderType == '3' && m.state == '1') {
                    if(m && m.detailList.length > 0 && m.willType == '1') {
                        payMoneyStr = m.detailList[0].firstMoney
                        presell_paymsg = '定金'
                    }
                    if(m && m.detailList.length > 0 && m.willType == '0') {
                        payMoneyStr = m.payMoney
                        presell_paymsg = '定金'
                    }
                } else if(m.orderType == '3' && m.state == '2') {
                    if(m && m.detailList.length > 0 && m.willType == '1') {
                        payMoneyStr = m.detailList[0].payMoney
                        presell_paymsg = '尾款'
                    }
                    if(m && m.detailList.length > 0 && m.willType == '0') {
                        payMoneyStr = m.payMoney
                        presell_paymsg = '尾款'
                    }
                } else {
                    payMoneyStr = m.payMoney
                    orderPayMoneyStr = m.payMoney
                }
                if(m.orderType == '3') {
                    if(m && m.detailList.length > 0) {
                        orderPayMoneyStr = m.detailList[0].firstMoney + m.detailList[0].payMoney
                        
                    }
                }
                if(m.state == '8') {
                    payMoneyStr = orderPayMoneyStr
                }
                if(m.orderType == '3' && m.state != '1' && m.state != '2') {
                    payMoneyStr = orderPayMoneyStr
                }
                return parseFloat(payMoneyStr).toFixed(2)
            }
            juicer.register('payMoneyStr', payMoneyStr);
            //1支付详情
            var presell_paymsg = function(m) {
                var payMoneyStr = '';
                var presell_paymsg = '';
                var orderPayMoneyStr = '';
                if(m.orderType == '3' && m.state == '1') {
                    payMoneyStr = m.firstMoney
                    presell_paymsg = '定金'
                }
                if(m.orderType == '3' && m.state == '2') {
                    if(m) {
                        payMoneyStr = m.payMoney
                        presell_paymsg = '尾款'
                    }
                }
                return presell_paymsg
            }
            juicer.register('presell_paymsg', presell_paymsg);
            //2支付详情
            var orderPayMoneyStr = function(m) {
                var payMoneyStr = '';
                var presell_paymsg = '';
                var orderPayMoneyStr = '';
                if(m.orderType == '3' && m.state == '1') {
                    if(m && m.detailList.length > 0) {
                        payMoneyStr = m.detailList[0].firstMoney
                        presell_paymsg = '定金'
                    }
                } else if(m.orderType == '3' && m.state == '2') {
                    if(m && m.detailList.length > 0) {
                        if(m) {
                            payMoneyStr = m.detailList[0].payMoney
                            presell_paymsg = '尾款'
                        }
                    }
                } else {
                    payMoneyStr = m.payMoney
                    orderPayMoneyStr = m.payMoney
                }
                if(m.orderType == '3') {
                    if(m && m.detailList.length > 0) {
                        if(m.willType == '0') {
                            orderPayMoneyStr = m.payMoney
                        }
                        else {
                            orderPayMoneyStr = m.detailList[0].firstMoney + m.detailList[0].payMoney
                        }
                    }
                }
                if(m.state == '8') {
                    payMoneyStr = orderPayMoneyStr
                }
                if(m.orderType == '3' && m.state != '1' && m.state != '2') {
                    payMoneyStr = orderPayMoneyStr
                }
                return parseFloat(orderPayMoneyStr).toFixed(2)
            }
            
            juicer.register('orderPayMoneyStr', orderPayMoneyStr);
            
            //	优惠信息
            var info = function(m) {
                var html = "";
                html += '<p>商品总价：<span>' + m.productMoney.toFixed(2) + '元</span></p>' +
                    '<p><b>运</b>费：<span>' + m.affixation.toFixed(2) + '元</span></p>';
                if(m.freeMoney > 1) {
                    html += '<p>优惠金额： <span class="m_span">-' + m.freeMoney.toFixed(2) + '元</span></p>';
                }
                if(m.integralReduceMoney > 0) {
                    html += '<p>积分抵扣：<span>-' + m.integralReduceMoney.toFixed(2) + '元</span></p>';
                }
                return html;
            }
            juicer.register('info', info);
            var product = function(m, n, b) {
                var html = '';
                html += ' <div class="zqrightinfo zqone  bor-bott">' +
                    '<div class="m_title" orderUuid="' + b.uuid + '"></div>' +
                    '<div class="m_center">'
                if(n.length > 0) {
                    html += '<div class="m_fullcut">'
                    for(var j = 0; j < n.length; j++) {
                        if(n[j].description) {
                            html += '<span>促销</span><a href="javascript:;">' + n[j].description + '</a>'
                        }
                    }
                    html += '</div>'
                }
                //循环商品列表
                for(var i = 0; i < m.length; i++) {
                    html += '<div class="zqproinfo  clearfloat" style="margin-bottom: -20px;">' +
                        '<div class="zqimgtxt fl">' +
                        '<div class="zqitimg imgwidth100">' +
                        '<a href="../productDetail/productDetail.html?uuid=' + m[i].productUuid + '" target="_blank">' +
                        '<img src="' + m[i].specUuid + '"  alt="' + m[i].productName + '"/>' +
                        '</a>' +
                        '</div>' +
                        '<div class="zqittxt">' +
                        '<p class="zqpmiaoshu"><a href="../productDetail/productDetail.html?uuid=' + m[i].productUuid + '" target="_blank">' + m[i].productName + '</a></p>'
                    if(m[i].specList) {
                        for(var k = 0; k < m[i].specList.length; k++) {
                            html += '<span class="zqpxinxi">' + m[i].specList[k].name + '：' + m[i].specList[k].value + '</span>'
                        }
                    }
                    
                    html += '</div>';
                    if(b.ucenterButton && b.ucenterButton.afterSaleButton) {
                        html += '<p class="zqnumber">';
                        if(m[i].state) {
                            var nowChooseTab = '';
                            if(m[i].applyType == '1') {
                                nowChooseTab = 'backgoods';
                            }
                            if(m[i].applyType == '2') {
                                nowChooseTab = 'backmoney';
                            }
                            if(m[i].applyType == '3') {
                                nowChooseTab = 'changegoods';
                            }
                            if(m[i].afterSaleSum < m[i].buyNum){
                                html += '<a href="../afterSaleService/afterSaleService.html?' + b.uuid + '&' + m[i].uuid + '&' + b.state + '">售后申请</a> ';
                            }
                            if(nowChooseTab != '') {
                                html += '<a href="../aftersale/aftersale.html?fromtype=order&searchName=' + b.orderId + '#' + nowChooseTab + '">查看售后</a>';
                            } else {
                                html += '<a href="../aftersale/aftersale.html?fromtype=order&searchName=' + b.orderId + '">查看售后</a>';
                            }
                            
                        } else {
                            html += '<a href="../afterSaleService/afterSaleService.html?' + b.uuid + '&' + m[i].uuid + '&' + b.state + '">售后申请</a>';
                        }
                        html += '</p>';
                    }
                    html += '</div>';
                    if(b.limitPromotion == true) {
                        html += '<div class="red-txt fl">秒杀商品</div>'
                    }
                    html += '<p class="zqmoney">' + m[i].basePrice.toFixed(2) + '元 x ' + m[i].buyNum + '</p>'
                    if(b.orderType == '3') {
                        html += '<p class="price-num"><span class="product-price">定金：' + m[i].firstMoney.toFixed(2) + '元</p>' +
                            '<p class="price-num"><span class="product-price">尾款：' + m[i].payMoney.toFixed(2) + '元</p>'
                    }
                    html += '</div>'
                    if(m[i].discountModel) {
                        if(m[i].discountModel.description && !m[i].discountModel.giftNames) {
                            html += '<div class="z_zengping" style="padding-bottom:10px;">' +
                                '<span class="z_zengping_title">促销</span>' +
                                '<div class="z_txt_control fl" style="margin-left:15px;">' +
                                ' <p>' + m[i].discountModel.description + '</p></div></div>'
                        }
                    }
                    //单品赠品
                    if(m[i].discountModel) {
                        if(m[i].discountModel.giftNames && m[i].discountModel.giftNames[0] != null) {
                            html += '<div class="z_zengping" style="padding-bottom:10px;">' +
                                '<span class="z_zengping_title">赠品</span>'
                            for(var a = 0; a < m[i].discountModel.giftNames.length; a++) {
                                if(m[i].discountModel.giftNames && m[i].discountModel.giftNames[a] != null) {
                                    html += '<div class="z_txt_control" style="margin-left:15px;">' + ' <p style="padding-left:47px;">' + m[i].discountModel.giftNames[a] + 'x' + m[i].buyNum + '</p></div>'
                                }
                            }
                            html += '</div>'
                            
                        }
                    }
                    
                }
                //订单赠品
                if(b.discountModel && b.discountModel.length > 0) {
                    for(var d = 0; d < b.discountModel.length; d++) {
                        if(b.discountModel[d].giftNames && b.discountModel[d].giftNames.length > 0) {
                            var giftProductUuid = b.discountModel[d].giftProductUuid.split(";");
                            html += '<div class="z_zengping bor-bott" style="padding-bottom:20px;">' +
                                '<span class="z_zengping_title">订单赠</span>' +
                                '<div class="z_txt_control fl" style="margin-left:15px;">'
                            for(var a = 0; a < b.discountModel[d].giftNames.length; a++) {
                                if(b.discountModel[d].giftNames) {
                                    html += ' <p><a target="_blank" href = "../productDetail/productDetail.html?uuid=' + giftProductUuid[a] + '">' + b.discountModel[d].giftNames[a] + '</a></p>'
                                }
                            }
                            '</div></div>'
                        }
                    }
                }
                html += '</div></div>'
                return html
                
            }
            juicer.register('product', product);
            
            var result = juicer(tpl, res)
            $("#mian_right").html(result);
            //调用物流方法
            getInfo(res.m.orderId)
            //判断跳转商品详情类型
            if(res.m.orderStatusName == "等待买家付款" || res.m.orderStatusName == "等待支付尾款") { //待付款
                $("#goback").attr("href", "../orderList/orderList.html?1")
            }
            if(res.m.orderStatusName == "等待卖家发货") { //代发货
                $("#goback").attr("href", "../orderList/orderList.html?4")
            }
            if(res.m.commentState == "2") { //交易成功
                $("#goback").attr("href", "../orderList/orderList.html?7")
            }
            if(res.m.orderStatusName == "卖家已发货") { //待收货
                $("#goback").attr("href", "../orderList/orderList.html?6")
            }
            if(res.m.commentState == "1") { //待评价
                $("#goback").attr("href", "../orderList/orderList.html?11")
            }
            if(res.m.delFlag == 0 && res.m.state == 8) {
                $("#goback").attr("href", "../orderList/orderList.html?20")
            }
            if(str.indexOf("reserveorder/reserveorder.html") > -1) {
                $("#goback").attr("href", "../reserveorder/reserveorder.html")
            }
            if(str.indexOf("toOrderRefund/toOrderRefund.html") > -1) {
                var after = str.split("?")[1];
                $("#goback").attr("href", "../toOrderRefund/toOrderRefund.html?" + after)
            }
            //定金尾款失效
            if(remain < 0) {
                $(".dingjin").removeClass("goPay");
                $(".dingjin").addClass("fail");
            }
            //有秒杀时候，每隔一分钟加载一次
            if(remain > 0) {
                var timer = setInterval(function() {
                    orderDetails();
                    if(remain < 0) {
                        clearInterval(timer)
                    }
                    clearInterval(timer)
                }, 60000)
            }
            //有套装时候显示套装名字
            if(res.m.detailList && res.m.detailList.length > 0) {
                for(var i = 0; i < res.m.detailList.length; i++) {
                    //套装
                    if(res.m.detailList[i].suit) {
                        $('.m_title[orderUuid="' + res.m.uuid + '"]').html(res.m.detailList[i].suit.name)
                    }
                }
            }
        }
        
        //返回
        function goBack(orderId) {
            $("#mian_right").html(ohtml);
        }
        
        //物流信息
        function getInfo(orderId) {
            $http.post({
                url: "/usercenter/order/getExpressTrace",
                data: {
                    orderuuid: orderId
                },
                success: function(data) {
                    if(data.code == "403" || data.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    // if(data.length > 0)
                    //     var str = "<p><span class='state-time'>" + data[0].acceptTime + "</span>[揽收成功]" + data[0].statusDes + "</p>";
                    // $(data).each(function(i, o) {
                    //     str += '<p><span class="state-time">' + o.acceptTime + '</span>';
                    //     str += o.statusDes;
                    //     if(o.trackingNo) {
                    //         str += '(运单号:' + o.trackingNo + ')';
                    //     }
                    //     str += '</p>';
                    // });
                    var  str = '';
                    if(data && data.length > 0) {
                        for(var i = data.length - 1; i > 0; i--){
                            str += '<p><span class="state-time">' + data[i].acceptTime + '</span>';
                            str += data[i].statusDes;
                            if(data[i].trackingNo) {
                                str += '(运单号:' + data[i].trackingNo + ')';
                            }
                            str += '</p>';
                        }
                        str += "<p><span class='state-time'>" + data[0].acceptTime + "</span>[揽收成功]" + data[0].statusDes + "</p>";
                    }
                    $("#expressTraceList").append(str);
                }
                
            });
        }
    })
})