/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/14
 */
require(['KUYU.Service', 'KUYU.Util', 'KUYU.plugins.alert', 'KUYU.Binder', 'KUYU.Store', 'juicer', 'lightbox'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $Store = KUYU.Store,
        Util = KUYU.Util,
        Map = $init.Map(),
        Map2 = $init.Map(),
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        path = _sever[_env.sever],
        $scope = KUYU.RootScope;


    function EventDispatcher() {
        this.events = {};
    };

    EventDispatcher.prototype.addEventListener = function(type, handler) {
        if (typeof handler != 'function') return;
        this.events[type] = handler;
    };

    EventDispatcher.prototype.dispatchEvent = function(type, body) {
        var e = {};
        e.body = body;
        this.events[type](e);
    };

    var _event = new EventDispatcher();

    var from = encodeURIComponent(location.href);
    var _UUID = $("#GLOBAL_UUID").val();
    var isSeckill = $("#GLOBAL_TYPE").val();
    var categoryUuid = $("#GLOBAL_categoryUuid").val();
    var secondParentCategoryName = $("#secondParentCategoryName").val();
    var globalField = { "localStoreId": "03d03b6b05604c5cb065aef65b72972e" };
    var channelDic = {
        "电视": 'tv',
        "手机": 'mobile',
        "空调": 'air',
        "冰箱": 'refrigerator',
        "洗衣机": 'washer',
        "健康电器": 'homeappliance'
    }
    var param = { //这个是存购物车
        'storeMap': {}
    };

    function formatxss(dom) {
        if (!dom) return false;
        var d = document.createElement('div');
        dom = dom.replace(/\s+/ig, '');
        d.innerHTML = dom;
        return d.innerText;
    }
    var submitUrl = ''; //存放URL
    globalField.promotionUuid = $("#promotionUuid").val();
    globalField.nowPromotion = ''; //单品促销ID
    globalField.skuNo = $("#skuNo").val();
    globalField.reserveOrderId = $("#reserveOrderId").val(); //这个ID是判断能不能参加预约的
    globalField.reservePromotionUuid = $("#reservePromotionUuid").val();

    globalField.activeStatus = $("#activeStatus").val();
    globalField.preSaleType = $("#preSaleType").val(); //parentSkuNo
    globalField.parentSkuNo = $("#parentSkuNo").val();
    globalField.showTypedisp = $("#showTypedisp").val();
    globalField.storeUuid = $("#storeUuid").val();

    var getProductDetail = function(_UUID) {
        if (isSeckill == 'true') {
            allRender.seckill();
        } else {
            //渲染模版
            //促销信息
            //获取属性
            //尺寸颜色选择方法
            allRender.skipGroupProduct();
            allRender.upDateTime();
            //获取收货地址-这里关联到库存
            getAddress.getProvince();
            //顶部固定条
            // getFixedPrice(data);
            ///////////////评论
            ajaxSearchComment(1, 5);
        }
    }

    var allRender = {
        seckill: function() { //toLimitProductKuyu
            var dom = $('<a class="buy" id="buyAId" href="javascript:;" >立即购买</a>');
            $("#promotionSub").html(dom);
            var dom1 = $('<a href="javascript:;" class="buy" id="fixedFastBuy">立即购买</a>');
            $("#fixedBuy").html(dom1);

            //获取收货地址-这里关联到库存
            getAddress.getProvince();
            //渲染模版
            //获取属性
            allRender.skipGroupProduct();
            //getFixedPrice(data);

            ///////////////评论
            ajaxSearchComment(1, 5);
            ///////////////////////

            //秒杀函数
            var doubleKill = function() {
                    var productUuid = $("#productUuid").val();
                    var provinceId = $("#provinceId").val();
                    var cityId = $("#cityId").val();
                    var region = $("#region").val();
                    var areaUuid = $("#areaUuid").val();
                    var skuNo = $("#skuNo").val();
                    var promotionUuid = $("#limitpromotionUuid").val();
                    //检查是否能够下单
                    //  promotionUuid=eccd79bf44ed44ba97c6172e8bac10fb&productSkuNo=P001010101010100122
                    //  "/order/checkCanSaveLimitOrder"
                    $http.get({
                        url: "/cart/checkLimitBuy",
                        data: {
                            promotionUuid: globalField.promotionUuid,
                            skuNo: globalField.skuNo,
                            areaUuid: areaUuid,
                            region: region,
                            provinceId: provinceId,
                            cityId: cityId,
                            _t: Math.random()
                        },
                        success: function(data) {
                            if (data.code == "true") {
                                window.location.href = "/pages/limitProduct/limitProduct.html?skuNo=" + globalField.skuNo + "&promotionUuid=" + globalField.promotionUuid + "&areaId=" + areaUuid
                            } else if (data.code == 1) {
                                // $init.nextPage('login',{})
                                window.location.href = "{{login}}?from=" + from;

                            } else if (data.code == CODEMAP.status.TimeOut || data.code == CODEMAP.status.notLogin) {
                                Msg.Alert("", "未登录", function() {
                                    // $init.nextPage('login',{})
                                    window.location.href = "{{login}}?from=" + from;

                                })
                            } else {
                                Msg.Alert("", data.message, function() {});
                            }
                        }
                    });
                }
                //右上角立即购买
            dom.on('click', function(e) {
                    if ($(this).hasClass('disabled')) {
                        return
                    }
                    doubleKill();

                })
                //悬浮立即购买
            dom1.on('click', function(e) {
                if ($(this).hasClass('disabled')) {
                    return
                }
                doubleKill();

            })
            var SysSecond = parseInt($("#seckillTime").val(), 10); //系统秒杀时间
            function SetRemainTime() {
                if (SysSecond > 0) {
                    SysSecond = SysSecond - 1;
                    var second = Math.floor(SysSecond % 60); // 计算秒
                    var minute = Math.floor((SysSecond / 60) % 60); //计算分
                    var hour = Math.floor((SysSecond / 3600) % 24); //计算小时
                    var day = Math.floor((SysSecond / 3600) / 24); //计算天

                    $("#limit_endTime").html(day + "天" + hour + "时" + minute + "分" + second + "秒");
                } else {
                    //剩余时间小于或等于0的时候，就停止间隔函数
                    window.clearInterval(InterValObj);
                    // $("#buyAId").addClass("disabled");
                    if ("status2" == activeStatus) {
                        $("#limit_endTime").html("活动还没开始");
                    } else {
                        $("#limit_endTime").html("活动已结束");
                    }
                }
            };
            SetRemainTime();
            (function() {
                var handEndTime = $("#handEndTime").val();
                if ('' == handEndTime) {
                    InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
                } else {
                    $("#limit_endTime").html("活动已结束");
                }
            })();

        }, //促销、预约、尾款
        //点击跳转组合商品页面
        skipGroupProduct: function() {
            $("#groupedProduct").on("click", ".options .groupedproduct", function() {
                var uuid = $(this).attr("data-uuid")
                if (uuid) {
                    window.location.href = window.location.origin + '/' + uuid;
                }
            })

        },
        ImgShow: function() {
            var purc = $(".purc-img .item"),
                radius = $(".purc-list .radius ");
            $.each(radius, function(i, o) {
                $(this).on('click', function(e) {
                    radius.removeClass("active");
                    purc.removeClass("active")
                    $(this).addClass("active");
                    purc.eq(i).addClass("active")
                })
            })
        },
        upDateTime: function() {
            var SysSecond = parseInt($("#SysSecond").val(), 10);
            var InterValObj;
            if (globalField.activeStatus == 'status1' || globalField.activeStatus == 'status2' || globalField.activeStatus == 'status3' || globalField.activeStatus == 'status4') {
                InterValObj = window.setInterval(SetRemainTime, 1000); //间隔函数，1秒执行
            }

            function SetRemainTime() {
                if (SysSecond > 0) {
                    SysSecond = SysSecond - 1;
                    var second = Math.floor(SysSecond % 60); // 计算秒
                    var minite = Math.floor((SysSecond / 60) % 60); //计算分
                    var hour = Math.floor((SysSecond / 3600) % 24); //计算小时
                    var day = Math.floor((SysSecond / 3600) / 24); //计算天

                    $("#daysId").html(day);
                    $("#hoursId").html(hour);
                    $("#minutesId").html(minite);
                    $("#secondeId").html(second);
                } else {
                    //剩余时间小于或等于0的时候，就停止间隔函数
                    window.clearInterval(InterValObj);
                    //这里可以添加倒计时时间为0后需要执行的事件,如果一直是去支付状态，此时需要调用接口关闭订单
                    window.location.reload();
                }
            }
        }
    };
    /******************
     * 区域地址全局变量 *
     ******************/
    if (localStorage.getItem("add") && localStorage.getItem("add") != "") {
        var pcrs = JSON.parse(localStorage.getItem("add"));
        var checkedProvince = pcrs.province;
        var checkedCity = pcrs.city;
        var checkedRegion = pcrs.region;
        var checkStreets = pcrs.street;
    } else {
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
        param: {
            checkedProvince: checkedProvince,
            checkedCity: checkedCity,
            checkedRegion: checkedRegion,
            checkStreets: checkStreets,
        },
        //改变按钮状态
        changeButton: function(activeStatus, preSaleType) {
            var promotionSub = $("#promotionSub");
            var fixBuy = $("#fixedBuy");
            if ("status2" == activeStatus) { //预约剩余时间
                submitUrl = '/front/product/addProductToOrder';
            } else if ("1" == preSaleType) { //全款
                submitUrl = '/front/product/presaleProductToOrder'; //付定金跳到包含地址栏的下单页面
            } else if ("2" == preSaleType) {
                submitUrl = '/front/product/presaleProductToOrder'; //付定金跳到包含地址栏的下单页面
            }
        },
        getProvince: function() {
            $http.get({
                url: "/usercenter/region/getAllProvince",
                data: {
                    "time": Math.random()
                },
                success: function(data) {
                    if (!data) {
                        Msg.Alert("", "获取区域地址失败", function() {});
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
                            provinceStr = provinceStr + "<li provinceliid='" + province.uuid + "' onclick='getAddress.showCity(\"" + province.uuid + "\" ,\"\");' >" + province.provinceName + "</li>";
                        }
                        provinceStr = provinceStr + "<input type='hidden'   name='province' id='provinceId'  value='" + checked + "' />";
                        $("#provinces").html(provinceStr);
                        if (getAddress.param.checkedProvince) {
                            $("[provinceliid='" + getAddress.param.checkedProvince + "']").parents(".m_areabox .mc").hide();
                            $("[provinceliid='" + getAddress.param.checkedProvince + "']").parents(".m_areabox .mc").next(".m_areabox .mc").show();
                            $("#provinceId").val(getAddress.param.checkedProvince);
                        }

                    }

                    var addressUuid = "";
                    if ("" != getAddress.param.checkedProvince) {

                        if ("" != getAddress.param.checkedCity) {
                            addressUuid = getAddress.param.checkedCity;
                            getAddress.showCity(getAddress.param.checkedProvince, getAddress.param.checkedCity, getAddress.param.checkedRegion, getAddress.param.checkStreets);
                        }

                        addressUuid = getAddress.param.checkedProvince;

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
                error: function(res) {
                    /*if(console)console.log(res)*/
                }
            });


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
                        if (city.uuid == checkedCity) {
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
        showRegion: function(cityId, checkRegion, checkStreets) {
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
                url: "/usercenter/region/getStreetsByRegionUuid",
                data: {
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
        checkstock: function(streetUuid) {
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
                if (!globalField.promotionUuid) {
                    getAddress.getProductRelSuit(_UUID, getAddress.param.checkedRegion);
                }
            }
        }, //：检查商品库存
        hasProduct: function(cb) {
            var region = $("#region").val(); //有字段 县
            var areaUuid = $("#areaUuid").val(); //有字段 乡镇
            var skuNo = globalField.skuNo; //有字段
            var parentSkuNo = globalField.parentSkuNo; //有字段
            var showTypedisp = globalField.showTypedisp; //有字段
            var provinceId = $("#provinceId").val();
            var buyDom = $("#buyNum");
            var cityId = $("#cityId").val();
            var buyNum = $("#buyNum").val();

            var noProduct = function(data) {
                if (data.retData.totalNum && data.retData.totalNum > 0) {
                    buyDom.val(data.retData.totalNum).data('max', data.retData.totalNum);
                    Msg.Alert("", "库存不足，请减少库存尝试", function() {});
                } else {
                    $("#isProduct").html("无货");
                    $("#fastBuy").attr("href", "javascript:;");
                    $("#buyAId").attr("href", "javascript:;");
                    $("#fixedFastBuy").attr("href", "javascript:;");
                    $("#buyAId").addClass("bespoke disabled");
                    $("#fastBuy, #fixedFastBuy").addClass("fastBuyDisabled");
                    $("#fastBuy, #fixedFastBuy").attr("disabled", true);
                    $("#fastBuy, #fixedFastBuy").addClass("bespoke");
                    if (showTypedisp != "subscribe") {
                        $("#buyAId").removeClass("buy");
                        $("#buyAId").addClass("bespoke disabled");
                    }
                    if (showTypedisp != "subscribe" && showTypedisp != "reserve") {
                        $("#fastBuy").attr("href", "javascript:;");
                        $("#buyAId").attr("href", "javascript:;");
                    }
                    buyDom.val(1)
                    Msg.Alert("", "库存不足，请减少库存尝试", function() {});
                }
            };
            if (!/^\d{1,7}$/.test(buyNum)) {
                if (buyNum > buyDom.data('max')) {
                    Msg.Alert("", "库存不足，请减少库存尝试", function() {});
                    buyNum = buyDom.data('max');
                    buyDom.val(buyNum)
                } else {
                    buyNum = 1;
                }
            } else if (buyNum <= 1) {
                buyNum = 1;
            }
            var url = '/front/product/hasProduct',
                postData = {
                    "region": region,
                    "areaUuid": areaUuid,
                    "skuNo": skuNo,
                    "buyNum": buyNum,
                    "bcustomerUuid": '',
                    "bType": bType,
                    "parentSkuNo": parentSkuNo,
                    "time": Math.random(),
                    "reservePromotionUuid": globalField.reservePromotionUuid //预售校验库存
                };
            if (globalField.skuNo && globalField.promotionUuid) { //查秒杀库存
                url = '/front/product/hasLimitProduct';
                postData = {
                    "region": region,
                    "areaUuid": areaUuid,
                    "skuNo": skuNo,
                    "buyNum": buyNum,
                    "bType": bType,
                    "provinceId": provinceId,
                    "promotionUuid": globalField.promotionUuid,
                    "cityId": cityId,
                    "parentSkuNo": parentSkuNo, // 秒杀的parentSkuNo这里会是空,有没有值都没关系，因为后端数据结构不对
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
                            if (postData.reservePromotionUuid) { ////预售校验库存
                                if (result.canBuy && result.hasProduct && result.totalNum > 0) {
                                    result.canBuy = true;
                                } else {
                                    result.canBuy = false;
                                }
                            }
                            if (result.canBuy) {
                                buyDom.data('max', data.retData.totalNum);
                                if (data.retData.totalNum && buyNum > data.retData.totalNum) {
                                    Msg.Alert("", "库存不足，请减少购买数量尝试", function() {});
                                }
                                $("#isProduct").html("有货");
                                $("#buyAId").removeClass("bespoke disabled");
                                if (isSeckill != 'true') {
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
                                $("#fastBuy, #fixedFastBuy").addClass("bespoke");
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

                        if ($.isFunction(cb)) cb();
                    }
                }
            })
        },
        //获取套装
        getProductRelSuit: function(productUuid, regionId) {
            $http.post({
                url: '/front/product/getSuitMainByRegion',
                data: {
                    productUuid: _UUID,
                    regionId: regionId
                },
                success: function(data) {
                    var dom = $("#suitList");
                    globalField.Suit = data.retData; /*储存套装列表内容*/
                    if (globalField.Suit != '') {
                        dom.show();
                    }
                    if (data.code == '1' && data.retData.length > 0) {
                        var tpl = '<div class="sale">' +
                            '      <ul class="sale-tit">' +
                            '          {@each retData as suit , index}' +
                            '                   <li suitUuid="${suit.uuid}" class="item ${index ==0?"active":"" }">${suit.name}</li>' +
                            '          {@/each}' +
                            '      </ul>' +
                            '      <div class="sale-pro">' +
                            '             $${retData| setDom}' +
                            '      </div>' +
                            '  </div>';

                        var setDom = function(suit) {
                            var html = '';
                            $.each(suit, function(i, o) {
                                var isShowDefalut = 0,
                                    defaultUuid = '',
                                    storeUuid = '';
                                html += ' <div class="suit-item">'
                                $.each(o.suitProductRellist, function(n, co) { //suitProductRel
                                    html += '<input type="hidden" suitUuid="' + o.uuid + '" class="suitproductskuno" value="' + co.skuNo + '" parentSkuNo="' + co.parentSkuNo + '" />'
                                    if (isShowDefalut == 0 && (_UUID == co.productUuid || data.productUuid == co.productUuid)) {
                                        html += '<div class="sale-item">' +
                                            '   <img style="width: 140px ; height: 140px" src="' + co.productSkuListModel.smallImg + '" />' +
                                            '   <p class="name">' + co.productSkuListModel.productName + '</p>' +
                                            '      <strong class="price">' + co.productSkuListModel.price + '元' +
                                            '          <font class="suitSplitError" skuNo="' + co.skuNo + '"></font>' +
                                            '      </strong>' +
                                            '</div>'
                                        isShowDefalut = 1;
                                        defaultUuid = co.uuid
                                    }
                                    storeUuid = co.storeUuid;
                                });
                                html += '<div class="sale-item sale-add">' +
                                    '  <span class="sale-plus"></span>' +
                                    '</div>'
                                $.each(o.suitProductRellist, function(m, so) { //suitProductRel
                                    if (!so.buyNum) so.buyNum = 1; //如套装默认购买数量不存在则设置为0;
                                    if (defaultUuid != so.uuid) {
                                        html += ' <div class="sale-item">' +
                                            '     <a href="/' + so.productUuid + '"><img style="width: 140px ; height: 140px" src="' + so.productSkuListModel.smallImg + '" /></a>' +
                                            '     <p class="name">' + so.productSkuListModel.productName + '</p>' +
                                            '      <strong class="price">' + so.productSkuListModel.price + '元' +
                                            '          <font class="suitSplitError" skuNo="' + so.skuNo + '"></font>' +
                                            '      </strong>' +
                                            '</div>'
                                    }

                                });
                                html += '   <div class="sale-item sale-add fr">' +
                                    '      <p class="sale-text">商品搭配优惠</p>' +
                                    '      <p class="sale-text">套装价</p>' +
                                    '      <p class="sale-text font24">' + o.totalAmount + '<strong>元</strong></p>' +
                                    '      <p><s>' + o.costAmount + '<strong>元</strong></s></p>' +
                                    '      <button class="buy fastBuyDisabled buySuitBtn" index="' + i + '" storeUuid="' + storeUuid + '" suitUuid="' + o.uuid + '">立即购买</button>' +
                                    '    </div>' +
                                    ' </div>';
                            });
                            return html;
                        };
                        juicer.register('setDom', setDom)
                        var html = juicer(tpl, data);
                        dom.html(html);
                        var saleTit = $(".sale-tit li"),
                            salepro = $(".sale-pro .suit-item");
                        salepro.hide();
                        $.each(saleTit, function(i, o) {
                            salepro.eq(0).show();
                            $(this).on('mouseover', function() {
                                saleTit.removeClass("active");
                                salepro.hide();
                                $(this).addClass("active");
                                salepro.eq(i).show();
                            })
                        });
                        getAddress.hasSuitProduct(data.retData);
                        $(".buySuitBtn").click(function() {
                            var suitUuid = $(this).attr("suitUuid"),
                                index = $(this).attr("index"),
                                suit = globalField.Suit, //套装
                                areaUuid = $("#areaUuid").val(); //有字段 乡镇
                            var currentList = suit[index],
                                arrMap = [];

                            var shoppingcart = $Store.get('shoppingcart')
                            if (shoppingcart) {
                                var res = JSON.parse(shoppingcart);
                                if (globalField.storeUuid == '') {}
                                var arr = res.storeMap[globalField.localStoreId];
                                param.storeMap[globalField.localStoreId] = arr;
                            } else {
                                param.storeMap[globalField.localStoreId] = [];
                            }

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
                                    while (k < len) {
                                        var kValue, mappedValue;
                                        if (k in O) {
                                            kValue = O[k];
                                            mappedValue = callback.call(T, kValue, k, O);
                                            A[k] = mappedValue;
                                        }
                                        k++;
                                    }
                                    return A;
                                };
                            }
                            //修正套装bug

                            var listMap = {};
                            var dicMap = {};
                            param.storeMap[globalField.localStoreId].map(function(ele, index, arr) {
                                dicMap[ele.productUuid] = arr[index];
                                arrMap.push(ele.suitUuid)
                            });
                            currentList.suitProductRellist.map(function(ele, index, arr) {
                                listMap[ele.productUuid] = arr[index]
                            });

                            if (param.storeMap[globalField.localStoreId].length < 2) {
                                $.each(currentList.suitProductRellist, function(i, o) {
                                    param.storeMap[globalField.localStoreId].push({
                                        "suitUuid": o.suitUuid,
                                        "buyNum": o.buyNum,
                                        "attrId": o.skuNo,
                                        "isSuitMain": o.isSuitMain,
                                        "distributorUuid": '',
                                        "productUuid": o.productUuid,
                                        "storeUuid": o.storeUuid,
                                        "type": "01",
                                        "opeTime": new Date().getTime()
                                    });

                                });
                            } else {
                                param.storeMap[globalField.localStoreId].map(function(ele, index, arr) {
                                    if (listMap[ele.productUuid] && listMap[ele.productUuid].suitUuid == ele.suitUuid) {
                                        ele.buyNum = parseInt(ele.buyNum) + 1;
                                    } else {
                                        if (currentList.suitProductRellist[index]) {
                                            if ($.inArray(currentList.suitProductRellist[index].suitUuid, arrMap) == -1) {
                                                param.storeMap[globalField.localStoreId].push({
                                                    "suitUuid": currentList.suitProductRellist[index].suitUuid,
                                                    "buyNum": currentList.suitProductRellist[index].buyNum,
                                                    "attrId": currentList.suitProductRellist[index].skuNo,
                                                    "isSuitMain": currentList.suitProductRellist[index].isSuitMain,
                                                    "distributorUuid": '',
                                                    "storeUuid": currentList.suitProductRellist[index].storeUuid,
                                                    "type": "01",
                                                    "productUuid": currentList.suitProductRellist[index].productUuid,
                                                    "opeTime": new Date().getTime()
                                                })
                                            }

                                        }
                                    }
                                });
                            }
                            $http.post({
                                url: '/front/product/addSuitProductToCartKuyu',
                                data: {
                                    suitUuid: suitUuid,
                                    buyNum: 1,
                                    distributorUuid: '',
                                    mainProductUuid: _UUID,
                                    mainSkuNo: globalField.skuNo,
                                    areaUuid: areaUuid,
                                },
                                success: function(data) {
                                    if (data.code == CODEMAP.status.success) {
                                        $init.nextPage('cart', {})
                                    } else {
                                        $Store.set('shoppingcart', JSON.stringify(param));
                                        $init.nextPage('cart', {})
                                    }
                                }
                            })
                        });
                    }
                }
            })
        },
        //检查套装商品库存
        hasSuitProduct: function(data) {
            var region = $("#region").val(); //有字段 县
            var areaUuid = $("#areaUuid").val(); //有字段 乡镇
            var skuNo = globalField.skuNo; //有字段
            var parentSkuNo = globalField.parentSkuNo; // 套装主商品SKU
            var showTypedisp = globalField.showTypedisp; //有字段
            var buyNum = $("#buyNum").val();
            var map = Map;
            var mapUid = Map2;
            var suitMAP = {};
            $.each(data, function(i, o) {
                var subSuit = o.suitProductRellist;
                var parentUUid = o.uuid;
                var pd = {};
                pd[parentUUid] = parentUUid;
                mapUid.put(o.uuid, pd);
                $.each(subSuit, function(i, o) {
                    var d = { sku: o.skuNo, parentUUid: parentUUid, parentSkuNo: o.parentSkuNo };
                    map.put(o.skuNo, d);
                    suitMAP[o.skuNo] = o.skuNo;
                });
            });

            var arr = map.values();
            var suitEvent = [];
            $.each(arr, function(i, o) {
                $http.post({
                    url: "/front/product/hasProduct",
                    data: {
                        "region": region, //5
                        "areaUuid": areaUuid, //3
                        "skuNo": o.sku, //1
                        "buyNum": buyNum || 1, //4
                        "bcustomerUuid": '', //7
                        "bType": bType, //6
                        "parentSkuNo": o.parentSkuNo, //2
                        "time": Math.random(),
                        "reservePromotionUuid": globalField.reservePromotionUuid //预售校验库存
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            var dom = $(".buySuitBtn[suituuid='" + mapUid.get(o.parentUUid)[o.parentUUid] + "']");
                            if (data.retData && data.retData.canBuy && data.retData.hasProduct && data.retData.totalNum > 0) {
                                _event.dispatchEvent('suit', { 'suit': o.sku, 'uuid': o.parentUUid, 'dom': dom });
                                //  dom.removeClass("fastBuyDisabled");
                            } else {
                                $(".suitSplitError[skuNo='" + o.sku + "']").text("(无货)");
                                // dom.addClass("fastBuyDisabled");
                                $(".buySuitBtn").off("click");
                                return false;
                            }

                        } else {
                            $(".suitSplitError[skuNo='" + o.sku + "']").text("(无货)");
                            dom.addClass("fastBuyDisabled");
                            $(".buySuitBtn").off("click");
                            return false;
                        }
                    }
                })
            });
            _event.addEventListener('suit', function(e) {
                suitEvent.push(suitMAP[e.body.suit])
                if (suitEvent.length == arr.length) {
                    //  console.log(suitEvent,arr)
                    e.body.dom.removeClass("fastBuyDisabled");
                } else {
                    //  console.log(suitEvent,arr, false)

                    e.body.dom.addClass("fastBuyDisabled");
                    $(".buySuitBtn").off("click");
                }
            });
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
        },
        //显示默认的区域地址
        updateAddressMsg: function() {
            var province = $("#provincetitle").html();
            var city = $("#citytitle").html();
            var region = $("#regiontitle").html();
            var street = $("#streettitle").html();
            $("#selectAreaNameId").html(province + " " + city + " " + region + " " + street).attr("title", province + " " + city + " " + region + " " + street);

            //详情页选择地区弹出框
            $(".y_sendarea .y_areasure").hover(function() {
                $(this).parents(".y_sendarea").addClass("y_aretive");
            });
            $(".m_areabox").mouseover(function() {
                $(this).parents(".y_sendarea").addClass("y_aretive");
            });
            $(".m_areabox").mouseout(function() {
                $(this).parents(".y_sendarea").removeClass("y_aretive");
            });

            $(".y_arelose").click(function() {
                $(this).parents(".m_areabox").removeClass("y_aretive");
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
        },
        //改变购买数量
        changeBuyNum: function() {
            if (globalField.skuNo && globalField.promotionUuid) {
                return;
            } else {
                var num = $("#buyNum").val();
                if (num.trim().length == 0) {
                    num = 1;
                } else if (num.trim().length == 1) {
                    num = num.trim().replace(/[^1-9]/g, '')
                } else {
                    num = num.trim().replace(/\D/g, '')
                }
                $("#buyNum").val(num);
                getAddress.hasProduct();
            }
        }

    };
    var inputAdd = {
        addBuyNum: function() {
            if (globalField.skuNo && globalField.promotionUuid) {
                return;
            } else {
                var num = parseInt($("#buyNum").val());
                if (num >= 999) {
                    Msg.Alert("", "超过购买上限", function() {});
                    return;
                }
                $("#buyNum").val(num + 1);
                getAddress.hasProduct();
            }
            //if(globalField.preSaleType == '2') {return;}
        },
        reduceBuyNum: function() {
            if (globalField.skuNo && globalField.promotionUuid) {
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
        changeBlur: function(e) {
            getAddress.hasProduct(function() {
                if (globalField.activeStatus == 'status2') {
                    return;
                } else {
                    var self = $(e),
                        _val = self.val();
                    if (!/^[0-9]{1,3}$/.test(_val)) {
                        if (/^\d+$/.test(_val)) {
                            self.val(self.data('max') ? (self.data('max') > 999 ? 999 : self.data('max') > 999) : 1);
                        } else {
                            self.val(1);
                        }
                    } else if (/\d+/.test(_val) && self.val() < 1) {
                        self.val(1);
                    }
                }
            });
        }
    }

    getProductDetail(_UUID);

    //保存用户点击的地址
    (function() {
        var add = {};
        if (localStorage.getItem("add")) {
            var add = JSON.parse(localStorage.getItem("add"));
        }
        $("#provinces").on("click", "li", function() {
            add.province = $(this).attr("provinceliid");
        })
        $("#citys").on("click", "li", function() {
            if (add.province) {
                add.city = $(this).attr("cityliid");
            }
        })
        $("#regions").on("click", "li", function() {
            if (add.city) {
                add.region = $(this).attr("regionliid");
            }
        })
        $("#streets").on("click", "li", function() {
            if (add.region) {
                add.street = $(this).attr("streetliid");
            }
            localStorage.setItem("add", JSON.stringify(add));
            //用户选中地址后刷新页面，可能存在套装和其他信息
            window.location.reload();

        })
    })();


    //页面滚动fixed-buy和详情tab
    $(window).on('scroll', function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var detaiT = $('.light-gray').offset().top - $('.detailNav').height();
            if (detaiT < scrollTop) {
                var detaiTop = scrollTop - detaiT + 'px';
                $('.detailNav').css({ 'margin-top': '0px', 'position': 'fixed', 'top': 0 });
                $('.details-r').show().css({ 'top': detaiTop });
            } else {
                $('.detailNav').css({ 'margin-top': '-60px', 'position': 'relative' });
                $('.details-r').hide().css({ 'top': '0px' });
            }
        })
        //商品导航点击事件
    $('.detailNav a').on('click', function() {
            $(this).parents('ul').find('a').removeClass('active');
            $(this).addClass('active');
        })
        //购买类型点击切换
    $('#buyWay .options span').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
    })
    $('.tab-comment').on('click', 'span', function() {
        var self = this;
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).data('val')) {
            ajaxSearchComment(1, 5, { queryType: $(self).data('val') })
        } else {
            ajaxSearchComment(1, 5);
        }

    })

    //页面滚动固定条价格信息
    function getFixedPrice(data) {
        var html = "";
        try {
            html += '<div class="fl">' +
                '<span>' + data.productModel.productMain.productSn + '</span>&nbsp;&nbsp;';
            //reserve => 预定
            if (data.showType && data.showType != 'reserve' && data.showType != 'subscribe') {
                html += '<strong class="red">' + data.productSkuPrice.toFixed(2) + '元</strong>';
            }
            //促销，预约，尾款
            if (data.showType && data.showType == "reserve" && data.preSale && data.preSale.type && data.preSale.type == "2") {
                html += '<strong class="red">' + data.preSale.firstCost.toFixed(2) + '元</strong>';
            } else if (data.promotionUuid) { //秒杀
                html += '<strong class="red">' + data.front.priceAndPromotion.price.toFixed(2) + '元</strong>';
            } else {
                html += '<strong class="red">' + data.productSkuPrice.toFixed(2) + '元</strong>';
            }
            html += '</div>';
            $(".fixed-box").prepend(html);
        } catch (e) {
            throw e;
        }

        //规格参数显示tab
        if (data.productAttribute) {
            $("#checkIfProductAttribute").show();
        } else {
            $("#checkIfProductAttribute").hide();
        }
    }


    //检查商品收藏状态
    function checkFavourState(productUuid) {
        $http.get({
            url: "/front/product/getProductFavourState",
            data: {
                productUuid: productUuid,
                ranNum: Math.ceil(Math.random() * 100000)
            },
            success: function(data) {
                var state = data.retData;
                if (state) state = state.favoriteState;
                if (data.code == CODEMAP.status.success) {
                    if (state == "1") {
                        $(".purc-start .state").html('<em class="active">&#xe636;</em>取消收藏');
                    } else {
                        $(".purc-start .state").html('<em>&#xe636;</em>收藏');
                    }

                }
                $(".purc-start").attr({
                    "data-uuid": productUuid,
                    "onclick": "KUYU.setCollect('" + productUuid + "','" + state + "','" + data.code + "')"
                });

            }
        })

    }

    function getTotalFavorite(productUuid) {
        $http.get({
            url: '/front/product/getTotalFavorite',
            data: {
                productUuid: productUuid
            },
            success: function(res) {
                $(".purc-start .total-favorite").html('(' + res.data + '人气)');
            }
        })
    }
    /**
     * 设置收藏
     * @param {uuid} string 产品uuid
     * @param {type} string 收藏状态 1:已经收藏状态
     * @param {code} string 判断是否登录
     * */
    KUYU.setCollect = function(uuid, type, code) {
        var locKey = $Store.get('istaff_token');

        var st = $(".purc-start"),
            cid = st.data('cid');
        if (locKey) {
            if (cid == undefined) {
                changeState(type, uuid)
            } else {
                changeState(cid, uuid)
            }

        } else {
            Msg.Alert("", "请登录", function() {
                // $init.nextPage('login', {})
                window.location.href = "{{login}}?from=" + from;

            });
        }

        function changeState(type, uuid) {
            if (type == 1) {
                toFetch('/front/product/cancelFavorite', function(res) {
                    if (res == '1') {
                        st.data('cid', '2')
                        st.find('.state').html('<em class="">&#xe636;</em>收藏');
                        getTotalFavorite(uuid);
                    }
                });
            } else {
                toFetch('/front/product/collectProduct', function(res) {
                    if (res == "1" || res == "3") {
                        st.find('.state').html('<em class="active">&#xe636;</em>取消收藏');
                        st.data('cid', '1')
                        getTotalFavorite(uuid);
                    } else if (res.code == '403') {
                        Msg.Alert("", "请登录", function() {
                            // $init.nextPage('login', {})
                            window.location.href = "{{login}}?from=" + from;

                        });
                    }
                });
            };
        }

        function toFetch(url, cb) {
            $http.get({
                url: url,
                data: {
                    productUuid: uuid,
                    ranNum: Math.random()
                },
                success: function(res) {
                    cb(res);
                },
                error: function(e) {
                    throw e;
                }
            })
        }

    };

    //wap链接的二维码图片赋值
    function makeQrCode(productUuid) {
        $http.post({
            url: "/front/product/createQrCode",
            data: {
                productUuid: productUuid,
                ranNum: Math.random()
            },
            success: function(res) {
                $(".pQrCode").each(function(k, v) {
                    v.src = res.retData;
                });
            }
        });
    }

    //服务政策
    function policy(secondParentCategoryName) {
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
    //$("#comment").html('<div class="details-comm"><div class="details-empty"><p>该商品还没有评价</p><p>快去购买提出宝贵意见吧</p></div></div>');

    function ajaxSearchComment(nowPage, pageShow, options) {
        var url = "/front/product/showProductComments";
        var param = {
            productUuid: _UUID,
            nowPage: nowPage,
            pageShow: pageShow,
            ranNum: Math.random()
        };
        if (options) {
            param = $.extend({}, param, options);
        }
        $http.post({
            url: url,
            data: param,
            success: function(res) {
                if (res) {
                    doCommentRes(res);
                    if (res.wm) {
                        var pagination = res.wm;
                        var totalNum = pagination.totalNum;
                        var pageShow = pagination.pageShow;
                        var nowPage = pagination.nowPage;
                        page(nowPage, pageShow, totalNum);
                    }
                }
            }
        })
    }

    //加载商品详情评价
    function doCommentRes(data) {
        var html = "";
        if (data.commentList && data.commentList.length > 0) {
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

                html += '<table cellspacing="0" cellpadding="0" class="comm-table">' +
                    '   <tr>' +
                    '       <td class="user-img">';
                if (comment.customerImageUrl) {
                    html += '<img src="' + comment.customerImageUrl + '" />';
                } else {
                    html += '<img src="../../app/images/default.png"/>';
                }
                html += '' + firstShopComment.customerName + '</td>' +
                    '<td><ul class="comm-star star-r j-star">';
                if (firstShopCommentScores) {
                    for (var j = 0; j < firstShopCommentScores.length; j++) {
                        var firstShopCommentScore = firstShopCommentScores[j];
                        if (firstShopCommentScore.appType == '1') {
                            for (var k = 1; k <= firstShopCommentScore.appScore; k++) {
                                html += '<li class="item active"></li>';
                            }
                        }
                    }
                }

                html += '   </ul><span class="comment_time">' + Util.formatDate(firstShopComment.appTime) + '</span>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td></td>' +
                    '   <td>' +
                    '        <p class="tab-mar">' + formatxss(firstShopComment.comments) + '</p>';
                if (firstShowImgs && firstShowImgs.length > 0) {
                    html += '<p class="reply-img">';
                    for (var j = 0; j < firstShowImgs.length; j++) {
                        var img = firstShowImgs[j];
                        html += '<a class="" href="' + img.imgUrl + '" data-lightbox="img">' +
                            '   <img src="' + img.imgUrl + '">' +
                            '</a>';
                    }
                    html += '</p>';
                }
                html += '</td>';

                if (specList) {
                    html += '<td class="text-c">' +
                        '   <div class="attr-text">';
                    for (var j = 0; j < specList.length; j++) {
                        var spec = specList[j];
                        html += '<span>' + spec.value + '</span>';
                    }
                    html += '</div></td>';
                }
                html += '</tr>';
                if (firstReplyComment) {
                    html += '<tr>' +
                        '   <td>' +
                        '   </td>' +
                        '    <td class="comm-child">' +
                        '       <p class="child-img">' +
                        '           <img src="../../app/images/y_recomd5.jpg"/>' +
                        '           <span class="red">官方回复</span>' +
                        '           <span class="marl20">' + nowTime(firstReplyComment.operTime) + '</span>' +
                        '       </p>' +
                        '       <p class="child-img">' + firstReplyComment.replyContent + '</p>' +
                        '</td>' +
                        '<td></td>' +
                        '</tr>';
                }
                if (afterShopComment) {
                    html += '<tr>' +
                        '   <td></td>' +
                        '   <td class="comm-child">' +
                        '       <p class="child-img">';
                    if (comment.customerImageUrl) {
                        html += '<img src="' + comment.customerImageUrl + '" />';
                    } else {
                        html += '<img src="../../app/images/default.png"/>';
                    }
                    html += '<span>买家追评</span>' +
                        '<span class="marl20">' + nowTime(afterShopComment.operTime) + '</span>' +
                        '</p>' +
                        '<p>' + formatxss(afterShopComment.comments) + '</p>' +
                        '<p class="reply-img">';

                    if (afterShowImgs) {
                        html += '<p class="reply-img">';
                        for (var j = 0; j < afterShowImgs.length; j++) {
                            var img = afterShowImgs[j];
                            html += '<a href = "' + img.imgUrl + '" data-lightbox="img">' +
                                '   <img src="' + img.imgUrl + '">' +
                                '</a>';
                        }
                        html += '</p>';
                    }
                    html += '</p>' +
                        '</td><td>' +
                        '</tr>';
                }
                if (afterReplyComment) {
                    html += '<tr>' +
                        '   <td></td>' +
                        '   <td class="comm-child">' +
                        '       <p class="child-img">' +
                        '           <img src="../../app/images/y_recomd5.jpg"/>' +
                        '           <span class="red">官方回复</span>' +
                        '       <span class="marl20">' + nowTime(afterReplyComment.operTime) +
                        '       </span></p>' +
                        '       <p class="child-img">' + afterReplyComment.replyContent + '</p>' +
                        '   </td>' +
                        '   <td></td>' +
                        '</tr>';
                }
                html += '</table>';


            }
        }
        //追加到#comment
        $(".commentList").html(html);
    }

    //评论分页
    function page(nowPage, pageShow, totalNum, options) {
        totalPage = Math.ceil(totalNum / pageShow);
        param.nowPage = nowPage;
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        html = "";
        if (totalPage < 8) {
            // html += '<button class="prev" ';
            if (nowPage == 1) {
                html += '<button class="prev gray" disabled';
            } else {
                html += '<button class="prev"';
            }
            html += ' style="background:#fff"><</button>';
            if (totalPage != 0) {
                for (var i = 1; i <= totalPage; i++) {
                    html += '<span class="item ';
                    if (nowPage == i) {
                        html += 'active';
                    }
                    html += '" title="第' + i + '页">' + i + '</span>';
                }
            } else {
                html += '<span class="item active" title="第1页">1</span>';
            }

            if (nowPage == totalPage) {
                html += '<button class="next gray" disabled';
            } else {
                html += '<button class="next" ';
            }
            html += ' style="background:#fff">></button>';

            $(".padding-box .clearmar").html(html);
        } else {
            if (totalPage >= 8 && nowPage < 7) {
                html += '<button class="prev" ';
                if (nowPage == 1) {
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                for (var i = 1; i <= 7; i++) {
                    html += '<span class="item ';
                    if (nowPage == i) {
                        html += 'active';
                    }
                    html += '" title="第' + i + '页">' + i + '</span>';
                }

                html += '<button class="next" ';
                if (nowPage == totalPage) {
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';

                $(".padding-box .clearmar").html(html);
            } else {
                html += '<button class="prev" ';
                if (nowPage == 1) {
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
                if (nowPage == totalPage) {
                    html += '<span class="item" title="第' + sbefore + '页">' + sbefore + '</span>';
                }
                html += '<span class="item" title="第' + before + '页">' + before + '</span>';



                if (nowPage <= totalPage) {
                    html += '<span class="item active" title="第' + nowPage + '页">' + nowPage + '</span>';
                }
                if (nowPage + 1 <= totalPage) {
                    html += '<span class="item" title="第' + after + '页">' + after + '</span>';

                }


                html += '<button class="next" ';
                if (nowPage == totalPage) {
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';
                $(".padding-box .clearmar").html(html);
            }

        }

    }

    //页码点击
    $(document).on("click", ".clearmar span:gt(0),.clearmar span:lt(8)", function() {
        nowPage = $(this).html();
        if (nowPage.indexOf("...") > -1) {
            return
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            var options = { queryType: $('.tab-item.active').data('val') }
            ajaxSearchComment(nowPage, param.pageShow, options);
        }
    })
    $(document).on("click", ".clearmar .prev", function() {
        if (param.nowPage > 1) {
            nowPage = param.nowPage - 1;
        }
        var options = { queryType: $('.tab-item.active').data('val') }
        ajaxSearchComment(nowPage, param.pageShow, options);
    })
    $(document).on("click", ".clearmar .next", function() {
        if (param.nowPage < param.totalPage) {
            nowPage = param.nowPage + 1;
        }
        var options = { queryType: $('.tab-item.active').data('val') }
        ajaxSearchComment(nowPage, param.pageShow, options);
    })

    //获取时间
    function nowTime(t) {
        t = new Date(t);
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var date = t.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        return year + '-' + month + '-' + date;
    }

    // //goTop回到顶部
    // window.onscroll = function(){
    //      var t = document.documentElement.scrollTop || document.body.scrollTop;
    //      if(t>500){
    //         $(".goTop").show();
    //      }else{
    //         $(".goTop").hide();
    //      }
    // }
    window.getAddress = getAddress;
    $scope.addBuyNum = inputAdd.addBuyNum;
    $scope.reduceBuyNum = inputAdd.reduceBuyNum;
    $scope.changeBlur = inputAdd.changeBlur;
    //商品详情广告
    function detail_ad(categoryUuid) {
        var dom = $("#productad");
        if (!categoryUuid) {
            return;
        } else {
            $http.get({
                url: '/front/product/getAdByProductCategoryUuid?terminalType=01&categoryUuid=' + categoryUuid,
                success: function(res) {
                    if (res.iconPath) {
                        var img = "<div class='divs'><a href=" + res.categoryUrl + " ><img src=" + res.iconPath + " ></a></div>";
                        dom.html(img)
                    }
                }
            })
        }
    }

    $scope.submitTOBuy = function(self) { //3参数预约
        var disabled = $(self).hasClass('bespoke');
        if (disabled) {
            return false;
        }
        // var num = $("#buyNum").val();
        var _data = {
            productUuid: _UUID,
            buyNum: 1, //预约抢购数量固定
            skuNo: globalField.skuNo
        };
        if (globalField.activeStatus == 'status2') { // 这里立即预约的
            $http.post({
                url: submitUrl,
                data: _data,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }, //不刷新页面请求的时候Content-Type
                success: function(res) {
                    if (res.code == 403 || res.code == '-6') {
                        Msg.Alert("", "会话失效或未登录", function() {
                            window.location.href = "{{login}}?from=" + from;
                        });
                    } else {
                        $init.nextPage("addProductToOrderKuyu", {
                            title: $(".purc-name span").text(),
                            secondParentCategoryName: secondParentCategoryName,
                            skuNo: res.retData.skuNo,
                            productId: res.retData.submodel.productUuid,
                            buyNum: res.retData.productBuyNum,
                            storeNote: res.retData.submodel.uuid,
                            submodelUuid: res.retData.submodel.uuid,
                            rushBuyBeginTime: res.retData.submodel.rushBuyBeginTime
                        });
                    }
                }
            })
        }

        if ("status4" == globalField.activeStatus) { //这里已经预约去抢购
            var reOrderId = globalField.reserveOrderId;
            jump({}, '/tclcustomer/userInfo', function(res) {
                if (reOrderId == "" || reOrderId == null) {
                    Msg.Alert("", "对不起!您没有预约不能参与抢购活动！", function() {});
                } else {
                    $init.nextPage("perserveBuyKuyu", {
                        productUuid: _UUID,
                        reserveOrderId: globalField.reserveOrderId,
                        skuNo: globalField.skuNo
                    });
                }
            })
        }

        function jump(req, url, cb) {
            $http.post({
                url: url,
                data: req,
                success: function(data) {
                    if (data.code == CODEMAP.status.success) {
                        cb(data);
                    } else if (data.code == CODEMAP.status.notLogin || data.code == CODEMAP.status.TimeOut) {
                        Msg.Alert("", data.msg, function() {
                            window.location.href = "{{login}}?from=" + from
                                // $init.nextPage("login", {});
                        });
                    } else {
                        Msg.Alert("", data.msg, function() {});
                    }
                }
            })
        }

    };
    $scope.submitPreSaleTOBuy = function() {
        var num = $("#buyNum").val();
        /*
         dealerBcustomerUuid:
         payOrderUuid: 为orderId非uuid
         orderType: 订单类型:1订单组；2单个订单
         pagename:
         */
        if (globalField.preSaleType == '2' || globalField.preSaleType == '1') { //2立即付定金,1 立即预定
            // /front/product/presaleProductToOrder?pIds=7c8156757ee548bb9f16e57cb6274208&attrIds=BP001020102020200010&buyNum=1&willType=2
            $http.post({
                url: submitUrl,
                data: {
                    "dealerBcustomerUuid": "",
                    "pIds": _UUID,
                    "buyNum": num,
                    "attrIds": globalField.skuNo,
                    "chooseCod": '',
                    "willType": 2
                },
                success: function(data) {
                    if (data.code == CODEMAP.status.success) {
                        /*$init.nextPage('addProductToOrder',{})*/
                        window.location.href = "/pages/addProductToOrder/addProductToOrder.html?pIds=" + _UUID + "&attrIds=" + globalField.skuNo + "&buyNum=" + num + "&willType=2&preSale=" + globalField.reservePromotionUuid;
                    } else if (data.code == CODEMAP.status.TimeOut || data.code == CODEMAP.status.notLogin) {
                        // $init.nextPage('login', {})
                        window.location.href = "{{login}}?from=" + from;

                    }
                }
            });
        }
    };
    $scope.toFastBuy = function(self) { //普通的购买
        var disabled = $(self).hasClass('bespoke');
        if (disabled) {
            return false;
        }
        //先删掉购物车该商品
        $http.post({
            url:'/cart/removeKuyu',
            data: {
                productIdAndAttrId:'remove_'+_UUID+'_'+globalField.skuNo
            },
            success: function(res) {
                if(res.code == CODEMAP.status.success){
                    //购物车先全不选
                    $http.post({
                        url:'/cart/changeChooseKuyu',
                        data: {
                            productIdAndAttrId: 'allRecords',
                            chooseState: false
                        },
                        success: function(res) {
                            if(res.code == CODEMAP.status.success){
                                var buyNum = $("#buyNum").val();
                                $http.post({
                                    url: '/front/product/addProductToCart',
                                    data: {
                                        productUuid: _UUID,
                                        buyNum: buyNum,
                                        attrId: globalField.skuNo
                                    },
                                    success: function(data) {
                                        //国双
                                        // _smq.push(['custom', 'PC', 'goumai']);

                                        // if(typeof beheActiveEvent == 'function') {
                                        //     beheActiveEvent({at:"buy",src:"1697009386",cid:"",sid:"27295.25155",orderid:"",cost:""})
                                        // }

                                        if (data.code == CODEMAP.status.success) {
                                            window.location.href = '/pages/productInfo/productInfo.html'
                                        } else if (data.code == CODEMAP.status.notLogin || data.code == '403') {
                                            notLoginBuy();
                                        } else {
                                            Msg.Alert('', data.retData, function() {})
                                        }
                                    }
                                });
                            }
                        }
                    })
                }
            }
        })

        var notLoginBuy = function() {
            var colorItem = $("#colorItem").html();
            var sizeItem = $("#sizeItem").html();
            var provinceId = "1";
            if ($("#provinceId").val()) {
                provinceId = $("#provinceId").val();
            }
            var streetId = $("#areaUuid").val();
            var stSize = 0;
            var skuNo = $("#skuNo").val();
            var buyNum = $("#buyNum").val();
            var shoppingcart = $Store.get('shoppingcart')
            if (shoppingcart) {
                var res = JSON.parse(shoppingcart);
                var arr = res.storeMap[globalField.localStoreId];
                param.storeMap[globalField.localStoreId] = arr;
            } else {
                param.storeMap[globalField.localStoreId] = [];
            }
            $.each(param.storeMap[globalField.localStoreId], function(i, o) {
                if (o.isSuitMain == null && o.productUuid == _UUID) {
                    stSize = parseInt(o.buyNum) + parseInt(buyNum);
                    o.buyNum = stSize;
                }
            })

            if (stSize <= 0) {
                param.storeMap[globalField.localStoreId].push({ "productUuid": _UUID, "buyNum": buyNum, "attrId": globalField.skuNo, "storeUuid": globalField.storeUuid, "type": "01", "nowPromotion": globalField.nowPromotion, "opeTime": new Date().getTime() })
            }
            $Store.set('shoppingcart', JSON.stringify(param));
            $init.nextPage('cart', {})
                //window.location.href = path+"/tclcart/addProductToCartKuyu?productUuid="+_UUID+"&attrIds="+globalField.skuNo+"&buyNum="+buyNum+"&areaUuid="+$("#areaUuid").val()+"&distributorUuid="+streetId+"&activityUuid=";
        }
    };
    //加入购物车
    $scope.toAddtoCartBuy = function(self) {
        var disabled = $(self).hasClass('bespoke');
        if (disabled) {
            return false;
        }
        var buyNum = $("#buyNum").val();
        $http.post({
            url: '/front/product/addProductToCart',
            data: {
                productUuid: _UUID,
                buyNum: buyNum,
                attrId: globalField.skuNo
            },
            success: function(data) {
                // if(typeof beheActiveEvent == 'function') {
                //     beheActiveEvent({at:"buy",src:"1697009386",cid:"",sid:"27295.25155",orderid:"",cost:""})
                // }
                if (data.code == CODEMAP.status.success) {
                    Msg.Alert('温馨提示', '已加入购物车', function() {})
                } else if (data.code == CODEMAP.status.notLogin || data.code == '403') {
                    notLoginBuy();
                } else {
                    Msg.Alert('', data.retData, function() {})
                }
            }
        });
    }
    $init.Ready(function() {
        checkFavourState(_UUID);
        getTotalFavorite(_UUID);
        makeQrCode(_UUID);
        allRender.ImgShow();
        // detail_ad(categoryUuid);

        policy();
        var descriptHtml = $("#details-l").html();
        productInfoScroll(descriptHtml, secondParentCategoryName);

        $("#details-l img").lazyload({
            placeholder: "../../app/images/lazy.png", //用图片提前占位
            threshold: 180,
            effect: "fadeIn"
        });
        $(".reply-img img").lazyload({
            placeholder: "../../app/images/loadbg.gif", //用图片提前占位
            threshold: 180,
            effect: "fadeIn"
        });
        $binder.init();
    })
});