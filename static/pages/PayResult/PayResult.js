require(['KUYU.Service','KUYU.navHeader', 'KUYU.HeaderTwo','KUYU.navFooterLink', 'KUYU.Binder','KUYU.Store', 'KUYU.SlideBarLogin','xss'],function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        $scope = KUYU.RootScope;
        $header.menuHover();
        $header.topSearch();
        navFooterLink();

        var u = location.search;
        u = u.substr(1);
        if(u == "rst"){
            var rst = sessionStorage.getItem("rst");
            rst = JSON.parse(rst);
            console.log(rst);
            loadResult(rst);
        }
        if(u.indexOf("out_trade_no") > -1){
            var out_trade_no = u.split("=")[1];
            $http.get({
                url:"/pay/getOrderPayResult",//拿到订单号再做请求
                data:{
                    out_trade_no:out_trade_no
                },
                success:function(rst){
                    if(rst.code == "403" || rst.code == "-6"){
                        window.location.href = "/sign";
                    }
                    if(rst){
                        loadResult(rst);
                    }
                }
            })
        }

        function loadResult(rst){
            var info = rst.data;
            var html = "";
            if (rst.code == 0) {//支付成功
                html += '<div class="graybox payBox"><i class="icon iconfont-tcl icon-danxuankuang_xuanzhong"></i><strong>恭喜你，支付成功啦！</strong><br>我们会尽快安排发货，请您耐心等待！<p>订单号:<span>'+info.orderId+'</span>订单金额:<span>' ;
            var payMoney = info.orderPayMoney.toString();
            if(payMoney.indexOf(".") > -1){
                if(payMoney.split(".")[1].length > 2){
                    html += '￥' + info.orderPayMoney + '</span></p>';
                }else{
                    html += '￥' + info.orderPayMoney.toFixed(2) + '</span></p>';
                }
            }else{
                html += '￥' + info.orderPayMoney.toFixed(2) + '</span></p>';
            }
                var isGroup = 0;
                var uuid='';
                var des = '查看订单详情';
                if (info.orderList) {
                    uuid = info.orderList[0].uuid;
                    if (info.orderList.length > 1) {
                        isGroup = 1;
                        des = '查看订单列表';
                    }
                }
            html += '<div class="btns"><a href="/" class="goshopping">继续购物</a><button class="but" isGroup="'+isGroup+'" data-uuid="'+uuid+'">'+des+'</button></div></div>';
            } else {//支付失败
                html += '<div class="m_instal m_padding" style="height:320px;text-align:center;margin-top:100px">' +
                    '   <div class="m_continue m_paym_ent ">' +
                    '       <h2>支付失败</h2>' +
                    '   </div>' +
                    '   <div class="m_explain_btn">' +
                    '       <a href="/" class="btn btn-custom">返回首页</a>' +
                    '   </div>' +
                    '</div>';
            }
            $("#payResult").append(html);
        }

    //跳转订单详情
    $(document).on("click",".but",function(){
        var isGroup = $(this).attr("isGroup");
        var uuid = $(this).attr("data-uuid");
        if(isGroup == 1 || uuid.length == 0){
            window.location.href = "../orderList/orderList.html";
        }else {
            window.location.href = "../orderDetail/orderDetail.html?"+uuid;
        }
    })

})
