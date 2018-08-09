/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/14
 */
require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.plugins.alert', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'KUYU.Store', 'juicer','lightbox','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        Map = $init.Map(),
        Map2 = $init.Map(),
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
         path = _sever[_env.sever],
        $scope = KUYU.RootScope;
        $header.menuHover();
        $header.topSearch();
        navFooterLink();
    //频道跳转配置
    var channelDic = {
        "电视":'tv',
        "手机":'mobile',
        "空调":'air',
        "冰箱":'refrigerator',
        "洗衣机":'washer',
        "健康电器":'homeappliance'
    };
    var _UUID = $param.uuid;
    var globalField = {"localStoreId":"03d03b6b05604c5cb065aef65b72972e"};
    var param = { //这个是存购物车
        'storeMap':{}
    };
    var submitUrl = ''; //存放URL
    globalField.promotionUuid = $param.promotionUuid;
    globalField.nowPromotion = '';  //单品促销ID
    globalField.__skuNo__ = $param.skuNo;
    globalField.reserveOrderId = $param.reserveOrderId; //这个ID是判断能不能参加预约的

    var getProductDetail = function (_UUID) {
        if(!_UUID) {
            $init.nextPage("404",{})
        }else {
            $http.get({
                url: '/front/product/toProductKuyu',
                data:{uuid:_UUID },
                success: function (data) {
                    if(data.promotionUuid && data.promotionUuid !=null) {
                        //promotionUuid存在则出现秒杀活动 [这里暂时忽略:如果promotionLimitBuy存在则显示秒杀]
                        globalField.promotionUuid = globalField.promotionUuid && globalField.promotionUuid!=null ? globalField.promotionUuid : (data.promotionUuid && data.promotionUuid !=null)?data.promotionUuid: data.promotionUuid;
                        globalField.__skuNo__ = globalField.__skuNo__ && globalField.__skuNo__ !=null ? globalField.promotionUuid : (data.skuNo && data.skuNo !=null) ? data.skuNo :data.skuNo ;
                        allRender.seckill();
                    } else {
                        if(data.returnCode && data.returnCode == 2){
                            //把title存本地，到不可售页面用
                            sessionStorage.setItem("title",JSON.stringify(data.setTitle))
                            window.location.href = "../productSoldOut/productSoldOut.html";
                        }
                        if(data.platformName){
                            data.setTitle = '【TCL '+data.platformName+'】'+ data.productModel.productMain.productName +'_TCL' + data.secondParentCategoryName+'-TCL官网'
                        }else{
                            data.setTitle = 'TCL - 详情页 -' + data.productModel.productMain.productName ;
                        }

                        if(data.preSale){
                            globalField.preSale=data.preSale.uuid;
                        }
                        $binder.sync(data)
                        globalField.activeStatus = data.activeStatus;
                        globalField.showTypedisp = data.showType;
                        globalField.preSaleType = data.preSale?data.preSale.type:null;
                        globalField.reservePromotionUuid = data.preSale?data.preSale.uuid:null; //预售uuid  校验库存的时候要传到后台
                        globalField.productUuid = data.productModel?data.productModel.productMain.uuid:null;
                        globalField.skuNo = data.front?data.front.skuNo:null;
                        globalField.parentSkuNo = data.productSku?data.productSku.parentSkuNo:null;
                        globalField.storeUuid = data.productModel?data.productModel.productMain.storeUuid:null; //商家ID
                        globalField.reserveOrderId = data.reserveOrderId; //这个ID是判断能不能参加预约的
                        globalField.promotionUuid = data.promotionUuid;
                        globalField.nowPromotion = (data.front && data.front.priceAndPromotion) ?  data.front.priceAndPromotion.promotionInteactiveModel.promotionUuid : data.front.priceAndPromotion.promotionUuid;
                        //预约时用到的商品名称
                        globalField.secondParentCategoryName = data.secondParentCategoryName;

                        //渲染模版
                        allRender.headShow(data);
                        allRender.crumbs(data);
                        allRender.productTitle(data);
                        allRender.productPrice(data);   //促销、预约、尾款
                        //促销信息
                        allRender.getStorePromotion();
                        //获取属性
                        allRender.baseSpecAttr1(data);
                        allRender.baseSpecAttr(globalField.productUuid);
                        //尺寸颜色选择方法
                        allRender.skipGroupProduct();
                        //获取收货地址-这里关联到库存
                        getAddress.getProvince();
                        //顶部固定条
                        getFixedPrice(data);

                        checkFavourState(globalField.productUuid);
                        makeQrCode(globalField.productUuid)
                        loadLeftImg(data);
                        getProductImg(data);


                        ///////////////评论

                        ajaxSearchComment(1,5);
                        policy();
                        getCommonProblems();
                        ///////////////////////
                        detail_ad(data.productModel.productMain.categoryUuid);
                    }
                },
                error: function (res) {
                    if(Array.of) {
                        console.log(res)
                    }
                }
            });
        }
    }

    var allRender = {
        headShow:function(data){

        },
        crumbs: function (data) {
            var tpl = ' <a href="/">TCL内购</a> > <a href="/pages/channel/channel.html?channelId='+channelDic[data.secondParentCategoryName]+'">${secondParentCategoryName}</a> > ${productModel.productMain.productName}';
            var crumbs = document.getElementById('crumbs');
            var html = juicer(tpl, data);
            $(crumbs).html(html)
        },//产品描述
        productTitle: function (data) {
            var tpl ='<h1 class="purc-name"><span title="${productModel.productMain.productName}">${productModel.productMain.productName}</span><a href="#" class="fr" id="deepKnowProduct" style="display:none" target="_blank">深入了解产品>></a></h1>'
                 +   '{@if promotionLimitBuy}'
                 +   '  <div class="purc-item redfont">秒杀时间：${promotionLimitBuy.beginTime}至${promotionLimitBuy.endTime} ${promotionLimitBuy.description}</div>'
                 +   '{@/if}'
                 +   '<div class="purc-item"><p class="desc">$${productModel.productMain.adviceNote}</p><span class="purc-start" ><em>&#xe636;</em>收藏</span></div>'
                 +   '<div class="purc-item clearfloat jifen">'
                 +   '    <div class="fl">'
                 +   '        <span>可获取积分：<em>${front?parseInt(front.priceAndPromotion.price):0}</em></span>'
                 +   '       </div>'

                 +   '    </div>'
                 +   '</div>';
            var proTitle = document.getElementById('render-product-title');
            var html = juicer(tpl, data);
            $(proTitle).html(html)
        },//秒杀
        seckill: function () { //toLimitProductKuyu
            $http.post({
                url: '/front/product/toLimitProductKuyu',
                data:{"promotionUuid":globalField.promotionUuid,"skuNo":globalField.__skuNo__},
                success: function (data) {
                    var skill_data = data;
                    if(data.platformName){
                        data.setTitle = '【TCL '+data.platformName+'】'+ data.productModel.productMain.productName +'_TCL' + data.secondParentCategoryName+'-TCL官网'
                    }else{
                        data.setTitle = 'TCL - 详情页 -' + data.productModel.productMain.productName ;
                    }
                    //判断商品是否下架
                    if(data.returnCode && data.returnCode == 2){
                        //把title存本地，到不可售页面用
                        sessionStorage.setItem("title",JSON.stringify(data.setTitle))
                        window.location.href = "../productSoldOut/productSoldOut.html";
                    }
                    $binder.sync(data)
                    var tpl = ' <div class="purc-text">'
                        +'    <p class="purc-item"><strong  class="bold">剩余时间：</strong> <span class="time" id="limit_endTime"></span></p>'
                        +'    <p class="purc-item"><strong class="bold">秒 杀 &nbsp价：</strong>'
                        +'        <i class="redfont mgl10"><em class="font30 redfont">'+data.front.priceAndPromotion.price+'</em></i>'
                        +'        <span class="txt-leave blackfont">（秒杀库存仅剩<font id="fnt_limitStock">'+data.front.stock+'</font>件）</span>'
                        +'        <span class="mgl20 line-through blackfont">原价：'+data.productSkuPrice+'</span></p>'
                        +'</div>';
                    var html = juicer(tpl, data);
                    $("#seckill").html(html);

                    var dom = $('<a class="buy" id="buyAId" href="javascript:;" >立即购买</a>');
                    $("#promotionSub").html(dom);
                    var dom1 = $('<a href="javascript:;" class="buy" id="fixedFastBuy">立即购买</a>');
                    $("#fixedBuy").html(dom1);

                    detail_ad(data.productModel.productMain.categoryUuid);

                    globalField.activeStatus = data.activeStatus;
                    globalField.showTypedisp = data.showType;
                    globalField.preSaleType = data.preSale?data.preSale.type:null;
                    globalField.productUuid = data.productModel?data.productModel.productMain.uuid:null;
                    globalField.skuNo = data.front?data.front.skuNo:null;
                    globalField.parentSkuNo = data.productSku?data.productSku.parentSkuNo:null;
                    globalField.storeUuid = data.productModel?data.productModel.productMain.storeUuid:null; //商家ID

                    //获取收货地址-这里关联到库存
                    getAddress.getProvince();


                    //渲染模版
                    allRender.crumbs(data);
                    allRender.productTitle(data);
                    //获取属性
                    // allRender.baseSpecAttr1(data);
                    // allRender.baseSpecAttr()

                    allRender.baseSpecAttr1(data);
                    allRender.baseSpecAttr(globalField.productUuid);
                    allRender.skipGroupProduct();

                    checkFavourState(data.productModel.productMain.uuid);
                    makeQrCode(data.productModel.productMain.uuid)
                    loadLeftImg(data)
                    getProductImg(data);

                    getFixedPrice(data);

                    ///////////////评论

                    ajaxSearchComment(1,5);
                    policy();
                    ///////////////////////

                    //秒杀函数
                    var doubleKill = function(){
                        var productUuid = $("#productUuid").val();
                        var provinceId = $("#provinceId").val() ;
                        var cityId = $("#cityId").val() ;
                        var region = $("#region").val();
                        var areaUuid = $("#areaUuid").val();
                        var skuNo=$("#skuNo").val();
                        var promotionUuid = $("#limitpromotionUuid").val();
                        //检查是否能够下单
                        //  promotionUuid=eccd79bf44ed44ba97c6172e8bac10fb&productSkuNo=P001010101010100122
                        //  "/order/checkCanSaveLimitOrder"
                        $http.get({
                            url: "/cart/checkLimitBuy",
                            data: {
                                promotionUuid:globalField.promotionUuid,
                                skuNo :data.skuNo,
                                areaUuid:  areaUuid,
                                region: region,
                                provinceId: provinceId,
                                cityId: cityId,
                                _t:Math.random()
                            },
                            success: function (data) {
                                if(data.code == "true") {
                                    //skuNo=&areaId=14994&promotionUuid=
//                                      $init.nextPage('fastBuyLimitProduct',{
//                                          skuNo: globalField.__skuNo__,
//                                          promotionUuid: globalField.promotionUuid,
//                                          areaId: areaUuid
//                                      })
                                    window.location.href="../limitProduct/limitProduct.html?skuNo="+globalField.__skuNo__+"&promotionUuid="+globalField.promotionUuid+"&areaId="+areaUuid
                                }else if(data.code == 1) {
                                    window.location.href=window.location.origin+"/sign";
                                }else if(data.code ==CODEMAP.status.TimeOut || data.code == CODEMAP.status.notLogin) {
                                    Msg.Alert("","未登录",function(){
                                        window.location.href=window.location.origin+"/sign";
                                    })
                                }else {
                                    Msg.Alert("",data.message,function(){});
                                }
                            }
                        });
                    }
                    //右上角立即购买
                    dom.on('click', function (e) {
                        if($(this).hasClass('disabled')) {
                            return
                        }
                        doubleKill();

                    })
                    //悬浮立即购买
                    dom1.on('click', function (e) {
                        if($(this).hasClass('disabled')) {
                            return
                        }
                        doubleKill();

                    })
                    var SysSecond = data.remindSeconds; //系统秒杀时间
                    function SetRemainTime() {
                        if (SysSecond > 0) {
                            SysSecond = SysSecond - 1;
                            var second = Math.floor(SysSecond % 60);             // 计算秒
                            var minute = Math.floor((SysSecond / 60) % 60);      //计算分
                            var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
                            var day = Math.floor((SysSecond / 3600) / 24);        //计算天

                            $("#limit_endTime").html(day+"天"+hour+"小时"+minute+"分"+second+"秒");
                        } else {
                            //剩余时间小于或等于0的时候，就停止间隔函数
                            window.clearInterval(InterValObj);
                            // $("#buyAId").addClass("disabled");
                            if("status2" == activeStatus){
                                $("#limit_endTime").html("活动还没开始");
                            }else{
                                $("#limit_endTime").html("活动已结束");
                            }
                        }
                    };
                    SetRemainTime();
                    (function(){
                        if(''==data.promotionLimitBuy.handEndTime){
                            InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                        }else{
                            $("#limit_endTime").html("活动已结束");
                        }
                    })();

                }
            });

        },//促销、预约、尾款
        productPrice: function (data) {
            var tpl ='<div class="purc-text hidden">'
                    +'        <div class="qrcode_pos ">'
                    +'            <div class="fr qrcode"><img style="margin-top:-2px;" src="../../app/images/qrcode.png" />&nbsp;&nbsp;手机购买'
                    +'                <div class="fixed-code"><img class="fl pQrCode" src="" />'
                    +'                <p class="code-text fl" style="line-height:1.5;">关注公众号<br/>一键下单购买</p>'
                    +'            </div>'
                    +'        </div>'
                    +'        {@if front.priceAndPromotion.price >= productBasePrice}'
                    +'                <strong class="bold">商 城 价&nbsp;：</strong><i class="red"><em class="font30" id="changePrice">${productSkuPrice.toFixed(2)}</em>元</i>'
                    +'            </p>'
                    +'        {@else}'
                    +'            <p><strong class="bold">促销价&nbsp;：</strong><i class="red"><em class="font30">${front.priceAndPromotion.price.toFixed(2)}</em>元</i>'
                    //+'                {@if productSkuPrice != front.priceAndPromotion.price}'
                    +'                    <span class="fr line-through productBasePrice">原价：${productBasePrice.toFixed(2)}元</span>'
                    //+'                {@/if}'
                    +'            </p>'
                    +'        {@/if}'
                    +'        {@if showType=="reserve" && "2"==preSale.type}'
                    +'            <p><strong class="bold">定 金 &nbsp;： </strong><i class="red"><em class="font30">${preSale.firstCost.toFixed(2)}</em>元</i></p>'
                    +'        {@/if}'
                    +'        <div id = "getStorePromotion">'
                    +'        </div>'
                    +'        {@if front.priceAndPromotion && front.priceAndPromotion.promotionInteactiveModel && front.priceAndPromotion.promotionInteactiveModel.productGiftList &&front.priceAndPromotion.promotionInteactiveModel.productGiftList.length != 0}'
                    +'            <p class="purc-item mypromotiontag" style="color: #666;line-height:22px ;overflow:hidden">'
                    +'                <strong  class="bold fl">赠&emsp;&emsp;&nbsp;品：</strong>'
                    +'                <span  class="fl mypromotiontagfl">'
                    +'                    {@each front.priceAndPromotion.promotionInteactiveModel.productGiftList as gift}'
                    +'                        <a href="productDetail.html?uuid=${gift.productUuid}" target="_blank" >${gift.productName}</a>'
                    +'                    {@/each}'
                    +'                </span>'
                    +'            </p>'
                    +'        {@/if}'
                    +'        {@if showType && showType == "subscribe"}'
                    +'            <li class="y_yytime">'
                    +'              {@if activeStatus =="status1"}'
                    +'                <span class="dt">预约活动开始剩余时间：</span>'
                    +'              {@/if}'
                    +'              {@if activeStatus=="status2"}'
                    +'                <span class="dt">预约剩余时间：</span>'
                    +'              {@/if}'
                    +'              {@if activeStatus=="status3"}'
                    +'                <span class="dt">抢购活动开始剩余时间：</span>'
                    +'              {@/if}'
                    +'              {@if activeStatus =="status4"}'
                    +'                <span class="dt">抢购剩余时间：</span>'
                    +'              {@/if}'
                    +'              <div class="dd" id="remainTime">'    //抢购这里有个自定义标签
                    +'                <b id="daysId">${day}</b>'
                    +'                  天'
                    +'                <b id="hoursId">${hour}</b>'
                    +'                  时'
                    +'                <b id="minutesId">${minute}</b>'
                    +'                  分'
                    +'                <b id="secondeId">${second}</b>'
                    +'                  秒  '
                    +'              </div>'
                    +'          </li>'
                    +'          <li>'
                    +'            <span class="dt">发货时间：</span>'
                    +'            <div class="dd">付款后7天内</div>'
                    +'          </li>'
                    +'        {@/if}'
                    +'        {@if preSale && preSale.type==2}' //预定活动时间显示
                    +'          <div class="m_process">'
                    +'            <div class="m_gift">'
                    +'                {@if preSale.promotionCost }'
                    +'                    <P class="f_color1">预付首款优惠金额：RMB${preSale.promotionCost}元</P>'
                    +'                {@/if}'
                    +'            </div>'
                    +'            <div class="m_process_box book clearfix">'
                    +'                <div class="m_left">'
                    +'                    <div>付定金</div>'
                    +'                    <p>剩余:<span class="f_color1">${preSale.endTime}</span></p>'
                    +'                </div>'
                    +'                <span class="m_left m_span">&gt;</span>'
                    +'                <div class="m_left">'
                    +'                    <div>尾款截止</div>'
                    +'                    <p><span class="f_color1"> ${flastPayTime.split(" ")[0]}</sapn></p>'
                    +'                </div>'
                    +'                <span class="m_left m_span">&gt;</span>'
                    +'                <div class="m_left">'
                    +'                    <div class="m_stocking">生产备货</div>'
                    +'                </div>'
                    +'                <span class="m_left m_span">&gt;</span>'
                    +'                <div class="m_left">'
                    +'                    <div>发货</div>'
                    +'                    <p>付尾款后<span class="f_color1">${preSale.sendGoodsTime}天</span></p>'
                    +'                </div>'
                    +'            </div>'
                    +'         </div>'
                    +'        {@else if preSale && preSale.type== 1}'
                    +'          <p>付款后${preSale.sendGoodsTime}天内发货</p>'
                    +'        {@/if}'
                    +'</div>';

            var renderPrice = document.getElementById('render-price');
            var activeStatus =  globalField.activeStatus,
                preSaleType =   globalField.preSaleType;

            getAddress.changeButton(activeStatus, preSaleType)

            var html = juicer(tpl, data);
            $(renderPrice).html(html);

            //促销
            var htmlStr = "";
            htmlStr +=  '<p class="purc-item mypromotiontag" style="color: #666;line-height:22px ; display: none;overflow:hidden">'+
                        '   <strong  class="bold fl">促销信息：</strong>'+
                        '   <span  class="fl mypromotiontagfl" style="display: none">';
            if(data.front.priceAndPromotion && data.front.priceAndPromotion.promotionInteactiveModel && data.front.priceAndPromotion.promotionInteactiveModel.promotionTypes && data.front.priceAndPromotion.promotionInteactiveModel.promotionTypes[0] != "5"){
                if(data.front.priceAndPromotion.promotionInteactiveModel.promotionTypes[0] == 7){
                    htmlStr += '<span class="red">满减</span>'+ data.front.priceAndPromotion.promotionInteactiveModel.promotionName+'<br/>';
                    $(".mypromotiontag").show();
                    $(".mypromotiontagfl").show();
                }
            }
            htmlStr += '</span></p>';
            $("#getStorePromotion").html(htmlStr);



            //更新时间
            var updateTime = function () {
                var SysSecond = data.remindSeconds;
                var InterValObj;
                if(activeStatus =='status1' || activeStatus=='status2' || activeStatus=='status3' || activeStatus=='status4'){
                    InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                }
                function SetRemainTime() {
                    if (SysSecond > 0) {
                        SysSecond = SysSecond - 1;
                        var second = Math.floor(SysSecond % 60);             // 计算秒
                        var minite = Math.floor((SysSecond / 60) % 60);      //计算分
                        var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
                        var day = Math.floor((SysSecond / 3600) / 24);        //计算天

                        $("#daysId").html(day) ;
                        $("#hoursId").html(hour) ;
                        $("#minutesId").html(minite) ;
                        $("#secondeId").html(second) ;
                    } else {
                        //剩余时间小于或等于0的时候，就停止间隔函数
                        window.clearInterval(InterValObj);
                        //这里可以添加倒计时时间为0后需要执行的事件,如果一直是去支付状态，此时需要调用接口关闭订单
                        window.location.reload() ;
                    }
                }
            }.call();

            KUYU.submitTOBuy = function  () {  //3参数预约
                // var num = $("#buyNum").val();
                var _data = {
                    productUuid: globalField.productUuid,
                    buyNum:1, //预约抢购数量固定
                    skuNo: globalField.skuNo
                };
                if(activeStatus == 'status2') {// 这里立即预约的
                    $http.post({
                        url:submitUrl,
                        data:_data,
                        headers:{"Content-Type":"application/x-www-form-urlencoded"},//不刷新页面请求的时候Content-Type
                        success:function(res){
                            if(res.code == 403 || res.code == '-6'){
                                Msg.Alert("","会话失效或未登录",function(){
                                    $init.nextPage("login", {});
                                });
                            }else{
                                $init.nextPage("addProductToOrderKuyu",{
                                    title:data.productModel.productMain.productName,
                                    secondParentCategoryName:globalField.secondParentCategoryName,
                                    skuNo: res.retData.skuNo,
                                    productId:res.retData.submodel.productUuid,
                                    buyNum: res.retData.productBuyNum,
                                    storeNote:res.retData.submodel.uuid,
                                    submodelUuid : res.retData.submodel.uuid,
                                    rushBuyBeginTime : res.retData.submodel.rushBuyBeginTime
                                });
                            }
                        }
                    })
                    /*jump(_data, submitUrl ,function(res) {
                        $init.nextPage("addProductToOrderKuyu",{
                            title:data.productModel.productMain.productName,
                            skuNo: res.retData.skuNo,
                            productId:res.retData.submodel.productUuid,
                            buyNum: res.retData.productBuyNum,
                            storeNote:res.retData.submodel.uuid,
                            submodelUuid : res.retData.submodel.uuid,
                            rushBuyBeginTime : res.retData.submodel.rushBuyBeginTime
                        });
                    })*/
                }

                if("status4"==activeStatus){ //这里已经预约去抢购
                    var reOrderId = globalField.reserveOrderId;
                    jump({}, '/tclcustomer/userInfo' ,function (res) {
                        if(reOrderId==""||reOrderId ==null){
                            Msg.Alert("","对不起!您没有预约不能参与抢购活动！",function(){});
                        } else {
                            $init.nextPage("perserveBuyKuyu",{
                                productUuid: globalField.productUuid,
                                reserveOrderId: globalField.reserveOrderId,
                                skuNo: globalField.skuNo
                            });
                        }
                    })
                }/*else{
                    plugin.Alert("对不起!您没有预约不能参与抢购活动！",{},function(){});
                    $("#buyAId").addClass("bespoke");
                    $("#fixedFastBuy").addClass("bespoke");
                    return;
                    //这里跳转到那里呢???$("#pForm").submit();
                }*/

                function jump (req,url,cb) {
                    $http.post({
                        url: url,
                        data:req,
                        success: function (data) {
                            if(data.code == CODEMAP.status.success) {
                                cb(data);
                            }else if(data.code == CODEMAP.status.notLogin || data.code == CODEMAP.status.TimeOut) {
                                Msg.Alert("",data.msg,function(){
                                    $init.nextPage("login", {});
                                });
                            }else{
                                Msg.Alert("",data.msg,function(){});
                            }
                        }
                    })
                }

            };
            KUYU.submitPreSaleTOBuy = function () {
                var num = $("#buyNum").val();
                /*
                 dealerBcustomerUuid:
                 payOrderUuid: 为orderId非uuid
                 orderType: 订单类型:1订单组；2单个订单
                 pagename:
                 */
                if(preSaleType == '2' || preSaleType == '1') { //2立即付定金,1 立即预定
                    // /front/product/presaleProductToOrder?pIds=7c8156757ee548bb9f16e57cb6274208&attrIds=BP001020102020200010&buyNum=1&willType=2
                    $http.post({
                        url: submitUrl,
                        data:{
                            "dealerBcustomerUuid":"",
                            "pIds":globalField.productUuid,
                            "buyNum":num,
                            "attrIds":globalField.skuNo,
                            "chooseCod":'',
                            "willType":2
                        },
                        success: function(data) {
                            if(data.code == CODEMAP.status.success) {
                                /*$init.nextPage('addProductToOrder',{})*/
                                window.location.href="../addProductToOrder/addProductToOrder.html?pIds="+globalField.productUuid+"&attrIds="+globalField.skuNo+"&buyNum="+num+"&willType=2&preSale="+globalField.preSale;
                            }else if(data.code == CODEMAP.status.TimeOut || data.code == CODEMAP.status.notLogin) {
                                $init.nextPage('login', {})
                            }
                        }
                    });
                }
            };
            KUYU.toFastBuy = function () { //普通的购买
                var buyNum = $("#buyNum").val();
                $http.post({
                    url:'/front/product/addProductToCart',
                    data:{
                        productUuid: globalField.productUuid,
                        buyNum: buyNum,
                        attrId: globalField.skuNo
                    },
                    success: function (data) {
                        //国双
                       // _smq.push(['custom', 'PC', 'goumai']);

                        // if(typeof beheActiveEvent == 'function') {
                        //     beheActiveEvent({at:"buy",src:"1697009386",cid:"",sid:"27295.25155",orderid:"",cost:""})
                        // }

                        if(data.code == CODEMAP.status.success) {
                            $init.nextPage('cart',{})
                        } else if(data.code == CODEMAP.status.notLogin ||data.code == '403') {
                            notLoginBuy();
                        } else {
                            Msg.Alert('', data.retData, function() {})
                        }
                    }
                });
                var notLoginBuy = function () {
                    var colorItem = $("#colorItem").html();
                    var sizeItem = $("#sizeItem").html();
                    var provinceId = "1";
                    if($("#provinceId").val()){
                        provinceId = $("#provinceId").val();
                    }
                    var streetId  = $("#areaUuid").val();
                    var stSize = 0;
                    var skuNo = $("#skuNo").val();
                    var buyNum = $("#buyNum").val();
                    var shoppingcart= $Store.get('shoppingcart')
                    if(shoppingcart) {
                        var res = JSON.parse(shoppingcart);
                        var arr = res.storeMap[globalField.localStoreId];
                        param.storeMap[globalField.localStoreId] = arr;
                    }else{
                        param.storeMap[globalField.localStoreId] = [];
                    }
                    $.each(param.storeMap[globalField.localStoreId], function (i, o) {
                        if(o.isSuitMain ==null && o.productUuid == globalField.productUuid) {
                            stSize = parseInt(o.buyNum)+parseInt(buyNum);
                            o.buyNum = stSize;
                        }
                    })

                    if(stSize<=0) {
                        param.storeMap[globalField.localStoreId].push({"productUuid":globalField.productUuid,"buyNum":buyNum,"attrId":globalField.skuNo,"storeUuid": globalField.storeUuid,"type": "01", "nowPromotion": globalField.nowPromotion , "opeTime":new Date().getTime()})
                    }
                    $Store.set('shoppingcart',JSON.stringify(param));
                    $init.nextPage('cart',{})
                    //window.location.href = path+"/tclcart/addProductToCartKuyu?productUuid="+globalField.productUuid+"&attrIds="+globalField.skuNo+"&buyNum="+buyNum+"&areaUuid="+$("#areaUuid").val()+"&distributorUuid="+streetId+"&activityUuid=";
                }
            };
        },
        //促销（页面刷新促销）
        getStorePromotion:function(){
            $http.get({
                url:"/front/product/getStorePromotion",
                data:{
                    productUuid:globalField.productUuid,
                    storeUuid: globalField.storeUuid
                },
                success:function (res) {
                    if(res.code == 0 && res.retData){
                        if(res.retData.length > 0){
                            $("#getStorePromotion .mypromotiontagfl").html("");
                            $(".mypromotiontag").show();
                            $(".mypromotiontagfl").show();
                        }
                        for(var i = 0; i < res.retData.length; i++){
                            var promotionTypes = res.retData[i].promotionTypes[0];
                            var promotionName = res.retData[i].promotionName;
                            if(promotionTypes == "1"){
                                $("#getStorePromotion .mypromotiontagfl").append('<span class="red">满减</span>'+promotionName+'<br>');
                            }else if(promotionTypes == "4"){
                                $("#getStorePromotion .mypromotiontagfl").append('<span class="red">满赠</span>'+promotionName+'<br>');
                            }else if(promotionTypes == "6"){
                                $("#getStorePromotion .mypromotiontagfl").append('<span class="red">满折</span>'+promotionName+'<br>');
                            }

                        }
                    }
                }
            })
        },
        //点击跳转组合商品页面
        skipGroupProduct:function () {
            $("#groupedProduct").on("click",".options .groupedproduct",function(){
                var uuid = $(this).attr("data-uuid")
                if (uuid) {
                    window.location.href = "productDetail.html?uuid=" + uuid;
                }
            })

        },
        //选择颜色尺寸
        baseSpecAttr: function (productUuid) {
            var ajaxGetBabySet = $.ajax({
                type: "GET",
                url: path+"/front/product/babyset",
                data: {
                    ranNum:Math.random(),
                    productUuid:productUuid
                },
                dataType: "json",
                //timeout : 1000, //超时时间设置，单位毫秒
                success: function(data, textStatus){
                    if(data){
                        var htmlStr = "";
                        if(data.resultcode == 200 && data.message == "success"){//有组合商品,显示组合商品
                            if(data.resultlist.length > 0){
                                //chenrm 6-8 18:00 在页面根据displayName进行排序
                                //sortResults(data.resultlist, 'displayName', true);  add by dufy 2016.07.06 宝贝集合后台实现排序 注掉这里代码
                                htmlStr += '<div class="sele">'+data.displayName+'</div>';
                                htmlStr += '<div class="options">';
                                $.each(data.resultlist, function(i,item) {
                                    if(item.uuid == globalField.productUuid){//选中当前组合商品
                                        htmlStr += '<span class="groupedproduct active" data-uuid = "'+item.uuid+'">'+item.displayName+'</span>';
                                    }else{
                                        htmlStr += '<span class="groupedproduct" data-uuid = "'+item.uuid+'">'+item.displayName+'</span>';
                                    }
                                })
                                htmlStr += '</div>';
                                $("#groupedProduct").html(htmlStr).show();
                            } else{//组合商品为空！显示单个商品的规格属性
                                $("#baseSpecAttr").show();
                            }
                        }else{//显示单个商品的规格属性
                            $("#baseSpecAttr").show();
                        }
                    }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数,status还有success,error等值的情况
                    if(status == 'error'){
                        ajaxGetBabySet.abort();
                        $("#baseAttr").show();
                    }
                    if(status=='timeout'){
                        ajaxGetBabySet.abort();
                        $("#baseAttr").show();
                    }
                }
            });


       },
        baseSpecAttr1: function (data) {
            if(data.front!=null && !data.front.productAttributes)return;
             var count = 0;
             var tpl ='{@each front.productAttributes as it}'
             +'     {@if it.canColor == "1"}'
             +'         {@if productModel.productColorImages && productModel.productColorImages.lenght>0}'
             +'             <div class="purc-text mypurctext">'
             +'                 {@if productModel.productColorImages.length >1 }<span class="edit">修改</span>{@/if}'
             +'                 <div class="sele">选择颜色</div>'
             +'                 <ul  id="colorItem" class="options ul" style="${productModel.productColorImages.lenght==1?"display:none":"display:block"}" >'
             +'                      {@each productModel.productColorImages as data , index}'
             +'                         <li attr-uuid="${data.attrValueUuid}"  onclick="selectColor(${data.attrValueUuid},${index});" class="op-item {@if (front.initSelectSpecUuids && data.attrValueUuid) || productModel.productColorImages.length == 1}active{@/if}">'
             +'                            {@if data.smallImageUrl}'
             +'                                <img src="${data.smallImageUrl}">'
             +'                            {@/if}'
             +'                            <em class="color">${data.colorName}</em>'
             +'                        </li>'
             +'                        {@if (front.initSelectSpecUuids && data.attrValueUuid) || productModel.productColorImages.length == 1}'
             +'                            <input type="hidden" id="${data.attrValueUuid}" value="${data.attrValueUuid}" />'
             +'                            <input type="hidden" id="${data.colorName}" value="${data.colorName}" />'
             +'                        {@/if}'
             +'                     {@/each}'
             +'                </ul>'
             +'             </div>'
             +'        {@/if}'
             +'        {@if it.values == 1}'
             +'            <input type="hidden" id="${attribute.values[0].value}" value="${attribute.values[0].value}" />'
             +'        {@/if}'
             +'    {@/if}'
             +'    {@if it.canColor!="1"}'
             +'        $${it|setAttrCount}'
             +'        <div class="purc-text mypurctext">'
             +'            {@if it.values > 1}<span class="edit">修改</span>{@/if}'
             +'            <div class="sele">选择${it.attributeName}</div>'
             +'            <div class="options sizeItem_1" id="sizeItem" style="${it.value==1?"display:none":"display:block"}" >'
             +'                 {@each it.values as size  , index}'
             +'                      {@if index < 2}'
             +'                          <a href="javascript:;">'
             +'                      {@else}'
             +'                          <a href="javascript:selectSize(\'${size.valueUuid}\');">'
             +'                      {@/if}'
             +'                        <span attrValueUuid="${size.valueUuid}" class="square ${(front.initSelectSpecUuids && size.valueUuid)?"active":""}">${size.value}</span>'
             +'                    </a>'
             +'                    {@if front.initSelectSpecUuids && size.valueUuid }'
             +'                         $${size|setInputVal}'
             +'                    {@/if}'
             +'                 {@/each}'
             +'            </div>'
             +'        </div>'
             +'    {@/if}'
             +'{@/each}'
             +'<input type="hidden" id="attrCount" value="'+count+'" >'
             var setAttrCount= function() {
             count +=1;
             };
             var setInputVal = function(size) {
             var htm = '';
             if(count ==1) {
             htm = ' <input type="hidden" id="defalutSize" value="'+size.valueUuid+'" />'
             +' <input type="hidden" id="defalutSizeValue" value="'+size.value+'" />'
             +' <input type="hidden" id="defalutSizeValue2" value="'+size.value+'" />'
             } else if(count ==2) {
             htm = ' <input type="hidden" id="defalutSize" value="'+size.valueUuid+'" />'
             +' <input type="hidden" id="defalutSizeValue" value="'+size.value+'" />'
             +' <input type="hidden" id="defalutSizeValue2" value="'+size.value+'" />'
             };
             return htm;
             }
             juicer.register('setAttrCount',setAttrCount);
             juicer.register('setInputVal',setInputVal);
             var html =juicer(tpl,data);
             $("#baseSpecAttr").html(html)
        }

    };
    /******************
     * 区域地址全局变量 *
     ******************/
    if(localStorage.getItem("add") && localStorage.getItem("add") != ""){
        var pcrs = JSON.parse(localStorage.getItem("add"));
        var checkedProvince = pcrs.province;
        var checkedCity = pcrs.city;
        var checkedRegion = pcrs.region;
        var checkStreets = pcrs.street;
    }else{
        checkedProvince = "01";
        checkedCity = "100";
        checkedRegion = "1000";
        checkStreets = "10000";
    }

    //当访问是从酷享汇过来时，判断酷商id是否为空
    var bcustomerUuid = "";
    //酷商的类型
    var bType = "";
    //获取区域地址
    var getAddress = {
        param:{
            checkedProvince:checkedProvince,
            checkedCity: checkedCity,
            checkedRegion: checkedRegion,
            checkStreets:checkStreets,
        },
        //改变按钮状态
        changeButton: function (activeStatus, preSaleType) {
            var promotionSub =  $("#promotionSub");
            var fixBuy = $("#fixedBuy");
            if("status1"==activeStatus){               //预约活动开始剩余时间
                promotionSub.html('<a class="bespoke" id="subId" >等待预约</a>');
                fixBuy.html('<a  class="bespoke" id="fixedFastBuy">等待预约</a>');
            }else if("status2"==activeStatus){         //预约剩余时间
                promotionSub.html('<a class="buy  " id="buyAId" href="javascript:KUYU.submitTOBuy();" >立即预约</a>');
                fixBuy.html('<a href="javascript:KUYU.submitTOBuy();" class="buy" id="fixedFastBuy">立即预约</a>');
                $('.select, .j-select').hide();
                submitUrl = '/front/product/addProductToOrder';
            }else if("status3"==activeStatus||"status5"==activeStatus){//抢购活动开始剩余时间
                promotionSub.html('<a class="bespoke" id="subId" >等待抢购</a>');
                fixBuy.html('<a class="bespoke bespoke-buy" id="fixedFastBuy">等待抢购</a>');
            }else if("status4"==activeStatus){          //预约抢购剩余时间
                //if(globalField.reserveOrderId && globalField.reserveOrderId!=null && globalField.reserveOrderId!=undefined) {
                    promotionSub.html('<a class="buy" id="buyAId" href="javascript:KUYU.submitTOBuy();" >立即抢购</a>');
                    fixBuy.html('<a href="javascript:KUYU.submitTOBuy();" class="buy" id="fixedFastBuy">立即抢购</a>');
                    $('.select, .j-select').hide();
                // }else{
                //     promotionSub.html('<a class="buy bespoke disabled " id="buyAId" href="javascript:KUYU.submitTOBuy();" >立即抢购</a>');
                // }
               // submitUrl = '/usercenter/reserveorder/perserveBuyKuyu';
            }else if("1"==preSaleType){                 //全款
                promotionSub.html('<a class="buy " id="buyAId" href="javascript:KUYU.submitPreSaleTOBuy();" >立即预定</a>');
                fixBuy.html('<a href="javascript:KUYU.submitPreSaleTOBuy();" class="buy" id="fixedFastBuy">立即预定</a>');
                submitUrl = '/front/product/presaleProductToOrder';  //付定金跳到包含地址栏的下单页面
            }else if("2"==preSaleType){
                promotionSub.html('<a class="buy " id="buyAId" href="javascript:KUYU.submitPreSaleTOBuy();" >立即付定金</a>');
                fixBuy.html('<a href="javascript:KUYU.submitPreSaleTOBuy();" class="buy" id="fixedFastBuy">立即付定金</a>');
                submitUrl = '/front/product/presaleProductToOrder'; //付定金跳到包含地址栏的下单页面
            }else if("status9"==activeStatus){
                //$("#subId").html('立即购买');//酷享汇
            } else{
                promotionSub.html('<a class="buy " id="buyAId" href="javascript:KUYU.toFastBuy();" >立即购买</a>');
                fixBuy.html('<a href="javascript:KUYU.toFastBuy();" class="buy" id="fixedFastBuy">立即购买</a>');
            };
        },
        getProvince: function () {
            $http.get({
                url: "/usercenter/region/getAllProvince",
                data: {
                    "time": Math.random()
                },
                success: function(data) {
                    if(!data) {
                        Msg.Alert("","获取区域地址失败",function(){});
                    }
                    var provinces = data;
                    if (provinces.length > 0) {
                        var provinceStr = "";
                        for (var i = 0; i < provinces.length; i++) {
                            var province = provinces[i];
                            var checked = "";
                            if (province.uuid == getAddress.param.checkedProvince) {
                                checked = getAddress.param.checkedProvince;
                                $("#provincetitle").html(province.provinceName);
                            }
                            if (bcustomerUuid != "") {
                                if (i == 0) {
                                    $("#provinceId").val(province.uuid);
                                    $("#provincetitle").html(province.name);
                                    $("#selectAreaNameId").html(province.name);
                                }
                            }
                            provinceStr = provinceStr + "<li provinceliid='" + province.uuid + "' onclick='getAddress.showCity(\"" + province.uuid + "\" ,\"\");getAddress.getPromotionsByProvince(\"" + province.uuid + "\");' >" + province.provinceName + "</li>";
                        }
                        provinceStr = provinceStr + "<input type='hidden'   name='province' id='provinceId'  value='" + checked + "' />";
                        $("#provinces").html(provinceStr);
                        if (getAddress.param.checkedProvince) {
                            $("[provinceliid='" + getAddress.param.checkedProvince + "']").parents(".m_areabox .mc").hide();
                            $("[provinceliid='" + getAddress.param.checkedProvince + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                            $("#provinceId").val(getAddress.param.checkedProvince);
                        }
                    }
                },
                error: function(res) {
                    /*if(console)console.log(res)*/
                }
            });
            var addressUuid = "";
            if ("" != getAddress.param.checkedProvince) {

                if ("" != getAddress.param.checkedCity) {
                    addressUuid = getAddress.param.checkedCity;
                    getAddress.showCity(getAddress.param.checkedProvince, getAddress.param.checkedCity, getAddress.param.checkedRegion, getAddress.param.checkStreets);
                }

                addressUuid = getAddress.param.checkedProvince;
                getAddress.getPromotionsByProvince(getAddress.param.checkedProvince);

            }

            if ("" != getAddress.param.checkedRegion) {
                addressUuid = getAddress.param.checkedRegion;
            }

            if ("" != getAddress.param.checkStreets) {}

            if ("" == getAddress.param.checkStreets) {
                $("#buyAId").addClass("disabled bespoke");
                $("#fixedFastBuy").addClass("disabled bespoke");
                $("#buyAId").attr("href", "javascript:;");
                $("#fixedFastBuy").attr("href", "javascript:;");
            }

        },
        showCity: function(provinceId, checkedCity, checkedRegion, checkStreets) {
            $("#citytitle").html("请选择城市");
            $("#regiontitle").html("请选择地区");
            $("#streettitle").html("请选择街道");
            $("#regions").html("");
            $("#streets").html("");
            $http.get({
                url: "/usercenter/region/getCitysByProvinceUuid",
                data: {
                    "provinceUuid": provinceId,
                    "time": Math.random()
                },
                success: function(data) {
                    var citys = data;
                    var cityStr = "";
                    for (var i = 0; i < citys.length; i++) {
                        var city = citys[i];
                        var checked = "";
                        if (city.uuid ==checkedCity) {
                            checked = checkedCity;
                            $("#citytitle").html(city.cityName);
                        }
                        if (i == 0) {
                            $("#cityId").val(city.uuid);
                            $("#citytitle").html(city.name);
                        }
                        cityStr = cityStr + "<li cityliid='" + city.uuid + "'  onclick='getAddress.showRegion(\"" + city.uuid + "\" ,\"\");' >" + city.cityName + "</li>";
                    }
                    cityStr = cityStr + "<input  type='hidden'   name='city' id='cityId'  value='" + checked + "' />";
                    $("#citys").html(cityStr);
                    $("#provincetitle").html($("[provinceliid='" + provinceId + "']").html());
                    $("#provinceId").val(provinceId);
                    $("[provinceliid='" + provinceId + "']").parents(".m_areabox .mc").hide();
                    $("[provinceliid='" + provinceId + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                    $("#provincetitle").parent("li").removeClass("hover");
                    $("#citytitle").parent("li").addClass("hover");
                    if (checkedCity) {
                        $("[cityliid='" + checkedCity + "']").parents(".m_areabox .mc").hide();
                        $("[cityliid='" + checkedCity + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                        $("#cityId").val(checkedCity);
                        $("#citytitle").parent("li").removeClass("hover");
                        $("#regiontitle").parent("li").addClass("hover");
                    }

                    if (checkedCity == "") {
                        return; //若是点击选择省则在这里退出，不要继续往下执行
                    }

                    if ("" != checkedRegion) { //这里是用户一进入页面所需做的初始化动作
                        getAddress.showRegion(checkedCity, getAddress.param.checkedRegion, getAddress.param.checkStreets);
                    }

                }
            });
        },
        //:获取地区
        showRegion: function(cityId, checkRegion,checkStreets) {
            $http.get({
                url: "/usercenter/region/getRegionsByCityUuid",
                data: {
                    "cityUuid": cityId,
                    "time": Math.random()
                },
                success: function(data) {
                    var regions = data;
                    var regionStr = "";
                    for (var i = 0; i < regions.length; i++) {
                        var region = regions[i];
                        var checked = "";
                        if (region.uuid == checkRegion) {
                            checked = checkRegion;
                            $("#regintitle").html(region.regionName);
                        }
                        regionStr = regionStr + "<li  regionliid='" + region.uuid + "'  onclick='getAddress.showStreet(\"" + region.uuid + "\",\"\");'>" + region.regionName + "</li>";
                    }
                    regionStr = regionStr + "<input type='hidden'   name='region' id='region''  value='" + checked + "' />";
                    $("#regions").html(regionStr);

                    $("#citytitle").html($("li[cityliid='" + cityId + "']").html());
                    $("#cityId").val(cityId);
                    $("[cityliid='" + cityId + "']").parents(".m_areabox .mc").hide();
                    $("[cityliid='" + cityId + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                    $("#citytitle").parent("li").removeClass("hover");
                    $("#regiontitle").parent("li").addClass("hover");
                    if (checkRegion) {
                        $("[regionliid='" + checkRegion + "']").parents(".m_areabox .mc").hide();
                        $("[regionliid='" + checkRegion + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                        $("#region").val(checkedRegion);
                        $("#regiontitle").parent("li").removeClass("hover");
                        $("#streettitle").parent("li").addClass("hover");
                    }

                    if (checkRegion == "") {
                        return; //若是用户点击选择市则在这里退出，不要继续往下执行
                    }

                    if ("" != checkStreets) {
                        //这里是用户一进入页面所需做的初始化动作
                        getAddress.showStreet(checkedRegion, checkStreets);
                    }
                }
            });
        },
        //:获取街道
        showStreet: function(regionId, checkStreets) {
            $http.get({
                url:"/usercenter/region/getStreetsByRegionUuid",
                data:{
                    "regionUuid": regionId,
                    "time": Math.random()
                },
                success: function(data) {
                    var streets = data;
                    var regionStr = "";
                    for (var i = 0; i < streets.length; i++) {
                        var street = streets[i];
                        var checked = "";
                        if (street.uuid == checkStreets) {
                            checked = checkStreets;
                            $("#streettitle").html(street.streetName);
                        }
                        regionStr = regionStr + "<li streetliid='" + street.uuid + "' onclick='getAddress.checkstock(\"" + street.uuid + "\")' >" + street.streetName + "</li>";
                    }
                    regionStr = regionStr + "<input type='hidden' name='street' id='street'   value='" + checked + "' />";
                    $("#streets").html(regionStr);
                    $("#regiontitle").html($("li[regionliid='" + regionId + "']").html());
                    $("#region").val(regionId);
                    $("[regionliid='" + regionId + "']").parents(".m_areabox .mc").hide();
                    $("[regionliid='" + regionId + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                    $("#regiontitle").parent("li").removeClass("hover");
                    $("#streettitle").parent("li").addClass("hover");
                    if (checkStreets != "") {
                        getAddress.checkstock(checkStreets);
                    }

                }
            });
        },

        checkstock:function(streetUuid) {
            $(".y_sendarea").removeClass("y_aretive");
            $("#street").val(streetUuid);
            $("#streettitle").html($("li[streetliid='" + streetUuid + "']").html());
            $("#areaUuid").val(streetUuid);
            getAddress.updateAddressMsg();

             /*检查商品库存*/
            getAddress.hasProduct();
            /*检查套装库存*/
            //获取优惠套装
            if ("" != getAddress.param.checkedRegion) {
                //getAddress.getSuitMainByRegion(addressUuid);
                if(!globalField.__skuNo__ && !globalField.promotionUuid) {
                    getAddress.getProductRelSuit(globalField.productUuid, getAddress.param.checkedRegion);
                }
            }
        }, //：检查商品库存
        hasProduct: function(cb) {
            var region = $("#region").val();   //有字段 县
            var areaUuid = $("#areaUuid").val(); //有字段 乡镇
            var skuNo = globalField.skuNo; //有字段
            var parentSkuNo = globalField.parentSkuNo; //有字段
            var showTypedisp = globalField.showTypedisp; //有字段
            var provinceId = $("#provinceId").val();
            var buyDom = $("#buyNum");
            var cityId = $("#cityId").val();
            var buyNum = $("#buyNum").val();

            var noProduct = function (data) {
                if(data.retData.totalNum && data.retData.totalNum > 0) {
                    buyDom.val(data.retData.totalNum).data('max', data.retData.totalNum);
                    Msg.Alert("","库存不足，请减少库存尝试",function(){});
                } else  {
                    $("#isProduct").html("无货");
                    $("#fastBuy").attr("href", "javascript:;");
                    $("#buyAId").attr("href", "javascript:;");
                    $("#fixedFastBuy").attr("href", "javascript:;");
                    $("#buyAId").addClass("bespoke disabled");
                    $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                    $("#fastBuy, #fixedFastBuy").attr("disabled", true);
                    $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                    if (showTypedisp != "subscribe") {
                        $("#buyAId").removeClass("buy");
                        $("#buyAId").addClass("bespoke disabled");
                    }
                    if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                        $("#fastBuy").attr("href", "javascript:;");
                        $("#buyAId").attr("href", "javascript:;");
                    }
                    buyDom.val(1)
                    Msg.Alert("","库存不足，请减少库存尝试",function(){});
                }
            };
            if (!/^\d{1,7}$/.test(buyNum)) {
                if(buyNum > buyDom.data('max')) {
                    Msg.Alert("","库存不足，请减少库存尝试",function(){});
                    buyNum = buyDom.data('max');
                    buyDom.val(buyNum)
                } else {
                    buyNum = 1;
                }
            } else if( buyNum <= 1 ) {
                buyNum = 1;
            }
            var url = '/front/product/hasProduct',
                postData = {
                    "region": region, //5
                    "areaUuid": areaUuid, //3
                    "skuNo": skuNo, //1
                    "buyNum": buyNum, //4
                    "bcustomerUuid": '', //7
                    "bType": bType,  //6
                    "parentSkuNo": parentSkuNo, //2
                    "time": Math.random(),
                    "reservePromotionUuid":globalField.reservePromotionUuid //预售校验库存
                };
            if(globalField.__skuNo__ && globalField.promotionUuid) { //查秒杀库存
                url = '/front/product/hasLimitProduct';
                postData = {
                    "region": region, //5
                    "areaUuid": areaUuid, //3
                    "skuNo": skuNo, //1
                    "buyNum": buyNum, //4
                    "bType": bType,  //6
                    "provinceId": provinceId,
                    "promotionUuid": globalField.promotionUuid,
                    "cityId": cityId,
                    "parentSkuNo": parentSkuNo, //2
                    "time": Math.random()
                }
            };
            $http.post({
                url: url,
                data: postData,
                success: function(data) {
                    var result = data.retData;
                    if (data.code == 0) {
                        //判断是否可售
                        var activeStatus = globalField.activeStatus,
                            preSaleType = globalField.preSaleType;
                        //取消预定购买限制
                       // preSaleType == 2 ? buyDom.attr('disabled', true) : '';
                        if (result.hasProduct) {
                            if (result.canBuy) {
                                buyDom.data('max', data.retData.totalNum);
                                if(data.retData.totalNum && buyNum > data.retData.totalNum) {
                                    Msg.Alert("","库存不足，请减少库存尝试",function(){});
                                }
                                $("#isProduct").html("有货");
                                $("#buyAId").removeClass("bespoke disabled");
                                if (!globalField.__skuNo__ && !globalField.promotionUuid) {
                                    getAddress.changeButton(activeStatus, preSaleType)
                                } else {
                                    //秒杀
                                    $("#buyNum").val(1)
                                }
                                $("#buyAId").addClass("buy");
                                if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                                    $("#fastBuy, #fixedFastBuy").removeClass("fastBuyDisabled");
                                    $("#fastBuy, #fixedFastBuy").attr("disabled", false);
                                    //$("#fastBuy, #fixedFastBuy").attr("href", "javascript:toFastBuy();");
                                    //$("#buyAId").attr("href", "javascript:goTOBuy();");
                                }
                                if (showTypedisp == "reserve") {
                                    //$("#buyAId").attr("href", "javascript:submitPreSaleTOBuy();");
                                    $("#fastBuy, #fixedFastBuy").removeClass("fastBuyDisabled");
                                    $("#fastBuy, #fixedFastBuy").attr("disabled", false);
                                    // $("#fastBuy, #fixedFastBuy").attr("href", "javascript:submitPreSaleTOBuy();");
                                }
                            } else {
                                $("#isProduct").html("商品不在该销售区域内");
                                $("#buyAId").attr("href", "javascript:;");
                                $("#buyAId").addClass("bespoke disabled");
                                $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                                $("#fastBuy, #fixedFastBuy").attr("disabled", true);
                                $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                                if (showTypedisp != "subscribe") {
                                    $("#buyAId").removeClass("buy");
                                    $("#buyAId").addClass("bespoke");
                                }
                                if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                                    //$("#fastBuy").attr("href", "javascript:;");
                                }
                            }
                        } else {
                            noProduct(data)
                        };

                        if($.isFunction(cb)) cb();

                        /*if (result.canBuy) {
                         if(result.hasProduct) {
                         $("#isProduct").html("有货");
                         $("#buyAId").removeClass("bespoke");
                         if(!globalField.__skuNo__ && !globalField.promotionUuid) {
                         getAddress.changeButton(activeStatus, preSaleType)
                         }
                         }else {
                         noProduct();
                         }
                         $("#buyAId").addClass("buy");
                         if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                         $("#fastBuy, #fixedFastBuy").removeClass("fastBuyDisabled");
                         $("#fastBuy, #fixedFastBuy").attr("disabled", false);
                         //$("#fastBuy, #fixedFastBuy").attr("href", "javascript:toFastBuy();");
                         //$("#buyAId").attr("href", "javascript:goTOBuy();");
                         }
                         if (showTypedisp == "reserve") {
                         //$("#buyAId").attr("href", "javascript:submitPreSaleTOBuy();");
                         $("#fastBuy, #fixedFastBuy").removeClass("fastBuyDisabled");
                         $("#fastBuy, #fixedFastBuy").attr("disabled", false);
                         // $("#fastBuy, #fixedFastBuy").attr("href", "javascript:submitPreSaleTOBuy();");
                         }
                         } else {
                         $("#isProduct").html("商品不在该销售区域内");
                         $("#buyAId").attr("href", "javascript:;");
                         $("#buyAId").addClass("bespoke disabled");
                         $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                         $("#fastBuy, #fixedFastBuy").attr("disabled", true);
                         $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                         if (showTypedisp != "subscribe") {
                         $("#buyAId").removeClass("buy");
                         $("#buyAId").addClass("bespoke");
                         }
                         if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                         //$("#fastBuy").attr("href", "javascript:;");
                         }
                         }
                         } else {
                         noProduct()
                         }*/
                    }
                }
            })
        },
        //获取套装
        getProductRelSuit: function(productUuid, regionId) {
            $http.post({
                url:'/front/product/getSuitMainByRegion',
                data:{
                    productUuid:_UUID,
                    regionId:regionId
                },
                success: function (data) {
                    var  dom = $("#suitList");
                    globalField.Suit = data.retData; /*储存套装列表内容*/
                    if(globalField.Suit!=''){
                        dom.show();
                    }
                    if(data.code == '1' && data.retData.length>0) {
                        var tpl = '<div class="sale">'
                            +'      <ul class="sale-tit">'
                            +'          {@each retData as suit , index}'
                            +'                   <li suitUuid="${suit.uuid}" class="item ${index ==0?"active":"" }">${suit.name}</li>'
                            +'          {@/each}'
                            +'      </ul>'
                            +'      <div class="sale-pro">'
                            +'             $${retData| setDom}'
                            +'      </div>'
                            +'  </div>';

                        var setDom = function (suit) {
                            var html ='';
                            $.each(suit, function (i, o) {
                                var isShowDefalut = 0, defaultUuid='', storeUuid='';
                                    html +=' <div class="suit-item">'
                                        $.each(o.suitProductRellist, function(n,co) { //suitProductRel
                                            html +='<input type="hidden" suitUuid="'+o.uuid+'" class="suitproductskuno" value="'+co.skuNo+'" parentSkuNo="'+co.parentSkuNo+'" />'
                                            if(isShowDefalut ==0 && (globalField.productUuid == co.productUuid || data.productUuid == co.productUuid)) {
                                                html+='<div class="sale-item">'
                                                    +'   <img style="width: 140px ; height: 140px" src="'+co.productSkuListModel.smallImg+'" />'
                                                    +'   <p class="name">'+co.productSkuListModel.productName+'</p>'
                                                    +'      <strong class="price">'+co.productSkuListModel.price+'元'
                                                    +'          <font class="suitSplitError" skuNo="'+co.skuNo+'"></font>'
                                                    +'      </strong>'
                                                    +'</div>'
                                                isShowDefalut =1; defaultUuid = co.uuid
                                            }
                                            storeUuid = co.storeUuid;
                                        });
                                        html+='<div class="sale-item sale-add">'
                                            +'  <span class="sale-plus"></span>'
                                            +'</div>'
                                        $.each(o.suitProductRellist, function(m,so) {//suitProductRel
                                            if(!so.buyNum) so.buyNum = 1;//如套装默认购买数量不存在则设置为0;
                                            if(defaultUuid != so.uuid) {
                                                html+=' <div class="sale-item">'
                                                    +'     <a href="/pages/productDetail/productDetail.html?uuid='+so.productUuid+'"><img style="width: 140px ; height: 140px" src="'+so.productSkuListModel.smallImg+'" /></a>'
                                                    +'     <p class="name">'+so.productSkuListModel.productName+'</p>'
                                                    +'      <strong class="price">'+so.productSkuListModel.price+'元'
                                                    +'          <font class="suitSplitError" skuNo="'+so.skuNo+'"></font>'
                                                    +'      </strong>'
                                                    +'</div>'
                                            }

                                        });
                                        html+='   <div class="sale-item sale-add fr">'
                                            +'      <p class="sale-text">商品搭配优惠</p>'
                                            +'      <p class="sale-text">套装价</p>'
                                            +'      <p class="sale-text font24">'+o.totalAmount+'<strong>元</strong></p>'
                                            +'      <p><s>'+o.costAmount+'<strong>元</strong></s></p>'
                                            +'      <button class="buy fastBuyDisabled buySuitBtn" index="'+i+'" storeUuid="'+storeUuid+'" suitUuid="'+o.uuid+'">立即购买</button>'
                                            +'    </div>'
                                            +' </div>';
                            });
                            return html;
                        };
                        juicer.register('setDom', setDom)
                        var html=juicer(tpl,data);
                        dom.html(html);
                        var saleTit = $(".sale-tit li"),
                            salepro = $(".sale-pro .suit-item");
                        salepro.hide();
                        $.each(saleTit, function(i, o) {
                            salepro.eq(0).show();
                            $(this).on('mouseover', function () {
                                saleTit.removeClass("active");
                                salepro.hide();
                                $(this).addClass("active");
                                salepro.eq(i).show();
                            })
                        });
                        getAddress.hasSuitProduct(data.retData);
                        $(".buySuitBtn").click(function () {
                            var suitUuid = $(this).attr("suitUuid"),
                                index = $(this).attr("index"),
                                suit = globalField.Suit, //套装
                                areaUuid = $("#areaUuid").val(); //有字段 乡镇
                            var currentList = suit[index],
                                arrMap = [];

                            var shoppingcart= $Store.get('shoppingcart')
                            if(shoppingcart ) {
                                var res = JSON.parse(shoppingcart);
                                if(globalField.storeUuid == '') {}
                                var arr = res.storeMap[globalField.localStoreId];
                                param.storeMap[globalField.localStoreId] = arr;
                            }else{
                                param.storeMap[globalField.localStoreId] = [];
                            }

                            //{"productUuid":globalField.productUuid,"buyNum":buyNum,"skuNo":globalField.skuNo}
                            /*
                            * if(o.isSuitMain>=0 && o.productUuid == o.productSkuListModel.productUuid) {
                             stSize = parseInt(o.buyNum) + 1;
                             o.buyNum = stSize;
                            * */

                            if (!Array.prototype.map) {
                                Array.prototype.map = function(callback, thisArg) {
                                    var T, A, k;
                                    if (this == null) {
                                        throw new TypeError(" this is null or not defined");
                                    }
                                    var O = Object(this);
                                    var len = O.length >>> 0;
                                    if (Object.prototype.toString.call(callback) != "[object Function]") {
                                        throw new TypeError(callback + " is not a function");
                                    }
                                    if (thisArg) {
                                        T = thisArg;
                                    }
                                    A = new Array(len);
                                    k = 0;
                                    while(k < len) {
                                        var kValue, mappedValue;
                                        if (k in O) {
                                            kValue = O[ k ];
                                            mappedValue = callback.call(T, kValue, k, O);
                                            A[ k ] = mappedValue;
                                        }
                                        k++;
                                    }
                                    return A;
                                };
                            }
                            //修正套装bug

                            var listMap = {};
                            var dicMap = {};
                            param.storeMap[globalField.localStoreId].map(function (ele, index, arr) {
                                dicMap[ele.productUuid] = arr[index];
                                arrMap.push(ele.suitUuid)
                            });
                            currentList.suitProductRellist.map(function (ele, index, arr) {
                                listMap[ele.productUuid] = arr[index]
                            });

                            if(param.storeMap[globalField.localStoreId].length <2) {
                                $.each( currentList.suitProductRellist, function(i, o) {
                                    param.storeMap[globalField.localStoreId].push({
                                        "suitUuid":o.suitUuid,
                                        "buyNum":o.buyNum ,
                                        "attrId": o.skuNo,
                                        "isSuitMain":o.isSuitMain,
                                        "distributorUuid":'',
                                        "productUuid":o.productUuid,
                                        "storeUuid": o.storeUuid,
                                        "type": "01",
                                        "opeTime":new Date().getTime()
                                    });
                                });
                            } else {
                                param.storeMap[globalField.localStoreId].map(function (ele, index , arr) {
                                    if(listMap[ele.productUuid] && listMap[ele.productUuid].suitUuid == ele.suitUuid) {
                                        ele.buyNum = parseInt(ele.buyNum) +1;
                                    }else {
                                        if(currentList.suitProductRellist[index] ) {
                                            if($.inArray( currentList.suitProductRellist[index].suitUuid, arrMap ) == -1) {
                                                param.storeMap[globalField.localStoreId].push({
                                                    "suitUuid":currentList.suitProductRellist[index].suitUuid,
                                                    "buyNum":currentList.suitProductRellist[index].buyNum ,
                                                    "attrId": currentList.suitProductRellist[index].skuNo,
                                                    "isSuitMain":currentList.suitProductRellist[index].isSuitMain,
                                                    "distributorUuid":'',
                                                    "type": "01",
                                                    "storeUuid":currentList.suitProductRellist[index].storeUuid,
                                                    "productUuid":currentList.suitProductRellist[index].productUuid,
                                                    "opeTime":new Date().getTime()
                                                })
                                            }

                                        }
                                    }
                                });
                            }

                            $http.post({
                                url:'/front/product/addSuitProductToCartKuyu',
                                data:{
                                    suitUuid:suitUuid,
                                    buyNum:1,
                                    distributorUuid:'',
                                    mainProductUuid:globalField.productUuid,
                                    mainSkuNo:globalField.skuNo,
                                    areaUuid:areaUuid,
                                },
                                success: function(data) {
                                    if(data.code == CODEMAP.status.success) {
                                        $init.nextPage('cart',{})
                                    } else{
                                        $Store.set('shoppingcart',JSON.stringify(param));
                                        $init.nextPage('cart',{})
                                    }
                                }
                            })
                        });
                    }
                }
            })
        },
        //抢购
        getPromotionsByProvince: function(checkProvinceId) {
            try {
                if ($("#dv_promotion_gift").length == 0) {
                    return;
                }
                var productUuid = $("#productUuid").val();
                var skuNo = "";
                var privonceId = checkProvinceId;
                var cityUuid = "";
                var regionUuid = "";
                var areaUuid = "";
                var showTypedisp = $("#showTypedisp").val();
                var preSaleType = $("#preSaleType").val();
                $http.get("/front/product/getPromotionsByProductUuid", {
                        "productUuid": productUuid,
                        "privonceId": privonceId,
                        "time": Math.random()
                    },
                    function(data) {
                        var promotionName = data.promotion.name;
                        var promotionTag = data.promotion.promotionTag;
                        var promotionPrice = data.promotion.price;
                        var promotionEnum = data.promotion.promotionEnum;
                        var productSkuPrice = data.productPrice;
                        var promotions = data.promotion.promotions;
                        var startTime = data.startime;
                        var endtime = data.endtime;
                        var firstCost = data.firstCost;
                        var promotion_gift_html = "";
                        var title_promotion_html = "";
                        var title_promotion_tag = "";
                        if ($("#showPromotionTag")) {
                            $("#showPromotionTag").remove();
                        }
                        if ($("#showPromotionTime")) {
                            $("#showPromotionTime").remove();
                        }
                        for (var j = 0; j < promotions.length; j++) {
                            for (var i = 0; i < promotions[j].productGift.length; i++) {
                                promotion_gift_html += '<div class="m_gift"><span class="f_color1 m_sapn_box">' + promotions[j].name + '</span><a href="/front/product/toProduct/+promotions[j].productGift[i].productUuid+ target=_blank" >' + promotions[j].productGift[i].productName + '</a></div>';
                            }
                        }
                        $("#dv_promotion_gift").html(promotion_gift_html);
                        if (promotionName != '' && promotionName != undefined && promotionName != 'undefined') {
                            title_promotion_html += '<div class="m_presell"><span style="background: #ec3a2c; display: inline-block; padding:0 10px;">' + promotionName + '</span></div>';
                        }
                        $("#promotionNameHtml").html(title_promotion_html);
                        if (promotionTag != '' && promotionTag != undefined && promotionTag != 'undefined') {
                            title_promotion_tag += '<li id="showPromotionTag">'
                            title_promotion_tag += '<span class="dt">';
                            title_promotion_tag += ' 促销信息';
                            title_promotion_tag += '</span>';
                            title_promotion_tag += '<div class="dd">';
                            title_promotion_tag += '<div class="m_presell" style="display: inline-block;"><span style="background: #ec3a2c; color: #fff; display: inline-block; padding:0 5px;">' + promotionTag + '</span></div>';
                            title_promotion_tag += '</div>';
                            title_promotion_tag += '</li>';
                        }
                        //限时抢购开始时间和结束时间
                        if (promotionEnum == '2') {
                            title_promotion_tag += '<li id="showPromotionTime">'
                            title_promotion_tag += '<span class="dt">';
                            title_promotion_tag += ' 活动时间';
                            title_promotion_tag += '</span>';
                            title_promotion_tag += '<div class="dd">';
                            title_promotion_tag += '<span class="y_mr10">' + startTime + '至' + endtime + '</span>';
                            title_promotion_tag += '</div>';
                            title_promotion_tag += '</li>';
                        }
                        $(".y_sendareabx").after(title_promotion_tag);
                        if (parseFloat(promotionPrice) != parseFloat(productSkuPrice)) {
                            var showStorePricehtml = "<p class=\"y_delete_price\">原价 RMB " + productSkuPrice + "元</p>";
                            showStorePricehtml += "<p class=\"y_price\" id=\"priceBuy\">RMB " + promotionPrice + "元</p>";
                            showStorePricehtml += "开始抢购";
                            $("#showStorePrice").html(showStorePricehtml);
                        } else {
                            var allShowStorePrice = "<p class=\"y_price\" id=\"priceBuy\">RMB " + promotionPrice.toFixed(1) + "元</p>";
                            if (showTypedisp !== "reserve") {
                                allShowStorePrice += "开始抢购";
                            }
                            if (showTypedisp == "reserve") {
                                if (preSaleType == "2") {
                                    allShowStorePrice += "<p>定金 RMB  " + firstCost.toFixed(1) + "元</p>";

                                }
                            }
                            $("#showStorePrice").html(allShowStorePrice);
                        }
                    });

            } catch (e) {}
        },
        //地区选择，筛选套装活动
        /*getSuitMainByRegion: function(regionId) {
            var productUuid = $("#productUuid").val();
            getAddress.getProductRelSuit(productUuid, regionId);
        },*/
        //检查套装商品库存
        hasSuitProduct: function(data) {
            var region = $("#region").val();   //有字段 县
            var areaUuid = $("#areaUuid").val(); //有字段 乡镇
            var skuNo = globalField.skuNo; //有字段
            var parentSkuNo = globalField.parentSkuNo; // 套装主商品SKU
            var showTypedisp = globalField.showTypedisp; //有字段
            var buyNum = $("#buyNum").val();
            var map =  Map;
            var mapUid =  Map2;
            $.each(data, function(i, o) {
                var subSuit = o.suitProductRellist;
                mapUid.put(o.uuid, o.uuid);
                $.each(subSuit, function (i, o) {
                    map.put(o.skuNo,o.skuNo);
                });
            });

            var arr = map.values();
            var arrUid = mapUid.values();
            $.each(arr, function (i, o) {
                $http.post({
                    url: "/front/product/hasProduct",
                    data: {
                        "region": region, //5
                        "areaUuid": areaUuid, //3
                        "skuNo": o, //1
                        "buyNum": buyNum, //4
                        "bcustomerUuid": '', //7
                        "bType": bType,  //6
                        "parentSkuNo": parentSkuNo, //2
                        "time": Math.random(),
                        "reservePromotionUuid":globalField.reservePromotionUuid //预售校验库存
                    },
                    success: function(data) {
                        if(data.code == 0 ) {
                            if(data.retData && data.retData.canBuy) {
                                $(".buySuitBtn[suituuid='"+arrUid[i]+"']").removeClass("fastBuyDisabled");
                            } else {
                                $(".suitSplitError[skuNo='" + o + "']").text("(无货)");
                                $(".buySuitBtn[suituuid='"+arrUid[i]+"']").addClass("fastBuyDisabled");

                                $(".buySuitBtn").off("click");
                                return false;
                            }
                        }else{
                            $(".suitSplitError[skuNo='" + o + "']").text("(无货)");
                            $(".buySuitBtn[suituuid='"+arrUid[i]+"']").addClass("fastBuyDisabled");
                            $(".buySuitBtn").off("click");
                            return false;
                        }
                    }
                })
            })
        },
        //套装商品逻辑
        goTOBuySuit: function() {
            var activeLi = $(".productDetailSuitList .sale-tit li.active");
            var suitUuid = activeLi.attr("suitUuid");
            var colorItem = $("#colorItem").html();
            var sizeItem = $("#sizeItem").html();
            var provinceId = "1";
            if ($("#provinceId").val()) {
                provinceId = $("#provinceId").val();
            }
            var areaUuid = $("#areaUuid").val();
            var skuNo = $("#skuNo").val();
            var buyNum = $("#buyNum").val();

            //window.location.href = "/tclcart/addSuitProductToCartKuyu?suitUuid=" + suitUuid + "&mainProductUuid=" + productUuid + "&mainSkuNo=" + skuNo + "&buyNum=" + buyNum + "&areaUuid=" + areaUuid + "&distributorUuid=&activityUuid=";
        },
        //显示默认的区域地址
        updateAddressMsg: function(){
            var province =$("#provincetitle").html();
            var city =$("#citytitle").html();
            var region =$("#regiontitle").html();
            var street =$("#streettitle").html();
            $("#selectAreaNameId").html(province+" "+city+" "+region+" "+street).attr("title", province+" "+city+" "+region+" "+street);



            //详情页选择地区弹出框
            $(".y_sendarea .y_areasure").hover(function() {
                $(this).parents(".y_sendarea").addClass("y_aretive");
            });

            $(".y_arelose").click(function() {
                $(this).parents(".y_sendarea").removeClass("y_aretive");
            });

            $(".m_areabox .mt .tab li").click(function() {
                var x = $(this).index(".m_areabox .mt .tab li");
                $(this).addClass("hover").siblings().removeClass("hover");
                $(".m_areabox .mc").eq(x).show().siblings(".m_areabox .mc").hide();
            });

            $(document).on("click", function() {
                $(".y_sendarea").removeClass("y_aretive");
            });

            $(".m_areabox").click(function(event) {
                event.stopPropagation();
            });
        }
    };
    var inputAdd = {
        addBuyNum: function () {
            if(globalField.__skuNo__ && globalField.promotionUuid) {
                return;
            } else {
                var num = parseInt($("#buyNum").val());
                if(num >= 999) {
                    Msg.Alert("","超过购买上限",function(){});
                    return;
                }
                $("#buyNum").val(num + 1);
                getAddress.hasProduct();
            }
            //if(globalField.preSaleType == '2') {return;}
        },
        reduceBuyNum: function () {
            if(globalField.__skuNo__ && globalField.promotionUuid) {
                return;
            } else {
                var num = parseInt($("#buyNum").val());
                if (num <= 1) {
                    $("#buyNum").val(1);
                    return;
                }
                num -= 1;
                $("#buyNum").val(num);
                getAddress.hasProduct();
            }
        },
        changeBlur: function (e) {
            getAddress.hasProduct(function () {
                if(globalField.activeStatus =='status2') {
                    return;
                }else {
                    var self = $(e),
                        _val = self.val();
                    if (!/^[0-9]{1,3}$/.test(_val)) {
                        if(/^\d+$/.test(_val)) {
                            self.val(self.data('max')?(self.data('max')>999 ? 999 : self.data('max')>999 ):1);
                        } else {
                            self.val(1);
                        }
                    } else if(/\d+/.test(_val) && self.val() <1 ) {
                        self.val(1);
                    }
                }
            });
            // if(globalField.preSaleType == '2') {//付定金 $(e).val(1)  }
        }
    }

    getProductDetail(_UUID);


    //保存用户点击的地址
    (function(){
        var add = {};
        if(sessionStorage.getItem("buyNum")){
            var num = JSON.parse(sessionStorage.getItem("buyNum"))
            $("#buyNum").val(num);
        }
        if(localStorage.getItem("add")){
            var add = JSON.parse(localStorage.getItem("add"));
        }
        $("#provinces").on("click","li",function(){
            add.province = $(this).attr("provinceliid");
        })
        $("#citys").on("click","li",function(){
            if(add.province){
                add.city = $(this).attr("cityliid");
            }
        })
        $("#regions").on("click","li",function(){
            if(add.city){
                add.region = $(this).attr("regionliid");
            }
        })
        $("#streets").on("click","li",function(){
            if(add.region){
                add.street = $(this).attr("streetliid");
            }
            localStorage.setItem("add",JSON.stringify(add));
            //用户选中地址后刷新页面，可能存在套装和其他信息
            var buyNum = $("#buyNum").val();
            sessionStorage.setItem("buyNum",JSON.stringify(buyNum))
            window.location.reload();

        })
    })();



    //页面滚动fixed-buy和详情tab
    $(window).on('scroll', function(){
        var scrollTop =  document.documentElement.scrollTop || document.body.scrollTop;
        var detaiT = $('.light-gray').offset().top - $('.fixed-buy').height();
        if(detaiT<scrollTop){
            var detaiTop = scrollTop - detaiT + 'px';
            $('.fixed-buy').css({'margin-top': '0px'});
            $('.details-r').show().css({'top': detaiTop});
        }
        else{
            $('.fixed-buy').css({'margin-top': '-60px'});
            $('.details-r').hide().css({'top': '0px'});
        }
    })


    //页面滚动固定条价格信息
    function getFixedPrice(data){
        var html = "";
        try{
            html += '<div class="fl">'+
                    '<span>'+data.productModel.productMain.productSn + '</span>&nbsp;&nbsp;';
            //reserve => 预定
            if(data.showType && data.showType !='reserve' && data.showType !='subscribe'){
                html += '<strong class="red">' +data.productSkuPrice.toFixed(2)+'元</strong>';
            }
            //促销，预约，尾款
            if(data.showType && data.showType == "reserve" && data.preSale && data.preSale.type &&data.preSale.type == "2"){
                html += '<strong class="red">' +data.preSale.firstCost.toFixed(2)+'元</strong>';
            }else if(data.promotionUuid){//秒杀
                html += '<strong class="red">' +data.front.priceAndPromotion.price.toFixed(2)+'元</strong>';
            }
            else{
                html += '<strong class="red">' +data.productSkuPrice.toFixed(2)+'元</strong>';
            }
            html += '</div>';
            $(".fixed-box").prepend(html);
        }catch(e){
            throw e;
        }

        //规格参数显示tab
        if(data.productAttribute){
            $("#checkIfProductAttribute").show();
        }else{
            $("#checkIfProductAttribute").hide();
        }



    }

    //产品详情图片
    function getProductImg(res) {
        var descriptHtml="";
        try {
            descriptHtml = res.productModel?res.productModel.productDescription.description:'无产品详情数据';
            var doms = $(descriptHtml);

            $.each(doms.find("img"), function (i, o) {
                $(this).attr("data-original",$(this).attr("src"));
                $(this).attr("src", "../../app/images/lazy.png");
            });
            $("#details-l").html(doms);

            $("#details-l img").lazyload({
                placeholder : "../../app/images/lazy.png", //用图片提前占位
                threshold :180,
                effect: "fadeIn"
            });

            policy(res.secondParentCategoryName);
            getCommonProblems(res.secondParentCategoryName);
            productInfoScroll(descriptHtml, res.secondParentCategoryName);
        }catch (e) {
            throw  e;
        }
    }

    //加载左上角图片
    function loadLeftImg(data){
        var mb = data.productModel.productImage;
        var ms = data.productModel.productMultiImage
        var html="";
        if (data.showType=='subscribe'){
            html+='<div class="badge">预约</div>'
        }
        if (data.showType=='reserve'){
            html+='<div class="badge">预售</div>'
        }
        if(data.front !=null && data.front.priceAndPromotion.promotionInteactiveModel && data.front.priceAndPromotion.promotionInteactiveModel.promotionTypes) {
            if( data.front.priceAndPromotion.promotionInteactiveModel.promotionTypes[0] == '5') {
                if(data.front.priceAndPromotion.name){
                    html+='<div class="badge">'+data.front.priceAndPromotion.name+'</div>'
                }
            }
        }
        html+="<div class='purc-img'>";
        if(mb.bigImageUrl || mb.smallImageUrl){
            var loading = KUYU.Init.getBasePath().baseUrl+'images/loading.gif';
            var imgDom = '<div class="item active" style="text-align: center;line-height: 400px;"><img id="bigImgSrc"  src="'+ loading +'"></div>'
            html+= imgDom;
        }
        if(ms.length>0){
            for (var i = 0; i < ms.length; i++) {
                var image = ms[i];
                html+='<div class="item"><img src="'+image.bigImageUrl+'"></div>';
            }
        }
        html+='</div><div class="purc-list">';
        if(mb.smallImageUrl){
            html+='<span class="radius active"><img src="'+mb.smallImageUrl+'"></span>';
        }
        if(ms.length>0){
            for (var i = 0; i < ms.length; i++) {
                var image = ms[i];
                html+='<span class="radius" ><img src="'+image.bigImageUrl+'"></span>';
            }
        }

        html+="</div>";

        $(".purc-l").html(html);
        var img = new Image(),
            imgSrc = (mb.bigImageUrl ? mb.bigImageUrl : mb.smallImageUrl ),
            bigImgSrc = $("#bigImgSrc");
        img.src = imgSrc;
        img.onload = function () {
           bigImgSrc.attr("src", imgSrc );
        };

        function ImgShow() {
            var purc = $(".purc-img .item"), radius = $(".purc-list .radius ");
            $.each(radius, function(i, o) {
                $(this).on('click', function(e) {
                    radius.removeClass("active");
                    purc.removeClass("active")
                    $(this).addClass("active");
                    purc.eq(i).addClass("active")
                })
            })
        };ImgShow();
    }

    //检查商品收藏状态
    function checkFavourState(productUuid) {
        $http.get({
            url: "/front/product/getProductFavourState",
            data: {
                productUuid: productUuid,
                ranNum:Math.ceil(Math.random()*100000)
            },
            success: function(data) {
                var state = data.retData;
                if(state)state = state.favoriteState;
                if (data.code== CODEMAP.status.success){
                    if(state=="1"){
                        $(".purc-start").html('<em class="active">&#xe636;</em>取消收藏');
                    }else{
                        $(".purc-start").html('<em class="">&#xe636;</em>收藏');
                    }
                }
                $(".purc-start").attr({
                    "data-uuid": productUuid,
                    "onclick": "KUYU.setCollect('"+productUuid+"','"+ state+"','"+data.code+"')"
                });

            }
        })
    }
    /**
     * 设置收藏
     * @param {uuid} string 产品uuid
     * @param {type} string 收藏状态 1:已经收藏状态
     * @param {code} string 判断是否登录
     * */
    KUYU.setCollect = function (uuid, type, code) {
        var st =  $(".purc-start"),
            cid = st.data('cid');
        if(code == CODEMAP.status.success) {
            if(cid == undefined) {
                changeState(type)
            }else {
                changeState(cid)
            }
        } else {
            Msg.Alert("","请登录",function(){
                window.location.href = "{{login}}"
            });
        }

        function changeState(type) {
            if(type == 1 ) {
                toFetch('/front/product/cancelFavorite', function (res) {
                    if (res=='1') {
                        st.data('cid','2')
                        st.find('em').removeClass('active');
                        st.html('<em class="">&#xe636;</em>收藏');
                    }
                });
            } else {
                toFetch('/front/product/collectProduct', function (res) {
                    if (res == "1"||res=="3") {
                        st.html('<em class="active">&#xe636;</em>取消收藏');
                        st.data('cid','1')
                    }
                });
            };
        }
        function toFetch( url, cb ) {
            $http.get({
                url: url,
                data:{
                    productUuid: uuid,
                    ranNum:Math.random()
                },
                success: function (res) {
                    cb(res);
                },
                error: function (e) {
                    throw e;
                }
            })
        }
    };

    //wap链接的二维码图片赋值
    function makeQrCode(productUuid){
        $http.post({
            url: "/front/product/createQrCode",
            data:{
                productUuid:productUuid,
                ranNum:Math.random()
            },
            success: function(res) {
                $(".pQrCode").each(function(k, v) {
                    v.src = res.retData;
                });
            }
        });
    }

    //常见问题解答
    function getCommonProblems(secondParentCategoryName){
        if (',3800,5800,6800,7800,8800,9700,9500,电视周边,大家电,电视,'.indexOf(secondParentCategoryName) > -1 ) {
            var str = "neigoudianshiwenti";
            ajaxProblems(str,secondParentCategoryName)
        }
        if ('手机,智能穿戴,平板电脑,么么哒手机,TCL手机,手机周边,自拍杆,耳机,充电宝,'.indexOf(secondParentCategoryName) > -1) {
            var str = "neigoushoujiwenti";
            ajaxProblems(str,secondParentCategoryName)
        }

        if (',空调,定频,变频,'.indexOf(secondParentCategoryName) > -1) {
            var str = "neigoukongtiaowenti";
            ajaxProblems(str,secondParentCategoryName)
        }
        if ('冰箱'.indexOf(secondParentCategoryName) > -1) {
            var str = "neigoubingxiangwenti";
            ajaxProblems(str,secondParentCategoryName)
        }
        if ('洗衣机'.indexOf(secondParentCategoryName) > -1) {
            var str = "neigouxiyijiwenti";
            ajaxProblems(str,secondParentCategoryName)
        }
        if (',健康电器,小家电,扫地机器人,空气净化器,净水机,除湿机,厨房电器,'.indexOf(secondParentCategoryName) > -1) {
            var str = "neigouxiaojiadianwenti";
            ajaxProblems(str,secondParentCategoryName)
        }
    }

    //常见问题请求
    function ajaxProblems(str,secondParentCategoryName){
        $("#question .procuct_title").html(secondParentCategoryName+'常见问题');
        $(function(){
            $http.get({
                url:"/front/product/getCommonProblems",
                data:{
                    contentId:str,
                    ranNum:Math.random()
                },
                success:function(res){
                    if(res){
                        if (res.retData) {
                            if(res.retData.introduction){
                                $("#questionitem").html(res.retData.introduction);
                            }
                        }
                    }
                }
            })
        })
    }

    //服务政策
    function policy(secondParentCategoryName){
        if (',3800,5800,6800,7800,8800,9700,9500,电视周边,大家电,电视,'.indexOf(secondParentCategoryName) > -1 ) {
            html = '';
            html = '<ul class="y_servicetab">'+
                '   <li>物流配送</li>'+
                '   <li class="active">商品签收</li>'+
                '   <li>产品安装</li>'+
                '   <li>发票</li>'+
                '   <li>售后服务</li>'+
                '</ul>'+
                '<div class="y_sercecontent">'+
                '<div class="y_sercepane wuliu"></div>'+
                '<div class="y_sercepane active qianshou"></div>'+
                '<div class="y_sercepane anzhuang"></div>'+
                '<div class="y_sercepane fapiao"></div>'+
                '<div class="y_sercepane shouhou"></div></div>';

            $("#policy").html(html);


            //请求数据
            $(document).ready(function() {
                var url = "/front/product/getServicePolicies";
                var wuliu = "neigoudianshiwuliu";
                var qianshou = "neigoudianshiqianshou";
                var anzhuang = "neigoudianshianzhuang";
                var fapiao = "neigoudianshifapiao";
                var shouhou = "neigoudianshishouhou";
                $http.get({
                    url:url,
                    data:{
                        wuliu: wuliu,
                        qianshou: qianshou,
                        anzhuang: anzhuang,
                        fapiao: fapiao,
                        shouhou: shouhou,
                        ranNum: Math.random(),
                    },
                    success:function(res) {
                        if (res) {
                            $(".wuliu").html(res.wuliu);
                            $(".qianshou").html(res.qianshou);
                            $(".anzhuang").html(res.anzhuang);
                            $(".fapiao").html(res.fapiao);
                            $(".shouhou").html(res.shouhou);
                        }
                    },

                })
            })
        }


        if ('手机,智能穿戴,平板电脑,么么哒手机,TCL手机,手机周边,自拍杆,耳机,充电宝,'.indexOf(secondParentCategoryName) > -1) {
            html = '';
            html = '<ul class="y_servicetab">'+
                '    <li>物流配送</li>  ' +
                '    <li class="active">商品签收</li>'+
                '    <li>资源下载</li>'+
                '    <li>发票</li>'+
                '    <li>售后服务</li>'+
                '</ul>'+
                '<div class="y_sercecontent"><div class="y_sercepane wuliu"></div>'+
                '<div class="y_sercepane active qianshou"></div>'+
                '<div class="y_sercepane xiazai"></div>'+
                '<div class="y_sercepane fapiao"></div>'+
                '<div class="y_sercepane shouhou"></div></div>';
            $("#policy").html(html);
            $(document).ready(function() {
                var url =  "/front/product/getServicePolicies";
                var wuliu = "neigoushoujiwuliu";
                var qianshou = "neigoushoujiqianshou";
                var xiazai = "neigoushoujixiazai";
                var fapiao = "neigoushoujifapiao";
                var shouhou = "neigoushoujishouhou";
                $http.get({
                    url:url,
                    data:{
                        wuliu: wuliu,
                        qianshou: qianshou,
                        xiazai: xiazai,
                        fapiao: fapiao,
                        shouhou: shouhou,
                        ranNum: Math.random()
                    },
                    success:function(res) {
                        if (res) {
                            $(".wuliu").html(res.wuliu);
                            $(".qianshou").html(res.qianshou);
                            $(".fapiao").html(res.fapiao);
                            $(".shouhou").html(res.shouhou);
                            $(".xiazai").html(res.xiazai);
                        }
                    }
                })
            })
        }


        if (',空调,定频,变频,'.indexOf(secondParentCategoryName) > -1) {
            html = '';
            html =  '<ul class="y_servicetab">'+
                    '<li>物流配送</li>'   +
                    '<li class="active">商品签收</li>'+
                    '<li>产品安装</li>'+
                    '<li>发票</li>'+
                    '<li>售后服务</li>'+
                    '</ul>'+
                    '<div class="y_sercecontent"><div class="y_sercepane wuliu"></div>'+
                    '<div class="y_sercepane active qianshou"></div>'+
                    '<div class="y_sercepane anzhuang"></div>'+
                    '<div class="y_sercepane fapiao"></div>'+
                    '<div class="y_sercepane shouhou"></div></div>';
            $("#policy").html(html);
            $(document).ready(function() {
                var url = "/front/product/getServicePolicies";
                var wuliu = "neigoukongtiaowuliu";
                var qianshou = "neigoukongtiaoqianshou";
                var anzhuang = "neigoukongtiaoanzhuang";
                var fapiao = "neigoukongtiaofapiao";
                var shouhou = "neigoukongtiaoshouhou";
                $http.get({
                    url:url,
                    data:{
                        wuliu: wuliu,
                        qianshou: qianshou,
                        anzhuang: anzhuang,
                        fapiao: fapiao,
                        shouhou: shouhou,
                        ranNum: Math.random()
                    },
                    success:function(res) {
                        if (res) {
                            $(".wuliu").html(res.wuliu);
                            $(".qianshou").html(res.qianshou);
                            $(".anzhuang").html(res.anzhuang);
                            $(".fapiao").html(res.fapiao);
                            $(".shouhou").html(res.shouhou);
                        }
                    }
                })
            })
        }


        if ('冰箱'.indexOf(secondParentCategoryName) > -1) {
            html = '';
            html = '<ul class="y_servicetab">'+
                '    <li>下单支付</li>'+
                '    <li>物流配送</li>'   +
                '    <li class="active">商品签收</li>'+
                '    <li>产品安装</li>'+
                '    <li>发票</li>'+
                '    <li>售后服务</li>'+
                '</ul>'+
                '<div class="y_sercecontent"><div class="y_sercepane zhifu"></div>'+
                '<div class="y_sercepane wuliu"></div>'+
                '<div class="y_sercepane active qianshou"></div>'+
                '<div class="y_sercepane anzhuang"></div>'+
                '<div class="y_sercepane fapiao"></div>'+
                '<div class="y_sercepane shouhou"></div></div>';
            $("#policy").html(html);
            $(document).ready(function() {
                var url =  "/front/product/getServicePolicies";
                var wuliu = "neigoubingxiangwuliu";
                var qianshou = "neigoubingxiangqianshou";
                var anzhuang = "neigoubingxianganzhuang";
                var fapiao = "neigoubingxiangfapiao";
                var shouhou = "neigoubingxiangshouhou";
                var zhifu = "neigoubingxiangzhifu";
                $http.get({
                    url:url,
                    data:{
                        wuliu: wuliu,
                        qianshou: qianshou,
                        anzhuang: anzhuang,
                        fapiao: fapiao,
                        shouhou: shouhou,
                        zhifu:zhifu,
                        ranNum: Math.random()
                    },
                    success:function(res) {
                        if (res) {
                            $(".wuliu").html(res.wuliu);
                            $(".qianshou").html(res.qianshou);
                            $(".anzhuang").html(res.anzhuang);
                            $(".fapiao").html(res.fapiao);
                            $(".shouhou").html(res.shouhou);
                            $(".zhifu").html(res.zhifu)
                        }
                    }
                })
            })
        }

        if ('洗衣机'.indexOf(secondParentCategoryName) > -1) {
            html = '';
            html = '<ul class="y_servicetab">'+
                '    <li>下单支付</li>'+
                '    <li>物流配送</li>'   +
                '    <li class="active">商品签收</li>'+
                '    <li>产品安装</li>'+
                '    <li>发票</li>'+
                '    <li>售后服务</li>'+
                '</ul>'+
                '<div class="y_sercecontent"><div class="y_sercepane zhifu"></div>'+
                '<div class="y_sercepane wuliu"></div>'+
                '<div class="y_sercepane active qianshou"></div>'+
                '<div class="y_sercepane anzhuang"></div>'+
                '<div class="y_sercepane fapiao"></div>'+
                '<div class="y_sercepane shouhou"></div></div>';
            $("#policy").html(html);
            $(document).ready(function() {
                var url =  "/front/product/getServicePolicies";
                var wuliu = "neigouxiyijiwuliu";
                var qianshou = "neigouxiyijiqianshou";
                var anzhuang = "neigouxiyijianzhuang";
                var fapiao = "neigouxiyijifapiao";
                var shouhou = "neigouxiyijishouhou";
                var zhifu = "neigouxiyijizhifu";
                $http.get({
                    url:url,
                    data:{
                        wuliu: wuliu,
                        qianshou: qianshou,
                        anzhuang: anzhuang,
                        fapiao: fapiao,
                        shouhou: shouhou,
                        zhifu:zhifu,
                        ranNum: Math.random()
                    },
                    success:function(res) {
                        if (res) {
                            $(".wuliu").html(res.wuliu);
                            $(".qianshou").html(res.qianshou);
                            $(".anzhuang").html(res.anzhuang);
                            $(".fapiao").html(res.fapiao);
                            $(".shouhou").html(res.shouhou);
                            $(".zhifu").html(res.zhifu)
                        }
                    }
                })
            })
        }


        if (',健康电器,小家电,扫地机器人,空气净化器,净水机,除湿机,厨房电器,'.indexOf(secondParentCategoryName) > -1) {
            html = '';
            html = '<ul class="y_servicetab">'+
                '    <li>物流配送</li>   '+
                '    <li class="active">商品签收</li>'+
                '    <li>产品安装</li>'+
                '    <li>发票</li>'+
                '    <li>售后服务</li>'+
                '</ul>'+
                '<div class="y_sercecontent">'+
                '<div class="y_sercepane wuliu"></div>'+
                '<div class="y_sercepane active qianshou"></div>'+
                '<div class="y_sercepane anzhuang"></div>'+
                '<div class="y_sercepane fapiao"></div>'+
                '<div class="y_sercepane shouhou"></div></div>';
            $("#policy").html(html);
            $(document).ready(function() {
                var url = "/front/product/getServicePolicies";
                var wuliu = "neigouxiaojiadianwuliu";
                var qianshou = "neigouxiaojiadianqianshou";
                var anzhuang = "neigouxiaojiadiananzhuang";
                var fapiao = "neigouxiaojiadianfapiao";
                var shouhou = "neigouxiaojiadianshouhou";
                $http.get({
                    url:url,
                    data:
                    {
                        wuliu:wuliu,
                        qianshou:qianshou,
                        anzhuang:anzhuang,
                        fapiao:fapiao,
                        shouhou:shouhou,
                        ranNum:Math.random()
                    } ,
                    success:function(data){
                        if(data){
                            $(".wuliu").html(data.wuliu) ;
                            $(".qianshou").html(data.qianshou) ;
                            $(".anzhuang").html(data.anzhuang) ;
                            $(".fapiao").html(data.fapiao) ;
                            $(".shouhou").html(data.shouhou) ;
                        }
                    }
                });
            })
        }



        //服务政策tab
        var $li = $(".y_servicetab li");
        var len = $li.length;
        if (len > 0) {
            $li.width(1 / len * 100 + "%");
        }

        $(".y_servicetab li").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
            $(".y_sercecontent .y_sercepane").eq($(this).index()).addClass("active").siblings().removeClass("active");
        });


    }

    function productInfoScroll(descriptHtml) {
        $(window).scroll(function(e) {
            var scollone, policyTop, questionTop, commentTop, productAttrTop;
            if ($("#details-l").length > 0) {
                // 规格参数的高度
                scollone = $("#details-l").offset().top - 50;
            } else {
                scollone = 0
            }
            if ($("#policy").length > 0) {
                //服务政策的高度
                policyTop = $("#policy").offset().top - 150;
            } else {
                policyTop = scollone
            }
            if ($("#question").length > 0) {
                // 常见问题的高度
                questionTop = $("#question").offset().top - 150;
            } else {
                questionTop = policyTop
            }
            if ($("#comment").length > 0) {
                //评论的高度
                commentTop = $("#comment").offset().top - 150;
            } else {
                commentTop = questionTop
            }
            if (descriptHtml.indexOf('<a name="productAttribute"></a>') > -1) {
                productAttrTop = $("a[name='productAttribute']").parent().offset().top - 150;
            } else {
                productAttrTop = policyTop;
            }
            if ($(this).scrollTop() < productAttrTop) {
                $(".details-r ul li").eq(0).addClass('active').siblings().removeClass('active');
            } else if (descriptHtml.indexOf('<a name="productAttribute"></a>') > -1 && $(this).scrollTop() < policyTop && $(this).scrollTop() > productAttrTop) {
                $(".details-r ul li").eq(1).addClass('active').siblings().removeClass('active');
            } else if ($(this).scrollTop() > policyTop && $(this).scrollTop() < questionTop) {
                $(".details-r ul li").eq(2).addClass('active').siblings().removeClass('active');
            } else if ($("#comment").length > 0) {
                if ($(this).scrollTop() > questionTop && $(this).scrollTop() < commentTop) {
                    $(".details-r ul li").eq(3).addClass('active').siblings().removeClass('active');
                } else if ($(this).scrollTop() > commentTop) {
                    $(".details-r ul li").eq(4).addClass('active').siblings().removeClass('active');
                }
            } else {
                if ($(this).scrollTop() > questionTop) {
                    $(".details-r ul li").eq(3).addClass('active').siblings().removeClass('active');
                } else if ($(this).scrollTop() > commentTop) {
                    $(".details-r ul li").eq(4).addClass('active').siblings().removeClass('active');
                }
            }
        });
    }

    //产品评论
    $("#comment").html('<div class="details-comm"><div class="details-empty"><p>该商品还没有评价</p><p>快去购买提出宝贵意见吧</p></div></div>');

    function ajaxSearchComment(nowPage,pageShow){
        var url = "/front/product/showProductComments";
        $http.post({
            url: url,
            data: {
                productUuid:globalField.productUuid,
                nowPage:nowPage,
                pageShow:pageShow,
                ranNum: Math.random()
            },
            success: function(res) {
                if(res){
                    doCommentRes(res);
                    if(res.wm){
                        var pagination = res.wm;
                        var totalNum = pagination.totalNum;
                        var pageShow = pagination.pageShow;
                        var nowPage = pagination.nowPage;
                        page(nowPage,pageShow,totalNum);
                    }
                }
            }
        })
    }

    //加载商品详情评价
    function doCommentRes(data){
        var html="";
        if(data.commentList){
            html += '<div class="details-comm">'+
                    '<div class="comm-left tx-left">';
            var averagescore = String(data.averagescore).substr(0,3);
            html += '<p>与描述相符 <strong>'+averagescore+'</strong></p>'+
                    '<ul class="comm-star j-star">';

            html += '<li class="item ';
            if(averagescore >=1){
                html +='active';
            }
            html += '"></li>';

            html += '<li class="item ';
            if(averagescore >=2){
                html +='active';
            }
            html += '"></li>';

            html += '<li class="item ';
            if(averagescore >=3){
                html +='active';
            }
            html += '"></li>';

            html += '<li class="item ';
            if(averagescore >=4){
                html +='active';
            }
            html += '"></li>';

            html += '<li class="item ';
            if(averagescore >=5){
                html +='active';
            }
            html += '"></li></ul><p>已有'+data.wm.totalNum+'人评价</p></div>';

            html += '<div class="comm-right tx-left">';

            if(data.goodComment){
                var goodComment = data.goodComment;
                html += '<p class="comm-title">最新好评</p>'+
                        '<table cellspacing="0" cellpadding="0" class="comm-table">'+
                        '   <tr >'+
                        '       <td class="user-img">';
                if(goodComment.customerImageUrl){
                    html += '<img src="'+goodComment.customerImageUrl+'" />';
                }else{
                    html += '<img src="../../app/images/default.png" />';
                }
                html +='</td><td class="tx-left">'+goodComment.customerName+'</td>';
                html += '<td><ul class="comm-star star-r j-star">';
                /*for (var i = 0; i < goodcomment.scoreList.length; i++) {
                    var score = goodcomment.scoreList[i];
                    html += '<li class="item ';
                    if(score.appScore >=1){
                        html +='active';
                    }
                    html += '"></li>';

                    if(score.appScore >=2){
                        html +='active';
                    }
                    html += '"></li>';

                    if(score.appScore >=3){
                        html +='active';
                    }
                    html += '"></li>';

                    if(score.appScore >=4){
                        html +='active';
                    }
                    html += '"></li>';

                    if(score.appScore >=5){
                        html +='active';
                    }
                    html += '"></li>';
                }*/
                html += '</ul></td></tr>';
                html += '<tr>'+
                        '   <td></td>'+
                        '<td colspan="2" class="tx-left">'+
                        '   <p class="tab-mar">'+goodComment.comments+'</p>'+
                        '</td>'+
                        '</tr>'+
                        '<tr>'+
                        '   <td></td>'+
                        '   <td class="tx-left">'+nowTime(goodComment.appTime)+'</td>'+
                        '   <td class="text-r">';
                if(goodComment.specList){
                    for (var i = 0; i < goodComment.specList.length; i++) {
                        var spec = goodComment.specList[i];
                        html += spec.value+' &nbsp;&nbsp;';
                    }
                }
                html += '</td></tr></table>';

            }
            html += '</div></div>';

            html += '<div class="reply-title">'+
                    '   <ul class="reply-tab">'+
                    '       <li class="reply-item active">全部('+data.wm.totalNum+')</li>'+
                    ''+
                    '</ul>'+
                    '</div>'+
                    '   <div class="reply-list commentList">';

            if(data.commentList && data.commentList.length>0){
                for (var i = 0; i < data.commentList.length; i++) {
                    var comment = data.commentList[i];

                    var firstShopComment = comment.firstShopComment;
                    var firstShopCommentScores = comment.firstShopCommentScores;
                    var firstReplyComment = comment.firstReplyComment;
                    var firstShowImgs = comment.firstShowImgs;

                    var afterShopComment = comment.afterShopComment;
                    var afterReplyComment = comment.afterReplyComment;
                    var afterShowImgs = comment.afterShowImgs;
                    var specList = comment.specList;

                    html += '<table cellspacing="0" cellpadding="0" class="comm-table">'+
                            '   <tr>'+
                            '       <td class="user-img">';
                    if(comment.customerImageUrl){
                            html += '<img src="'+comment.customerImageUrl+'" />';
                    }else{
                        html += '<img src="../../app/images/default.png"/>';
                    }
                    html += '</td>'+
                            '<td>'+firstShopComment.customerName+
                            '   <span class="fr">'+nowTime(firstShopComment.appTime)+'</span>'+
                            '</td>'+
                            '<td class="user-star">'+
                            '   <ul class="comm-star star-r j-star">';
                    if(firstShopCommentScores){
                        for (var j = 0; j < firstShopCommentScores.length; j++) {
                            var firstShopCommentScore = firstShopCommentScores[j];
                            if(firstShopCommentScore.appType == '1'){
                                for(var k=1; k <= firstShopCommentScore.appScore; k++){
                                    html += '<li class="item active"></li>';
                                }
                            }
                        }
                    }

                    html+=  '   </ul>'+
                            '</td>'+
                            '</tr>'+
                            '<tr>'+
                            '   <td></td>'+
                            '   <td>'+
                            '        <p class="tab-mar">'+firstShopComment.comments+'</p>';
                    if(firstShowImgs &&firstShowImgs.length>0){
                        html += '<p class="reply-img">';
                        for(var j = 0; j< firstShowImgs.length; j++ ){
                            var img = firstShowImgs[j];
                            html += '<a class="" href="'+img.imgUrl+'" data-lightbox="img">'+
                                    '   <img class="maxheight" src="'+img.imgUrl+'">'+
                                    '</a>';
                        }
                        html += '</p>';
                    }
                    html += '</td>';

                    if(specList){
                        html += '<td class="text-c">'+
                                '   <div class="attr-text">';
                        for(var j = 0;j < specList.length; j++){
                            var spec = specList[j];
                            html += '<span>'+spec.value+'</span>';
                        }
                        html += '</div></td>';
                    }
                    html += '</tr>';
                    if(firstReplyComment){
                        html += '<tr>'+
                                '   <td>'+
                                '   </td>'+
                                '    <td class="comm-child">'+
                                '       <p class="child-img">'+
                                '           <img src="../../app/images/y_recomd5.jpg"/>'+
                                '           <span class="red">官方回复</span>'+
                                '           <span class="fr">'+nowTime(firstReplyComment.operTime)+'</span>'+
                                '       </p>'+
                                '       <p class="child-img">'+firstReplyComment.replyContent +'</p>'+
                                '</td>'+
                                '<td></td>'+
                                '</tr>';
                    }
                    if(afterShopComment){
                        html += '<tr>'+
                                '   <td></td>'+
                                '   <td class="comm-child">'+
                                '       <p class="child-img">';
                        if(comment.customerImageUrl){
                            html += '<img src="'+comment.customerImageUrl+'" />';
                        }else{
                            html += '<img src="../../app/images/default.png"/>';
                        }
                        html += '<span>买家追评</span>'+
                                '<span class="fr">'+nowTime(afterShopComment.operTime)+'</span>'+
                                '</p>'+
                                '<p>'+afterShopComment.comments+'</p>'+
                                '<p class="reply-img">';

                        if(afterShowImgs){
                            html += '<p class="reply-img">';
                            for(var j = 0;j < afterShowImgs.length; j++){
                                var img = afterShowImgs[j];
                                html += '<a href = "'+img.imgUrl+'" data-lightbox="img">'+
                                        '   <img src="'+img.imgUrl+'">'+
                                        '</a>';
                            }
                            html += '</p>';
                        }
                        html += '</p>'+
                                '</td><td>'+
                                '</tr>';
                    }
                    if(afterReplyComment){
                        html += '<tr>'+
                                '   <td></td>'+
                                '   <td class="comm-child">'+
                                '       <p class="child-img">'+
                                '           <img src="../../app/images/y_recomd5.jpg"/>'+
                                '           <span class="red">官方回复</span>'+
                                '       <span class="fr">'+nowTime(afterReplyComment.operTime)+
                                '       </span></p>'+
                                '       <p class="child-img">'+afterReplyComment.replyContent+'</p>'+
                                '   </td>'+
                                '   <td></td>'+
                                '</tr>';
                    }
                    html += '</table>';


                }
            }
            html += '</div>';

        }else{
            html += '<div class="details-comm">'+
                    '   <div class="details-empty">'+
                    '       <p>该商品还没有评价</p>'+
                    '       <p>快去购买提出宝贵意见吧！</p>'+
                    '   </div>'+
                    '</div>';
        }

        //追加到#comment
        $("#comment").html(html);
        $("#comment .commentList").append('<div class="padding-box"><div class="padding clearmar"></div></div>');
    }

    //评论分页
    function page(nowPage,pageShow,totalNum){
        totalPage = Math.ceil(totalNum/pageShow);
        param.nowPage = nowPage;
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        html = "";
        if(totalPage<8){
            html += '<button class="prev" ';
            if(nowPage == 1){
                html += 'disabled';
            }
            html += ' style="background:#fff"><</button>';
            if(totalPage!=0){
                for(var i = 1;i <= totalPage ;i++){
                    html += '<span class="item ';
                    if(nowPage == i){
                        html += 'active';
                    }
                    html +='" title="第'+i+'页">'+i+'</span>';
                }
            }else{
                 html += '<span class="item active" title="第1页">1</span>';
            }


            html += '<button class="next" ';
            if(nowPage == totalPage){
                html += 'disabled';
            }
            html += ' style="background:#fff">></button>';

            $(".padding-box .clearmar").html(html);
        }else{
            if(totalPage >= 8 && nowPage < 7){
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                for(var i = 1; i <= 7 ;i++){
                    html += '<span class="item ';
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

                $(".padding-box .clearmar").html(html);
            }else{
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                html += '<span class="item" title="第1页">1</span>';
                html += '<span class="item" title="第2页">2</span>';
                html += '<span class="item" title="第3页">3</span>';
                html += '<span class="item" title="第...页">...</span>';
                var before = nowPage - 1;
                var after = nowPage + 1;
                var sbefore = before - 1;
                if(nowPage == totalPage){
                    html += '<span class="item" title="第'+ sbefore +'页">'+sbefore+'</span>';
                }
                html += '<span class="item" title="第'+ before +'页">'+before+'</span>';



                if(nowPage <= totalPage){
                    html += '<span class="item active" title="第'+ nowPage +'页">'+nowPage+'</span>';
                }
                if(nowPage+1<=totalPage){
                    html += '<span class="item" title="第'+ after +'页">'+after+'</span>';

                }


                html += '<button class="next" ';
                if(nowPage == totalPage){
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';
                $(".padding-box .clearmar").html(html);
            }

        }

    }

    //页码点击
    $(document).on("click",".clearmar span:gt(0),.clearmar span:lt(8)",function(){
        nowPage = $(this).html();
        if(nowPage.indexOf("...") > -1){
            return
        }else{
            $(this).addClass('active').siblings().removeClass('active');
            ajaxSearchComment(nowPage,param.pageShow);
        }
    })
    $(document).on("click",".clearmar .prev",function(){
        if(param.nowPage>1){
            nowPage = param.nowPage - 1;
        }
        ajaxSearchComment(nowPage,param.pageShow);
    })
    $(document).on("click",".clearmar .next",function(){
        if(param.nowPage < param.totalPage){
            nowPage = param.nowPage + 1;
        }
        ajaxSearchComment(nowPage,param.pageShow);
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

    //goTop回到顶部
    window.onscroll = function(){
         var t = document.documentElement.scrollTop || document.body.scrollTop;
         if(t>500){
            $(".goTop").show();
         }else{
            $(".goTop").hide();
         }
    }
    window.getAddress = getAddress;
    $scope.addBuyNum = inputAdd.addBuyNum;
    $scope.reduceBuyNum = inputAdd.reduceBuyNum;
    $scope.changeBlur = inputAdd.changeBlur;

    //商品详情广告
    function detail_ad(categoryUuid) {
        var dom = $("#productad");
        if(!categoryUuid) {
            return;
        }else{
            $http.get({
                url: '/front/product/getAdByProductCategoryUuid?terminalType=01&categoryUuid='+categoryUuid,
                success:function (res) {
                    if(res.iconPath) {
                        var img = "<div class='divs'><a href="+res.categoryUrl+" ><img src="+res.iconPath+" ></a></div>";
                        dom.html(img)
                    }
                }
            })
        }
    }

    $init.Ready(function () {
    })
});
