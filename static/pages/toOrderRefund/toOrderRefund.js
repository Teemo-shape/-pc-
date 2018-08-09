/*
 *author:chenlong
 */
require(['KUYU.Service','KUYU.plugins.alert','KUYU.navFooterLink', 'KUYU.HeaderTwo','KUYU.Binder',  'KUYU.SlideBarLogin', 'KUYU.Store',
 'ajaxfileupload','validate','xss'], function() {
    var $http = KUYU.Service,
         $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $scope = KUYU.RootScope;
     $filter = KUYU.Filter,
        $header.menuHover();
        $header.topSearch();
        navFooterLink();

    var param={};


    //去url后面参数
    var u = location.search;
    var u = u.substr(1);
    var arr = u.split("&");
    var orderUuid = arr[0];
    var detailUuid = arr[1];
    var applyType = arr[2];
    //单独存applyType
    param.applyType = applyType;

    url = "/usercenter/afterSale/toOrderRefundKuyu";
    $http.get({
        url:url,
        data:{
            orderUuid:orderUuid,
            detailUuid:detailUuid,
            applyType:applyType,
            ranNum:Math.random()
        },
        success:function(res){
            if(res.code == 403 || res.code == "-6" ){
                window.location.href = "{{login}}";
            }
            if(res.msg == "success"){
                doOrderRefundRes(res.data);
            }
            if(res.code == -1){
                Msg.Alert("","您可能已经提交过申请，请不要重复提交！",function(){
                    window.location.href = "../aftersale/aftersale.html";
                });
            }
        }
    })



    //退款换货申请加载数据
    var flag = ""  //判断什么类型
    function doOrderRefundRes(data){
        param.orderUuid = data.orderMain.uuid;
        param.detailUuid = data.orderDetail.uuid;
        //param.orderId = data.omam.uuid;
        //param.applyType = data.applyType;  //申请类型 1，退货  2，退款  3.换货
        param.backMoney = data.orderDetail.payMoney;  //退款金额
        param.imgName = "";
        param.money = data.orderDetail.payMoney;
        param.returnType = "";      //退款方式
        param.sendGoods = "";   //是否发货
        param.receiveGoods = "";
        param.packageNote = "";  //
        param.packageGoodOrNot = "";

        flag = data.changeOrRepair;
    	if(!data.changeOrRepair){
    		$("head title").html("TCL - 退款申请");
    	}else{
    		$("head title").html("TCL - 换货申请");
    	}

    	var html = '';
    	if(!data.changeOrRepair){//退款退货
    		html += '<div class="zqrightinfo zqone m_bor">'+
    				'	<div class="zqinfo">'+
    				'		<p class="zqtype">';
    		if(data.applyType == '1'){
    			html += '退货申请';
    		}else if(data.applyType == '2'){
                html += '退款申请';
            }else{
                html += '退款/退货申请';
            }
            var orderMain = data.orderMain;
    		html += '</p>'+
                    '<p class="height1"></p>'+
                    '<p class="zqwxinfo">'+
                    '   <span class="zqtime">'+orderMain.orderTime+'</span><span class="zqordernum">'+
                    '   <a href="../orderDetail/orderDetail.html?'+u+'">订单号：'+orderMain.orderId+
                    '   </a></span><span class="zqpay">在线支付</span>'+
                    '</p>'+
                    '<p class="height1"></p>'+
                    '<div class="zqproinfo clearfloat">';
            if(orderMain.discountModel){
                html += '<div class="m_fullcut">';
                for (var i = 0; i < orderMain.discountModel.length; i++) {
                    var promotion =  orderMain.discountModel[i];
                    if(orderMain.fromType == '1' || orderMain.fromType == '6'){
                        html += '<span>';
                        if(orderMain.fromType == '1'){
                            html += '满减';
                        }
                        if(orderMain.fromType == '6'){
                            html += '满折';
                        }
                        html += '</span><a href="javascript:;">'+promotion.description+'</a>';
                    }
                }
                html += '</div>';
            }
            var orderDetail = data.orderDetail;
            html += '<div class="zqimgtxt fl">'+
                    '   <div class="zqitimg">'+
                    '       <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" title="'+orderDetail.productName+'" target="_blank">'+
                    '           <img src="'+orderDetail.specUuid+'">'+
                    '       </a>'+
                    '   </div>'+
                    '   <div class="zqittxt" id="myzqittxt">'+
                    '       <p class="zqpmiaoshu">'+orderDetail.productName+'</p>';
            if(orderDetail.spec){
                var item = eval(orderDetail.spec);
                for (var i = 0; i < item.length; i++) {
                   var item = item[i];
                   html += '<p class="zqpxinxi">'+item.name + '：'+item.value+'</p>';
                }
            }
            orderDetail.detailTotalPrice=$filter.toFiexd(orderDetail.detailTotalPrice);
            html += '</div></div>'+
                    '<p class="zqnumber"><b>|</b>×<span class="zqno">'+orderDetail.buyNum+'</span></p>'+
                    '<p class="zqmoney">交易金额：'+$filter.toFiexd(orderDetail.detailTotalPrice)+
                    '元</p>'+
                    '</div>';
                    //赠品
            if(orderDetail.discountModel && orderDetail.discountModel.giftNames){
                html += '<div class="z_zengping">'+
                        '   <span class="z_zengping_title">赠品</span>'+
                        '   <div class="z_txt_control fl" style="margin-left:15px;">';
                for (var i = 0; i < orderDetail.discountModel.giftNames.length; i++) {
                    var giftName = orderDetail.discountModel.giftNames[i];
                    html += '<p>'+giftName+'</p>';
                }
                html += '</div></div>';
            }
            orderDetail.payMoney= $filter.toFiexd(orderDetail.payMoney);
            var backMaxNum = orderDetail.buyNum-orderDetail.afterSaleSum;
            var backMaxMoney = orderDetail.payMoney/orderDetail.buyNum*backMaxNum;
            html += '<p class="height1"></p>'+
                    '<div class="zqtabinfo">'+
                    '<form id="form1" class="form-validate1"  method="post">'+
                    '   <input type="hidden" name="applyType" value="'+data.applyType+'" />'+
                    '   <input id="radiof2" type="hidden" name="returnType" value="'+data.applyType+'"  >'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">申请数量：</span>'+
                    '       <input  name="afterServiceNum" id="afterServiceNum" onchange="changeApplyNum()" max="'+backMaxNum+'" style="width:60px" value="'+backMaxNum+'" data-rule-required="true"/>'+
                    '       (最多可退 <b id="backMaxNum">'+backMaxNum+'</b>)'+
                    '   <p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">退款金额：</span>'+
                    '       <font style="color: red"></font>'+
                    '       <input type="text" id="afterServiceMoney" max="'+backMaxMoney+'" num="'+backMaxNum+'" name="money" onchange="changeApplyMoney()" style="width:100px" value="'+backMaxMoney.toFixed(2)+'" />'+
                    '       (最多可退 ￥<b class="price-color" id="backMaxMoney">'+backMaxMoney.toFixed(2)+'</b>)'+
                    '   <p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">退款原因：</span>'+
                    '       <select name="zqprovince" class="zqworry">'+
                    '           <option value="">请选择</option>';
            for (var i = 0; i < data.backReasons.length; i++) {
                var reason = data.backReasons[i];
                html += '<option value="'+reason+'">'+reason+'</option>';
                /*if(m.reason == reason){
                    html += 'selected';
                }*/
                //html += '>'+reason+'</option>';
            }
            html += '</select></p>'+
                    '<p class="zqrows"><span class="zqname width100">详细描述：'+
                    '</span><textarea rows="3" name="description" ></textarea></p>'+
                    '<p class="zqrows" style="display: none">'+
                    '   <span class="zqname width100">图片信息：</span>'+
                    '   <a href="#" id="uploadImage">'+
                    '   <input type="file" id="uploadFiles" class="files y_uploadbtn" name="myfiles" onchange="uploadImage(this)" /></a>'+
                    '   <input type="hidden" id="uploadFilesCount" value="0" />'+
                    '   <div class="row relate-img y_uppic" id="showPic">'+
                    '</p>'+
                    '<p class="zqrows">';
            if(data.applyType == '1'){
                html += '<input type="submit" style="color: #333" class="zqbtn" id="button1" value="确认退货">';
            }else if(data.applyType == '2'){
                html += '<input type="submit" style="color: #333" class="zqbtn" id="button1" value="确认退款">';
            }else{
                html += '<input type="submit" style="color: #333" class="zqbtn" id="button1" value="确认退款">';
            }
            html += '</p>'+
                    '<p class="zqrows zqzhushi">'+
                    '商家会在1-7个工作日内把实际购物金额返还到您的账号中<br>'+
                    '如您还有疑问，请联系客服。或者拨打我们的联系电话：4008-123456</p>'+
                    '</from>'+
                    '</div>'+
                    '</div>'+
                    '<div class="clear30"></div>'+
                    '</div>'+
                    '</div>';

    	}else{//换货申请
            var orderMain = data.orderMain;
            html += '<div class="zqrightinfo zqone m_bor">'+
                    '   <div class="zqinfo">'+
                    '   <p class="zqtype">换货申请</p>'+
                    '   <p class="height1"></p>'+
                    '   <p class="zqwxinfo">'+
                    '       <span class="zqtime">'+orderMain.orderTime+'</span>'+
                    '       <span class="zqordernum"><a href="../orderDetail/orderDetail.html?'+u+'">订单号：'+orderMain.orderId+'</a></span><span class="zqpay">在线支付</span>'+
                    '   </p>'+
                    '   <p class="height1"></p>'+
                    '   <div class="zqproinfo clearfloat">';
            if(orderMain.discountModel){
                html += '<div class="m_fullcut">';
                for (var i = 0; i < orderMain.discountModel.length; i++) {
                    var promotion =  orderMain.discountModel[i];
                    if(orderMain.fromType == '1' || orderMain.fromType == '6'){
                        html += '<span>';
                        if(orderMain.fromType == '1'){
                            html += '满减';
                        }
                        if(orderMain.fromType == '6'){
                            html += '满折';
                        }
                        html += '</span><a href="javascript:;">'+promotion.description+'</a>';
                    }
                }
                html += '</div>';
            }
            var orderDetail = data.orderDetail;
            html += '<div class="zqimgtxt fl">'+
                    '   <div class="zqitimg">'+
                    '       <a href="../productDetail/productDetail.html?'+orderDetail.productUuid+'" title="'+orderDetail.productName+'" target="_blank">'+
                    '           <img src="'+orderDetail.specUuid+'">'+
                    '       </a>'+
                    '   </div>'+
                    '   <div class="zqittxt" id="myzqittxt">'+
                    '       <p class="zqpmiaoshu">'+orderDetail.productName+'</p>';
            if(orderDetail.spec){
                var item = eval(orderDetail.spec);
                for (var i = 0; i < item.length; i++) {
                   var item = item[i];
                   html += '<p class="zqpxinxi">'+item.name + '：'+item.value+'</p>';
                }
            }
           
            html += '</div></div>'+
                    '<p class="zqnumber"><b>|</b>×<span class="zqno">'+orderDetail.buyNum+'</span></p>'+
                    '<p class="zqmoney">交易金额：'+orderDetail.detailTotalPrice+
                    '元</p>'+
                    '</div>';
            //赠品
            if(orderDetail.discountModel && orderDetail.discountModel.giftNames){
                html += '<div class="z_zengping">'+
                        '   <span class="z_zengping_title">赠品</span>'+
                        '   <div class="z_txt_control fl" style="margin-left:15px;">';
                for (var i = 0; i < orderDetail.discountModel.giftNames.length; i++) {
                    var giftName = orderDetail.discountModel.giftNames[i];
                    html += '<p>'+giftName+'</p>';
                }
                html += '</div></div>';
            }
            var backMaxNum = orderDetail.buyNum-orderDetail.afterSaleSum;
            html += '<p class="height1"></p>'+
                    '<div class="zqtabinfo">'+
                    '<form id="form1" class="form-validate1"  method="post">'+
                    '   <input type="hidden" name="applyType" value="'+data.applyType+'" />'+
                    '   <input id="radiof2" type="hidden" name="returnType" value="'+data.applyType+'"  >'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">申请数量：</span>'+
                    '       <input name="afterServiceNum" id="afterServiceNum" onchange="changeApplyNum()" max="'+backMaxNum+'" style="width:60px" value="'+backMaxNum+'" data-rule-required="true" />'+
                    '       (最多可退 <b id="backMaxNum">'+backMaxNum+'</b>)'+
                    '   </p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">详细描述：</span><textarea rows="3" name="description"></textarea>'+
                    '   </p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">售后人姓名：</span>'+
                    '       <input type="text" name="customerName" value="'+data.omam.name+'" data-rule-maxlength="10" palaceholder="'+data.omam.name+'" required/>'+
                    '   </p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">联系电话：</span>'+
                    '       <input type="text"  name="customerTel" value="'+data.omam.mobile+'" data-rule-mobilezh="true"  palaceholder="'+data.omam.mobile+'" required  >'+
                    '   </p>'+
                    '   <p class="zqrows">'+
                    '       <span class="zqname width100">收货人地址：</span>'+
                    '       <input type="text"  name="customerAddress" data-rule-maxlength="50" readonly="readonly" value="'+data.omam.address+'" palaceholder="'+data.omam.address+'"/>'+
                    '   </p>'+
                    '<p class="zqrows" style="display: none">'+
                    '   <span class="zqname width100">图片信息：</span>'+
                    '   <a href="#" id="uploadImage">'+
                    '   <input type="file" id="uploadFiles" class="files y_uploadbtn" name="myfiles" onchange="uploadImage(this)" /></a>'+
                    '   <input type="hidden" id="uploadFilesCount" value="0" />'+
                    '   <div class="row relate-img y_uppic" id="showPic">'+
                    '</p>'+
                    '<p class="zqrows">'+
                    '   <input type="submit" style="color: #333" class="zqbtn" id="button1" value="确认换货">'+
                    '</p>'+
                    '</from>'+
                    '</div></div>'+
                    '<div class="clear30"></div>'+
                    '</div></div>';
                    

        }
        html += '</div></div></div>';
        $(".mian_right .m_content").append(html);
    }

    $("#mian_right").on("click","#button1",function(e){
        e.preventDefault();
        submit();

    });


    //提交
    function submit(){
        var fail = false;
        var customerName = filterXSS($('input[name="customerName"]').val());
        var customerTel = $('input[name="customerTel"]').val();
        var afterServiceNum = $('input[name="afterServiceNum"]').val();
        var description = filterXSS($('textarea[name="description"]').val());
        var customerAddress = filterXSS($('input[name="customerAddress"]').val());
        var reason = filterXSS($(".zqworry").val());
        var orderUuid = param.orderUuid ;
        var detailUuid = param.detailUuid;
        //var orderId = param.orderId ;
        var applyType =  param.applyType;
        var backMoney = param.backMoney ;
        var imgName = param.imgName ;
        var money = $('input[name="money"]').val();
        var returnType = param.returnType;
        var sendGoods = param.sendGoods ;
        var receiveGoods = param.receiveGoods ;
        var packageNote = param.packageNote;
        var packageGoodOrNot = param.packageGoodOrNot;

        //校验手机号
        if(flag){ //换货类型，是一个类型标示（全局）
            var reg = /^1[345678]\d{9}$/;
            if(!reg.test(customerTel)){
                Msg.Alert("","请输入正确的联系电话！",function(){});
                fail = true;
                return;
            }

        }
        if(description.length>200){
            Msg.Alert("","详细描述字数必须在200字以内！",function(){});
            return;
        }

        var url = "/usercenter/afterSale/saveServiceApplyKuyu";
        if(!fail){
            $http.post({
                url : url,
                data:{
                    customerName:customerName,
                    customerTel:customerTel,
                    afterServiceNum:afterServiceNum,
                    description:description,
                    customerAddress:customerAddress,
                    reason:reason,
                    orderUuid:orderUuid,
                    detailUuid:detailUuid,
                    //orderId:orderId,  无用
                    applyType:applyType,
                    backMoney:backMoney,
                    imgName:imgName,
                    money:money,
                    returnType:returnType,
                    sendGoods:sendGoods,
                    receiveGoods:receiveGoods,
                    packageNote:packageNote,
                    packageGoodOrNot:packageGoodOrNot,
                    ranNum:Math.random()
                },
                success:function(res){
                    if(res.code == 403 || res.code == "-6" ){
                        window.location.href = "{{login}}";
                    }
                    if(res.code == "0") {
                        Msg.Alert("","提交成功",function(){
                            window.location.href = "toOrderRefundSuccess.html";
                        });
                    }else if(res.code == "-1"){
                        Msg.Alert("",res.msg,function(){});
                    }
                },
                error:function(res){
                    Msg.Alert("","提交失败,请稍后重试！",function(){

                    });
                }
            })
        }

        


        
    }


})

//改变申请数量
function changeApplyNum() {
    var num = $("#afterServiceNum").val();
    var max = $("#afterServiceNum").attr("max");
   if (num.trim().length == 1) {
        num = num.trim().replace(/[^1-9]/g, '')
    } else {
        num = num.trim().replace(/\D/g, '')
    }

    if (num.trim().length == 0) {
        num = 1;
    }

    if(num > max || num.length > max.length){
        num = max;
    }
    $("#afterServiceNum").val(num);
    var max = ($("#afterServiceMoney").attr("max")/$("#afterServiceMoney").attr("num")*$("#afterServiceNum").val()).toFixed(2);
    $("#afterServiceMoney").val(max);
}

//改变申请金额
function changeApplyMoney() {
    var num = $("#afterServiceMoney").val();
    var max = ($("#afterServiceMoney").attr("max")/$("#afterServiceMoney").attr("num")*$("#afterServiceNum").val()).toFixed(2);
    //num = num.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    //num = num.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    //num = num.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    //num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数

    if (num.trim().length == 0) {
        num = 0;
    }
    try {
        num = parseFloat(num);
    } catch (err) {
        console.log("金额格式不对")
        num = 0;
    }

    if(isNaN(num)){
        num = 0;
    }

    if(num > max || num.length > max.length){
        num = max;
    }
    $("#afterServiceMoney").val(num);
}