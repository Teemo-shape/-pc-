require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.navHeader',  'KUYU.SlideBarLogin','KUYU.navFooterLink','xss'], function() {
	var $http = KUYU.Service,
		slidBarLogin = KUYU.SlideBarLogin,
        $init = KUYU.Init,
		navHeader = KUYU.navHeader,
        $binder = KUYU.Binder,
		Header = KUYU.HeaderTwo;
		navFooterLink =  KUYU.navFooterLink;
    $path = window.location.origin;
    // Header.menuHover();

	Header.topSearch();
	navFooterLink();
	$(function() {
		getUserInfo()
		//更新之后及时获取用户信息
		function getUserInfo() {
			var userinfo = {}
            navHeader(function (res) {
                $binder.sync(res)
                if(res.code == CODEMAP.status.success) {
                    var user=res.data
                    if(user.bindMail && user.bindMail !="null" && user.bindMail != null) {
                        $("#email").html(user.bindMail)
                    }
                    if(user.bindPhone && user.bindPhone !="null" && user.bindPhone != null) {
                        $("#phone").html(user.bindPhone)
                    }
                    if(user.customerImgUrl) {
                        $("#userimg").attr("src", user.customerImgUrl)
                    }
                    if(user.nickName) {
                        $("#nickName").html(user.nickName)
                    }
                    if(user.realName) {
                        $("#name").html(user.realName)
                    }
                } else if( res.code == CODEMAP.status.TimeOut || res.code == CODEMAP.status.notLogin) {
                    window.location.href=$path+"/sign";
                }
            })
		}

		//获取个人中心信息
		// $http.post({
		// 		url: "/usercenter/customercomplex/getProductFavoriteCountByCustomeruuid",
		// 		data: {
		// 			ranNum: Math.random()
		// 		},
		// 		success: function(data) {
		// 			if(data.code== "403"||data.code== "-6"){
		// 				window.location.href = "{{login}}"
		// 			}
		//
		// 			if(data.code == 0) {
		// 				if(data.data) {
		// 					$("#favoritecount").html(data.data)
		// 				}
		// 			}
		// 		}
		// 	})
		//1:待付款  4:待发货 6:待收货 7:交易成功 11 待评价
			//获取待收货商品
		$http.post({
				url: "/usercenter/order/query/orderCountKuyu",
				data: {
					ranNum: Math.random(),
					orderState: "1"
				},
				success: function(data) {
					if(data.code== "403"||data.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(data.data!=null) {
						$("#waitpaycount").html(data.data)
					}
				}
			})
			//获取待支付商品
		$http.post({
				url: "/usercenter/order/query/orderCountKuyu",
				data: {
					ranNum: Math.random(),
					orderState: "6"
				},
				success: function(data) {
					if(data.code== "403"||data.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(data.data!=null) {
						$("#shippingcount").html(data.data)
					}
				}
			})
			//获取待评价商品
		$http.post({
				url: "/usercenter/order/query/orderCountKuyu",
				data: {
					ranNum: Math.random(),
					orderState: "11"
				},
				success: function(data) {
					if(data.code== "403"||data.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(data.data!=null) {
						$("#waitcommentcount").html(data.data)
					}
				}
			})
			//获取待发货商品
		$http.post({
				url: "/usercenter/order/query/orderCountKuyu",
				data: {
					ranNum: Math.random(),
					orderState: "4"
				},
				success: function(data) {
					if(data.code== "403"||data.code== "-6"){
						window.location.href = "{{login}}"
					}
					if(data.data!=null) {
						$("#waitsendcount").html(data.data)
					}
				}
			})

			//获取用过的商品
		// $http.post({
		// 	url: "/usercenter/customercomplex/getUsedProduct",
		// 	data: {
		// 			ranNum: Math.random(),
		// 		},
		// 	success: function(data) {
		// 		if(data.code== "403"||data.code== "-6"){
		// 			window.location.href = "{{login}}"
		// 		}
		// 		var html = ''
		// 		if(data.length > 0) {
		// 			for(var i = 0; i < data.length; i++) {
		// 				html += '<li>' +
		// 					'<div class="pic">' +
		// 					'<div class="pic"><img style="width:200px;height: 200px" src="'+data[i].specUuid+'"></div>' +
		// 					'</div>' +
		// 					'<div class="tit" style="text-align: center;">' + data[i].productName + '</div>' +
		// 					'<a target="_blank" href="../serviceRevision/repair.html" class="btn y_btn_custom1">我要维修</a>' +
		// 					'</li>'
		// 			}
		// 		}
		// 		$(".olist").append(html)
		// 	}
		// })

	})
    $binder.init()
    $init.Ready(function() {
        Header.menuHover();
    })
})
