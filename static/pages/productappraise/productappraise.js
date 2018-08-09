/*
 *author:chenlong
 */
require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.navFooterLink','KUYU.HeaderTwo','KUYU.Binder',  'KUYU.Store',
    'ajaxfileupload','validate','xss'
], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;
    var UPLOADLIST = $init.Map();

        // $header.menuHover();
        $header.topSearch();
        navFooterLink();
    $init.Ready(function() {
        $header.menuHover();
    })
var mainFun = function () {
    var param ={};
    $(document).ready(function() {
        ajaxSearchOrder(1,10);
    });
    //:搜索
    $("#searchBtn").click(function() {
        ajaxSearchOrder(1,10);
    });
    //回车
    $("#searchName").on('keydown', function(e){
        if(e.keyCode == 13){
            ajaxSearchOrder(1,10);
        }
    });

    //点击页码
    $(".page-list.clearfloat").on("click","span:gt(0),span:lt(8)",function(){
        nowPage = $(this).html();
        if(nowPage.indexOf("...") > -1){
            return
        }else{
            console.log(nowPage,param.pageShow)
            $(this).addClass('active').siblings().removeClass('active');
            ajaxSearchOrder(nowPage,param.pageShow);
            $('body,html').animate({scrollTop: 0 },200);
        }
    })
    $(".page-list.clearfloat").on("click",".prev",function(){
        if(param.nowPage>1){
            nowPage = param.nowPage - 1;
        }
        ajaxSearchOrder(nowPage,param.pageShow);
        $('body,html').animate({scrollTop: 0 },200);
    })
    $(".page-list.clearfloat").on("click",".next",function(){
        if(param.nowPage<param.totalPage){
            nowPage = param.nowPage + 1;
        }
        ajaxSearchOrder(nowPage,param.pageShow);
        $('body,html').animate({scrollTop: 0 },200);
    })

    //tab点击事件
    $('.tab-item li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        if($(this).data('type') == "waitcomment"){
            param.nowChooseTab = "waitcomment";
        }
        else if($(this).data('type') == "appraise"){
            param.nowChooseTab = "appraise";
        }
        else if(!$(this).data('type')){
            param.nowChooseTab='';
        }
        ajaxSearchOrder(1,10);
    })

     //:异步加载订单和异步订单搜索

    function ajaxSearchOrder(nowPage,pageShow) {
         var searchName = filterXSS($.trim($("#searchName").val()));
         var nowChooseTab = param.nowChooseTab;
         var url = "/usercenter/order/ajaxlist";
         $http.post({
            url:url,
            data:{
                pageShow:pageShow,
                nowPage:nowPage,
                searchName: searchName,
                nowChooseTab:nowChooseTab?nowChooseTab:'waitcomment',
                ranNum: Math.random()
            },
            success:function(res) {
                if(res){
                    if(res.data){
                        if(res.data.dataList){
                            var data=res.data.dataList;
                            doAppraiseResponse(data);
                        }
                        if(res.data.pagination){
                            var pagination = res.data.pagination;
                            var totalNum = pagination.totalNum;
                            var pageShow = pagination.pageShow;
                            var nowPage = pagination.nowPage;
                            page(nowPage,pageShow,totalNum);
                        }
                    }
                }

            }
        });
    }



    //处理评价列表
    function doAppraiseResponse(data){
        $('#usercenterComment').empty();
        var html="";
        if(data){
            for (var i = 0; i < data.length; i++) {
                var objItem = data[i];
                html += '<div class="grid-list-item">'+
                            '<div class="grid-list-item-header">'+
                                '<div class="item-header-body clearfloat">'+
                                    '<div class="fl">'+
                                        '<span class="subtxt">'+objItem.orderTime+'</span>'+
                                        '<span class="subtxt">订单号：'+objItem.orderId+'</span>'+
                                        // '<span class="subtxt">'+objItem.paytype+'</span>'+
                                        '<span class="subtxt">在线支付</span>'+
                                    '</div>'+
                                    '<div class="fr">'+
                                        '<span class="amount-title">订单金额：</span><span class="amount-sum">'+objItem.payMoney.toFixed(2)+'</span>元'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                for (var j = 0; j < objItem.detailList.length; j++) {
                    //保存uuid到param
                    param.uuid=objItem.uuid;
                    var orderDetail =  objItem.detailList[j];
                    var detailSpec;
                    if(orderDetail.spec){
                        detailSpec=eval("("+orderDetail.spec+")");
                    }
                    html+='<div class="grid-list-item-body clearfloat">'+
                            '<a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" class="fl">'+
                                '<img src='+orderDetail.specUuid+'>'+
                            '</a>'+
                            '<dl class="product-info fl">'+
                                '<dd><p class="product-title">'+orderDetail.productName+'</p></dd>';
                            if(detailSpec) {
                                 html+=  '<dd class="subtxt">';
                                 for (var k = 0; k < detailSpec.length; k++){
                                    html += '<span>'+detailSpec[k].name+": "+'</span><span>' + detailSpec[k].value + '</span> &nbsp;&nbsp;';
                                 }
                                 html+='</dd>';
                            }
                            html+=  '</dl>'+
                                '<div class="product-price fl">'+
                                '<span class="amout">¥ '+(orderDetail.finalPrice/orderDetail.buyNum).toFixed(2)+'</span>'+
                                '<span class="sum">x'+orderDetail.buyNum+'</span>'+
                            '</div>';
                           if(objItem.commentState == '1' && objItem.state == '7'){
                               html+='<ul class="operation fr">'+
                                       '<li><span class="toComment" data-uuid="'+objItem.uuid+'"><a href="commentDetail.html?'+objItem.uuid+'">写评价</a></span></li>'+
                                   '</ul>';
                           }
                           else if(objItem.commentState == '2' && objItem.state == '7'){
                                html+='<ul class="operation fr">'+
                                        '<li><span class="toView" data-uuid="'+objItem.uuid+'"><a href="commentDetail.html?'+objItem.uuid+'">查看评价</a></span></li>';
                                if(orderDetail.shopCommentModel && !orderDetail.shopCommentModel.afterComment){
                                    html+= '<li><span class="toAppend" data-uuid="'+objItem.uuid+'"><a href="commentDetail.html?'+objItem.uuid+'">追加评价</a></span></li>';
                                }
                                html+='</ul>';
                           }
                           else if(objItem.commentState ==0){
                               html+='<ul class="operation fr">'+
                                   '<li><span class="toView" data-uuid="'+objItem.uuid+'"><a href="commentDetail.html?'+objItem.uuid+'">查看评价</a></span></li></ul>';
                           }
                    html+='</div>'
                    /*html += '<div class="zqproinfo order-item zqtop30 clearfloat">'+
                            '   <div class="zqimgtxt fl">'+
                            '       <div class="zqitimg">'+
                            '           <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" target="_blank">'+
                            '               <img src="'+orderDetail.specUuid+'" alt="'+orderDetail.productName+'"/>'+
                            '           </a>'+
                            '       </div>'+
                            '       <div class="zqittxt">'+
                            '           <p class="zqpmiaoshu">'+
                            '               <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" target="_blank">'+orderDetail.productName+'</a>'+
                            '           </p>';
                    if(orderDetail.specList){
                        for (var k = 0; k < orderDetail.specList.length; k++) {
                            var specObj = orderDetail.specList[k];
                            html += '<span class="zqpxinxi">'+specObj.name +'：'+specObj.value+' </span>';
                        }
                    }
                    html += '</div></div>'+
                            '<p class="zqnumber fl">'+
                            '   <span>交易金额：'+orderDetail.payMoney.toFixed(2)+'</span>'+
                            '</p>'+
                            '<form class="zqthreebtn">';
                    if(m.commentState == '1' && m.state == '7'){
                        html += '<input type="hidden" name="commentState" id="commentState_'+m.uuid+'" value="'+m.commentState +'">'+
                                '<a href="#" data-uuid="'+m.uuid+'" class="y_btn y_btn_custom2">写评价</a>';
                    }
                    if(m.commentState == '2' && m.state == '7'){
                        html += '<a href="../toAppraise/toAppraise.html?'+m.uuid+'" class="y_btn y_btn_custom2">查看评价</a>';
                        if(orderDetail.shopCommentModel && !orderDetail.shopCommentModel.afterComment){
                            //保存uuid
                            param.orderDetail = m.detailList.uuid
                            html += '<a href="../toAppraise/toAppraise.html?'+m.uuid+'"  data-uuid="'+m.uuid+'" class="y_btn y_btn_custom2">追评</a>';
                        }
                    }
                    html += '</form></div>';*/
                }
                html+='</div>';
            }

            $("#usercenterComment").html(html);
            $("#usercenterComment").append('<div class="padding-box"><div class="padding clearmar"></div></div>');

        }

        $('#usercenterComment').on("click",".toComment",function(){
            var uuid = $(this).attr("data-uuid");
            console.log(uuid);
            window.location.href="commentDetail.html?"+uuid;
        })
        $('#usercenterComment').on("click",".toView",function(){
            var uuid = $(this).attr("data-uuid");
            console.log(uuid);
            window.location.href="commentDetail.html?"+uuid;
        })
        $('#usercenterComment').on("click",".toAppend",function(){
            var uuid = $(this).attr("data-uuid");
            console.log(uuid);
            window.location.href="commentDetail.html?"+uuid;
        })

    }

    //底部页码

    function page(nowPage,pageShow,totalNum){
        var totalPage = Math.ceil(totalNum/pageShow);
        param.nowPage = nowPage;
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        var html = "";
        if(totalPage<8){
            html += '<button class="prev" ';
            if(nowPage == 1){
                html += 'disabled';
            }
            html += ' style="background:#fff"><</button>';

            if(totalPage!=0){
                for(var i = 1;i <= totalPage ;i++){
                    html += '<span class="page-item ';
                    if(nowPage == i){
                        html += 'active';
                    }
                    html +='" title="第'+i+'页">'+i+'</span>';
                }
            }else{
                 html += '<span class="page-item active" title="第1页">1</span>';
            }

            html += '<button class="next" ';
            if(nowPage == totalPage){
                html += 'disabled';
            }
            html += ' style="background:#fff">></button>';

            $(".page-list").html(html);
        }else{
            if(totalPage >= 8 && nowPage < 7){
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                for(var i = 1; i <= 7 ;i++){
                    html += '<span class="page-item ';
                    if(nowPage == i){
                        html += 'active';
                    }
                    html +='" title="第'+i+'页">'+i+'</span>';
                }

                html += '<button class="next" ';
                if(nowPage == totalPage){
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';

                $(".page-list").html(html);
            }else{
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                html += '<span class="page-item" title="第1页">1</span>';
                html += '<span class="page-item" title="第2页">2</span>';
                html += '<span class="page-item" title="第3页">3</span>';
                html += '<span class="page-item" title="第...页">...</span>';
                var before = nowPage - 1;
                var after = nowPage + 1;
                var sbefore = before - 1;
                if(nowPage == totalPage){
                    html += '<span class="page-item" title="第'+ sbefore +'页">'+sbefore+'</span>';
                }
                html += '<span class="page-item" title="第'+ before +'页">'+before+'</span>';



                if(nowPage <= totalPage){
                    html += '<span class="page-item active" title="第'+ nowPage +'页">'+nowPage+'</span>';
                }
                if(nowPage+1<=totalPage){
                    html += '<span class="page-item" title="第'+ after +'页">'+after+'</span>';

                }


                html += '<button class="next" ';
                if(nowPage == totalPage){
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';
                $(".page-list").html(html);
            }

        }

    }

    //点击写评价
    $(document).on("click",".zqthreebtn a",function(e){
        uuid = $(this).attr("data-uuid");
        if(this.innerHTML=="写评价"){
            e.preventDefault();
            orderComments(uuid);
        }
    })


    //:商品评价
    function orderComments(uuid) {
        var url = "/usercenter/order/ajaxviewKuyu";
        $http.post({
            url: url,
            data: {
                uuid:uuid,
                ranNum: Math.random()
            },
            success: function(res) {
            	if(res.code== "403"||res.code== "-6"){
					window.location.href = "{{login}}"
				}
                if(res.data){
                    var data=res.data
                    doCommentsResponse(data);
                }

            },
            error: function(res) {

            }
        });
    }



    //全局数组  保存评价所有的东西
    var json = [];
    var orderUuid = "";
    //评价
    function doCommentsResponse(data) {
        var html = '';
        html += '<div class="m_content">'+
                '<h3>评价管理</h3>'+
                '<div class="zqrightinfo">'+
                '<p class="zqwxinfo zqtop30  clearfloat">'+
                '   <span class="fl"><span class="zqtime">'+data.m.orderTime+'</span><span class="zqordernum">订单号:'+data.m.orderId+'</span><span class="zqpay">'+data.m.payTypeName +'</span></span>'+
                '<span class="zqzt fr">评价状态：待评价</span>'+
                '</p>';

        orderUuid = data.m.uuid;
        for(var i = 0; i < data.detailList.length; i++){
            json[i] = new Object(); //在数组中new 对象
            var orderDetail = data.detailList[i];
            json[i].orderDetailUuid = orderDetail.uuid;
            json[i].orderId = data.m.uuid;

            html+='<input type="hidden" value="'+orderDetail.uuid+'" name="detailUuid" value=""/><p class="height1 hgt20"></p>'
            if(orderDetail.discountModel){
                html+='<div class="m_fullcut">';
                for(var j = 0; j < orderDetail.discountModel.length; j++){
                    var promotion = orderDetail.discountModel[j];
                    if(data.m.fromType == '1' || data.m.fromType == '6'){
                        html+='<span>';
                        if(data.m.fromType=='1'){
                            html+='满减';
                        }
                        if(data.m.fromType=='6'){
                            html+='满折';
                        }
                        html+='</span><a href="javascript:;">'+promotion.description+'</a>';
                    }
                }
                html+='</div>';
            }
            html += '<div class="zqproinfo zqtop30 clearfloat">'+
                    '<div class="zqimgtxt fl">'+
                    '   <div class="zqitimg">'+
                    '       <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" target="_blank">';
            if(orderDetail.specUuid){
                html +='<img src="'+orderDetail.specUuid+'" alt="'+orderDetail.productName+'"/>';
            }else{
                html +='<img src="../../app/images/noimg.jpg" alt="'+orderDetail.productName+'"/>';
            }

            html+=  '       </a>'+
                    '   </div>'+
                    '   <div class="zqittxt">'+
                    '       <p class="zqpmiaoshu">'+
                    '           <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" target="_blank">'+orderDetail.productName+'</a>'+
                    '       </p>';
            if(orderDetail.specList){
                for(var k = 0; k < orderDetail.specList.length; k++){
                    var specObj = orderDetail.specList[k];
                    html+= '<span class="zqpxinxi">'+specObj.name +'：'+specObj.value+'</span>';
                }
            }

            html += '</div></div>'+
                    '<p class="zqnumber">×<span class="zqno">'+orderDetail.buyNum+'</span></p>'+
                    '<p class="zqmoney">交易金额：'+orderDetail.payMoney +'元</p>'+
                    '</div>';
            if(orderDetail.discountModel && orderDetail.discountModel.giftNames && orderDetail.discountModel.giftNames[0] !=null){
                html += '<div class="z_zengping">'+
                        '   <span class="z_zengping_title">赠品</span>'+
                        '<div class="z_txt_control fl" style="margin-left:15px;">';
                for(var n=0; n < orderDetail.discountModel.giftNames.length; n++){
                    var giftName = orderDetail.discountModel.giftNames[n];
                    html += '<p>'+giftName+'</p>';
                }
                html+='</div></div>';
            }

            html += '<p class="height1"></p>'+
                    '<div class="zqfabiao">'+
                    '   <p class="zqfbtitle">您的评价内容</p>'+
                  //  '   <form>'+
                    '       <div class="zqpjarea clearfloat">'+
                    '           <textarea rows="4" placeholder="开始对我们的商品进行评价吧，最多上传五张图片！" name="content'+orderDetail.uuid +'" id="content'+orderDetail.uuid +'"></textarea>'+
                    '           <div class="zqadder">'+
                    // '               <div class="zqaddimg fl">'+
                    // '                   <b>+</b>'+
                    // '                   <input class="upload" type="file" detailUuid = "'+orderDetail.uuid+'" id="'+orderDetail.uuid +'_file" name="image" value=""/>'+
                    // '               </div>'+
                     '         <div class="zqaddimg fl">'+
                     '              <form method="post" enctype="multipart/form-data">'+
                     '                   <a href="javascript:;" class="file">'+
                     '                       <input id="upload1" type="file" name="file" accept="image/png,image/jpeg,image/jpg" class="upbtn" fileElementId="upload1" onchange="KUYU.uploadImage(this, \'upload1_img0\', \''+orderDetail.uuid+'\')">'+
                     '                       <img src="" class="uploadimgShow" id="upload1_img0">'+
                     '                       <font>+</font>'+
                     '                   </a>'+
                     '               </form>'+
                     '          </div>'+
                    '               <input type="hidden" id="'+orderDetail.uuid +'_imgsString" value=""/>'+
                    '               <ul class="zqaddimgli fl" detailUuid = "'+orderDetail.uuid+'" id="'+orderDetail.uuid+'_showImg">'+
                    '               </ul>'+
                    '           </div>'+
                    '       </div>'+
               //     '   </form>'+
                    '</div>'+
                    '<p class="zqfbtitle zqtop30">您的评分</p>'+
                    '<div id="zqstar1" class="j-start zqstar clearfloat">'+
                    '   <span></span>'+
                    '   <ul class="stars_Product_'+orderDetail.uuid+'">'+
                    '       <li class=""><a href="javascript:;">1</a></li>'+
                    '       <li class=""><a href="javascript:;">2</a></li>'+
                    '       <li class=""><a href="javascript:;">3</a></li>'+
                    '       <li class=""><a href="javascript:;">4</a></li>'+
                    '       <li class=""><a href="javascript:;">5</a></li>'+
                    '   </ul>'+
                    '   <span></span>'+
                    '   <p>描述相符</p>'+
                    '</div>'+
                    '<div id="zqstar2" class="j-start zqstar clearfloat">'+
                    '   <span></span>'+
                    '   <ul class="stars_TransportService_'+orderDetail.uuid+'">'+
                    '       <li class=""><a href="javascript:;">1</a></li>'+
                    '       <li class=""><a href="javascript:;">2</a></li>'+
                    '       <li class=""><a href="javascript:;">3</a></li>'+
                    '       <li class=""><a href="javascript:;">4</a></li>'+
                    '       <li class=""><a href="javascript:;">5</a></li>'+
                    '   </ul>'+
                    '   <span></span>'+
                    '   <p>物流服务</p>'+
                    '</div>'+
                    '<div id="zqstar3" class="j-start zqstar clearfloat">'+
                    '   <span></span>'+
                    '   <ul class="stars_CustomerService_'+orderDetail.uuid+'">'+
                    '       <li class=""><a href="javascript:;">1</a></li>'+
                    '       <li class=""><a href="javascript:;">2</a></li>'+
                    '       <li class=""><a href="javascript:;">3</a></li>'+
                    '       <li class=""><a href="javascript:;">4</a></li>'+
                    '       <li class=""><a href="javascript:;">5</a></li>'+
                    '   </ul>'+
                    '   <span></span>'+
                    '   <p>服务态度</p>'+
                    '</div>';


        }

        html += '<a href="javascript:void(0);" class="y_btn y_btn_custom2" id="save_appraise">提交评价</a>'+
                '</div>'+
                '</div>';

        $("#main_right").html(html);

    }


    //删除图片
    $("#main_right").on("click",".zqaddimgli>li>a",function(e){
        e.preventDefault();
        var detailUuid = $(this).parent().parent().attr("detailUuid");
        rmImg(this, detailUuid);

    })

    //上传图片监控
    $("#main_right").on("change",".upload",function(){
        var detailUuid = $(this).attr("detailUuid");
        //uploadImage(detailUuid);
    });

    //评分
    $(function() {
        //var $aLi = $(".j-start li");
        $("#main_right").on("mouseover",".j-start li", function(event) {
            var index = $(this).index();
            var $parent = $(this).parent();
            $parent.find("li").removeClass('on');
            $parent.find("li:lt(" + (index + 1) + ")").addClass('on');
        });

        //鼠标离开后恢复上次评分
       $("#main_right").on("mouseout",".j-start li", function() {
            var $parent = $(this).parent();
            $parent.find("li").removeClass('on');
            $parent.find("li.isClick").addClass('on');
        });

        //点击后进行评分处理
        $("#main_right").on("click",".j-start li", function() {
            var $parent = $(this).parent();
            $parent.find("li").removeClass('on isClick');
            var index = $(this).addClass('on isClick').index();
            $parent.find("li:lt(" + (index + 1) + ")").addClass('on isClick');
        });
    });


    KUYU.uploadImage = function (dom, imgdom, detailUuid) {
            var self = $(dom);
            var id = self.attr("fileElementId");
            var form = self.parents('form');
            var imgs = "";
            if(UPLOADLIST.size()<5) {
                form.ajaxSubmit({
                    url: '/rest/usercenter/batchfileupload/batch/upload?rand'+Math.random(),
                    type: 'post',
                    dataType:'json',
                    //contentType: "text/html; charset=utf-8",
                    success: function (res) {
                        if(res.code == 0) {
                            if(res.data) {
                                UPLOADLIST.put(res.data.imgName, {key: res.data.imgName,value:res.data.fileUrl});
                                $("#" + detailUuid + "_showImg").append("<li key='"+ res.data.imgName +"' name='" + res.data.imgName + "' path='" + res.data.fileUrl + "'><a class='uploadIMgClose'>×</a><img src='" + res.data.fileUrl + "'></li>");

                                 imgs = $("#" + detailUuid + "_imgsString").val();
                                if (imgs != "" && imgs != null) {
                                    imgs = imgs + ";" + res.data.imgName + "," + res.data.fileUrl;
                                } else {
                                    imgs = imgs + res.data.imgName + "," + res.data.fileUrl;
                                }
                                $("#" + detailUuid + "_imgsString").val(imgs);
                                form[0].reset()
                            }
                        }else{
                            var errcode = {
                                '-1': '文件大小超限',
                                '-2': '非法的文件格式',
                                '-3': '上传文件为空',
                            };
                            Msg.Alert("","上传失败:"+ errcode[res.code], function () {
                            })
                            form[0].reset()
                        }
                    }
                })
            }else{
                Msg.Alert("","最多可上传5张图片", function () { });   
            }
            
        }




    //删除图片
    function rmImg(obj, detailUuid) {
        var li = $(obj).closest("li");
        var name = li.attr("name");
        var path = li.attr("path");
        var img = name + "," + path;
        var key = li.attr("key");
        var imgs = $("#" + detailUuid + "_imgsString").val();
        imgs = imgs.replace(img, "");
        imgs = imgs.replace(";;", ";");
        if (imgs.substring(imgs.length - 1, imgs.length) == ";") {
            imgs = imgs.substring(0, imgs.length - 1)
        }
        if (imgs.substring(0, 1) == ";") {
            imgs = imgs.substring(1, imgs.length)
        }
        $("#" + detailUuid + "_imgsString").val(imgs);
        li.remove();
        UPLOADLIST.removeByKey(key)

    }


    //提交评价按钮
    $("#main_right").on("click","#save_appraise",function(){
        saveAppraise();
    });


    //保存评价
    function saveAppraise() {
        var fail = false;
        for(var i = 0;i<json.length;i++){
            json[i].productScore = $(".stars_Product_" + json[i].orderDetailUuid + " li.on").length;
            json[i].customerServiceScore = $(".stars_CustomerService_" + json[i].orderDetailUuid + " li.on").length;
            json[i].transportServiceScore = $(".stars_TransportService_" + json[i].orderDetailUuid + " li.on").length;
            json[i].content = filterXSS($("#content" + json[i].orderDetailUuid).val());
            json[i].imgString =  $("#" + json[i].orderDetailUuid + "_imgsString").val();
            json[i].appTags = "";
            if (json[i].productScore == "" || json[i].customerServiceScore == "" || json[i].transportServiceScore == "") {
                fail = true;
                Msg.Alert("","产品评分不能为空！",function(){});
                return;
            }

            if (json[i].content.length <= 0) {
                fail = true;
                Msg.Alert("","请填写评价内容！",function(){});
                return;
            }

            if (json[i].content.length > 150) {
                fail = true;
                Msg.Alert("","请填写150字以内的评价内容！",function(){});
                return;
            }
        }

        var jsonstr ={};
        jsonstr.data =JSON.stringify(json);
        if (!fail) {
            var url = "/usercenter/productappraise/saveAppraiseKuyu";
            $http.post({
                url: url,
                data: jsonstr,
                success: function(res) {
                	if(res.code== "403"||res.code== "-6"){
					    window.location.href = "{{login}}"
					}
                    if (res.code == 0) {
                        Msg.Alert("","评价成功！",function(){
                            window.location.href = "../toAppraise/toAppraise.html?" + orderUuid;
                        });
                    } else {
                        Msg.Alert("","评价失败,您可能已评价或稍后再试！",function(){
                            window.location.href = "productAppraise.html"
                        });
                    }
                }

            })
        }
    }
}
    mainFun();
    $init.Ready(function() {
       // var locKey = $Store.get('_ihome_token_');
        
        // function checkSSO (callback) {
        //     var script ="<script src={{sso}}></script>"
        //     $("body").append(script);
        //     cb = function (data){
        //         callback(data)
        //     };
        // }
    
        // if(!locKey) {
        //     checkSSO(function (data) {
        //         if(data.status == -1) {
        //             $init.nextPage("login",{})
        //             $Store.set(Date.now(), '云平台SSO检测失败')
        //         } else {
        //             $init.nextPage("cloudLogin", {msg:data.code})
        //         }
        //     })
        //     return;
        // } else {
        //     $binder.sync({'locKey':true})
        // }

       /* var script ="<script id='sso' src='{{sso}}'><\/script>";
        $("body").append(script);
        var SOK = function (res) {
            if(res.status != -1 && res.code) {
				var token = $Store.get('_ihome_token_') ? $Store.get('_ihome_token_') : null;
				
                $.ajax({
                    url: '/rest/ssologin/check',
					type:'get',
					headers:{
						'ihome-token' : token,
					},
                    data:{code: res.code },
                    success: function (data) {
                        if(data.code == CODEMAP.status.success) {
                            localStorage.setItem('_ihome_token_', data.token);
                            $header.userInof();
                            mainFun()
                            console.info('run:...')    
                            //   $binder.sync({'locKey':true});
                        }else{
							$init.nextPage("login",'')
						}
                    }
                })
            } else {
                $init.nextPage("login",'')
            }
        }
        //如果超时或者tokne不存在就发请求
        cb = function (data){
            SOK(data);
        }*/

    })

})
