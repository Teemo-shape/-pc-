/*
 *author:chenlong
 */
require(['KUYU.Service','KUYU.plugins.alert', 'KUYU.HeaderTwo','KUYU.navFooterLink','KUYU.Binder',
    'KUYU.SlideBarLogin', 'KUYU.Store', 'ajaxfileupload','validate','xss'
], function() {
    var  $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $scope = KUYU.RootScope;
    var UPLOADLIST = $init.Map();

    $header.menuHover();
    $header.topSearch();
    navFooterLink();


    function formatxss(dom) {
        if(!dom) return false;
        var d = document.createElement('div');
        dom = dom.replace(/\s+/ig, '');
        d.innerHTML = dom;
        return d.innerText;
    }

    //点击查看评论按钮
    $(document).on('click', '.see-comm', function() {
        var parent = $(this).parents('.order-item').find('.view-comm');
        if (parent.hasClass('active')) {
            parent.removeClass('active');
            parent.slideUp();
        } else {
            parent.addClass('active');
            parent.slideDown();
            parent.css({'overflow':'visible'}) //显示小箭头
        }


    });


    //追评点击
    var orderUuid = "";
    var detailUuid = "";
    $(document).on("click",".add-comm",function(e){
        e.preventDefault();
        orderUuid = $(this).attr("data-orderuuid");
        detailUuid = $(this).attr("data-detailuuid");
        orderAfterComments(orderUuid);
    })



    //:商品追评
    function orderAfterComments(orderUuid) {
        var url = "/usercenter/order/ajaxviewKuyuByAfterComment";
        $http.post({
            url:url, 
            data:{
                uuid:orderUuid,
                ranNum: Math.random()
            }, 
            success:function(res) {
            	if(res.code== "403"||res.code== "-6"){
					window.location.href = "{{login}}"
				}
                if(res.data){
                    doAfterCommentRes(res.data)
                }
                
            }
        })

    }



    var orderId = "";
    //追加评论数据处理
    function doAfterCommentRes(data){
        orderId = data.m.orderId;
        var html = "";
        html += '<h3>评价管理</h3>'+
                '<div class="zqrightinfo ">'+
                '<p class="zqwxinfo zqtop30  clearfloat">'+
                '   <span class="fl"><span class="zqtime">'+data.m.orderTime +'</span>'+
                '   <span class="zqordernum">订单号:'+data.m.orderId +'</span><span class="zqpay">'+data.m.payTypeName +'</span></span>'+
                '</p>';
        for (var i = 0; i < data.m.detailList.length; i++) {
            var orderDetail = data.m.detailList[i];
            if(detailUuid  == orderDetail.uuid){
                html += '<p class="height1 hgt20"></p>'+
                    '<div class="zqproinfo zqtop30 clearfloat">'+
                    '   <div class="zqimgtxt fl">'+
                    '   <div class="zqitimg">'+
                    '       <img src="'+orderDetail.specUuid+'" alt="'+orderDetail.productName+'"/>'+
                    '   </div>'+
                    '   <div class="zqittxt">'+
                    '   <p class="zqpmiaoshu">'+
                    '       <a href="../productDetail/productDetail.html?uuid='+orderDetail.productUuid+'" target="_blank">'+orderDetail.productName+
                    '   </a></p>'+
                    '   <p class="zqpxinxi">';
                if(orderDetail.specList){
                    for (var j = 0; j < orderDetail.specList.length; j++) {
                        var specObj = orderDetail.specList[j];
                        html += ' <span> '+specObj.name +'：'+specObj.value+' </span>';
                    }
                }
                html += '</p></div></div>'+
                    '<p class="zqnumber"><b>|</b>×<span class="zqno">'+orderDetail.buyNum+
                    '</span></p>'+
                    '<p class="zqmoney">交易金额：'+orderDetail.payMoney.toFixed(2)+
                    '元</p> </div>'+
                    '<p class="height1"></p>'+
                    '<div class="zqfabiao">';
                if(orderDetail.shopCommentModel){
                    html +=  '<p class="zqfbtitle color-g">已评价的内容<span>';
                    if(orderDetail.shopCommentModel.creater){
                        html += orderDetail.shopCommentModel.creater;
                    }
                    if(orderDetail.shopCommentModel.comments){
                        html += '</span></p><p class="zqrightinfo-comm">'+formatxss(orderDetail.shopCommentModel.comments);
                    }
                }


                html += '   </p>'+
                    '</div>'+
                    '<div class="zqfabiao">'+
                    '   <p class="zqfbtitle">您的追评</p>'+
                    '   <div class="zqpjarea clearfloat">'+
                    '    <textarea rows="4" placeholder="谢谢商家。好评！全5分" name="content'+orderDetail.uuid +'" id="content'+orderDetail.uuid +'"></textarea>'+
                    '   <div class="zqadder">'+
                    '       <div class="zqaddimg fl">'+
                     '              <form method="post" enctype="multipart/form-data">'+
                     '                   <a href="javascript:;" class="file">'+
                     '                       <input id="upload1" type="file" name="file" accept="image/png,image/jpeg,image/jpg" class="upbtn" fileElementId="upload1" onchange="KUYU.uploadImagePlugs(this, \'upload1_img0\', \''+orderDetail.uuid+'\')">'+
                     '                       <img src="" class="uploadimgShow" id="upload1_img0">'+
                     '                       <font>+</font>'+
                     '                   </a>'+
                     '               </form>'+
                     '      </div>'+
                    // '       <div class="zqaddimg fl">'+
                    // '           <b>+</b>'+
                    // '           <input class="upload" type="file" id="file" name="image" value="" />'+
                    // '       </div>'+
                    '    <input type="hidden" id="imgsString" value=""/>'+
                    '   <ul class="zqaddimgli fl" id="showImg"> </ul>'+
                    '</div></div>'+
                    '<p class="zqfbtitle zqtop30"></p>'+
                    ' <a href="javascript:void(0);"  class="y_btn y_btn_custom2">提交评价</a>'+
                    '</div></div></div>';
            }


        }
        html += '</div>';

        $(".m_content").html(html);
    }




    //查看评价
    $(function(){
        var u = location.search;
        uuid = u.substr(1);
        url="/usercenter/productappraise/seeOrderComment";
        $http.post({
            url:url,
            data:{
                orderUuid:uuid,
                ranNum:Math.random()
            },
            success:function(res){
            	if(res.code== "403"||res.code== "-6"){
					window.location.href = "{{login}}"
				}
                if(res.data){
                    var res = res.data;
                    doSeeCommentResponse(res)
                }
            }
        });
    })


    //获取时间
    function nowTime(t){
        t = new Date(t);
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        if(month<10){
            month = "0"+month;
        }
        var date = t.getDate();
        if(date<10){
            date = "0"+ date;
        }
        return year+'-'+month+'-'+date;
    }


    //查看评价数据处理
    //保存list的uuid
    function doSeeCommentResponse(res){
        var html = "";
        if(res){
            html += '<div class="zqrightinfo ">'+
                    '   <p class="zqwxinfo zqtop30  clearfloat">'+
                    '       <span class="fl"><span class="zqtime">'+res.orderTime +'</span>'+
                    '       <span class="zqordernum">订单号：'+res.orderId +'</span>'+
                    '       <span class="zqpay">在线支付</span></span>'+
                    '       <span class="zqzt fr">评价状态：已评价</span>'+
                    '   </p>'+
                    '   <p class="height1 hgt20"></p>'+
                    '   <div class="zqproinfo clearfloat">';

            var detailList = res.detailList;
            for(var i = 0; i < detailList.length; i++){
                var data = detailList[i];
                html += '<div class="order-item zqtop30">'+
                        '   <div class="order-item-box">'+
                        '       <div class="zqimgtxt fl">'+
                        '           <div class="zqitimg">'+
                        '               <a href="../productDetail/productDetail.html?uuid='+data.productUuid+' "target="_blank">'+
                        '                   <img src="'+data.productPicUrl+'" alt="'+data.productName +'"/>'+
                        '               </a>'+
                        '           </div>'+
                        '       <div class="zqittxt">'+
                        '           <p class="zqpmiaoshu">'+
                        '                <a href="../productDetail/productDetail.html?uuid='+data.productUuid+'" target="_blank">'+data.productName+'</a>'+
                        '           </p>'+
                        '           <p class="zqpxinxi">';
                if(data.spec){
                    for(var j=0; j < data.spec.length; j++){
                        var specObj = data.spec[i];
                        html += specObj.name +'：'+specObj.value +'&nbsp;&nbsp';
                    }
                }
                html += '</p></div></div>';

                html += '<p class="zqnumber">交易金额：<span class="zqno">'+data.finalPrice+
                        '元</span></p>';
                if(data.discountModel && data.discountModel.giftNames){
                    html += '<div class="z_zengping">'+
                            '   <span class="z_zengping_title">赠品</span>'+
                            '   <div class="z_txt_control fl" style="margin-left:15px;">';
                    for (var j = 0; j < data.discountModel.giftNames.length; j++) {
                        var giftName = data.discountModel.giftNames[j];
                        html += '<p>'+giftName+'</p>';
                    }
                    html += '</div></div>';
                }
                html += '<p class="zqmoney">';

                if(data.shopCommentModel){
                    if(data.shopCommentModel.afterComment){
                        html += '<a class="zqmoney-but add-comm" data-Orderuuid="'+res.orderUuId+'" data-detailuuid="'+data.uuid+'" href="javascript:void(0)">追加评论</a>';
                    }
                }

                html += '<a class="zqmoney-but see-comm active" href="##">查看评论</a>'+
                        '</p></div>'+
                        '<div class="view-comm">'+
                        '   <span class="arrow"></span>';
                var shopCommentModel = data.shopCommentModel;
                if(shopCommentModel){
                    html += '<div class="reply-list">'+
                            '   <table cellspacing="0" cellpadding="0" class="comm-table">'+
                            '       <tr>';
                    if(shopCommentModel.customerImageUrl){
                        html += '<td class="user-img"><img src="'+shopCommentModel.customerImageUrl+'"/></td>';
                    }else{
                        html += '<td class="user-img"><img src="../../app/images/default.png"/></td>';
                    }
                    html += '<td>'+shopCommentModel.customerName+'<span class="fr">'+ nowTime(shopCommentModel.appTime) +'</span></td>'+
                        '<td class="user-star">'+
                        '<ul class="comm-star star-r j-star">';
                    for(var j=1;j<=shopCommentModel.productScore;j++){
                        html += '<li class="item active"></li>';
                    }
                    html += '</ul></td></tr>'+
                        '<tr>'+
                        '   <td></td>'+
                        '   <td>'+
                        '       <p class="tab-mar">'+formatxss(shopCommentModel.comments)+'</p>'+
                        '       <p class="reply-img">';
                    if(shopCommentModel.showImgList.length>0){
                        for (var j = 0; j < shopCommentModel.showImgList.length; j++) {
                            var commentImg = shopCommentModel.showImgList[j];
                            html += '<img src="'+commentImg.imgUrl+'">';
                        }
                    }
                    html += '</p>'+
                            '</td>'+
                            '<td class="text-c">'+
                            '<div class="attr-text"><span>';
                    if(data.spec){
                        for (var j = 0; j < data.spec.length; j++) {
                            var specObj = data.spec[j];
                            html += specObj.value ;
                        }
                    }
                    html += ' </span></div></td>'+
                        '</tr>';
                    if(shopCommentModel.replyList && shopCommentModel.replyList.length > 0){
                        var replyComment = shopCommentModel.replyList[0];
                        html += '<tr><td></td>'+
                                '   <td class="comm-child">'+
                                '   <p class="child-img"><img src="../../app/images/y_recomd5.jpg"/> '+
                                '       <span class="red">官方回复</span>'+
                                '   <span class="fr">'+nowTime(replyComment.createTime)+
                                '   </span></p>'+
                                '   <p class="child-img">'+replyComment.replyContent+'</p>'+
                                '</td><td></td></tr>';
                    }
                    if(shopCommentModel.afterShopComment){
                        var afterShopComment = shopCommentModel.afterShopComment;
                        html += '<tr>'+
                                '   <td></td>'+
                                '   <td class="comm-child">';
                        if(shopCommentModel.customerImageUrl){
                            html += '<p class="child-img"><img src="'+shopCommentModel.customerImageUrl+'"/>';
                        }else{
                            html += '<p class="child-img"><img src="../../app/images/default.png"/>';
                        }

                        html += '           <span>买家追评</span>'+
                                '           <span class="fr">'+nowTime(afterShopComment.appTime)+
                                '       </span></p>'+
                                '       <p>'+formatxss(afterShopComment.comments)+'</p>'+
                                '       <p class="reply-img">';
                        for (var j = 0; j < afterShopComment.showImgList.length; j++) {
                            var commentImg = afterShopComment.showImgList[j]
                            html += '<img src="'+commentImg.imgUrl+'">';
                        }
                        html += '</p></td><td></td>'+
                            '</tr>';
                        if(afterShopComment.replyList && afterShopComment.replyList.length > 0){
                            var replyComment1 = afterShopComment.replyList[0];
                            html += '<tr>'+
                                '   <td></td>'+
                                '   <td class="comm-child">'+
                                '       <p class="child-img">'+
                                '           <img src="../../app/images/y_recomd5.jpg"/>'+
                                '           <span class="red">官方回复</span>'+
                                '           <span class="fr">'+nowTime(replyComment.createTime)+
                                '       </span></p>'+
                                '       <p class="child-img">'+replyComment1.replyContent+'</p>'+
                                '   </td>'+
                                '   <td></td>'+
                                '</tr>';
                        }

                    }
                    html += '</table></div>';

                }
                html += '</div></div>';
            }
            //列表结束
            html += '</div></div>';

            $("#main_comment").html(html);
        }

    }


    KUYU.uploadImagePlugs = function (dom, imgdom, detailUuid) {
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
                                $("#showImg").append("<li  key='"+ res.data.imgName +"' name='" + res.data.imgName + "' path='" + res.data.fileUrl + "'><a class='uploadIMgClose'>x</a><img src='" + res.data.fileUrl + "'></li>");
                                 imgs = $("#imgsString").val();
                                if (imgs != "" && imgs != null) {
                                    imgs = imgs + ";" + res.data.imgName + "," + res.data.fileUrl;

                                } else {

                                    imgs = imgs + res.data.imgName + "," + res.data.fileUrl;

                                }
                                $("#imgsString").val(imgs);
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



    //上传图片监控
    $(document).on("change",".upload",function(){
       // uploadImage(detailUuid);
    });


    //删除图片 add by huangrc
    function rmImg(obj) {
        var li = $(obj).closest("li");
        var name = li.attr("name");
        var path = li.attr("path");
        var img = name + "," + path;
        var key = li.attr("key");
        var imgs = $("#imgsString").val();
        imgs = imgs.replace(img, "");
        imgs = imgs.replace(";;", ";");
        if (imgs.substring(imgs.length - 1, imgs.length) == ";") {
            imgs = imgs.substring(0, imgs.length - 1)
        }
        if (imgs.substring(0, 1) == ";") {
            imgs = imgs.substring(1, imgs.length)
        }
        $("#imgsString").val(imgs);
        li.remove();
        UPLOADLIST.removeByKey(key)

    }


    //删除图片
    $(document).on("click",".zqaddimgli>li>a",function(e){
        e.preventDefault();
        rmImg(this);

    })


     $(".m_content").on("click",".y_btn_custom2",function(e){
        e.preventDefault();
        saveAppraise()
     })



     //保存追评评价
    function saveAppraise() {
        var fail = false;
        var content = filterXSS($("#content" + detailUuid).val());
        var imgString = $("#imgsString").val();
        var orderId = orderId;
       
        if (content.length <= 0) {
            fail = true;
            Msg.Alert("","请填写评价内容",function(){});
            return;
        }

        if (content.length > 150) {
            fail = true;
            Msg.Alert("","请填写150字以内的评价内容",function(){});
            return;
        }
        /*if (json.length > 10) {
            json += ',';
        }*/
        var json = {};
            json.orderDetailUuid = detailUuid;
            json.imgString=imgString;
            json.orderId=orderUuid;
            json.content=content;
            json.appTags="appTags";

        var jsonstr ={};
        jsonstr.data =JSON.stringify(json);
        if (!fail) {
            var url = "/usercenter/productappraise/saveAfterAppraiseKuyu";
            $http.post({
                url: url,
                data: jsonstr,
                success: function(res) {
                	if(res.code== "403"||res.code== "-6"){
						window.location.href = "{{login}}"
					}
                    if (res.code == 0) {
                        Msg.Alert("","评价成功",function(){
                            window.location.href = "../toAppraise/toAppraise.html?" + orderUuid;
                        });
                    } else {
                        Msg.Alert("","评价失败,您可能已评价或稍后再试！",function(){});
                    }
                }
               
            })
        }
    }












})