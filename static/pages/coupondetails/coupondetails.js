/*
 *author:chenlong
 */
require(['KUYU.Service','KUYU.plugins.alert', 'KUYU.HeaderTwo' ,'KUYU.Store','KUYU.Binder', 'juicer','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        $binder = KUYU.Binder,
        _env = KUYU.Init.getEnv(),
        navFooterLink =  KUYU.navFooterLink;
        $header = KUYU.HeaderTwo;

    $header.menuHover();
    $header.topSearch();
    navFooterLink();


    $param = KUYU.Init.getParam();


    var returnCode = $param.returnCode;
    //var returnCode = "returnCode"; //:绑定优惠券时所用的提示
    //          1领取成功 2领取失败 3会员已经领取
    if (returnCode == "0") {
        Msg.Alert("","优惠券领取成功!",function(){
        });
    } else if (returnCode == "2") {
        Msg.Alert("","优惠券领取失败!",function(){
        });
    }else if (returnCode == "3") {
        Msg.Alert("","会员已经领取!",function(){
        });
    } else if (returnCode == "-1") {
        Msg.Alert("","优惠券不存在!",function(){
        });
    } else if (returnCode == "-2") {
        Msg.Alert("","会员积分不够!",function(){
        });
    } else if (returnCode == "-3") {
        Msg.Alert("","所领优惠券已达到个人领取上限,不可再次领取,请尝试领取其它优惠券！",function(){
        });
    } else if(returnCode == "-4"){
        Msg.Alert("","该优惠券发行量非法！",function(){
        });
    }




    //未使用优惠券
    $("a[href='#no-used']").click(function(e) {
        e.preventDefault();
        $("#state").val("1");
        $("#couponId").val("");
        $("a[href='#no-used']").addClass("active");
        $("a[href='#has-used']").removeClass("active");
        $("a[href='#has-longed']").removeClass("active");
        searchCouponDetail("1", "", "1", "6");
    });

    //已使用优惠券
    $("a[href='#has-used']").click(function(e) {
        e.preventDefault();
        $("#state").val("2");
        $("#couponId").val("");
        $("a[href='#has-used']").addClass("active");
        $("a[href='#no-used']").removeClass("active");
        $("a[href='#has-longed']").removeClass("active");
        searchCouponDetail("2", "", "1", "6");
    });

    //已过期优惠券
    $("a[href='#has-longed']").click(function(e) {
        e.preventDefault();
        $("#state").val("3");
        $("#couponId").val("");
        $("a[href='#has-longed']").addClass("active");
        $("a[href='#no-used']").removeClass("active");
        $("a[href='#has-used']").removeClass("active");
        searchCouponDetail("3", "", "1", "6");
    });

    //点击搜索按钮
    $("#searchCouponId").click(function() {
        searchCouponDetail(state, couponId, "1", "6");
    });
    $("#couponId").on('keydown',function(e){
        if(e.keyCode == 13){
            searchCouponDetail(state, couponId, "1", "6");
        }
    });


    //加载点击状态的优惠券数（6张）
    function searchCouponDetail(state, couponId, nowPage, pageShow) {
        var url = "/usercenter/coupondetails/searchCouponDetailsKuyu";
        var state = $("#state").val();
        var couponId = $.trim($("#couponId").val());
        $http.post({
            url: url,
            data: {
                state: state,
                couponId: couponId,
                nowPage: nowPage,
                pageShow: pageShow
            },
            success: function(res) {
            	if(res.code== "403"||res.code== "-6"){
					window.location.href = "{{login}}"
				}
                doCouponDetailResponse(res,state)
                var pagination = res.data.pagination;
                var totalNum = pagination.totalNum;
                var pageShow = pagination.pageShow;
                var nowPage = pagination.nowPage;
                page(nowPage,pageShow,totalNum);
            },
            error: function() {

            }
        });
    }

    //处理数据
    function doCouponDetailResponse(res,state) {
        var couponDetailList = res.data.list;
        var html = '';
        html += '<input type="hidden" id="currentCouponUuid" name="pagetype" value="">';
        if (couponDetailList.length>0) {
            html += '<input type="hidden" id="currentCouponUuid" value=""/>'+
                    '<ul class="zqyhj clearfloat">';
            for (var i = 0; i < couponDetailList.length; i++) {
                var cdm = couponDetailList[i];
                html += '<li';
                if (state == '1') {
                    html += ' class="active"';
                }
                html += '>';
                html += '<a href="javascript:;">'+
                        '<div class="zqyhinfo">';

                html += '<p class="zqyhjg fl" >';
                if (0 < cdm.money && cdm.money < 10) {
                    html += '<span class="zqbmoney one">'+cdm.money+'</span>'
                }
                if (10 <= cdm.money && cdm.money < 100) {
                    html += '<span class="zqbmoney two">'+cdm.money+'</span>';
                }
                if (100 <=cdm.money && cdm.money < 1000) {
                    html += '<span class="zqbmoney">'+cdm.money+'</span>'
                }
                if (1000 <=cdm.money && cdm.money < 10000) {
                    html += '<span class="zqbmoney four">'+cdm.money+'</span>';
                }
                if (10000 <=cdm.money && cdm.money < 100000) {
                    html += '<span class="zqbmoney five">'+cdm.money+'</span>';
                }
                if (cdm.money.indexOf == 0) {
                    html += '<span class="zqbmoney">'+cdm.money+'</span>';
                }
                html += '</p>'+
                        '<p class="zqyhmk fr">'+
                        '<span class="zqbmk">';
                if (cdm.minConsumeMoney > 0) {
                    html += '满'+cdm.minConsumeMoney+'元使用';
                } else {
                    html += '无门槛使用';
                }
                html +='</span>'+
                       '<span class="zqyhjb">';
                if ( cdm.couponType==1 ) {
                    html += '通用券';
                }
                if (cdm.couponType === 2) {
                    html += '手机券';
                }

                html += '</span></p>'+
                        '<p class="receive fl">';
                if (cdm.state == '1') {
                    html += '<span>立即使用</span>';
                }
                if (cdm.state == '2') {
                    html += '<span>已使用</span>';
                }
                if (cdm.state == '3') {
                    html += '<span>已过期</span>';
                }
                html += '</p>'+
                        '<p class="zqyhsy fl">部分商品不能用 有效期:'+cdm.endTime.substring(0, 10)+'</p>'+
                        '</div>'+
                        '</a>'+
                        '</li>';

            }
            html += '</ul>';
            if(html.indexOf("li") > -1){
                $("#show").empty().html(html);
            }
        } else {
            html += '您一张优惠都没有哟，快去抢几张';
            $("#show").empty().append(html)
        }

        //页码
        $("#show").append('<div class="padding-box"><div class="padding clearmar"></div></div>');
    }


    //底部页码
    var param={};
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
    $(document).on("click",".padding span:gt(0), .padding span:lt(8)",function(){
        nowPage = $(this).html();
        if(nowPage.indexOf("...") > -1){
            return
        }else{
            $(this).addClass('active').siblings().removeClass('active');
            searchCouponDetail("", "", nowPage,param.pageShow);
            $('body,html').animate({scrollTop: 0 },200);
        }
    })
    $(document).on("click",".prev",function(){
        if(param.nowPage>1){
            nowPage = param.nowPage - 1;
        }
        searchCouponDetail("", "", nowPage, param.pageShow)
        $('body,html').animate({scrollTop: 0 },200);
    })
    $(document).on("click",".next",function(){
        if(param.nowPage < param.totalPage){
            nowPage = param.nowPage + 1;
        }
        searchCouponDetail("", "", nowPage, param.pageShow)
        $('body,html').animate({scrollTop: 0 },200);
    })


    //搜索加载优惠券
    function couponPage(nowPage, showPage) {
        var state = $("#state").val();
        var couponId = $("#couponId").val();
        searchCouponDetail(state, couponId, nowPage, showPage);
    }

    function canGetCoupon() {
        $.getJSON("",
            function(data) {
                if (data.nickName == null || data.nickName == "") {
                    window.location.href = "/customer/toLogin";
                    return false;
                }
            });
        var url = "";
        $.post(url, function(data) {
            $("#cangetcoupon").html(data);
        });
    }


    $init.Ready(function() {
        var locKey = $Store.get('istaff_token');
        
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

        //     $(function() {
        //         //页面加载请求
        //         var state = $("#state").val();
        //         var couponId = $("#couponId").val();
        //         searchCouponDetail(state, "", 1, 6);
        
        //     });
        // }

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
                
                            $binder.sync({'locKey':true});

                            $(function() {
                                //页面加载请求
                                var state = $("#state").val();
                                var couponId = $("#couponId").val();
                                searchCouponDetail(state, "", 1, 6);

                            });
                        }else{
							$init.nextPage("login",'')
						}
                    }
                })
            } else {
                $init.nextPage("login",'')
            }
        }
        /*
        * 如果超时或者tokne不存在就发请求
        */
        cb = function (data){
            SOK(data);
        }
       
    })


})
