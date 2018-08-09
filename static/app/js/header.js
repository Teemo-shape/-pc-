/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/14
 */
define('KUYU.Header', ['KUYU.Service', 'KUYU.Binder', 'KUYU.Store', 'KUYU.userInfo', 'juicer'], function() {
	var $http = KUYU.Service,
		$scope = KUYU.RootScope,
		$binder = KUYU.Binder,
		getUserInfo = KUYU.userInfo,
		$init = KUYU.Init,
		_env = KUYU.Init.getEnv(),
		$Store = KUYU.Store,
		$param = KUYU.Init.getParam(),
		_sever = KUYU.Init.getService();
	$init.cookie();
	$path = window.location.origin;
    var GLOBAL_UUID = $("#GLOBAL_UUID").val();
	function stringLength(str) {
		var len = 0;
		for(var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			//单字节加1
			if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
				len++;
			} else {
				len += 2;
			}
		}
		return len;
	};

	var header = {
		getTopBar: function() {
			var top_bar_nav = $("#top_bar_nav"),
				wechat_box = $(".wechat_box");
			$(document).on("mousemove", ".wechat_box", function() {
				$(this).find("a").css("color","#FFFFFF")
				$(".wechat").show();
			}).on("mouseout", ".wechat_box", function() {
				$(this).find("a").css("color","#CCC")
				$(".wechat").hide();
			}).on("mousemove", ".wechat", function() {
				$(this).find("a").css("color","#FFFFFF")
				$(".wechat").show();
			}).on("mouseout", ".wechat", function() {
				$(this).find("a").css("color","#CCC")
				$(".wechat").hide();
			})
			// $http.get({
			// 	url: '/homePage/getActiveFirstBars',
			// 	success: function(res) {
			// 		if(res.code == CODEMAP.status.success) {
			// 			var li = '';
			// 			if(res.retData && res.retData.length > 0) {
			// 				$.each(res.retData, function(i, o) {
			// 					if(i < 6){
			// 					li += '<li><a target="_blank" href=' + o.url + '>' + o.titleName + '</a></li>';
			// 					}
			// 				})
			// 			}
			// 			top_bar_nav.html(li)
			// 		}
			// 	}
			// });
			$http.get({
				url: '/homePage/getActiveTopBars?terminalType=01',
				success: function (res) {
					var dom = $("#topads");
					if(res.retData && res.code == 0) {
						var data = res.retData;
						if(data.imgUrl) {
							dom.html("<div class='divs'><a href="+data.url+" id='topads_background'></a><i id='t-event-close'>×</i></div>")
							dom.css({height:'85px'})
							var close = $("#t-event-close");
							var bg = $("#topads_background");
							bg.css({"background": "url("+data.imgUrl+") center center no-repeat", "height":"85px"})
							close.on("click", function (e) {
								dom.fadeOut(300);
							})
						}
					}
				}
			});

		},
		 hovera: function() {
		 	$(document).on("mousemove",".top-bar-wrap li",function(){
		 		$(this).find("a").css("color","#FFFFFF")
		 	})
		 	$(document).on("mouseout",".top-bar-wrap li",function(){
		 		$(this).find("a").css("color","#CCC")
		 	})
		},
		menuHover: function() {
            //获取头部分类
            var topParams={
                "terminalType":"PC",
            }
            $http.get({
                url: '/homePage/topNavigation/getActiveTopNavigation',
                dataType: 'json',
                data: topParams,
                success: function (res) {
                    var dom = $("#topads");
                    if(res.retData && res.code == 0) {
                        var data = res.retData;
                        var headerHtml="<i class=\"menu_line\"></i>";
                        var productsData=[];
                        var headermenuindex=0;
                        for(var i=0;i<data.length;i++){
                            if(data[i].type==0){
                                headerHtml+="<div class=\"mes\" data-id="+headermenuindex+"> <a href="+data[i].url+">"+data[i].titleName+"</a></div>";
                                headermenuindex++;
                                productsData.push(data[i].topNavigationContents);
                            }
                        }
                        $("#j-h-menu").html(headerHtml);
                        renderList(productsData);
                          _menuHover();

                    }
                }
            })


			function renderList(res) {
				var menuList = $(".menu-list");
				var li="";
				for(var i = 0; i < res.length; i++) {
					li += '<div class="li menuBarLi" data-id="' + i + '"></div>';
				}

				menuList.html(li)

				for(var i = 0; i < res.length; i++) {
					a(res[i])
				}

				function a(res){
                    var _li = $(".menuBarLi"), tpl ='';
                    var count = 0;
                    $.each(res.product, function (i ,o) {
                    	count++;
                        tpl +='<li>'
                            + '    <a target="_blank" href="' + o.url + '">'
                            + '           <span class="m_img"><img src="/app/images/loading.gif" data-o="' + o.imageUrl + '" data-load=false class="header_img" ></span>'
                            + '            <p class="m_tit">' + o.titleName + '</p>'
                            + '            <p class="red" id="plathead_' + o.uuid + '">'
                        if (o.staffPrice) {
                            tpl += o.staffPrice.toFixed(2) + '元'
                        } else {
                            tpl += "0.00" + '元'
                        }
                        tpl+='            </p>'
                        + '        </a>'
                        + '    </li>';
                        if(count == 5){
							return false;
						}
                    })
                    _li.eq(i).html('<ul>'+tpl+'</ul>');

                    var menuBox = $(".menu"),
                        header_img = $(".header_img");

                    menuBox.on('mouseover', function (e) {
                        $.each(header_img, function (i, o) {
                            var self= $(o);
                            if(self.attr('data-o')) {
                                var new_img = new Image();
                                new_img.src = self.attr('data-o');
                                if(!self.data('load')){
                                    new_img.onload = function () {
                                        self.attr("src", self.attr('data-o'))
                                        self.data('load', true)
                                    }
                                }
                            }
                        })
                    })
                    $(".header_img").lazyload({
                        effect: "fadeIn"
                    });
                }
			}
			//
			function _menuHover() {
				var menus = $(".mes"),
					lists = $(".li"),
					menuList = $(".menu-list"),
					menu_line = $(".menu_line"),
					parent_offset = 0,
					timer = null;
				var set_line = function(menu_line, self, flag) {
					menu_line.show();
					if(self) {
						parent_offset = self.parent().offset().left;
						menu_line.css({
							width: self.outerWidth(),
							bottom: '-10px',
							left: Math.floor(self.offset().left - parent_offset)
						});

					} else {
						menu_line.css({
							width: 0,
							bottom: '-24px',
							left: '0px'
						});
					}

				};

				$.each(menus, function(i, o) {
                    var lis = lists.eq(i);
                    var self = $(this);
                    menuList.height(lis.outerHeight());
					$(this).on('mouseover', function() {

						if(timer) {
							clearTimeout(timer);
							timer = null;
						}

						set_line(menu_line, self)
						lists.hide()
						lis.show();

                        if($(this).data('id') == lis.data('id')) {

							menuList.slideDown();
						} else {

							menuList.slideUp(120)
						}

					});
					$(this).on('mouseout', function() {

						timer = setTimeout(function() {
							set_line(menu_line)
							lists.eq(i).hide();
							menuList.slideUp(120)
							timer = null;
						}, 100)
					});
					lists.eq(i).on('mouseover', function() {

						if(timer) {
							clearTimeout(timer)
							timer = null
						}
					});
					lists.eq(i).on('mouseout', function() {

						timer = setTimeout(function() {
							set_line(menu_line)
							lists.eq(i).hide();
							menuList.slideUp(120)
							timer = null;
						}, 100)
					});

				});
			}

		},
		//热词搜索框
		topSearch: function() {

			function searchshow(data) {
				var list = $(".input-list")
				var placehoder = $(".ser-input").attr("placeholder")
				//搜索页面关键词自动关联到input上
				var href = window.location.href;
				if(href.indexOf("search/search")>-1){
				var word = sessionStorage.getItem("keyword")
					if(word) {
						$(".ser-input").val(word);
					}
				}
				$(document).on("focus",".ser-input",function(e){
					$(this).attr("placeholder",'');
					sessionStorage.removeItem("keyword")
					e.stopPropagation();
					if(data && list.text()) {
						list.show();
					}
				})
			    $(document).on("click",".input-list li",function(e){
					var html = $(this).find('a').attr('key');
					var list = $(".input-list");
					sessionStorage.setItem("keyword",html)
					list.hide();
					$(".ser-input").val(word);
					list.html('');
			    	e.stopPropagation();
				})

			    $(document).on("blur",".ser-input",function(){
					if($.trim($(this).val()) =='') {
						$(this).attr("placeholder",'电视');
					}
			    	setTimeout(function(){
			    		list.hide()
			    	},200)
			    })
			    $(".ser-input").on('keydown', function(e) {
					if(e.keyCode == 13) {
						var keyword = $(".ser-input").val();
						if($.trim(keyword) == ""){
							sessionStorage.setItem("keyword",placehoder)
							window.location.href = "/search/search?keyword=" + placehoder + "&sortBy=sortWeight";
						}
						else {
							sessionStorage.setItem("keyword",keyword)
							window.location.href = "/search/search?keyword=" + keyword + "&sortBy=sortWeight";
						}
					}
				});

				$(document).on('click', '.sear', function() {
					var keyword = $(".ser-input").val();
					if($.trim(keyword) == ""){
						sessionStorage.setItem("keyword",placehoder)
						window.location.href = "/search/search?keyword=" + placehoder + "&sortBy=sortWeight";
					}
					else {
						sessionStorage.setItem("keyword",keyword)
						window.location.href= "/search/search?keyword=" + keyword + "&sortBy=sortWeight";
					}
				});

			};


			$(document).on('keyup', '.ser-input', function(event) {
				event.stopPropagation();
				var self = $(this);
				var keyword = $(".ser-input").val();

				setTimeout(function () {
					getData(keyword)
				},300);
			});

			searchshow('');
			function getData(word) {
				$.get(KUYU.Init.getService().dev + "/front/product/pc/hotkeyword?platformUuid=platform_tcl_staff&word="+word, function(data) {
					var divHotKey = $(".input-list");
					var data = data.retData;
					var list = '';
					if(data && data.length) {
						$.each(data, function(i, item) {
							list += '<li><a target="_blank" href="/search/search?keyword=' + item.unionWord + '&sortBy=sortWeight" key='+item.unionWord+'>'+item.unionWord+' <i class="scCount">约有'+item.hitCount+'件</i></a></li>'
						});
						divHotKey.html(list).show();
					}else{
						divHotKey.html('').hide();
					}
					searchshow(data);
				});
			}


		},
		initMenu: function() {
			var dic = {
				'1': 'tv',
				'2': 'mobile',
				'3': 'air',
				'4': 'refrigerator',
				'5': 'washer',
				'6': 'homeappliance',
				'7': 'service',
				'10': 'dacg'
			};
			var mes = $(".mes")
			$.each(dic, function(i, o) {
				$(".mes[data-id=" + i + "]").find('a').attr('href', '/' + o)
				if(i == 7) {
					$(".mes[data-id='7']").find('a').attr('href', '/pages/service-home/index.html')
				}
				if(i == 10) {
					$(".mes[data-id='10']").find('a').attr('href', '/pages/bulkpurchase/bulkpurchase.html')
				}
			});
			$(".logo").attr("href", "/");

		},
        userInof: function() {
            getUserInfo(function(res) {
                var slideLoginSide = $("#nav-right") //$("#slideLoginSide");
                if(res.code == CODEMAP.status.success) {
                    var user = JSON.stringify(res.data);
                    sessionStorage.setItem("userinfo", user);
                    //如是用户登录状态 则显示登录样式
                    var name = res.data.customerName?res.data.customerName:'';

                    if(stringLength(name) >= 8) {
                        name = name.substr(0, 8) + '...';
                    };

                    $("#span_customerName").html(name).data("title", res.data.customerUuid);

                    var html ='<li class="index_cus_id" ><a href="javascript:;" id="onlyName" data-id=${customerUuid}  >{@if nickName} ${nickName} {@else} {@if realName} ${realName} {@else} ${customerName}{@/if} {@/if}</a><em class="arrow webfont">&#xe608;</em>' +
                        '<div class="info clearfix">'+
                        // 	'<div class="infotop clearfix">'+
                        // 	'<a href="{{manageuser}}"><img src={@if customerImgUrl} ${customerImgUrl} {@else}../../app/images/admin.png{@/if}></a>'+
                        // 	'<div class="inforight">'+
                        // 	 '<div class="p1"><span class="user_name" title="{@if nickName} ${nickName} {@else} ${customerName}{@/if}">{@if nickName} ${nickName} {@else} ${customerName}{@/if}</span><span><img id="userlevel"/></span></div>'+
                        // 	 '<div class="p2"><span>积分</span> <a id="userjifen" href="{{integral}}" title=${jifen} >${jifen}</a>　<span>优惠券 </span> <a href="/pages/coupondetails/coupondetails.html" title=${coupon} >${coupon}</a></div>'+
                        // 	 '</div>'+
                        // '</div>'+
                        '<div class="infobom clearfix">'+
                        // '<a href="{{uthome}}"><span>个人中心</span></a>{{equityHTML}}'+
                        '<a href="{{uthome}}"><span>个人中心</span></a>'+
                        '<a href="{{wodeshoucang}}"><span>我的收藏</span></a>'+
                        '<a href="{{manageuser}}" target="_blank"><span>账号管理</span></a>'+
                        '<a href="/pages/productappraise/productappraise.html#productappraise"><span>评价管理<span></span></a>'+
                        '<a id="exit" href="javascript:;"><span>退出登录</span></a>'+
                        '</div>'+
                        '</div>'+
                        '</li><i></i><li><a href="/pages/orderList/orderList.html">我的订单</a></li><i></i>'+
                        '<li class="index_cart_li"><a class="index_cart shoping" href="javascript:;" >购物车</a><span  class="newheader-circle" id="newhead_cart">( 0 )</span></li>';
                    var htm = juicer(html, res.data);

                    slideLoginSide.html(htm);

                    // if(res.data.level == "T1" || res.data.level == "T0"||res.data.level == "铁粉T1" || res.data.level == "铁粉T0"){
                    //     $("#userlevel").attr("src","../../app/images/Artboard1.png")
                    // }
                    // else if(res.data.level == "T2" || res.data.level == "铁粉T2"){
                    //     $("#userlevel").attr("src","../../app/images/Artboard2.png")
                    // }
                    // else if(res.data.level == "T3" || res.data.level == "铁粉T3"){
                    //     $("#userlevel").attr("src","../../app/images/Artboard3.png")
                    // }
                    // else if(res.data.level == "T4" || res.data.level == "铁粉T4"){
                    //     $("#userlevel").attr("src","../../app/images/Artboard4.png")
                    // }
                    // else if(res.data.level == "T5" || res.data.level == "铁粉T5"){
                    //     $("#userlevel").attr("src","../../app/images/Artboard5.png")
                    // }

                    $(".shoping ").click(function() {
                        $init.nextPage('cart', {});
                    });

                    var index_cus_id = $(".index_cus_id"),info=$(".info"),htimer= null;
                    index_cus_id.on('mouseover', function(e) {
                        clearTimeout(htimer)
                        info.show();
                    });
                    index_cus_id.on('mouseout', function(e) {
                        htimer = setTimeout(function () {
                            info.hide();
                        },300)
                    });
                    info.on('mouseover', function(e) {
                        clearTimeout(htimer)
                    });
                    info.hover(function(){
                        clearTimeout(htimer)
                    },function(){
                        htimer = setTimeout(function () {
                            info.hide();
                        },300)
                    });


                    slideLoginSide.on("click", "#exit", function() {
                        $init.getHeaders()['ihome-token'] =  $Store.get('istaff_token') ? $Store.get('istaff_token') : null;
                        $http.get({
                            url: '/login/staff/logout',
                            success: function(data) {
                                if(data.code == CODEMAP.status.success || data.code == CODEMAP.status.TimeOut || data.code == 103) {
                                    localStorage.removeItem("istaff_token");
                                    // localStorage.removeItem("ssoInject_first_time");
                                    localStorage.removeItem("CartNum");
                                    $.removeCookie("istaff_token")
                                    // $.removeCookie("fanliCookie")
                                    $init.nextPage("Index", {});
                                    //window.location.reload()
                                }else{
                                    Msg.Alert('', "退出失败",function () {});
                                }
                            }
                        });
                        // localStorage.removeItem("istaff_token");
                        // $init.nextPage("Index",{});
                    });
                    header.getCartCount('login')
                    if(GLOBAL_UUID) { //如果UID存在侧进入的是商品详情客服
                        header.GETKF(GLOBAL_UUID, res);
                    } else {
                        header.GETKF(null,res);
                    }
                } else {
                    if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut || res.code == 103) {
                        $init.nextPage("Index", {});
                        localStorage.removeItem('istaff_token');
                        $.removeCookie("istaff_token", { path: '/' })
                        $.removeCookie("fanliCookie", { path: '/' })
                    };

                };
            });
        },
		getCartCount: function(isLogin) {
			//未登录获取购物车数量
            var CartNum = localStorage.getItem('CartNum');

            if(CartNum && parseInt(CartNum)) {
                $("#newhead_cart").text("( "+CartNum+" )")
            }
            else {
                $("#newhead_cart").text("( 0 )")
            }
			if(!window.attachEvent) {
				window.addEventListener('setItemEvent', function(e) {
					if(e.key == 'CartNum') {
						$("#newhead_cart").text("( "+e.val+" )")
					}
				});
			}

			//获取购物车数量
			function getCount() {
				$http.post({
					url: "/cart/count",
					success: function(data) {
						if(data.code == 0) {
							$("#newhead_cart").text("（"+data.data+"）")
						}
						// if(data.code == 0 && data.data != 0) {
						// 	//购物车有货且本地有货
						// 	if(cartSize) {
						// 		$("#newhead_cart").text("（"+data.data + cartSize+"）")
						// 	}
						// 	//购物车有货且本地无货
						// 	else {
						// 		$("#newhead_cart").text("（"+data.data+"）")
						// 	}
						// } else if(data.code == 0 && data.data == 0) {
						// 	//购物车无货且本地有货
						// 	if(cartSize) {
						// 		$("#newhead_cart").text("（"+cartSize+"）")
						// 	}
						// 	//购物车无货且本地无货
						// 	else {
						// 		$("#newhead_cart").text("")
						// 	}
						// } else {
						// 	$("#newhead_cart").text("")
						// }
					}
				})
			};
			if(isLogin) {
				getCount();
			}
		},
		GETKF: function(_UUID, res) { //小能客服
			var keyword = $param.keyword;
			var _obj = {};
			var Uid= {};
			if(res) {
				_obj.Uid = res.data.customerUuid
				_obj.uname = res.data.nickName ? res.data.nickName : res.data.customerName;
			}
			/* id="categoryUuid"若存在，则进入的是频道页 */
			if($('#categoryUuid').length != 0) {
				var categoryUuid = $('#categoryUuid').val(); //获取频道页的Uuid,通过判断categoryUuid确定进入哪个频道页
				/*频道页分类名称，相应的cateUuid 对应相应的频道*/
				var channelObj = {
					"456a4e26d34540eab1b31c7212a5fd98": "电视",
					"9dcd3d03e0674150831553d1bcd86176": "手机",
					"325fe3718b3f4d4f8abe611373df821a": "空调",
					"bbef5c0d59e74f04a1aadcc8003d9511": "冰箱",
					"51dc2554485d4c549503a63298c34fae": "洗衣机",
					"778c3418ca0a459b925a1edd09620c88": "健康电器"
				}
				NTKF_PARAM = {
					siteid: "kf_9428", //企业ID，为固定值，必填
					settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
					uid: _obj.Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
					uname: _obj.uname, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
					isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
					userlevel: "1", //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
					ntalkerparam: {
						category: channelObj[categoryUuid] //分类名称，多分类可以用分号(;)分隔， 长路径父子间用冒号(:)分割：对应channelObj的值
					}
				}
			} else if(_UUID) { //商品详情
				NTKF_PARAM = {
					siteid: "kf_9428", //企业ID，为固定值，必填
					settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
					uid: _obj.Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
					uname: _obj.uname, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
					isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
					userlevel: "1", //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
					itemid: _UUID, //(必填)商品ID
					itemparam: "pc_Product" //(选填)itemparam为商品接口扩展字段,例如 pc/Product  pc/Promotion/促销id/促销商品skuno
				}
			} else if(keyword) {
				NTKF_PARAM = {
					siteid:"kf_9428",		             //企业ID，为固定值，必填
					settingid:"kf_9428_1525949700591",	 //接待组ID，为固定值，必填
					uid: _obj.Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
					uname: _obj.uname, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
					isvip:"0",                           //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
					userlevel:"1",		                 //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
					erpparam:"abc",                      //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
					ntalkerparam:{
				　　		category: keyword,    //分类名称，多分类可以用分号(;)分隔， 长路径父子间用冒号(:)分割
				　　		brand: ""             //品牌名称，多品牌可以用分号(;)分隔
					}
				}
			}else {
				/*其他页面*/
				NTKF_PARAM = {
					siteid: "kf_9428", //企业ID，为固定值，必填
					settingid: "kf_9428_1525949700591", //接待组ID，为固定值，必填
					uid: _obj.Uid, //用户ID，未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
					uname: _obj.uname, //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
					isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
					userlevel: "1" //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
				}
			}
			//每个页面添加客服悬浮框
			$(function() {
				var html = ["<div class=\"goTop\">",
					"            <a href=\"javascript:void(0);\" onclick=\"NTKF.im_openInPageChat(\'kf_9428_1525949700591\')\">",
					"                <div class=\"item\"></div>",
					"            </a>",
					"			<a onclick=\"$(\'body,html\').animate({scrollTop: 0 },500);\"></a>",
					"		</div>"
				].join("");
				//var src = '<script type="text/javascript" src="http://dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_9428" charset="utf-8"></script>';
				if(window.location.pathname != '/page/ueCenter/ueCenter') {
					$("body").append(html);
				}
                (function () {
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = (location.protocol == 'https:' ? 'https:' : 'http:') + '//dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_9428';
                    var  firstScript = document.getElementsByTagName('script')[0];
                    firstScript.parentNode.insertBefore(s, firstScript);
                })();

				//滚动至一定位置才显示 Linxh
				// var $scrollFun = function() {
				// 	var st = $(document).scrollTop();
				// 	st > 0 ? $('.goTop').show() : $('.goTop').hide();
				// }
				// $(window).on('scroll', $scrollFun);
			});
		}
	};

	$binder.init();

	header.initMenu();
//	header.topSearch();

	$init.Ready(function() {
		header.getTopBar();
		// header.getCartCount();

		header.hovera();
        header.userInof();
        // var SOK = function (res) {
        //     if(res.status != -1 && res.code) {
			// 	var token = $Store.get('istaff_token') ? $Store.get('istaff_token') : null;
			//
        //         $.ajax({
        //             url: '/rest/ssologin/check',
			// 		type:'get',
			// 		headers:{
			// 			'ihome-token' : token,
			// 		},
        //             data:{code: res.code },
        //             success: function (data) {
        //                 if(data.code == CODEMAP.status.success) {
        //                     localStorage.setItem('istaff_token', data.token);
        //                     // if($param.uuid) {
        //                     //     $header.userInof()
			// 				// }
        //                     header.userInof();
        //                     mergeCart();
        //                 }else{
			// 				$init.nextPage("login",'')
			// 			}
        //             }
        //         })
        //     } else {
			// 	if($Store.get('istaff_token') || $.cookie('_ihome-token_')) {
			// 		header.userInof()
			// 	} else {
			// 		if($param.uuid) { //如果UID存在侧进入的是商品详情客服
			// 			header.GETKF($param.uuid);
			// 		}else{
			// 			header.GETKF();
			// 		}
			// 		header.getCartCount();
        //
			// 	}
        //     }
        // }
        /*
        * 如果超时或者tokne不存在就发请求
        */
        cb = function (data){
            // SOK(data);
        //    if(!$Store.get('istaff_token')) {
        //         SOK(data);
        //    } else {
        //        if(Array.of) {
        //            console.info(data)
        //        }
        //    }
        }

        var script ="<script src='{{sso}}'><\/script>";
        $("body").append(script);


        function mergeCart() {
            var simpleDbCart = {};
            var carts = $Store.get('shoppingcart');
            if(carts) {
                var localData  = $Store.get('shoppingcart');
                var res = JSON.parse(localData);
                var list = res ? res.storeMap["03d03b6b05604c5cb065aef65b72972e"] : [];
                var cartNewMaps = {};
                var listMap = {};
                $.each(list, function (i , o) {
                    listMap[o.storeUuid] =  [];
                });
                $.each(list, function (i ,o ) {
                    if(listMap[o.storeUuid]) {
                        listMap[o.storeUuid].push(o)
                    }
                })
                cartNewMaps["storeMap"] = listMap;
                simpleDbCart.storeMap= listMap
            } else {
                simpleDbCart.storeMap= {}
            }
            $http.post({
                url:'/login/mergeCart',
                data:JSON.stringify(simpleDbCart),
                headers:{"Content-Type":"application/json; charset=UTF-8"},
                success: function ( res ) {
                    if(res.code == CODEMAP.status.success) {
                        if(localData && window.location.href.indexOf('cart.html') > 0) {
                            window.location.reload();
                        }

                        $Store.remove('shoppingcart');

                        if (window._gsTracker) {
                            _gsTracker.track("/targetpage/loginOk");
                        }

                        if($Store.get('m18') == 1) {
                            $Store.set('m18',2);
                        }
                    }
                }
            })
        };


	})

	KUYU.toSearch = function(item) {
		window.location.href = "/search/search?keyword=" + item + "&sortBy=sortWeight";
	};

    _APP.inject('KUYU.Header', header);
});
