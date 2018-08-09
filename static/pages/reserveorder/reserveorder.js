require(['KUYU.Service', 'KUYU.HeaderTwo' ,'KUYU.Binder', 'KUYU.Store', 'juicer','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        $binder = KUYU.Binder,
        navFooterLink = KUYU.navFooterLink,
        _env = KUYU.Init.getEnv(),
        $header = KUYU.HeaderTwo;

    $header.menuHover();
    $header.topSearch();
    navFooterLink();

    function initReserve(nowPage,pageShow) {
        var url = '/usercenter/reserveorder/listKuyu?';
        $http.post({
            url: url,
            data: {
                nowPage: nowPage,
                pageShow: pageShow

            },
            success: function (res) {
                if(res.code && (res.code == 403 || res.code == -10)){
                    $init.nextPage("login",'');                    
                }
                if (res) {
                    doReserveResponse(res,nowPage,pageShow);
                }

            },
            error: function (res) {

            }
        });
    }

    function doReserveResponse(res,nowPage,pageShow) {

        page(nowPage, pageShow, res.pagination.totalNum);
        var reserveorder = {
            uc : {
                buy: '立即抢购',
                start:'开始',
                waitBuy: '等待抢购'
            }
        };

        var html = '';
        var rows = res.rows;

        for (var i = 0; i < rows.length; i++) {
            var m = rows[i];
            var canBuy= res.canBuyList[i];
            var orderUuidId = res.orderUuidList[i];
           // var canBuy = canBuyList[vs.index];
           // var orderUuid = orderUuidList[vs.index];
            html += '<tr>' +
            '<td colspan="3" style="text-align:left; padding:0 20px;">' +
            '预约时间：'+m.orderTime+'<span>|</span>预约编号：'+m.reserveNo+'</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<div class="m_box">' +
            '<div class="m_img">' +
            '<a href="../productDetail/productDetail.html?uuid='+m.productUuid+'">' +
            '<img src="'+ m.skuNo+'" style = "width:50px;height:50px;"/>' +
            '</a>' +
            '</div>' +
            '<div class="m_tit">' +
            '<a href="../productDetail/productDetail.html?uuid='+m.productUuid+'" title="'+m.product.productInfo.productName+'">'+m.product.productInfo.productName+'</a>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '<td style="text-align:center">' +
            '<p>';
            if (m.state == '1' && canBuy == '1') {
                html += '<span class="f_color1">抢购中</span><br/>';
            }
           /* if (canBuy == '0') {
                html += '<span class="f_color1">'+m.stateName+'</span><br/>'
            }*/
            if(m.state == '2'){
                html += '<span class="f_color1">已抢购</span><br/>'
            }
            html += '</p>';
            if(m.promotionSubscribe.rushBuyBeginTime){
                html += '<p><i class="fa fa-clock-o"></i>'+m.promotionSubscribe.rushBuyBeginTime+''+reserveorder.uc.start+'</p>';
            }
            html += '</td><td style="text-align:center">';
            if (m.state == '1') {
                if (canBuy == '0') {
                    if (new Date(m.promotionSubscribe.rushBuyBeginTime).getTime() < new Date().getTime()) {
                        html += '<a href = "javascript:;" title = "活动结束" class = "y_btn y_btn_custom4 btn-sm disabled">活动结束 </a>';
                    } else {
                        html += '<a href = "javascript:;" title = "'+reserveorder.uc.waitBuy+'" class="y_btn y_btn_custom4 btn-sm disabled" >' +reserveorder.uc.waitBuy+'</a>';
                    }
                }
                if (canBuy == '1') {
                    html += '<a href = "../productDetail/productDetail.html?uuid='+m.productUuid+'&reserveOrderId='+m.uuid+'" title = "'+reserveorder.uc.buy+'" class = "y_btn y_btn_custom1 btn-sm" >'+reserveorder.uc.buy+'</a>';
                }
            }

            if (m.state == '2') {
                html += '<a href = "../orderDetail/orderDetail.html?'+orderUuidId+ '" title = "查看订单" class = "y_btn y_btn_custom4 btn-sm disabled">查看订单</a>';
            }
            html += '</td></tr >';

        }


        $("#reserveorder").empty(html);
        $("#reserveorder").append(html);



    }


    //底部页码
    var param = {};
    function page(nowPage, pageShow, totalNum) {
        totalPage = Math.ceil(totalNum / pageShow);
        param.nowPage = nowPage;
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        html = "";
        if(totalPage < 8) {
            html += '<button class="prev" ';
            if(nowPage == 1) {
                html += 'disabled';
            }
            html += ' style="background:#fff"><</button>';
            if(totalPage != 0) {
                for(var i = 1; i <= totalPage; i++) {
                    html += '<span class="item ';
                    if(nowPage == i) {
                        html += 'active';
                    }
                    html += '" title="第' + i + '页">' + i + '</span>';
                }
            } else {
                html += '<span class="item active" title="第1页">1</span>';
            }

            html += '<button class="next" ';
            if(nowPage == totalPage) {
                html += 'disabled';
            }
            html += ' style="background:#fff">></button>';

            $(".padding-box .clearmar").html(html);
        } else {
            if(totalPage >= 8 && nowPage < 7) {
                html += '<button class="prev" ';
                if(nowPage == 1) {
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';

                for(var i = 1; i <= 7; i++) {
                    html += '<span class="item ';
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

                $(".padding-box .clearmar").html(html);
            } else {
                html += '<button class="prev" ';
                if(nowPage == 1) {
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
                html += '<span class="item" title="第' + before + '页">' + before + '</span>';

                if(nowPage <= totalPage) {
                    html += '<span class="item active" title="第' + nowPage + '页">' + nowPage + '</span>';
                }
                if(nowPage + 1 <= totalPage) {
                    html += '<span class="item" title="第' + after + '页">' + after + '</span>';

                }

                html += '<button class="next" ';
                if(nowPage == totalPage) {
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';
                $(".padding-box .clearmar").html(html);
            }

        }

    }

    $(".padding-box .clearmar").on("click", "span:gt(0),span:lt(8)", function() {
        nowPage = $(this).html();
        if(nowPage.indexOf("...") > -1){
            return
        }else{
            $(this).addClass('active').siblings().removeClass('active');
            initReserve(nowPage, param.pageShow);
            $('body,html').animate({scrollTop: 0 },200);
        }

    });
    $(".padding-box .clearmar").on("click", ".prev", function() {
        if(param.nowPage > 1) {
            nowPage = param.nowPage - 1;
        }
        initReserve(nowPage, param.pageShow);
        $('body,html').animate({
            scrollTop: 0
        }, 200);
    });
    $(".padding-box .clearmar").on("click", ".next", function() {
        if(param.nowPage < param.totalPage) {
            nowPage = param.nowPage + 1;
        }
        initReserve(nowPage, param.pageShow);
        $('body,html').animate({
            scrollTop: 0
        }, 200);
    });


    $init.Ready(function() {
        var locKey = $Store.get('istaff_token');
        
        // function checkSSO (callback) {
        //     // var sso_url='';
        //     // if(document.domain=="www.tcl.com" && !_env.test){
        //     //     sso_url = "{{sso}}";
        //     // }else{
        //     //     sso_url = "{{ssoTest}}";   
        //     // }
        //     var script ="<script src={{sso}}></script>"
        //     $("body").append(script);
        //     cb = function (data){
        //         callback(data)
        //     };
        // }
    
        // if(!locKey) {
        //     checkSSO(function (data) {
        //         if(data.status == -1) {
        //             $init.nextPage("login",{});
        //             $Store.set(Date.now(), '云平台SSO检测失败')
        //         } else {
        //             $init.nextPage("cloudLogin", {msg:data.code})
        //         }
        //     })
        //     return;
        // } else {
        //     $binder.sync({'locKey':true});
        //     initReserve(1,6);
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
                    data:{code:res.code},
                    success: function (data) {
                        if(data.code == CODEMAP.status.success) {
                            localStorage.setItem('istaff_token', data.token);
                            $header.userInof();
                            $binder.sync({'locKey':true});
                            initReserve(1,6);
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

});
