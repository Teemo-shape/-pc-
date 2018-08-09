require(['KUYU.Service', 'KUYU.plugins.slide', 'placeholder','KUYU.Store'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService();
	var move = {
		imgHover: function() {
			var li = $(".tv_sec_right li")
			li.each(function(i, o) {
				$(this).on("mouseover", function() {
					$(this).removeClass("hoverimg")
					$(this).addClass("hoverimg")
				})
				$(this).on("mouseout", function() {
					$(this).removeClass("hoverimg")
				})
			})
		},
		bannerHover: function() {
			var timer = null
			$("#ban-nav .ul li").hover(function() {
				if(timer) {
					clearTimeout(timer);
					timer = null;
				}
				var uuid = $(this).attr("uuid")
				var width = $('.ban-nav-cont[uuid=' + uuid + ']').attr("width")
				$(".ul li").removeClass('active')
				$(this).addClass('active')
				$('.ban-nav-cont').hide()
				$(".ban-nav-box").show()
				$('.ban-nav-cont[uuid=' + uuid + ']').show()
				$(".ban-nav-box").css("width",width)
			}, function() {
				$('.ban-nav-cont').hide()
				$(".ban-nav-box").hide()
				timer = setTimeout(function() {
					$(".ul li").removeClass('active')
					$(".ban-nav-box").hide();
					$(".ban-nav-cont").hide();
					$(".ban-nav-box").hide();
				}, 100)
			})
			$(".ban-nav-cont").hover(function() {
				if(timer) {
					clearTimeout(timer)
					timer = null
				}
				var uuid = $(this).attr("uuid")
				$("#ban-nav .ul li").removeClass("active")
				$('#ban-nav .ul li[uuid=' + uuid + ']').addClass("active")
				$(".ban-nav-box").show()
				$('.ban-nav-cont[uuid=' + uuid + ']').show();
			}, function() {
				timer = setTimeout(function() {
					$("#ban-nav .ul li").removeClass("active")
					$(".ban-nav-box").hide()
					$(".ban-nav-cont").hide()
				}, 100)
			})
		},
		//点击锚链接 到指定地点
		leftnav: function() {
			var index = 0;
			$(document).on("click", ".float_nav li", function() {
				index = $(this).attr("data-id");
				console.log(index);
				var height = $('.tv_series' + index).offset().top - 10
				$('body,html').stop().animate({
					scrollTop: height + "px"
				}, 500);
			})
			//滑动的时候，类目变颜色
			$(window).scroll(function() {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var len = $(".float_nav li").length;
				for(var i = 0; i < len; i++) {
					if(scrollTop > 730 + 650 * i && scrollTop < 730 + (i + 1) * 650) {
						$(".float_nav").show();
						$(".float_nav li a").removeClass("nav-color").eq(i).addClass("nav-color");
					}
					if(scrollTop > 730 + (i + 1) * 650) {
						$(".float_nav li a").removeClass("nav-color")
						$(".float_nav").hide();
					}
					if(scrollTop < 730){
						$(".float_nav").hide();
					}
				}
			});
		},
        thirdLogin: function () {
            var urlparam = KUYU.Init.getParam("detail");
            if(urlparam) {
                if(urlparam.detail) {
                    var getparam = JSON.parse(urlparam.detail)
                    if(getparam.loginCallBack && getparam.loginCallBack.url) {
                        $http.post({
                            url: '/login/loginBind',
                            data: {
                                detail: JSON.stringify(getparam)
                            },
                            success: function(res) {
                                if(res.code == "0") {
                                    if(localStorage) {
                                        localStorage.setItem('istaff_token', res.data.token);
                                    } else if($.cookie) {
                                        $.cookie('istaff_token', res.data.token, {
                                            expires: 1
                                        });
                                    } else {
                                        Array.of ? console.warn("can't store") : '';
                                    }
                                    var user = getparam.user;
                                    sessionStorage.userinfo = user;
                                    mergeCart();
                                } else if(res.code == "-1") {
                                    alert('登录失败')
                                    window.location.href = '/';
                                } else if(res.code == "-6") {
                                    var url1 = window.location.search.substring(1);
                                    window.location.href = '/pages/register/thirdLogin.html?'+url1;
                                }
                            }
                        })
                    }
                }
            }
        }
	}

    var help = $(".help").outerHeight(true),
        series = $(".series"),
        footer = $(".footer").outerHeight(true);
    //715 是新闻的高度写死的
    var bottom = 715 + help + footer

    $(window).scroll(function() {
        sc_init();
    });
    window.onresize = function() {
        sc_init();
    }

    function sc_init() {
        var float_nav = $(".float_nav");
        float_nav_h = float_nav.outerHeight(true);
        var height = $(window).height(),
            scrollTop = $(document).scrollTop();
        float_nav.css({ top: height / 2 - float_nav_h / 2 });
        if(scrollTop > series.offset().top - 250) {
            float_nav.show();
        } else {
            float_nav.hide();
        }
    }

    function mergeCart() {
        var simpleDbCart = {};
        var carts = $Store.get('shoppingcart');
        if(carts) {
            var localData = $Store.get('shoppingcart');
            var res = JSON.parse(localData);
            var list = res ? res.storeMap["03d03b6b05604c5cb065aef65b72972e"] : [];
            var cartNewMaps = {};
            var listMap = {};
            $.each(list, function(i, o) {
                listMap[o.storeUuid] = [];
            });
            $.each(list, function(i, o) {
                if(listMap[o.storeUuid]) {
                    listMap[o.storeUuid].push(o)
                }
            })
            cartNewMaps["storeMap"] = listMap;
            simpleDbCart.storeMap = listMap;
        } else {
            window.location.href = '/';
        };
        $init.getHeaders()['Content-Type'] = 'application/json; charset=utf-8';
        $http.post({
            url: '/login/mergeCart',
            data: JSON.stringify(simpleDbCart),
            success: function(res) {
                if(res.code == CODEMAP.status.success) {
                    $Store.remove('shoppingcart');
                    window.location.href = '/';
                }
            }

        })
    }

    $init.Ready(function (){
		$(".banner").Slide({
            eles: $(".banner-slide"),
            dots: $(".banner-dots"),
            slideshow: true
		});
		$("img.hot-img").lazyload({
            effect: "fadeIn",
            skip_invisible: !1
		});
		move.imgHover()
		move.bannerHover()
		move.leftnav();
        move.thirdLogin();
	})
    $(function() {
        var clears = $(".ban-cont-list .ban-cont-list-three")
        for (var i = 0; i < clears.length; i++) {
            var clear = $(clears[i])
            if(clear.children().length === 1) {
                clear.closest(".ban-cont-list-three").css("border", "none")
                //二级分类没有下级时不显示箭头
                //clear.closest(".typetwo-li").find('.typetwo-arr').css("display", "none")
            }
        }
        // if(clear.hasClass("clear")) {
        //     clear.closest(".ban-cont-list-three").css("border", "none")
        // }
    })




});
