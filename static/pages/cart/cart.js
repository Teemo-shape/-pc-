/*
 * author: linxiaohu
 * time:2016年11月24日 20:38:07
 * */
require([ 'KUYU.plugins.alert','juicer','KUYU.Store','KUYU.HeaderTwo','KUYU.Service', 'KUYU.Binder','KUYU.navHeader'],function(){
    var Store = KUYU.Store,
        $http = KUYU.Service,
        $init = KUYU.Init,
        navHeader = KUYU.navHeader,
        $param = KUYU.Init.getParam(),
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $scope = KUYU.RootScope,
        $Store = KUYU.Store,
        cartData = null,
        addFlag = true, //增减按钮开关
        checkFlag = true, //选择开关
        cartMap = {};
    var globalField = {"localStoreId":"03d03b6b05604c5cb065aef65b72972e"};
    var param = { //这个是存购物车
        'storeMap':{}
    };
    //设置头部导航, nvaHeader(cb), 回调参数包含是否登录信息
    navHeader(function(res) {
        if(res.code == CODEMAP.status.success) { //登录后购物车

            var parmas = {
                suitUuid: $param.suitUuid,
                buyNum: $param.buyNum,
                distributorUuid: '',
                mainProductUuid: $param.mainProductUuid,
                mainSkuNo: $param.mainSkuNo , //attrId
                areaUuid: $param.areaUuid,
            };
            if(parmas.suitUuid ) {
                if(history.replaceState){
                    history.replaceState({page: 1}, '', '?_=1')
                }
                $http.post({
                    url:'/front/product/addSuitProductToCartKuyu',
                    data: parmas,
                    success: function(data) {
                        if(data.code == CODEMAP.status.success) {
                          $init.nextPage('cart',{})
                        } else{
                            Msg.Alert("","套装加入购物车失败",function(){
                                $init.nextPage('cart',{})
                            });
                        }
                    }
                });
            }


            shoppingFunc.checkFun(true);
            shoppingFunc.submit(true);
            //Store.remove('shoppingcart');
            //Store.remove('storeCartAll');
            fun(res);

            //改变购物车商品数量
            $(document).on('click','.shop-item .reg',function(){
                var _id  = $(this).attr('id');
                var _rid = _id.substring(_id.indexOf('_')+1);
                if(addFlag && $(this).data('num')>1) {
                    addFlag = false;

                    changeCartNum(0,_rid, 'isLogin');

                    $('.buy').addClass('disabled').attr("disabled" , true);

                }

            }).on('click','.shop-item .add',function(){
                var _id  = $(this).attr('id');
                var _rid = _id.substring(_id.indexOf('_')+1);
                if(addFlag && $(this).data('max')>$(this).data('num')) {
                    addFlag = false;
                    changeCartNum(1,_rid, 'isLogin');
                    $('.buy').addClass('disabled').attr("disabled" , true);
                } else {
                    if($(this).data('num') >= $(this).data('max')) {
                         Msg.Alert("","商品库存不足,最多只能购买: "+$(this).data('max')+"件",function(){
                        });
                    }
                }
            });

            //收藏按钮
            $(document).on('click','.star.j-star',function(){
                var uuid = $(this).attr('productuuid');
                var el = $(this);
                toToggleProductCollectState(uuid, el, 'isLogin');
            })

            //改变文本框数量
            $(document).on('blur','.j-val',function(){
                $('.buy').addClass('disabled').attr("disabled" , true);

                var $input = $(this);
                var max = $input.data('max');
                //如果小于库存再做判断，代码
                var buyNum = parseInt($input.val());
                var _arr = this.id.replace('stock_','').split('_');
                var _id =  'stock_' + _arr[0] + '_' + _arr[1];
                if($input.attr("suituuid")){
                    _id = '';
                    $(".j-select[suitUuid='" + $input.attr("suituuid") + "']").each(function(i, o) {
                        $(this).val(buyNum);
                        _id += 'stock_'+ $(o).attr("productid") + '_' +$(o).attr("skuno")+'_'+$input.attr("suituuid")+';'
                    })
                }

                setTimeout(function () {
                    if(/^\d{1,3}$/.test(buyNum)) {
                        if(buyNum>max) {
                            if(max > 999) {
                                Msg.Alert("","商品数量超限",function(){});
                                ajaxChangeNum(_id,999,$input.attr("suituuid"),true, 'blur');
                            } else {
                                ajaxChangeNum(_id,buyNum,$input.attr("suituuid"),true, 'blur');
                            }
                        }else{
                            ajaxChangeNum(_id,buyNum, $input.attr("suituuid"), true, 'blur');
                        }
                    } else {
                        var num = buyNum >= 999 ? 999 : ( $input.data('max') <= 999 ? $input.data('max') : 999);
                        $input.val(num);
                        ajaxChangeNum(_id, num, $input.attr("suituuid"), true, 'blur');
                    }
                }, 0)
            })
            //领取优惠券
            // $(document).on('click','.m_discount_pop li a',function(){
            //     var _uuid = $(this).parent('li').attr('data-uuid'),
            //         type = $(this).parent('li').attr('coup');
            //     downLoadCoupon(_uuid, type);
            // })

        }else if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) { //没登录购物车
            shoppingFunc.checkFun(false);
            shoppingFunc.submit(false);
            $(document).on('click','.myorder',function(){
            	sessionStorage.setItem("order","order")
            });
            //本地存储购物车信息
            cartData = Store.get('shoppingcart'),
            parseCartData = null;
            if(cartData && cartData!=null){
                parseCartData = JSON.parse(cartData);

                for(var i in parseCartData.storeMap){cartMap['cartUid'] = i};
                cartMap['parseCartMap'] = parseCartData
            }

            var parmas = {
                suitUuid: $param.suitUuid,
                buyNum: $param.buyNum,
                distributorUuid: '',
                mainProductUuid: $param.mainProductUuid,
                mainSkuNo: $param.mainSkuNo , //attrId
                areaUuid: $param.areaUuid,
            };

            if(parmas.suitUuid) {
                $http.post({
                    url:'/tclcart/addSuitProductToCartKuyu',
                    data: parmas,
                    success: function(data) {
                        if(data.code == CODEMAP.status.success) {
                            $.each(data.data, function (i,o) {
                                o['opeTime'] = new Date().getTime();
                                o['type'] = '01';
                                o['suitUuid'] = parmas.suitUuid;
                            })
                            var list = data.data;
                            var isIN = false;
                            var shoppingcart= $Store.get('shoppingcart')
                            if(shoppingcart ) {
                                var res = JSON.parse(shoppingcart);
                                var arr = res.storeMap[globalField.localStoreId];
                                param.storeMap[globalField.localStoreId] = arr;
                            }else{
                                param.storeMap[globalField.localStoreId] = [];
                            }

                            var dicMap = {};
                            var arrMap = [];
                            list.map(function (ele, index, arr) {
                                dicMap[ele.productUuid] = arr[index];
                                if(ele.suitUuid) arrMap.push(ele.suitUuid)
                            });
                            if( param.storeMap[globalField.localStoreId].length<2) {
                                param.storeMap[globalField.localStoreId] = param.storeMap[globalField.localStoreId].concat(list);
                            }else{
                                param.storeMap[globalField.localStoreId].map(function (ele, index, arr) {
                                    if($.inArray( ele.suitUuid, arrMap ) >= 0) {
                                        ele.buyNum =parseInt(ele.buyNum)+1;
                                        isIN = false;
                                    }else{
                                        if(arrMap.length>0 && $.inArray( ele.suitUuid, arrMap ) < 0) {
                                            isIN = true;
                                        }
                                    }
                                });
                                if(isIN) {
                                    param.storeMap[globalField.localStoreId] = param.storeMap[globalField.localStoreId].concat(list);
                                }
                            }
                            $Store.set('shoppingcart',JSON.stringify(param));
                            $init.nextPage('cart',{})
                            fun(false)
                        } else{
                            Msg.Alert("","获取套餐商品失败",function(){
                                $init.nextPage('cart',{})
                            });
                        }
                    }
                });
            }else{
                fun(false);

            }
            //改变购物车商品数量
            $(document).on('click','.shop-item .reg',function(){
                var _id  = $(this).attr('id');
                var _rid = _id.substring(_id.indexOf('_')+1);
                if(addFlag && $(this).data('num')>1) {
                    addFlag = false;
                    changeCartNum(0,_rid, false);
                }
            }).on('click','.shop-item .add',function(){
                var _id  = $(this).attr('id');
                var _rid = _id.substring(_id.indexOf('_')+1);
                if(addFlag && $(this).data('max')>$(this).data('num')) {
                    addFlag = false;
                    changeCartNum(1,_rid, false);
                }else{
                    if($(this).data('num') >= $(this).data('max')) {
                         Msg.Alert("","商品库存不足,最多只能购买: "+$(this).data('max')+"件",function(){});
                    }
                }
            });

            //动态元素添加事件
            // $(document).on('click','.star.j-star',function(){
            //     var uuid = $(this).attr('productuuid');
            //     var el = $(this);
            //     toToggleProductCollectState(uuid,el);
            // })

            //改变文本框数量
            $(document).on('blur','.j-val',function(){

                $('.buy').addClass('disabled').attr("disabled" , true);

                var $input = $(this)

                var max = $input.data('max')
                //如果小于库存再做判断，代码

                var buyNum = !/^\d{1,3}$/.test($(this).val()) ? ( max < 999 ? $(this).val(max) : $(this).val(999) ) : parseInt($(this).val());
                var _arr = this.id.replace('stock_','').split('_');

                var _id =  '_' + _arr[0] + '_' + _arr[1];
                if($input.attr("suituuid")){
                    _id = '';
                    $(".j-select[suituuid='" + $input.attr("suituuid") + "']").each(function(i, o) {
                        $(this).val(buyNum);
                        _id += '_'+ $(o).attr("productid") + '_' +$(o).attr("skuno")+'_'+$input.attr("suituuid")+';'
                    })
                }
                setTimeout(function () {
                    if(/^\d{1,3}$/.test(buyNum)) {
                        if(buyNum>max) {
                            if(max > 999) {
                                Msg.Alert("","商品数量超限",function(){});
                                ajaxChangeNum(_id,999,$input.attr("suituuid"),false, 'blur', $input);
                            } else {
                                ajaxChangeNum(_id,buyNum,$input.attr("suituuid"),false, 'blur', $input);
                            }
                        }else{
                            ajaxChangeNum(_id,buyNum,$input.attr("suituuid"),false, 'blur', $input);
                        }
                    } else {
                        var num = buyNum >= 999 ? 999 : ( $input.data('max') <= 999 ? $input.data('max') : 999);
                        $input.val(num);
                        ajaxChangeNum(_id,num,$input.attr("suituuid"),false, 'blur', $input);
                    }
                }, 0)
            });
            //领取优惠券
            // $(document).on('click','.m_discount_pop li a',function(){
            //     Msg.Alert("","请先登录",function(){
            //         $init.nextPage('login','');
            //     });
            // });

        }else {
            throw res;
        }
    });

    var shoppingFunc = {
        //选择购物车
        checkFun: function (login) {
            //购物车商品全选复选框
            $("#shoppingCart").on("click", ".checkbox.j-all", allCheck)
            function allCheck() {
                var flag = $(this).hasClass("active");
                var self = $(this)
                flag = !flag;
                if(flag){
                    var nodes = $("[id^='product_']");
                    $.each(nodes, function (i, o ) {
                        if($(this).attr("data-notsale") != "true") {
                            $(this).addClass("active");
                        }
                    })

                    $(this).addClass("active");
                }
                else{
                    $("[id^='product_']").removeClass("active");
                    $(this).removeClass("active");
                }
                if(login) {
                    setTimeout(function () {
                        if(checkFlag) {
                            checkFlag = false;
                            ajaxChangeChoose("allRecords" ,flag, '',self, login) ;
                            $('.buy').addClass('disabled').attr("disabled" , true);
                        }
                    },0)
                }else{
                    setTimeout(function () {
                        changeListChoose("allRecords" ,flag, '', self)
                    },0)
                }
            }
            //购物车商品选中框操作
            $(document).off('click', '.j-odd');
            $(document).on('click', '.j-odd' , function(){
                var self = $(this)
                var buyNum = $(this).attr("buynum");
                if(buyNum == "0"){
                    return;
                }
                var suitUuid = $(this).attr("suituuid");
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                    if(!login) { // 更改选择属性 取消选择状态
                        var ID = $(this).data('proid');
                        shoppingFunc.changeLocalData(false, ID)
                    }
                }
                else{
                    $(this).addClass('active');
                    if(!login) { // 更改选择属性 添加选择状态
                        var ID = $(this).data('proid');
                        shoppingFunc.changeLocalData(true, ID)
                    }
                }
                //执行回调函数
                if($('.sel-wid .active').length > 0){
                    $('.payment').find('.buy').removeClass('disabled').removeAttr('disabled');
                    $('.j-all').removeClass('active');
                }
                else {
                    $('.payment').find('.buy').addClass('disabled').attr('disabled','true');
                }
                //如果全部单选，则全选也高亮
                if($('.sel-wid .active').length == $('.checkbox').length-1){
                    $('.j-all').addClass('active');
                }
                var operId = $(this).attr("id") ;
                var flag = $(this).hasClass("active");
                if(login) {
                    //内购不考虑套装
                    // if($(this).data('issuitmain')){
                    //     var sui = $(this).attr("suituuid")
                    //     operId = '';
                    //     $(".j-select[suituuid='" + sui + "']").each(function(i, o) {
                    //         $(this).html(buyNum);
                    //         operId += 'product_'+$(o).attr("productid") + '_' +$(o).attr("skuno")+'_'+$(o).attr("suituuid")+';';
                    //     })
                    // }
                    if(checkFlag) {
                        checkFlag = false;
                        ajaxChangeChoose(operId ,flag,suitUuid, '', login) ;
                        $('.buy').addClass('disabled').attr("disabled" , true);
                    }
                }else{
                    changeListChoose(operId ,flag,suitUuid, self)
                }
            });

            $(document).on('click','.del.j-del',function(){
                var jOdd = $(this).parents('.shop-box').find('span.jar');
                var notSale = $(this).parents('.shop-box').find('span[data-notsale]');
                if(!jOdd.data('notsale') && notSale.data('notsale')) {
                    jOdd = notSale;
                }
                var suitUuid = jOdd.attr('suituuid');
                var id = 'remove_' + jOdd.attr('id').substring(8) + (suitUuid&&suitUuid!='null'?'_'+suitUuid:'');
                var el = $(this);
                /*
                * 套装删除未做拼接,后端现在根据套装ID删除整个套装
                */
                removeProduct(id , suitUuid, el, login);
            })
            //批量收藏 接口尚未遍历
            $(document).on('click','#multiFav',function(){
                Msg.Confirm('', '确定将这些商品移入收藏吗？', function () {
                    if (login) {
                        if (checkFlag) {
                            checkFlag = false;
                            var jOddList = $('span.jar.active'), pids = '';
                            var pids2 = '', suitUuids = '';
                            jOddList.each(function () {
                                var _suitUuid = $(this).attr('suituuid');
                                pids += $(this).parents('.shop-box').find('span.j-star').attr('productuuid') + ';';
                                pids2 += 'remove_' + $(this).attr('id').substring(8) + (_suitUuid && _suitUuid != 'null' ? '_' + _suitUuid : '') + ';';
                                suitUuids += _suitUuid + ';';
                            });
                            ajaxRemove(pids2, suitUuids, login);
                            collectProductCart(pids, function () {
                                $('span.jar.active').parents('.shop-box').find('span.j-star').addClass("active").html('取消收藏');
                            });
                        }
                    }
                })
            })
            //批量删除
            $(document).on('click','#multiDel',function(){
                Msg.Confirm('', '确定删除这些商品吗？', function () {
                    if (login) {
                        if (checkFlag) {
                            checkFlag = false;
                            var jOddList = $('span.jar.active'), pids = '', suitUuids = '';
                            jOddList.each(function () {
                                var _suitUuid = $(this).attr('suituuid');
                                pids += 'remove_' + $(this).attr('id').substring(8) + (_suitUuid && _suitUuid != 'null' ? '_' + _suitUuid : '') + ';';
                                suitUuids += _suitUuid + ';';
                            });
                            ajaxRemove(pids, suitUuids, login);
                        }
                    }
                })
            })
            //清空失效商品
            $(document).on('click','#removeNotsale',function(){
                Msg.Confirm('', '确定清空失效商品吗？', function () {
                    if (login) {
                        if (checkFlag) {
                            checkFlag = false;
                            var notSales = $('span[data-notsale]'), pids = '', suitUuids = '';
                            notSales.each(function () {
                                var _suitUuid = $(this).attr('suituuid');
                                pids += 'remove_' + $(this).attr('id').substring(8) + (_suitUuid && _suitUuid != 'null' ? '_' + _suitUuid : '') + ';';
                                suitUuids += _suitUuid + ';';
                            });
                            ajaxRemove(pids, suitUuids, login);
                        }
                    }
                })
            })
        },
        //渲染购物车列表
        renderList: function (data, isLogin) {
            if(!data || data == null ) {
                $(".Cart").hide();
                $(".box.gray-back ").hide();
                $(".buy-box").show();
                return;
            }
            var _pro = data.carts;
            //不可售商品数组
            // var unmarketableMap = data.unmarketableMap;
            // var arr_unmarketable = [];
            // for(var i in unmarketableMap){
            //     if(unmarketableMap[i] == true){
            //         arr_unmarketable.push(i);
            //     }
            // }

            var tpl = [
                '{@each carts as item,index}',
                '$${item, index|products_build}',
                '{@/each}'
            ].join('');
            var funcPros = function(_pro, index){
                // //判断商品是否不可售，若不可售，unmarketable置为true
                // for(var i=0,len = arr_unmarketable.length; i < len; i++){
                //     if(arr_unmarketable[i]){
                //         unmarketable = true;
                //     }
                // }
                var html = '<!-- 累加购物车商品数量，用于显示购物车商品总数 -->'
                    + '<div class="shop-cont-'
                    + _pro.productId
                    + '_';
                if(_pro.attrIds != null){
                    html += $.trim(_pro.attrIds);
                }else{
                    html += '';
                }
                html = html
                    + '_'
                    + index
                    + '">'
                if( (_pro.onSell && !_pro.suitMain) || (_pro.suitMain && _pro.suitOnSell) ) {  //$.inArray(_pro.productId, arr_unmarketable) == -1
                    html = html
                        + '<dl class="shop-box">'
                        + '<dd class="shop-item sel-wid"> '
                        + '<span data-proid='+_pro.productId+' data-isSuitMain='+(_pro.isSuitMain!=null?true:false)+' data-totalPrice='+_pro.totalPrice+' data-price='+_pro.marketFinalPrice+' class="checkbox'+( _pro.buyNum > 0 ? " j-odd jar ":" jar not-add ")+'';
                    if(_pro.checked == false){
                        html += '';
                    }else{
                        html += 'active';
                    }
                    html = html
                        + '" suituuid="'+_pro.suitUuid+'" name=items value="product_'
                        + _pro.productId
                        + '_';
                    if(_pro.attrIds != null){
                        html += $.trim(_pro.attrIds);
                    }else{
                        html += '';
                    }
                    html = html
                        + '"id="product_'
                        + _pro.productId
                        + '_';
                    if(_pro.attrIds != null){
                        html += $.trim(_pro.attrIds);
                    }else{
                        html += '';
                    }
                    html = html
                        + '" buyNum="'
                        + _pro.buyNum
                        + '"></span>'
                }
                else{

                    html = html
                        + '<dl class="shop-box soldout">'
                        + '<dd class="shop-item sel-wid"> '
                        + '<span style="float:left;" data-notSale=true id="product_'+_pro.productId+'_'+(_pro.attrIds!=null?_pro.attrIds:'')+'" suituuid='+_pro.suitUuid+' >失效</span>';
                };
                html = html
                    + '</dd>';
                if(_pro.suitMain && _pro.suitMain != null){
                    html = html
                        + '<dd class="shop-item pro-wid">'
                        + _pro.suitMain.name
                        + '</dd>';
                }else{
                    html = html
                        + '<dd class="shop-item pro-wid">'
                        + '<span class="left">'
                        + '<a href="/pages/productDetail/productDetail.html?uuid='
                        + _pro.productId
                        + '" class="cart_productId" id="'
                        + _pro.productId
                        + '">'
                        if( (!_pro.onSell && !_pro.suitMain) || (_pro.suitMain && !_pro.suitOnSell) ){
                          html = html
                          + '<img src="/app/images/soldout1.png" class="soldoutImg">'
                        }
                        html = html
                        + '<img style="width:100px;height: 100px" src="'
                        + _pro.productImgUrl
                        + '" />'
                        + '</a>'
                        + '</span>'
                        + '<span class="right">'
                        + '<a href="/pages/productDetail/productDetail.html?uuid='
                        + _pro.productId
                        + '">'
                        + '<p class="m_pro">'
                        + _pro.productName
                        + '</p>';
                    if( _pro.attrValues && _pro.attrValues != null && _pro.attrValues.length>0){
                        html = html
                            + '<p class="m_p1">';
                        $.each(_pro.attrValues,function(i,item){
                            html = html
                                + _pro.attrValues[i].name
                                + ':'
                                + _pro.attrValues[i].value
                                + '&emsp;';
                        });
                        html = html
                            + '</p>';
                    };

                    html = html
                        + '</a>';
                    // if((_pro.onSell && !_pro.suitMain) || (_pro.suitMain && _pro.suitOnSell)){ // $.inArray(_pro.productId, arr_unmarketable) == -1
                    //     html = html
                    //         + '<div class="order-num m_discount"  binder-event="click|openQuan:h3">';
                    //     if(_pro.couponList && _pro.couponList.length>0){
                    //         html = html
                    //             + '<h3 data-tp=true>优惠券</h3>'
                    //             + '<div class="m_discount_pop">'
                    //             + '<ol>';
                    //         $.each(_pro.couponList,function(i,item){
                    //             html = html
                    //                 + '<li '+ (_pro.couponList[i].convertIntegral ? "style='width:260px' coup="+_pro.couponList[i].convertIntegral+"" : "" ) +' data-uuid='
                    //                 + _pro.couponList[i].uuid
                    //                 + ' >'
                    //                 + '<span>'
                    //                 + _pro.couponList[i].couponTypeName
                    //                 + '</span>'
                    //                 + '<a href="javascript:;" '+ (_pro.couponList[i].convertIntegral ? "style='width:130px'" : "" ) +'>'+(_pro.couponList[i].convertIntegral ? "领取(抵扣"+_pro.couponList[i].convertIntegral+"积分)" : "领取" )+'</a>'
                    //                 + '</li>'
                    //         })
                    //         html = html
                    //             + '</ol>'
                    //             + '</div>';
                    //     }
                    //     html = html
                    //         + '</div>';
                    // }

                    html = html
                        + '</span>'
                        + '</dd>'
                };
                html = html
                    + '<dd class="shop-item pri-wid" style="padding-top: 36px;">'
                    //判断为员工价还是亲友价
                    if(parseFloat((parseFloat(_pro.totalPrice)/parseInt(_pro.buyNum)).toFixed(2))==parseFloat(_pro.staffPrice)){
                      html = html
                      + '员工价:<span class="showPrice">¥'
                      + _pro.staffPrice
                      +'</span>'
                    }else{
                      html = html
                      + '亲友价:<span class="showPrice">¥'
                      + _pro.friendPrice
                      +'</span>';
                    }


                //if(_pro.suitUuid ){
                    //html += parseFloat(_pro.suitFinalPrice).toFixed(2);
                //}else{
                    //html += parseFloat(_pro.singleMarketPrice ).toFixed(2);//市场价
                //}
                html = html
                    + '</dd>'
                    + '<dd class="shop-item num-wid j-select">';
                if( (_pro.onSell && !_pro.suitMain) || (_pro.suitMain && _pro.suitOnSell) ){ //$.inArray(_pro.productId, arr_unmarketable) == -1
                    //库存小于5显示库存紧张，购买数量大于库存显示库存不足最多可购买多少件，无货就是库存不足了
                    if(_pro.productWarning != '0'){
                      html = html
                          + '<span class="reg" id="1stock_'
                          + _pro.productId
                          + '_';
                      if(_pro.attrIds !== null){
                          html += $.trim(_pro.attrIds);
                      }else{
                          html += '';
                      }
                      html = html
                          + '_';
                      if(_pro.suitUuid ){
                          html += _pro.suitUuid;
                      }else{
                          html += '';
                      }
                      html = html
                          + '_'
                          + index
                          + '" data-num='+(_pro.buyNum > 999 ? 999 :_pro.buyNum )+' >-</span>'
                          + '<input type="text" autocomplete="off"  data-max='+(_pro.stockNo)+'  class="val j-val" id="stock_'
                          + _pro.productId
                          + '_';
                      if(_pro.attrIds !== null){
                          html += $.trim(_pro.attrIds);
                      }else{
                          html += '';
                      }
                      html = html
                          + '_';
                      if(_pro.suitUuid ){
                          html += _pro.suitUuid;
                      }else{
                          html += '';
                      }
                      html = html
                          + '_'
                          + index
                          + '" value="'
                          + (_pro.buyNum > 999 ? 999 :_pro.buyNum )
                          + '" suituuid="';
                      if(_pro.suitUuid ){
                          html += _pro.suitUuid;
                      }else{
                          html += '';
                      }
                      html = html
                          + '" />'
                          + '<span class="add" id="2stock_'
                          + _pro.productId
                          + '_';
                      if(_pro.attrIds !== null){
                          html += $.trim(_pro.attrIds);
                      }else{
                          html += '';
                      }
                      html = html
                          + '_';
                      if(_pro.suitUuid ){
                          html += _pro.suitUuid;
                      }else{
                          html += '';
                      }
                      html = html
                          + '_'
                          + index
                          + '" data-num='+(_pro.buyNum > 999 ? 999 :_pro.buyNum )+' data-max='+(_pro.stockNo)+'>+</span>';
                    }

                    if(_pro.productWarning == '0'){
                        html = html
                            + '<div class="red y_cartnokc">'
                            + '该商品库存不足'
                            + '</div>';
                    }else if(_pro.productWarning == '1'){
                        html = html
                            + '<div class="red y_cartnokc">'
                            + '库存不足,最多可购买'
                            + _pro.buyNum
                            + '件</div>';
                    }else if(_pro.productWarning == '2'){
                        html = html
                            + '<div class="red y_cartnokc">'
                            + '库存紧张'
                            + '</div>';
                    }
                }else{
                    // html += '<input type="text" class="val" value="'
                    //     + _pro.buyNum
                    //     + '" readonly/>'
                    html += '<dd class="shop-item num-wid j-select" style="visibility: hidden;"><span class="reg" >-</span><input class="val"  type="text"><span class="add" >+</span></dd>'
                };
                html = html
                    + '</dd>'
                    + '<dd class="shop-item sub-wid red pri-wid">'
                    + '<span class="j-subtotal fl total-price">¥';
                if(_pro.suitUuid){
                    html += _pro.suitTotalPrice + '<br>';
                    html = html
                        + '<span class="j-price through" style="color: gray">¥';
                    // var sum = 0;
                    // if(_pro.suitSubProduct && _pro.suitSubProduct !=null) {
                    //     $.each(_pro.suitSubProduct,function(i,item){
                    //         sum += parseFloat(_pro.suitSubProduct[i].totalPrice);
                    //     })
                    // }
                    html += parseFloat(_pro.suitCostAmount).toFixed(2);
                }else{
                    html = html
                        + parseFloat(_pro.totalPrice).toFixed(2);
                }

                html = html
                    + '</span><span class="j-price through fl total-price-old" style="color:gray;">'+( (_pro.marketFinalPrice && (parseFloat(_pro.marketFinalPrice) > parseFloat(_pro.totalPrice)))  ? '¥'+parseFloat(_pro.marketFinalPrice).toFixed(2):"")+'</span>'
                    + '</dd>'
                    + '<dd class="shop-item ope-wid">'
                    if(!_pro.suitMain) {
                        //html+= '<span class="star j-star" productUuid="' + _pro.productId + '"></span>'
                        html+= '<span class="star j-star" productUuid="' + _pro.productId + '"></span>'
                    }
                    //html+= '<span class="del j-del">' +'</span>'
                    html+= '<span class="del j-del">删除' +'</span>'
                    + '</dd>'
                    + '</dl>';
                //checkState(_pro.productId);//检查收藏状态
                if(_pro.suitMain && _pro.suitMain !=null) {
                    html = html
                        + '<!-- 主商品 -->'
                        + '<dl class="shop-prod lock clearfloat">'
                        + '<dd class="shop-item sel-wid">&nbsp;</dd>'
                        + '<dd class="shop-item pro-wid">'
                        + '<span class="left">'
                        + '<img style="width:120px;height: 120px" src="'
                        + _pro.productImgUrl
                        + '" /></span>'
                        + '<span class="right">'
                        + '<div class="right-content">'
                        + '<a href="/pages/productDetail/productDetail.html?uuid='
                        + _pro.productId
                        + '">'
                        + '<p class="m_pro">'
                        + _pro.productName
                        + '</p>'
                        + '<p class="m_p1">';

                    html = html
                        + '</p>'
                        + '</a>'
                        + '</div>'
                        + '</span>'
                        + '</dd>'
                        + '<dd class="shop-item pri-wid">'
                        + '<span class="j-price">¥' //marketPrice
                        + _pro.singleMarketPrice
                        + '</span></dd><dd class="shop-item num-wid j-select " productId="'
                        + _pro.productId
                        + '" skuNo="';
                    if(_pro.attrIds!=null){
                        html += $.trim(_pro.attrIds);
                    }else{
                        html += '';
                    }
                    html = html
                        + '" suituuid="'
                        + _pro.suitUuid
                        + '">'
                        + _pro.buyNum
                        + '</dd>'
                        + '<dd class="shop-item sub-wid"></dd>'
                        + '<dd class="shop-item ope-wid">'
                        + '<span class="star j-star" productuuid="'
                        +  _pro.productId
                        + '"></span>'
                        + '</dd>'
                        //+ '</dl>';
                }
                if(_pro.suitSubProduct != null){
                    $.each(_pro.suitSubProduct,function(i,item){
                        var _i = _pro.suitSubProduct[i];
                        html = html
                            + '<!-- 副商品 -->'
                            + '<dl class="shop-prod lock clearfloat">'
                            + '<dd class="shop-item sel-wid">&nbsp;</dd>'
                            + '<dd class="shop-item pro-wid">'
                            + '<span class="left">'
                            + '<img style="width:120px;height: 120px" src="'
                            + _i.productImgUrl
                            + '" /></span>'
                            + '<span class="right">'
                            + '<div class="right-content">'
                            + '<a href="/pages/productDetail/productDetail.html?uuid='
                            + _i.productId
                            + '">'
                            + '<p class="m_pro">'
                            + _i.productName
                            + '</p>'
                            + '<p class="m_p1">';
                        if(_i.attrValues != ''){
                            $.each(_i.attrValues,function(i,item){
                                html = html
                                    + _i.attrValues[i].name
                                    + ':'
                                    + _i.attrValues[i].value
                                    + '<br>'
                            })
                        };
                        html = html
                            + '</p>'
                            + '</a>'
                            + '</div>'
                            + '</span>'
                            + '</dd>'
                            + '<dd class="shop-item pri-wid">'
                            + '<span class="j-price">¥' //marketPrice
                            + _i.singleMarketPrice
                            + '</span></dd><dd class="shop-item num-wid j-select" productId="'
                            + _i.productId
                            + '" skuNo="';
                        if(_i.attrIds!=null){
                            html += $.trim(_i.attrIds);
                        }else{
                            html += '';
                        }
                        html = html
                            + '" suituuid="'
                            + _pro.suitUuid
                            + '">'
                            + _i.buyNum
                            + '</dd>'
                            + '<dd class="shop-item sub-wid"></dd>'
                            + '<dd class="shop-item ope-wid">'
                            + '<span class="star j-star" productuuid="'
                            +  _i.productId
                            + '"></span>'
                            + '</dd>'
                            //+ '</dl>';
                    })
                }

                //促销信息
                if(_pro.pim && _pro.pim !=null && _pro.pim.promotionTypes != null){
                    var promotionTypes = _pro.pim.promotionTypes[0];
                    if( (_pro.onSell && !_pro.suitMain) || (_pro.suitMain && _pro.suitOnSell) && _pro.pim !== '' && promotionTypes != ''){ //$.inArray(_pro.productId, arr_unmarketable) == -1
                        var pim = _pro.pim;
                        html = html
                            + '<p class="promotionInfo">';
                        if(promotionTypes == '5')
                        {
                            html = html
                                + '<span class="red">打折</span>'
                                + pim.promotionName
                                + "("+pim.promotionTag+")"
                        }else if(promotionTypes == '7')
                        {
                            html = html
                                + '<span class="red">买减</span>'
                                + pim.promotionName
                                + pim.promotionTag;
                        };
                        if(pim && pim.productGiftList!=null && pim.productGiftList.length>0){
                            $.each(pim.productGiftList,function(i,item){
                                html = html
                                    + '<span>赠品:  '+item.productName+'</span>';
                            })
                        }
                        html = html
                            + '</p>';
                    }
                };

                html = html
                    + '</dl></div>';
                return html;
            };

            juicer.register('products_build',funcPros);
            var result = juicer(tpl,data);
            $('#shoppingList').html(result);
            $binder.init();

            //全选复选框
            var notSel = $(".checkbox.j-odd:not(.active)").length;
            if (notSel == 0) {
                $(".checkbox.j-all").addClass("active");
            }else{
                $(".checkbox.j-all").removeClass("active");
            }
            $(".buy").removeAttr("disabled").removeClass('disabled');

            //结算按钮状态
            // data.cartsShowToBlance
            if($('.sel-wid .active').length ){
                $(".buy").removeAttr("disabled").removeClass('disabled');
            } else {
                $('.buy').addClass('disabled').attr("disabled" , true);
            }
            //购物车底部操作
            shoppingFunc.operateBtn(data);
            //计算价格调用
            shoppingFunc.totalPrice(data);
            //悬浮
            //shoppingFunc.priceBar(data);
        },
        //更改储存
        changeLocalData: function (type,ID) {
            var uid = cartMap.cartUid;
            var cart_ = Store.get('shoppingcart');
            var cartStore = JSON.parse(cart_);
            if(cartStore) {
                var carts = cartStore.storeMap[uid];
                $.each(carts, function (i, o) {
                    if(ID == o.productUuid) {
                        o.checked = type;
                    }
                });
             Store.set('shoppingcart', JSON.stringify(cartStore))
            }else{
                throw '获取不到购物车储存'
            }
        },
        //跳转到订单
        submit: function (res) {
            $("#buy").on("click", function () {
                //_smq.push(['custom', 'PC', 'jiesuan']); //ad
                if(res) {
                    window.location.href = '../productInfo/productInfo.html'
                } else {
                    window.location.href = window.location.origin+'/sign';
                }
                // $http.get({
                //     url:'/order/toBalanceKuyu',
                //     success: function (data) {
                //         console.log(data)
                //     }
                // })
            });
        },
        //购物车底部操作
        operateBtn:function(data){
            var operate= $("#operate"),tpl = '';
            tpl = '<span class="pay-text pay-text-count">(已选<s style="color:red;text-decoration:none;">'+data.cartProductCount_sel+'</s>件商品)</span>'//共'+data.cartProductCount+'件商品
            + '<a href="javascript:;" id="removeNotsale">清空失效商品</a>'
            + '<a href="javascript:;" id="multiDel">删除选中商品</a>'
            + '<a href="javascript:;" id="multiFav">移入收藏</a>';
            operate.html(tpl);
        },
        //计算总价格
        totalPrice: function (data) {
            var subtotal= $("#subtotal");
            $Store.set('CartNum', data.cartProductCount);
            var tpl = '活动优惠：<span class="red" style="margin-right:24px">-'
                +'¥'+(parseFloat(data.productTotalMount)-parseFloat(data.cartsTotalMount)).toFixed(2)
                +'</span>'
                +' 合计（不含运费）：'
                +'<span style="font-size:24px;color:red;line-height:24px;vertical-align: sub;">¥'
                +data.cartsTotalMount
                // +'</em>'
                // +'<s style="color:gray">'+(parseFloat(data.productTotalMount) > parseFloat(data.cartsTotalMount) ? '¥'+parseFloat(data.productTotalMount) : "" )+'</s>'
                +'</span>';
            subtotal.html(tpl);
        },
        //悬浮
        priceBar: function (del) {
            var payment = $(".payment"),
                barHeight = payment.outerHeight(true),
                foot = $(".help").offset().top ;
            if(payment.hasClass('cartFixed')) {
                foot = foot +barHeight;
            }else if((Number(foot) - Number($(window).scrollTop()) ) > (Number($(window).height()) + Number(barHeight) ) ) {
                payment.addClass("cartFixed")
            } else {
                payment.removeClass("cartFixed");
            };
            $(window).trigger("scroll");
            $(window).scroll(function (e) {
                if((Number(foot) - Number($(this).scrollTop())) > (Number($(this).height()) + (Number(barHeight) > 325 ? 325 : Number(barHeight))) ) {
                    payment.addClass("cartFixed")
                } else {
                    payment.removeClass("cartFixed")
                }
            })
            $(window).resize(function(e) {
                if((Number(foot) - Number($(this).scrollTop())) > (Number($(this).height()) + (Number(barHeight) > 325 ? 325 : Number(barHeight))) ) {
                    payment.addClass("cartFixed")
                } else {
                    payment.removeClass("cartFixed")
                }
            });
        }
    };


    /* 参数说明
     _money：购物车金额
     _productList：商品清单，格式为：商品1ID,商品1数量;商品2ID,商品2数量;... */
    //复选框是否选中

    // loseProduct()
    function ajaxChangeChoose(operId ,flag,suitUuid, undefined, isLogin ) {
        var changeNumUrl = "/cart/changeChooseKuyu?random="+Math.random();
      //  mask();
        $http.get({
            url:changeNumUrl,
            data:{productIdAndAttrId:operId,chooseState:flag,suitUuid:suitUuid},
            success:function(data){
                fun(isLogin);
                //$("#shoppingCart").html(data);
            },
            error:function(res){
                throw res;
            }
        })
    }
    //未登录选择--功能没开发
    function changeListChoose(operId ,flag, suitUuid, self) {
        var uid = cartMap.cartUid;
        var cart_ = Store.get('shoppingcart');
        var cartStore = JSON.parse(cart_);
        var carts = cartStore.storeMap[uid];


        if(flag  && operId =='allRecords') {
            if(cartStore) { //全选
                $.each(carts, function (i, o) {
                    o.checked = true;
                });
                Store.set('shoppingcart', JSON.stringify(cartStore));
                //console.log('全选')
                //console.log(cartStore)
            }
        } else {
            if(cartStore) { //反选
                $.each(carts, function (i, o) {
                    o.checked = false;
                });
            }
            if(cartStore && self) {
                var add = $(".j-odd");
                $.each(carts, function (i, o) {
                    if(self.data("proid") == o.productUuid && self.hasClass('active')) {
                        o.checked = true
                    } else {
                        $.each(add, function (m, n) {
                            if($(n).hasClass('active')) {
                                var uid = $(n).data("proid");
                               if(o.productUuid==uid) {
                                    o.checked = true;
                               }
                            }
                        });
                    }
                });
                Store.set('shoppingcart', JSON.stringify(cartStore))
                // console.log('反选')
            }

        };
        if(checkFlag) {
            checkFlag = false;
            fun()
            $('.buy').addClass('disabled').attr("disabled" , true);

        }
    };

    //领取优惠券
    $scope.openQuan = function (e,evt) {
        var self = $(e);
        if(self.siblings().css("display") == "none") {
            $(".m_discount_pop").hide();
            self.siblings().show()
            self.data('tp', false);
        }else {
            self.data('tp', true);
            self.siblings().hide()
        }
        evt.stopPropagation();
    }
    $(document).on('click', function () {
        $(".m_discount_pop").hide();
        $(".m_discount_pop").siblings('h3').data('tp',true)
    })
    /*
    * @couponTypeUuid  {string}
    * @type            {string}
    * */
    function downLoadCoupon(couponTypeUuid, type){
        if(type) {
            Msg.Confirm("", "领取该优惠券，需抵扣积分值"+type, function () {
                sendMsg();
            })
        } else {
            sendMsg();
        }

        function sendMsg() {
            var downLoadUrl = "/cart/downLoadCoupon?random="+Math.random() ;
            $http.get({
                url:downLoadUrl,
                data:{couponTypeUuid:couponTypeUuid ,ranNum:Math.random()},
                success:function(data){
                    //1领取成功 2.领取失败 3.已经领取多次  2017/10/10  成功0
                    if("0"==data.code) {
                        Msg.Alert("","领取成功",function(){});
                    }else if("3"==data.code){
                        Msg.Alert("","您已经领取过了",function(){});
                    }else{
                        Msg.Alert("",data.msg,function(){});
                    }
                },
                error:function(e){
                    throw e;
                }
            });
        }
    }


    //取消掉原有的加减购买数量事件
    $(document).off('click','.j-select .add');
    $(document).off('click','.j-select .reg');


    function changeCartNum(type,stockId, isLogin){
        var $input = $("#stock_" + stockId);
        var inputValue = $input.val();
        var buyType = '';
        inputValue = parseInt(inputValue);
        if(type == 0 && inputValue <= 1){
            return;
        }
        else if(type == 0){
            buyType = 'reducestock'
            inputValue = inputValue - 1;
        }else{
            buyType = 'addstock'
            inputValue = inputValue + 1;
        }

        $input.val(inputValue);
        var operId = $input.attr("id");
        var buyNum = $input.val().replace(/[^\d]/g, '');
        if(buyNum == "") {
            buyNum = 1 ;
        }
        var arr = stockId.split('_');
        var a = buyType+'_' + arr[0] + '_' + arr[1];
        //套装活动需同时改变数量
        if($input.attr("suituuid")){
            a = '';
            $(".j-select[suituuid='" + $input.attr("suituuid") + "']").each(function(i, o) {
                $(this).html(buyNum);
                a += buyType+'_'+ $(o).attr("productid") + '_' +$(o).attr("skuno")+'_'+$input.attr("suituuid")+';'
            })
        }
        if(buyNum > 999) {
            Msg.Alert("","商品数量超限",function(){
                $('.buy').removeClass('disabled').attr("disabled" , false);
            });
            $input.val(999);
            addFlag = true;
            ajaxChangeNum(a ,999,$input.attr("suituuid"), isLogin, null, $input);
        } else {
            $input.val(buyNum);
            ajaxChangeNum(a ,buyNum,$input.attr("suituuid"), isLogin,null, $input);
        }
    }

    //修改购买数量
    function ajaxChangeNum(operId ,changeNum, suitUuid, isLogin, blur, self) {
        if(isLogin) {
            var changeNumUrl = "/cart/changeNumsKuyu?random="+Math.random();
          //  mask();
            $http.get({
                url:changeNumUrl,
                data:{productIdAndAttrId:operId,changeNum:changeNum,ranNum:Math.random(),suitUuid:suitUuid != 'null' ? suitUuid : null },
                success:function(data){
                    fun(isLogin);
                   // unmask();
                }
            });
       } else {
            var cart_ = Store.get('shoppingcart');
            var cartStore = JSON.parse(cart_);
            var b = operId.split('_');
            $.each(cartStore.storeMap[cartMap.cartUid], function (i , o) {
                if(b.length <=3 && this.productUuid == b[1] && (this.isSuitMain?(this.isSuitMain!=1):(this.isSuitMain!=0)) ) {
                    this.buyNum = (changeNum>self.data('max')?self.data('max'):changeNum);
                }else if(b.length>3 && this.isSuitMain>=0 && suitUuid ==o.suitUuid){
                    this.buyNum = changeNum
                }
            });
            Store.set('shoppingcart',JSON.stringify(cartStore))
            fun(isLogin);
        }
    }

    //切换商品收藏状态
    function toToggleProductCollectState(uuid , el, isLogin){

        if(!isLogin)
            Msg.Alert("","请先登录",function(){
                window.location.href=window.location.origin+"/sign";
            });

        if($(el).hasClass("active")){
            Msg.Confirm('', '确定将该商品取消收藏吗？', function () {
            cancelFavorite(uuid , function(){
                $(el).removeClass("active").html('移入收藏');
            });
            })
        }
        else{
            Msg.Confirm('', '确定将该商品移入收藏吗？', function () {
                var jOdd = $(el).parents('.shop-box').find('span.jar');
                var notSale = $(el).parents('.shop-box').find('span[data-notsale]');
                if(!jOdd.data('notsale') && notSale.data('notsale')) {
                    jOdd = notSale;
                }
                var suitUuid = jOdd.attr('suituuid');
                var id = 'remove_' + jOdd.attr('id').substring(8) + (suitUuid&&suitUuid!='null'?'_'+suitUuid:'');
                if(!$(el).hasClass("active")){
                   ajaxRemove(id , suitUuid, 'isLogin');
                }
            collectProductCart(uuid , function(){
                $(el).addClass("active").html('取消收藏');
            });

            })
        }
    }
    //收藏
    function collectProductCart(productUuid , callback){
        var url = '/front/product/collectProduct?random='+Math.random();
        $http.get({
            url:url,
            data:{
                productUuid:productUuid,
                ranNum:Math.random()
            },
            success:function(data){
                //收藏成功返回1,收藏失败返回2,已经收藏返回3
                //批量收藏统一返回1
                if(data == "1"||data=='3'){
                    //alert('收藏成功');
                    if(callback) callback();
                }else if(data == '2'){
                    //alert('收藏失败！请稍后重试。');
                }
            },
            error:function(res){
                throw res;
            }
        })
    }
    //取消收藏
    function cancelFavorite(productUuid , callback){
        var url = '/front/product/cancelFavorite?random='+Math.random();

        $http.get({
            url:url,
            data:{
                productUuid:productUuid,
                ranNum:Math.random()
            },
            success:function(data){
                if(data == "1"){
                    //alert('取消收藏成功')
                    if(callback) callback();
                }else{
                    //alert('操作失败！请稍后重试。');
                }
            },
            error:function(res){
                throw res;
            }
        })
    }
    /************收藏按钮************/
    //加载显示收藏商品，收藏按钮添加“已收藏”样式
    function checkState(){
        $http.get({
            url:'/front/product/getMyProductFavoriteList?random='+Math.random(),
            success:function(data){
                if(data.code ==1 ) {
                    var result = data.retData;
                    var favArr = [];
                    var favDom = $(".star.j-star")
                    $.each(result, function (i , o) {
                        if(o.state == '1') {
                            favArr.push(o.productUuid)
                        }
                    });
                    $.each(favDom, function (i, o) {
                        var Id = $(o).attr('productuuid');
                        if($.inArray(Id,favArr) > -1){
                            $('.star.j-star[productUuid="' + Id +'"]').addClass('active').html('取消收藏');
                        }else{
                          $('.star.j-star[productUuid="' + Id +'"]').removeClass('active').html('移入收藏');
                        }
                    });

                }else{
                    if(Array.of){
                        console.warn(data)
                    }
                }
            },
            error:function(e){
                throw e;
            }
        })
    }

    /************删除按钮************/
    //弹出确认是否删除框  单个删除

    function removeProduct(id , suitUuid, el, login){
        var rid = id.substring(id.indexOf("_"));
        Msg.Confirm('', '确认要删除该宝贝吗？', function () {
            $(".shop-cont-"+rid).remove();
            ajaxRemove(id , suitUuid, login);
        })
    }
    //删除购物车中的商品
    function ajaxRemove(operId , suitUuid, login) {
        if(login) {
            var removeUrl = "/cart/removeKuyu?random="+Math.random() ;
          //  mask();
            $http.get({
                url:removeUrl,
                data:{productIdAndAttrId:operId,ranNum:Math.random(),suitUuid:suitUuid},
                success:function(data){
                    fun(login);
                    //unmask();
                }
            });
        } else {
            var cart_ = Store.get('shoppingcart');
            var cartStore = JSON.parse(cart_);
            var b = operId.split('_');

            for(var i=cartStore.storeMap[cartMap.cartUid].length-1;i>=0;i--) {
                var self = cartStore.storeMap[cartMap.cartUid][i];
                if(self.isSuitMain!=null && self.isSuitMain >=0) {
                    if(b[b.length-1] == self.suitUuid) {
                        cartStore.storeMap[cartMap.cartUid].splice(i,1)
                    }
                }else {
                    if(b[1] == self.productUuid) {
                        cartStore.storeMap[cartMap.cartUid].splice(i,1)
                    }
                }
            }

            Store.set('shoppingcart',JSON.stringify(cartStore));
            fun(login);
        }
    }

    //显示加载gif，提示用户
    function mask(){
        $("#imgLoading").show();
        $(".buy").attr("disabled" , true).addClass('disabled');
    }

    //关闭加载gif，提示用户
    function unmask(){
        $("#imgLoading").hide();
        if($('.sel-wid .active').length){
            $(".buy").removeAttr("disabled").removeClass('disabled');
        }
        else {
            $('.buy').addClass('disabled').attr("disabled" , true);
        }
    }

    //购物车列表 使用juicer渲染
    function fun(isLogin){
        var localData  = Store.get('shoppingcart');
        var res = JSON.parse(localData);
        var list = res ? res.storeMap[cartMap.cartUid] : [];
        var cartNewMaps = {};
        var listMap = {};
        //根据 storeUuid 重组数据
        if(list && list.length > 0) {
            $.each(list, function (i , o) {
                if(o.storeUuid) {
                    listMap[o.storeUuid] =  [];
                }
            });

            $.each(list, function (i ,o ) {
                if(listMap[o.storeUuid]) {
                    listMap[o.storeUuid].push(o)
                }else{
                    //如个没有商铺ID就直接丢这个ID里面
                    listMap['03d03b6b05604c5cb065aef65b72972e'].push(o)
                }
                //add time 9/25
                o.buyNum > 999 ? (o.buyNum = 999) : o.buyNum;
            })
        };
        cartNewMaps["storeMap"] = listMap;
        var localDataNew = JSON.stringify(cartNewMaps);
        var lod = $(".loading");
        if(!isLogin && list.length<1) {
            lod.hide()
        } else {
            lod.show().css({
                top: (($(window).height()/2-160)<150 ? 150 : $(window).height()/2-160)+'px',
            });
        }

        // if(localData && res.storeMap[cartMap.cartUid].length==0 && !isLogin) {
        //     $(".shopping").hide();
        //     $(".box.gray-back ").hide();
        //     $(".buy-box").show();
        // }else {
            var $init = KUYU.Init;
            $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
          //  mask();
            $http.post({
                url:'/cart/show?rando='+Math.random(),
                data:localDataNew,
                cache:false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success:function(data){
                    data.isLogin = isLogin;
                    $binder.sync(data)
                    if(data.code == CODEMAP.status.success) {
                        addFlag = true;
                        checkFlag = true;
                   //     unmask();
                        //收藏状态检测

                        var kefuList = [];
                        var res = data.data;
                        shoppingFunc.renderList(res, isLogin)
                        if(res.carts.length>0) {
                            $.each(res.carts, function (i, o) {
                                kefuList.push({id:o.productId, count: o.buyNum})
                            });
                        };
                        var kf_info = {};
                        if(typeof isLogin == 'object'){
                            kf_info.uid = isLogin.data.customerUuid
                            kf_info.uname = (isLogin.data.nickName || isLogin.data.customerName )
                        }else {
                            kf_info.uid = '';kf_info.uname = '';
                        }
                        NTKF_PARAM = {
                            siteid: "kf_9428",                    //企业ID，为固定值，必填
                            settingid: "kf_9428_1525949700591",   //接待组ID，为固定值，必填
                            uid: kf_info.uid,                         //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
                            uname: kf_info.uname,                           //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
                            isvip:"0",                           //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
                            userlevel:"1",                       //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
                            erpparam:"abc",                      //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
                            ntalkerparam:{                       //购物车专属参数，
                                cartprice :res.cartsTotalMount,	              	//购物车总价
    　　		                   items:kefuList		                    //注意：这里是items
                            }
                        }
                        if(isLogin) {
                            checkState();
                            $header.getCartCount(true)
                        }else{
                            $header.getCartCount()
                        }
                        //shoppingFunc.priceBar();

                    }else {
                        //如果登录了，清空了购物车，重新刷一次count
                        if(isLogin){
                            $header.getCartCount(true)
                        }else{
                            $header.getCartCount()
                        }
                        shoppingFunc.renderList(null)
                        $Store.set('CartNum', 0);
                    }
                },
                error:function(res){
                    throw res;
                }
            });
      //  }
    };

});
