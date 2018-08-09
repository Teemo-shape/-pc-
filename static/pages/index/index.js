/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/4
 */
require(['KUYU.Service', 'KUYU.plugins.slide', 'placeholder', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'KUYU.navFooterLink', 'KUYU.Store', 'juicer'], function() {
	var $http = KUYU.Service,
		slidBarLogin = KUYU.SlideBarLogin,
		$init = KUYU.Init,
		navFooterLink = KUYU.navFooterLink,
		$Store = KUYU.Store,
		Header = KUYU.HeaderTwo,
		_env = KUYU.Init.getEnv(),
		_sever = KUYU.Init.getService();
	Header.topSearch();
	$(function() {
		//跳转到订单列表的判断条件
		sessionStorage.setItem("order", "")
		initAdvertisement();

	});
	function escapeHtml (text) {
		var temp = document.createElement("div");
		   temp.innerHTML = text;
		   var output = temp.innerText || temp.textContent;
		   temp = null;
		   return output;
	//	return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	};
	/*!
	 * @method menuHover
	 *  头部显示隐藏
	 */
	var hotModule = function() {
			$(".box .exhibition li.exhi-item").click(function() {
				var url = $(this).attr("url");
				window.open(url, "_blank");
			});
			//添加标签页鼠标经过事件

			$(document).on('mouseover', '.hot-ul>li', function() {
				var i = $(this).index('.hot-ul>li');
				$('.exhibition ul').eq(i).show().siblings('ul').hide();
				var $clas = 'hot-product ' + $(this).attr('class').split()[0];
				$('.hot-product').attr('class', $clas);
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
			});

			//初始化，选中第一个标签
			(function() {
				var index = 0;
				$(".hot-product .exhibition ul").each(function(i, item) {
					if($(item).find("li").length > 0) {
						index = i;
						return false;
					}
				});
				$(".hot-product .hot-ul li").eq(index).addClass("active");
				var clName = "hot-back";
				//从li中获取class名
				try {
					var cl = $(".hot-product .hot-ul li").eq(index).attr("class").split(" ");
					for(var i = 0; i < cl.length; i++) {
						if(cl[i].includes("-back")) {
							clName = cl[i];
						}
					}
				} catch(e) {}
				$(".hot-product").addClass(clName);
				$(".hot-product .exhibition ul").eq(index).show();
			})();
		},
		initBannerNav = function() {
			var timer = null;
			$(document).on("mousemove", ".ul li", function() {
				if(timer) {
					clearTimeout(timer);
					timer = null;
				}
				var i = $(this).index(),
					uuid = $(this).attr("uuid"),
					li = $("#ban-nav .ul li"),
					ban_box = $(".ban-nav-box"),
					ban_cont = $(".ban-nav-cont");
				var width = $('.ban-nav-cont[uuid=' + uuid + ']').attr("width");
				var categoryImg = $(".category-img");
				$(".ul li").removeClass('active')
				$(this).addClass('active')
				ban_cont.hide();
				ban_box.show();
				if(width == "1040px") {
					ban_box.css("width", "1040px")
				} else {
					ban_box.css("width", "758px")
				}
				$('.ban-nav-cont[uuid=' + uuid + ']').show();
				$.each(categoryImg, function(i, o) {
					if($(o).data("load") == false) {
						$(this).attr("src", $(this).data("o"))
					}
				})
			}).on("mouseout", ".ul li", function() {
				timer = setTimeout(function() {
					$(".ul li").removeClass('active')
					$(".ban-nav-box").hide();
					$(".ban-nav-cont").hide();
					$(".ban-nav-box").hide();
				}, 100)
			}).on("mousemove", ".ban-nav-cont", function() {
				if(timer) {
					clearTimeout(timer)
					timer = null
				}
				var i = $(this).index(),
					uuid = $(this).attr("uuid"),
					li = $("#ban-nav .ul li"),
					ban_box = $(".ban-nav-box"),
					ban_cont = $(".ban-nav-cont");
				li.removeClass("active")
				$('#ban-nav .ul li[uuid=' + uuid + ']').addClass("active")
				ban_box.show();
				$('.ban-nav-cont[uuid=' + uuid + ']').show();
			}).on("mouseout", ".ban-nav-cont", function() {
				timer = setTimeout(function() {
					$("#ban-nav .ul li").removeClass("active")
					$(".ban-nav-box").hide()
					$(".ban-nav-cont").hide()
				}, 100)
			})
		};
	//banner get data
	function initAdvertisement() {
		var url = '/getIndexAds/pc';
		$http.post({
			url: url,
			cache: true,
			data: {},
			success: function(res) {
				if(res) {
					if(res.topAds) {
						var topAds_html = '<div class="banner">' +
							'<div class="banner-content" id="banner-content">';
						$.each(res.topAds, function(topAdsKey, topAdsItem) {
                             //if(topAdsKey == 1)return
							topAds_html += '<div class="banner-slide slide-active">' +
								'<a target="_blank" href="' + topAdsItem.href + '" class="inner-link " >' +
								'<img data-load="' + (topAdsKey == 0 ? true : false) + '" src="' + (topAdsKey == 0 ? topAdsItem.src : "../../app/images/loading.gif") + '"  _data-original="' + topAdsItem.src + '" alt="' + topAdsItem.alt + '" class="src banner_src">' +
								'</a>' +
								'</div>';
						});

						topAds_html += '<div class="dots-box wd1228"><div class="banner-dots"></div></div>';
						$('#banner-content').empty().append(topAds_html);
                        $('.banner').append('<div class="anchors"><a href="javascript:;" class="banner-anchor flex-prev prev">&#xe632;</a><a href="javascript:;" class="banner-anchor flex-next next">&#xe631;</a></div>');
						var banner_src = $(".banner_src");

						$.each(banner_src, function(i, o) {
							var self = $(o);
							var new_img = new Image();
							new_img.src = self.attr('_data-original');
							if(!self.data('load')) {
								new_img.onload = function() {
									self.attr("src", self.attr('_data-original'))
									self.data('load', true)
								}

							}
						});

						$(".banner").Slide({
							eles: $(".banner-slide"),
							dots: $(".banner-dots"),
							slideshow: true
						});

						//initPosition(res.topAds);
						if(res.threeAds) {
							var threeAds_html = '';
							$.each(res.threeAds, function(key, value) {
								threeAds_html += '<li class="new-left" '+(key>=2 ? "style='margin-right:0px;'" : "" )+'>' +
									'<a target="_blank" width="409" height="409" href="' + res.threeAds[key].href + '" target="_blank">' +
									'<div class="text-l">' +
									'<p class="prod-name"></p>' +
									'<p class="prod-desc"><span pid="price_TheCreativeLifes.html"> </span></p>' +
									'</div><img  src="' + res.threeAds[key].src + '" alt="' + res.threeAds[key].alt + '"></a>' +
									'</li>'
							});
							$("#threeAd").empty().append(threeAds_html);

							if(res.newsTitle) {
								$("#dynamic_title").html(res.newsTitle.title);
								$("#sub_bdynamic_title").html(res.newsTitle.subTitle);

								if(res.news) {
									var news_html = '';
									$.each(res.news, function(key, newItem) {

										if(key === res.news.length - 1) {
											news_html += '<li class="fans-item fans-last-child">' +
												'<a target="_blank" href="' + newItem.href + '"><img src="../../app/images/loadbg.gif" data-original="' + newItem.src + '" alt="' + newItem.alt + '"></a>' +
												'<div class="fans-box">' +
												'<div class="fans-title">' +
												'<span class="fans-news">' + newItem.type + '</span>' + newItem.title +
												'</div>' +
												'<div class="fans-describe">' + newItem.desc.substring(0, 20) + '...</div>' +
												'<a target="_blank" href="' + newItem.href + '" class="fans-details" target="_blank">查看详情 &gt;&gt; </a>' +
												'</div>' +
												'</li>'
										} else {
											news_html += '<li class="fans-item">' +
												'<a target="_blank" href="' + newItem.href + '"><img src="../../app/images/loadbg.gif" data-original="' + newItem.src + '" alt="' + newItem.alt + '"></a>' +
												'<div class="fans-box">' +
												'<div class="fans-title">' +
												'<span class="fans-news">' + newItem.type + '</span>' + newItem.title +
												'</div>' +
												'<div class="fans-describe">' + newItem.desc.substring(0, 20) + '...</div>' +
												'<a target="_blank" href="' + newItem.href + '" class="fans-details" target="_blank">查看详情 &gt;&gt; </a>' +
												'</div>' +
												'</li>'
										}
									});

									$("#news").empty().append(news_html);
									$("img").lazyload({
										effect: "fadeIn"
									});
									if(res.newsTitle.more) {
										var more = '<div class="fans-more"> <a href="' + res.newsTitle.more + '" target="_blank">查看更多 &gt;&gt; </a> </div>'
										$(more).insertAfter("#news");
									}
								}
							}

							if(res.titles) {
								$(".hot-title").html(res.titles[0])
								$("#hot_title li").each(function(key, titleVal) {
									$(this).find('h3').html(res.titles[key + 1]);
								});
							}

						}
						//获取首页商品价格
						getPrice()
					}
				}
			}
		})
	}
	//获取首页价格
	function getPrice() {
		var size = 20;
		var countSum = $('span[product_price]').length;
		var uuids = "";
		$('span[product_price]').each(function(index, item) {
			var uuid = $(item).attr("product_price");
			if(uuid != "" && typeof(uuid) != "undefined" && uuid.length == 32 && uuid.indexOf(".jsp") < 0 && uuid.indexOf(".html") < 0) {
				uuids += uuid + ",";
			}
		});
		getProductPriceByUuid(uuids);
	}
	//获取价格
	function getProductPriceByUuid(uuids) {
		$http.post({
			url: "/front/product/getProductPriceByProductUuid",
			data: {
				"productUuids": uuids
			},
			success: function(data) {
				if(data.code == 0) {
					var tpl = [
						'{@each data as list}',
						'$${list|getProductPrice}',
						'{@/each}'
					].join('');
					var getProductPrice = function(data) {
						return $("span[product_price='" + data.productUuid + "']").html(data.productPrice + "元");
					}
					juicer.register('getProductPrice', getProductPrice); //注册自定义函数
					var result = juicer(tpl, data);
				}
			}
		})
	}

	Header.menuHover();

	hotModule();

	/*
	 * @bannerTransform 效果改版废弃
	 * */
	// bannerTransform();

	// 页脚
	navFooterLink()
	//第三方登录跳转问题
	$(function() {
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
								var url = window.location.href;
								var url1 = url.split("index.html")[1]
								window.location.href = '../register/thirdLogin.html?' + url1;
							}
						}
					})
				}
			}
		}
	});

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
		float_nav.css({ top: height / 2 - float_nav_h / 2 })
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

	/**
	 * Created With TCL-PC-new.
	 * User: hcccc - hucong@kuyumall.com
	 * Date: 2017/3/3
	 */
	var listdata = [];
	var listuuid = [];
	var flag = false;
	//获取可用类目
	function mainNav() {
		var url = '/homePage/category/getActiveMain';
		$http.post({
			url: url,
			success: function(res) {
				if(res.code == 0) {
					var list = res.retData;
					for(var i = 0; i < list.length; i++) {
						mainRight(list[i].uuid)
						if(flag) {} else {
							listdata.push(list[i])
						}
						flag = false
					}
					getusenav()
				}
			}
		});
	};
	//获取可用类目
	function getusenav() {
		var html = '';
		for(var i = 0; i < listdata.length; i++) {
			if(i < 7) {
				html += '<li uuid="' + listdata[i].uuid + '"><a>' + listdata[i].titleName + '</a> <i class="flex-next">&#xe631;</i></li>'
			}
		}
		$("#ban-nav .ul").html(html)
	}
	//通过目录uuid获取
	function mainRight(uuid) {
		var url = '/homePage/category/getActiveContent?parentId=' + uuid;
		$http.post({
			url: url,
			async: false,
			success: function(res) {
				if(res.code == 0) {
					var list = res.retData.product;
					var listad = res.retData.poster;
					var num = Math.ceil(Math.random() * listad.length) - 1
					var html = '';
					if(listad && listad[num]) {
						html += '<div class="ban-nav-cont" width="1055px" uuid=' + uuid + '>'
					} else {
						html += '<div class="ban-nav-cont" width="758px" uuid=' + uuid + '>'
					}
					html += '<ul class="ban-cont-list fl">'
					for(var i = 0; i < list.length; i++) {
						if(i < 6) {
							html += '<li><a  target="_blank" href="' + list[i].url + '">' +
								'<img src="../../app/images/loadbg.gif" class="category-img" data-load=false data-o="' + list[i].imageUrl + '" >' +
								'<div class="dj">' +
								'<p>' + list[i].titleName + '</p>' +
								'<button>立即购买</button>' +
								'</div>' +
								'</a></li>'
						}
					}
					html += '</ul>' +
						'<div class="ad fl">'
					if(listad && listad[num]) {
						html += '<a target="_blank" href="' + listad[num].url + '"><img class="category-img" data-load=false data-o=' + listad[num].imageUrl + ' src="../../app/images/loadbg.gif"></a>'
					}
					html += '</div>' +
						'</div>'
					//如果通过uuid取出来有值，则添加dom
					if(list && list.length > 0) {
						$(".ban-nav-box").append(html)
					} else {
						flag = true
					}
					initBannerNav()
				}
			}
		});
	};
	//	推荐商品列表
	var des = []; //推荐语列表
	function getallproduct() {
		var url = '/homePage/featured/getActiveFeatured';
		$http.post({
			data: { terminalType: "01" }, //pc终端参数
			url: url,
			success: function(res) {
				var list = res.retData;
				var menu = "";
				var sum = "";
				if(res.code == 0) {
					for(var i = 0; i < list.length; i++) {
						if(list && list.length > 0) {
							if(list[i].featuredContents && list[i].featuredContents.product && list[i].featuredContents.product.length > 0) {
								if(list[i].description) {
									des = list[i].description.split(",")
								}
								var num = Math.ceil(Math.random() * list[i].featuredContents.poster.length) - 1
								sum += '<div class="tv_series tv_series' + i + '">' +
									'<div class="clear headerSeries">' +
									'<h3>' + list[i].titleName + '</h3>' +
									'<ul class="akey">'
								for(var n = 0; n < des.length; n++) {
									sum += '<li><a target="_blank" href=/pages/search/search.html?keyword=' + des[n] + '&sortBy=sortWeight>' + des[n] + '</a></li>'
								}
								sum += '</ul>' +
									'<a target="_blank" class="more" href=' + list[i].url + '>更多 ></a>' +
									'</div>' +
									'<div class="tv_serise_content clear clearHidden">' +
									'<div class="tv_sec_left fl">' +
									'<a target="_blank" href=' + list[i].featuredContents.poster[num].url + '>' +
									'<img class="hot-img" data-original=' + list[i].featuredContents.poster[num].imageUrl + ' src="../../app/images/loadbg.gif">' +
									'</a>' +
									'</div>' +
									'<ul class="tv_sec_right fl">'
								for(var j = 0; j < list[i].featuredContents.product.length; j++) {
									var listproduct = list[i].featuredContents.product[j];
									if(j < 6) {
										sum += '<li>'
										if(listproduct.label) {
											sum += '<img class="rightbadge hot-img" data-original=' + listproduct.label.imageUrl + '>'
										}
										sum += '<a target="_blank" uuid=' + listproduct.uuid + ' href=' + listproduct.url + '><img class="hot-img" width=180 height=180 src="../../app/images/loadbg.gif"  data-original=' + listproduct.imageUrl + ' alt="">' +
											'<p class="title">' + listproduct.titleName + '</p>' +
											'<p class="dice">' + escapeHtml(listproduct.description)  + '</p>' +
											'<p class="price">' + parseFloat(listproduct.staffPrice).toFixed(2) + '元</p>' +
											'</a>' +
											'</li>'
									}
								}

								sum += '</ul>' +
									'</div>' +
									'</div>'
								//左边导航名称
								menu += '<li>' +
									'<a href="javascript:;">' + list[i].titleName + '</a>' +
									'</li>'
							}
						}
					}
					$(".float_nav").html(menu)
					$(sum).insertBefore(".float_nav");
					imghover();
					akey()

					$("img.hot-img").lazyload({
						effect: "fadeIn",
						skip_invisible: !1
					})
				}
			}
		})
	}
	//点击锚链接 到指定地点
	function leftnav() {
		var index = 0;
		$(document).on("click", ".float_nav li", function() {
			index = $(this).index();
			var height = $('.tv_series' + index).offset().top - 10
			$('body,html').stop().animate({ scrollTop: height + "px" }, 500);
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
			}
		});
	}
	//图片hover的时候阴影
	function imghover() {
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
	}
	//点击热词搜索
	function akey() {
		$(document).on("click", ".akey li", function() {
			var akey = $(this).find("a").html();
			sessionStorage.setItem("keyword", akey)
		})
	}
	mainNav();
	leftnav();
	getallproduct();
});
