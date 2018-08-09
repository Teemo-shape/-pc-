/*
 *author:chenlong
 */
require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.HeaderTwo', 'KUYU.navFooterLink', 'KUYU.Binder', 'KUYU.Store', 'ajaxfileupload', 'validate', 'xss'
], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;
    
    // $header.menuHover();
    $header.topSearch();
    navFooterLink();
    sessionStorage.removeItem("order");
    
    var UPLOADLIST = $init.Map();
    var mainFun = function() {
        $(function() {
            //加载状态数量
            orderCountKuyu();
            //搜索按钮
            $(".zqbtnn").on("click", function() {
                // var searchName = $.trim($("#searchName").val());
                ajaxSearchOrder(1, 5);
            })
            //回车
            $("#searchName").on('keydown', function(e) {
                if(e.keyCode == 13) {
                    ajaxSearchOrder(1, 5);
                }
            });
            
            $(".tab-switch").on("click", "a", function(e) {
                e.preventDefault();
                $(this).addClass("active").siblings().removeClass("active");
                //加载状态数量
                orderCountKuyu();
            })
            
            //:全部订单
            $(".all").click(function() {
                $("#searchName").val('');
                $("#state").val("");
                ajaxSearchOrder(1, 5);
            });
            //:待付款
            $(".waitpay").click(function() {
                $("#searchName").val('');
                $("#state").val(1);
                ajaxSearchOrder(1, 5);
            });
            //：待发货
            $(".waitship").click(function() {
                $("#searchName").val('');
                $("#state").val(4);
                ajaxSearchOrder(1, 5);
            });
            //:待收货
            $(".shipping").click(function() {
                $("#searchName").val('');
                $("#state").val(6);
                ajaxSearchOrder(1, 5);
            });
            
            //：待评价
            $(".waitcomment").click(function() {
                $("#searchName").val('');
                $("#state").val(11);
                ajaxSearchOrder(1, 5);
            });
            //:已完成
            $(".succeed").click(function() {
                $("#state").val(7);
                $("#commentState").val("2");
                ajaxSearchOrder(1, 5);
            });
            //订单回收
            $(".delete").click(function() {
                $("#searchName").val('');
                $("#state").val(20)
                ajaxSearchOrder(1, 5);
            })
            
        })
        
        function orderCountKuyu() {
            //加载获取订单的状态数量
            var queryCountUrl = "/usercenter/order/query/queryAllStatusOrderCountKuyu";
            $http.post({
                url: queryCountUrl,
                data: {
                    ranNum: Math.random()
                },
                success: function(res) {
                    if(res && res.code == CODEMAP.status.success) {
                        if(res.data) {
                            $("#waitpaycount").html("(" + res.data.waitpay + ")");
                            $("#waitshippingcount").html("(" + res.data.waitship + ")");
                            $("#shippingcount").html("(" + res.data.shipping + ")");
                            $("#waitcommentcount").html("(" + res.data.waitcomment + ")");
                            $("#succeedorder").html("(" + res.data.succeedorder + ")");
                        }
                    } else if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) {
                        window.location.href = window.location.origin + "/sign";
                    }
                }
            });
            
        }
        
        //异步加载订单和异步订单搜索
        function ajaxSearchOrder(nowPage, pageShow, searchName, extraOption) {
            var state = $("#state").val(), searchName = $("#searchName").val();
            var url = "/usercenter/order/listKuyu";
            var param = {
                pageShow: pageShow,
                nowPage: nowPage,
                orderState: state,
                searchName: searchName,
                ranNum: Math.ceil(Math.random() * 100000)
            }
            param = $.extend({}, param, extraOption);
            $http.post({
                url: url,
                data: param,
                success: function(res) {
                    if(res && res.code == CODEMAP.status.success) {
                        if(res.data) {
                            if(res.data.dataList) {
                                var data = res.data.dataList;
                                doOrderResponse(data);
                                //页码
                                var pagination = res.data.pagination;
                                var totalNum = pagination.totalNum;
                                var pageShow = pagination.pageShow;
                                var nowPage = pagination.nowPage;
                                page(nowPage, pageShow, totalNum, param.orderState);
                            }
                        }
                    } else if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) {
                        window.location.href = window.location.origin + "/sign";
                    }
                }
            });
        }
        
        
        //加载订单列表数据
        function doOrderResponse(data) {
            $("#usercenterOrder .isSuitFlag").remove();
            $('#usercenterOrder').empty();
            var str = '';
            for(var i = 0; i < data.length; i++) {
                var item = data[i];
                /********头部start************/
                str += '<div class="grid-list-item">' +
                    '<div class="grid-list-item-header">' +
                    '<p><span class="state">' + item.orderStatusName + '</span></p>';
                // if(item.state==1){
                //     str+='<span class="cutdown">付款时间还剩<span>45</span>分钟</span></p>'
                // }
                str += '<div class="item-header-body clearfloat">' +
                    '<div class="fl">' +
                    '<span class="subtxt">' + item.orderTime + '</span><span class="subtxt">订单号：' + item.orderId + '</span>' +
                    '</div>' +
                    '<div class="fr">' +
                    '<span class="amount-title">订单金额：</span><span class="amount-sum">' + item.payMoney.toFixed(2) + '</span>元' +
                    '</div>' +
                    '</div>';
                str += '</div>';
                /***************头部end****************/
                str += '<div class="grid-list-item-content">'
                for(var j = 0; j < item.detailList.length; j++) {
                    var detailSpec;
                    if(item.detailList[j].spec) {
                        detailSpec = eval("(" + item.detailList[j].spec + ")");
                    }
                    str += '<div class="grid-list-item-body clearfloat">' +
                        '<a href="../productDetail/productDetail.html?uuid=' + item.detailList[j].productUuid + '" class="fl">' +
                        '<img src="' + item.detailList[j].specUuid + '">' +
                        '</a>' +
                        '<dl class="product-info fl">' +
                        '<dd><p class="product-title">' + item.detailList[j].productName + '</p></dd>';
                    if(detailSpec) {
                        str += '<dd class="subtxt">';
                        // '<span>颜色：</span><span>'+detailSpec[0].value+'</span>'+
                        // '&nbsp;&nbsp;<span>尺寸：</span><span>'+detailSpec[1].value+'</span>'+
                        for(var k = 0; k < detailSpec.length; k++) {
                            str += '<span>' + detailSpec[k].name + ": " + '</span><span>' + detailSpec[k].value + '</span> &nbsp;&nbsp;';
                        }
                        str += '</dd>';
                    }
                    str += '</dl>' +
                        '<div class="product-price fl">' +
                        '<span class="amout">¥ ' + (item.detailList[j].finalPrice / item.detailList[j].buyNum).toFixed(2) + '</span>' +
                        '<span class="sum">x' + item.detailList[j].buyNum + '</span>' +
                        '</div>';

                    str += '</div>';
                }
                if(item.state == 1) { //待付款
                    str += '<ul class="operation fr">' +
                        '<li><span class="toPay" state="' + item.state + '" orderGroupUuid="' + item.orderGroupUuid + '" orderId="' + item.orderId + '" orderType="' + item.paytype + '">去付款</span></li>' +
                        '<li><span class="toDetail" data-uuid="' + item.uuid + '"><a href="../orderDetail/orderDetail.html?' + item.uuid + '">订单详情</a></span></li>' +
                        '<li><span class="cancel-btn" data-uuid="' + item.uuid + '">取消订单</span></li>' +
                        '</ul>'
                }
                else if(item.state == 6) { //待确认
                    str += '<ul class="operation fr">' +
                        '<li><span class="ConfirmReceive" data-uuid="' + item.uuid + '">确认收货</span></li>' +
                        '<li><span class="toDetail" data-uuid="' + item.uuid + '"><a href="../orderDetail/orderDetail.html?' + item.uuid + '">订单详情</a></span></li>'
                    '</ul>'
                }
                else if(item.state == 7) { //交易完成
                    if(item.commentState == 2) {
                        str += '<ul class="operation fr">' +
                            '<li><span class="viewComment" data-uuid="' + item.uuid + '"><a href="../productappraise/commentDetail.html?' + item.uuid + '">查看评价</a></span></li>' +
                            '<li><span class="toDetail" data-uuid="' + item.uuid + '"><a href="../orderDetail/orderDetail.html?' + item.uuid + '">订单详情</a></span></li>'
                        '</ul>'
                    } else {
                        str += '<ul class="operation fr">' +
                            '<li><span class="toComment" data-uuid="' + item.uuid + '"><a href="../productappraise/commentDetail.html?' + item.uuid + '">去评价</a></span></li>' +
                            '<li><span class="toDetail" data-uuid="' + item.uuid + '"><a href="../orderDetail/orderDetail.html?' + item.uuid + '">订单详情</a></span></li>'
                        '</ul>'
                    }
                }
                else {
                    str += '<ul class="operation fr">' +
                        '<li><span class="toDetail" data-uuid="' + item.uuid + '"><a href="../orderDetail/orderDetail.html?' + item.uuid + '">订单详情</a></span></li>'
                    '</ul>'
                }
                str += '</div></div>';
            }
            
            $('#usercenterOrder').prepend(str);
            
        }
        
        //跳转订单详情
        $('#usercenterOrder').on("click", ".toDetail", function() {
            var uuid = $(this).attr("data-uuid");
            window.location.href = "../orderDetail/orderDetail.html?" + uuid;
        })
        $('#usercenterOrder').on("click", ".toComment", function() {
            var uuid = $(this).attr("data-uuid");
            window.location.href = "../productappraise/commentDetail.html?" + uuid;
        })
        $('#usercenterOrder').on("click", ".viewComment", function() {
            var uuid = $(this).attr("data-uuid");
            window.location.href = "../productappraise/commentDetail.html?" + uuid;
        })
        
        // //跳转订单详情
        // $('#usercenterOrder').on("click","input[value='订单详情']",function(){
        //     var uuid = $(this).attr("data-uuid");
        //     window.location.href="../orderDetail/orderDetail.html?"+uuid;
        // })
        //不同状态订单切换
        $('.tab-item').on('click', 'a', function() {
            $(this).parent().addClass('active').siblings().removeClass('active');
            var param = {
                orderState: $(this).data('orderstate')
            }
            ajaxSearchOrder(1, 5, null, param);
        })
        
        //去付款、付定金、付尾款页面请求
        $('#usercenterOrder').on("click", ".toPay", function() {
            var state = $(this).attr("state");
            var payOrderType = 2;
            var payOrderUuid = $(this).attr("orderId");
            // if(payOrderType==1){
            //     payOrderUuid = $(this).attr("orderGroupUuid");
            // }
            var pagename = "";
            toOrderPayKuyu(payOrderUuid, payOrderType);
            /*var ajaxToOrderPayKuyu = toOrderPayKuyu(payOrderUuid,payOrderType);
            if(!ajaxToOrderPayKuyu){
                payOrderUuid = $(this).attr("orderGroupUuid");
                payOrderType = "1";
                toOrderPayKuyu(payOrderUuid,payOrderType);
            }*/
        })
        
        function toOrderPayKuyu(payOrderUuid, payOrderType) {
            url = "/orderpay/toOrderPayKuyu";
            $http.post({
                url: url,
                async: false,
                data: {
                    dealerBcustomerUuid: "",
                    payOrderUuid: payOrderUuid,
                    payOrderType: payOrderType,
                    pagename: "",
                    ranNum: Math.random()
                },
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    var data = res.retData.nextMethod;
                    //支付订单uuid
                    uuid = res.retData.payOrderUuid;
                    /*
                    if(data == "toOrderPayKuyu"){
                        return false;
                    }*/
                    if(data == "OrderPay") {
                        var a = new Date().getTime();
                        var res = JSON.stringify(res);
                        sessionStorage.setItem("cl" + a, res);
                        window.location.href = "../toOrderPayKuyu/toOrderPayKuyu.html?cl" + a;
                    }
                    if(data == "toLogin") {
                        window.location.href = "{{login}}";
                    }
                    if(data == "PayAgainSuccess") {
                        window.location.href = "../PayAgainSuccess/PayAgainSuccess.html?" + payOrderUuid + "&" + state;
                    }
                    if(res.code == 1) {
                        Msg.Alert('温馨提示', res.msg, function() {
                        });
                    }
                }
            })
        }
        
        
        //删除或回复订单请求
        function recycleOrDeleteOrder(uuid, delFlag) {
            var $tip = $(".reson-tip");
            $http.post({
                url: "/usercenter/order/recycleOrDeleteOrder",
                data: {
                    uuid: uuid,
                    delFlag: delFlag,
                    ranNum: Math.random()
                },
                success: function(res) {
                    if(res.code == 403 || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if(res.code == 0) {
                        if(delFlag == 0 || delFlag == 2) {
                            $(".modal-backdrop").addClass('y_show')
                            $tip.text("删除成功").show();
                            setTimeout(function() {
                                ajaxSearchOrder(1, 5);
                                $tip.hide();
                                $(".modal-backdrop").removeClass('y_show')
                            }, 1000)
                        } else {
                            $(".modal-backdrop").addClass('y_show')
                            $tip.text("还原成功").show();
                            setTimeout(function() {
                                ajaxSearchOrder(1, 5);
                                $tip.hide();
                                $(".modal-backdrop").removeClass('y_show')
                            }, 1000)
                            
                        }
                    } else {
                        Msg.Confirm("", "请稍后再试！", function() {
                            window.location.reload()
                        });
                    }
                },
                error: function() {
                    Msg.Confirm("", "请稍后再试！", function() {
                        window.location.reload()
                    });
                }
            })
        }
        
        
        //删除和还原订单按钮
        $(document).on("click", "#usercenterOrder .del-order,input[value='还原订单']", function() {
            var uuid = $(this).attr("data-uuid");
            var delFlag = $(this).attr("delFlag");
            if(delFlag == 0) {
                Msg.Confirm("", "你确定删除该订单吗？", function() {
                    recycleOrDeleteOrder(uuid, delFlag);
                });
            } else if(delFlag == 2) {
                Msg.Confirm("", "你确定永久删除该订单吗？", function() {
                    recycleOrDeleteOrder(uuid, delFlag);
                });
                
            } else {
                Msg.Confirm("", "你确定还原该订单吗？", function() {
                    recycleOrDeleteOrder(uuid, delFlag);
                });
            }
            
        })
        
        var dic = {
            "1": "1",
            "4": "4",
            "6": "6",
            "7": "7",
            "11": "11",
            "20": "20",
        }
        
        //详情页面到待支付，待评价，待发货，写评价tab
        $(function() {
            var u = location.search;
            var u = u.substr(1);
            //待付款
            if(dic[u] == "1") {
                $(".waitpay").click();
            }
            //待发货
            else if(dic[u] == "4") {
                $(".waitship").click();
            }
            //已完成
            else if(dic[u] == "7") {
                $(".succeed").click();
            }
            //待收货
            else if(dic[u] == "6") {
                $(".shipping").click();
            }
            //待评价
            else if(dic[u] == "11") {
                $(".waitcomment").click();
            } else if(u == "20") {
                $(".delete").click();
            }
            else if(!dic[u]) {
                //加载订单
                ajaxSearchOrder(1, 5);
            }
            else {
                orderComments(u);
            }
        })
        
        
        //到评论
        $("#usercenterOrder").on("click", "input[value='写评价']", function() {
            
            var uuid = $(this).attr("data-uuid");
            orderComments(uuid);
        })
        $("#usercenterOrder").on("click", "input[value='查看评价']", function() {
            var uuid = $(this).attr("data-uuid");
            window.location.href = "../toAppraise/toAppraise.html?" + uuid;
        })
        
        
        function nowTime(t) {
            t = new Date(t);
            var year = t.getFullYear();
            var month = t.getMonth() + 1;
            if(month < 10) {
                month = "0" + month;
            }
            var date = t.getDate();
            if(date < 10) {
                date = "0" + date;
            }
            var hour = t.getHours();
            if(hour < 10) {
                hour = "0" + hour;
            }
            var min = t.getMinutes();
            if(min < 10) {
                min = "0" + min;
            }
            var sec = t.getSeconds();
            if(sec < 10) {
                sec = "0" + sec;
            }
            return year + '-' + month + '-' + date + ' ' + hour + ":" + min + ":" + sec;
        }
        
        
        //底部页码
        var param = {};
        var status = {};
        
        function page(nowPage, pageShow, totalNum, orderState) {
            var totalPage = Math.ceil(totalNum / pageShow);
            param.nowPage = nowPage;
            param.pageShow = pageShow;
            param.totalNum = totalNum;
            param.totalPage = totalPage;
            var html = "";
            status.orderState = orderState;
            if(totalPage < 8) {
                html += '<button class="prev" ';
                if(nowPage == 1) {
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';
                
                if(totalPage != 0) {
                    for(var i = 1; i <= totalPage; i++) {
                        html += '<span class="page-item ';
                        if(nowPage == i) {
                            html += 'active';
                        }
                        html += '" title="第' + i + '页">' + i + '</span>';
                    }
                } else {
                    html += '<span class="page-item active" title="第1页">1</span>';
                }
                
                
                html += '<button class="next" ';
                if(nowPage == totalPage) {
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';
                
                $(".page-list").html(html);
            } else {
                if(totalPage >= 8 && nowPage < 7) {
                    html += '<button class="prev" ';
                    if(nowPage == 1) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff"><</button>';
                    
                    for(var i = 1; i <= 7; i++) {
                        html += '<span class="page-item ';
                        if(nowPage == i) {
                            html += 'active';
                        }
                        html += '" title="第' + i + '页">' + i + '</span>';
                    }
                    
                    html += '<button class="next" ';
                    if(nowPage == totalPage) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';
                    
                    $(".page-list").html(html);
                } else {
                    html += '<button class="prev" ';
                    if(nowPage == 1) {
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
                    if(nowPage == totalPage) {
                        html += '<span class="page-item" title="第' + sbefore + '页">' + sbefore + '</span>';
                    }
                    html += '<span class="page-item" title="第' + before + '页">' + before + '</span>';
                    
                    
                    if(nowPage <= totalPage) {
                        html += '<span class="page-item active" title="第' + nowPage + '页">' + nowPage + '</span>';
                    }
                    if(nowPage + 1 <= totalPage) {
                        html += '<span class="page-item" title="第' + after + '页">' + after + '</span>';
                        
                    }
                    
                    
                    html += '<button class="next" ';
                    if(nowPage == totalPage) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';
                    $(".page-list").html(html);
                }
                
            }
            
        }
        
        
        //页码点击
        $(".page-list").on("click", "span:gt(0),span:lt(8)", function() {
            nowPage = $(this).html();
            if(nowPage.indexOf("...") > -1) {
                return
            } else {
                $(this).addClass('active').siblings().removeClass('active');
                ajaxSearchOrder(nowPage, param.pageShow, null, status);
                $('body,html').animate({scrollTop: 0}, 200);
            }
            
        })
        $(".page-list").on("click", ".prev", function() {
            if(param.nowPage > 1) {
                nowPage = param.nowPage - 1;
            }
            ajaxSearchOrder(nowPage, param.pageShow, null, status);
            $('body,html').animate({scrollTop: 0}, 200);
        })
        $(".page-list").on("click", ".next", function() {
            if(param.nowPage < param.totalPage) {
                nowPage = param.nowPage + 1;
            }
            ajaxSearchOrder(nowPage, param.pageShow, null, status);
            $('body,html').animate({scrollTop: 0}, 200);
        })
        
        
        //:商品评价
        function orderComments(uuid) {
            var url = "/usercenter/order/ajaxviewKuyu";
            $http.post({
                url: url,
                data: {
                    uuid: uuid,
                    ranNum: Math.random()
                },
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if(res && res.code == CODEMAP.status.success) {
                        if(res.data) {
                            var data = res.data
                            doCommentsResponse(data);
                        }
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
            html += '<div class="m_content">' +
                '<h3>评价管理</h3>' +
                '<div class="zqrightinfo">' +
                '<p class="zqwxinfo zqtop30  clearfloat">' +
                '   <span class="fl"><span class="zqtime">' + data.m.orderTime + '</span><span class="zqordernum">订单号:' + data.m.orderId + '</span><span class="zqpay">' + data.m.payTypeName + '</span></span>' +
                '<span class="zqzt fr">评价状态：待评价</span>' +
                '</p>';
            
            orderUuid = data.m.uuid;
            for(var i = 0; i < data.detailList.length; i++) {
                json[i] = new Object(); //在数组中new 对象
                var orderDetail = data.detailList[i];
                json[i].orderDetailUuid = orderDetail.uuid;
                json[i].orderId = data.m.uuid;
                
                html += '<input type="hidden" value="' + orderDetail.uuid + '" name="detailUuid" value=""/><p class="height1 hgt20"></p>'
                if(orderDetail.discountModel) {
                    html += '<div class="m_fullcut">';
                    for(var j = 0; j < orderDetail.discountModel.length; j++) {
                        var promotion = orderDetail.discountModel[j];
                        if(data.m.fromType == '1' || data.m.fromType == '6') {
                            html += '<span>';
                            if(data.m.fromType == '1') {
                                html += '满减';
                            }
                            if(data.m.fromType == '6') {
                                html += '满折';
                            }
                            html += '</span><a href="javascript:;">' + promotion.description + '</a>';
                        }
                    }
                    html += '</div>';
                }
                html += '<div class="zqproinfo zqtop30 clearfloat">' +
                    '<div class="zqimgtxt fl">' +
                    '   <div class="zqitimg">' +
                    '       <a href="../productDetail/productDetail.html?uuid=' + orderDetail.productUuid + '" target="_blank">';
                if(orderDetail.specUuid) {
                    html += '<img src="' + orderDetail.specUuid + '" alt="' + orderDetail.productName + '"/>';
                } else {
                    html += '<img src="../../app/images/noimg.jpg" alt="' + orderDetail.productName + '"/>';
                }
                
                html += '       </a>' +
                    '   </div>' +
                    '   <div class="zqittxt">' +
                    '       <p class="zqpmiaoshu">' +
                    '           <a href="../productDetail/productDetail.html?uuid=' + orderDetail.productUuid + '" target="_blank">' + orderDetail.productName + '</a>' +
                    '       </p>';
                if(orderDetail.specList) {
                    for(var k = 0; k < orderDetail.specList.length; k++) {
                        var specObj = orderDetail.specList[k];
                        html += '<span class="zqpxinxi">' + specObj.name + '：' + specObj.value + '</span>';
                    }
                }
                
                html += '</div></div>' +
                    '<p class="zqnumber">×<span class="zqno">' + orderDetail.buyNum + '</span></p>' +
                    '<p class="zqmoney">交易金额：' + orderDetail.payMoney + '元</p>' +
                    '</div>';
                if(orderDetail.discountModel) {
                    if(orderDetail.discountModel.giftNames && orderDetail.discountModel.giftNames[0]) {
                        html += '<div class="z_zengping">' +
                            '<span class="z_zengping_title">赠品</span>' +
                            '<div class="z_txt_control fl" style="margin-left:15px;">';
                        for(var n = 0; n < orderDetail.discountModel.giftNames.length; n++) {
                            var giftName = orderDetail.discountModel.giftNames[n];
                            if(giftName) {
                                html += ' <p>' + giftName + ' × <span class="zqno">' + orderDetail.buyNum + '</span></p>';
                            }
                        }
                        html += '</div></div>';
                    }
                }
                html += '<p class="height1"></p>' +
                    '<div class="zqfabiao">' +
                    '   <p class="zqfbtitle">您的评价内容</p>' +
                    '       <div class="zqpjarea clearfloat">' +
                    '           <textarea rows="4" placeholder="开始对我们的商品进行评价吧，最多上传五张图片！" name="content' + orderDetail.uuid + '" id="content' + orderDetail.uuid + '"></textarea>' +
                    '           <div class="zqadder">' +
                    '               <div class="zqaddimg fl">' +
                    '              <form method="post" enctype="multipart/form-data">' +
                    '                   <a href="javascript:;" class="file">' +
                    '                       <input id="upload1" type="file" name="file" accept="image/png,image/jpeg,image/jpg" class="upbtn" fileElementId="upload1" onchange="KUYU.uploadImage(this, \'upload1_img0\', \'' + orderDetail.uuid + '\')">' +
                    '                       <img src="" class="uploadimgShow" id="upload1_img0">' +
                    '                       <font>+</font>' +
                    '                   </a>' +
                    '               </form>' +
                    '               </div>' +
                    '               <input type="hidden" id="' + orderDetail.uuid + '_imgsString" value=""/>' +
                    '               <ul class="zqaddimgli fl" detailUuid = "' + orderDetail.uuid + '" id="' + orderDetail.uuid + '_showImg">' +
                    '               </ul>' +
                    '           </div>' +
                    '       </div>' +
                    '</div>' +
                    '<p class="zqfbtitle zqtop30">您的评分</p>' +
                    '<div id="zqstar1" class="j-start zqstar clearfloat">' +
                    '   <span></span>' +
                    '   <ul class="stars_Product_' + orderDetail.uuid + '">' +
                    '       <li class=""><a href="javascript:;">1</a></li>' +
                    '       <li class=""><a href="javascript:;">2</a></li>' +
                    '       <li class=""><a href="javascript:;">3</a></li>' +
                    '       <li class=""><a href="javascript:;">4</a></li>' +
                    '       <li class=""><a href="javascript:;">5</a></li>' +
                    '   </ul>' +
                    '   <span></span>' +
                    '   <p>描述相符</p>' +
                    '</div>' +
                    '<div id="zqstar2" class="j-start zqstar clearfloat">' +
                    '   <span></span>' +
                    '   <ul class="stars_TransportService_' + orderDetail.uuid + '">' +
                    '       <li class=""><a href="javascript:;">1</a></li>' +
                    '       <li class=""><a href="javascript:;">2</a></li>' +
                    '       <li class=""><a href="javascript:;">3</a></li>' +
                    '       <li class=""><a href="javascript:;">4</a></li>' +
                    '       <li class=""><a href="javascript:;">5</a></li>' +
                    '   </ul>' +
                    '   <span></span>' +
                    '   <p>物流服务</p>' +
                    '</div>' +
                    '<div id="zqstar3" class="j-start zqstar clearfloat">' +
                    '   <span></span>' +
                    '   <ul class="stars_CustomerService_' + orderDetail.uuid + '">' +
                    '       <li class=""><a href="javascript:;">1</a></li>' +
                    '       <li class=""><a href="javascript:;">2</a></li>' +
                    '       <li class=""><a href="javascript:;">3</a></li>' +
                    '       <li class=""><a href="javascript:;">4</a></li>' +
                    '       <li class=""><a href="javascript:;">5</a></li>' +
                    '   </ul>' +
                    '   <span></span>' +
                    '   <p>服务态度</p>' +
                    '</div>';
                
                
            }
            
            html += '<a href="javascript:void(0);" class="y_btn y_btn_custom2" id="save_appraise">提交评价</a>' +
                '</div>' +
                '</div>';
            
            $("#mian_right").html(html);
            
        }
        
        
        //删除图片
        $("#mian_right").on("click", ".zqaddimgli>li>a", function(e) {
            e.preventDefault();
            var detailUuid = $(this).parent().parent().attr("detailUuid");
            rmImg(this, detailUuid);
            
        })
        
        //上传图片监控
        $("#mian_right").on("change", ".upload", function() {
            var detailUuid = $(this).attr("detailUuid");
            //uploadImage(detailUuid);
        });
        
        //评分
        $(function() {
            //var $aLi = $(".j-start li");
            $("#mian_right").on("mouseover", ".j-start li", function(event) {
                var index = $(this).index();
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on');
                $parent.find("li:lt(" + (index + 1) + ")").addClass('on');
            });
            
            //鼠标离开后恢复上次评分
            $("#mian_right").on("mouseout", ".j-start li", function() {
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on');
                $parent.find("li.isClick").addClass('on');
            });
            
            //点击后进行评分处理
            $("#mian_right").on("click", ".j-start li", function() {
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on isClick');
                var index = $(this).addClass('on isClick').index();
                $parent.find("li:lt(" + (index + 1) + ")").addClass('on isClick');
            });
        });
        
        
        KUYU.uploadImage = function(dom, imgdom, detailUuid) {
            var self = $(dom);
            var id = self.attr("fileElementId");
            var form = self.parents('form');
            var imgs = "";
            if(UPLOADLIST.size() < 5) {
                form.ajaxSubmit({
                    url: '/rest/usercenter/batchfileupload/batch/upload?rand' + Math.random(),
                    type: 'post',
                    dataType: 'json',
                    //contentType: "text/html; charset=utf-8",
                    success: function(res) {
                        if(res.code == 0) {
                            if(res.data) {
                                UPLOADLIST.put(res.data.imgName, {key: res.data.imgName, value: res.data.fileUrl});
                                $("#" + detailUuid + "_showImg").append("<li key='" + res.data.imgName + "' name='" + res.data.imgName + "' path='" + res.data.fileUrl + "'><a class='uploadIMgClose'>×</a><img src='" + res.data.fileUrl + "'></li>");
                                
                                imgs = $("#" + detailUuid + "_imgsString").val();
                                if(imgs != "" && imgs != null) {
                                    imgs = imgs + ";" + res.data.imgName + "," + res.data.fileUrl;
                                } else {
                                    imgs = imgs + res.data.imgName + "," + res.data.fileUrl;
                                }
                                $("#" + detailUuid + "_imgsString").val(imgs);
                                form[0].reset()
                            }
                        } else {
                            var errcode = {
                                '-1': '文件大小超限',
                                '-2': '非法的文件格式',
                                '-3': '上传文件为空',
                            };
                            Msg.Alert("", "上传失败:" + errcode[res.code], function() {
                            })
                            form[0].reset()
                        }
                    }
                })
            } else {
                Msg.Alert("", "最多可上传5张图片", function() {
                });
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
            if(imgs.substring(imgs.length - 1, imgs.length) == ";") {
                imgs = imgs.substring(0, imgs.length - 1)
            }
            if(imgs.substring(0, 1) == ";") {
                imgs = imgs.substring(1, imgs.length)
            }
            $("#" + detailUuid + "_imgsString").val(imgs);
            li.remove();
            UPLOADLIST.removeByKey(key)
            
        }
        
        
        //提交评价按钮
        $("#mian_right").on("click", "#save_appraise", function() {
            saveAppraise();
        });
        
        
        //保存评价
        function saveAppraise() {
            var fail = false;
            for(var i = 0; i < json.length; i++) {
                json[i].productScore = $(".stars_Product_" + json[i].orderDetailUuid + " li.on").length;
                json[i].customerServiceScore = $(".stars_CustomerService_" + json[i].orderDetailUuid + " li.on").length;
                json[i].transportServiceScore = $(".stars_TransportService_" + json[i].orderDetailUuid + " li.on").length;
                json[i].content = filterXSS($("#content" + json[i].orderDetailUuid).val());
                json[i].imgString = $("#" + json[i].orderDetailUuid + "_imgsString").val();
                json[i].appTags = "";
                if(json[i].productScore == "" || json[i].customerServiceScore == "" || json[i].transportServiceScore == "") {
                    fail = true;
                    Msg.Alert("", "产品评分不能为空！", function() {
                    });
                    return;
                }
                
                if(json[i].content.length <= 0) {
                    fail = true;
                    Msg.Alert("", "请填写评价内容！", function() {
                    });
                    return;
                }
                
                if(json[i].content.length > 150) {
                    fail = true;
                    Msg.Alert("", "请填写150字以内的评价内容！", function() {
                    });
                    return;
                }
            }
            
            var jsonstr = {};
            jsonstr.data = JSON.stringify(json);
            if(!fail) {
                var url = "/usercenter/productappraise/saveAppraiseKuyu";
                $http.post({
                    url: url,
                    data: jsonstr,
                    success: function(res) {
                        if(res.code == "403" || res.code == "-6") {
                            window.location.href = "{{login}}"
                        }
                        if(res.code == 0) {
                            Msg.Alert("", "评价成功！", function() {
                                window.location.href = "../toAppraise/toAppraise.html?" + orderUuid;
                            });
                        } else {
                            Msg.Alert("", "评价失败！", function() {
                                window.location.href = "orderList.html?11";
                            });
                        }
                    },
                    error: function(res) {
                    
                    }
                })
            }
        }
        
        
        //取消订单弹出框
        var orderId, $dialog;
        $(function() {
            $dialog = $(".reson-dialog");
            $text = $(".reson-dialog textarea");
            $(document).on('click', '#usercenterOrder .cancel-btn', function() {
                orderId = $(this).attr("data-uuid");
                $dialog.show();
            }).on('click', ".reson-dialog .m_close, .reson-dialog .clean", function() {
                $dialog.hide();
            });
            
            //取消订单弹出框
            $(document).on('click', '.cancel-btn', function() {
                $(".mask").show()
                $('.modal-backdrop').addClass('y_show');
                $('.reson-dialog').addClass('y_show');
            }).on('click', '.modal-backdrop,.reson-dialog .m_close,.reson-dialog .clean', function() {
                $(".mask").hide()
                $('.modal-backdrop').removeClass("y_show");
                $('.reson-dialog').removeClass('y_show');
            });
            
            
            //取消订单按钮
            $(".reson-dialog").on("click", ".sure", function() {
                cancelOrder();
            });
            
        })
        
        
        //取消订单
        function cancelOrder() {
            var cancelReason = filterXSS($("#reasons").val() + " " + $("#reasoncontent").val());
            var $tip = $(".reson-tip");
            $http.post({
                url: "/usercenter/order/cancel",
                data: {
                    orderId: orderId,
                    cancelReason: cancelReason,
                    ranNum: Math.ceil(Math.random() * 10000)
                },
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if("success" == res.msg) {
                        $dialog.hide();
                        $dialog.removeClass('y_show');
                        $tip.text("取消订单成功").show();
                        setTimeout(function() {
                            /*orderCountKuyu()
                            ajaxSearchOrder(1,10);*/
                            window.location.reload();   //参照testmall
                            $tip.hide();
                            $(".modal-backdrop").removeClass('y_show')
                        }, 1500)
                    } else {
                        $dialog.hide();
                        $('.mask').hide();
                        $dialog.removeClass('y_show');
                        $tip.text("取消订单失败").show();
                        setTimeout(function() {
                            $tip.hide();
                            $(".modal-backdrop").removeClass('y_show')
                        }, 1500);
                    }
                },
                error: function(res) {
                    Msg.Alert("", "取消订单失败！", function() {
                    });
                }
            });
        }
        
        
        //确认收货
        $("#mian_right").on("click", ".ConfirmReceive", function() {
            var uuid = $(this).attr("data-uuid");
            ConfirmReceiveGoods(uuid);
        });
        
        //确认收货 （拷贝详情页面确认收货逻辑）
        function ConfirmReceiveGoods(uuid) {
            Msg.Confirm("", "确认收货后不能修改，您确定要收货吗？", function() {
                var orderUuid = uuid;
                var url = "/usercenter/order/reveiveKuyu";
                $http.post({
                    url: url,
                    data: {
                        orderUuid: orderUuid,
                        password: "123456",
                        ranNum: Math.random()
                    },
                    success: function(data) {
                        if(data.code == "403" || data.code == "-6") {
                            window.location.href = "{{login}}"
                        }
                        if("success" == data.msg) {
                            Msg.Alert("", "确认收货成功！", function() {
                            });
                            setTimeout(function() {
                                window.location.href = "../productappraise/commentDetail.html?" + orderUuid;
                            }, 1000);
                        } else {
                            Msg.Alert("", "确认收货失败，请稍后重试！", function() {
                            });
                            setTimeout(function() {
                                //window.location.href = "../orderList/orderList.html";
                            }, 1000);
                        }
                    },
                    error: function(res) {
                        Msg.Alert("", "请稍后再试", function() {
                        });
                    }
                });
            });
        }
    
        //秒杀订单检测
        $(function() {
            //秒杀订单过了支付时间自动关闭
            var checkAndHandleLimitOrder = function() {
                try {
                    var closeUrl = "/usercenter/order/cancel";
                    $(".limitPayTimeOut").each(function(i, item) {
                        var uuid = $(item).attr("orderUuid");
                        var status = $(item).attr("status");
                        if(status == "1") {
                            //先将支付按钮屏蔽
                            $(".goPay[orderUuid='" + uuid + "']").remove();
                            $http.post({
                                url: closeUrl,
                                data: {
                                    orderId: uuid,
                                    cancelReason: "秒杀支付时间已过，自动关闭订单",
                                    ranNum: Math.random()
                                },
                                success: function(data) {
                                    if(data.code == "403" || data.code == "-6") {
                                        window.location.href = "{{login}}"
                                    }
                                }
                            });
                        }
                    });
                }
                catch(e) {
                }
            };
            checkAndHandleLimitOrder();
            //刷新秒杀订单支付倒计时
            (function() {
                try {
                    //每分钟执行一次
                    var interval_limitPayScan = window.setInterval(function() {
                        $(".limitRemainPayTimeSpan").each(function(i, item) {
                            var orderUuid = $(item).attr("orderUuid");
                            var minute = parseInt($(".limitRemainPayTimeSpan .minute").text());
                            var allMinutes = minute - 1;
                            $(".limitRemainPayTimeSpan .minute").text(allMinutes)
                            //判断时间是否已到期
                            if(allMinutes <= 0) {
                                $(item).addClass("limitPayTimeOut");
                                $(item).html("剩余付款时间：已过期");
                                clearInterval(interval_limitPayScan);
                            }
                        });
                        checkAndHandleLimitOrder();
                        
                    }, 1000 * 60);
                } catch(e) {
                
                }
            })()
        });
        
    };
    
    var locKey = $Store.get('istaff_token');
    mainFun();
    /*
    * 如果超时或者tokne不存在就发请求
    */
    $init.Ready(function() {
        $header.menuHover();
    })
    /*$init.Ready(function() {
       
       
        var script ="<script id='sso' src='{{sso}}'><\/script>";
        $("body").append(script);
        var SOK = function (res) {
            if(res.status != -1 && res.code) {
                var token = $Store.get('istaff_token') ? $Store.get('istaff_token') : null;
                $.ajax({
                    url: '/rest/ssologin/check',
                    type:'get',
                    headers:{
                        'ihome-token' : token,
                    },
                    data:{code: res.code },
                    success: function (data) {
                        if(data.code == CODEMAP.status.success) {
                            localStorage.setItem('istaff_token', data.token);
                            $header.userInof();
                            mainFun();
                        }else{
                            $init.nextPage("login",'')
                        }
                    }
                })
            } else {
                $init.nextPage("login",'')
            }
        };
        cb = function (data){
            SOK(data);
        }

    })*/
})
