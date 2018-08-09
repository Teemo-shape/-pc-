require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.userInfo', 'KUYU.SlideBarLogin', 'KUYU.navFooterLink', 'juicer'], function() {
	var $http = KUYU.Service,
		slidBarLogin = KUYU.SlideBarLogin,
		userInfo = KUYU.userInfo,
		Header = KUYU.HeaderTwo,
		navFooterLink = KUYU.navFooterLink;
	Header.menuHover();
	Header.topSearch();
	navFooterLink();
	$(function() {
		var uuid = location.search.substr(1);
		$http.post({
			url: "/servicecenter/getContent",
			data: {
				contentId: uuid
			},
			success: function(data) {
				var data = data.retData;
				html = "";
				html += '<div class="section">' +
					'<section class="h_title text-center">' +
					'<h3 class="y_mb10">' + data.contentTitle + '</h3>' +
					'<span class="f_clr999">' + data.createTime + '</span>' +
					'</section>' +
					' <div class="h_zxcontent">' +
					data.introduction+
					'</div>' +
					'</div> '
				$(".container").html(html)
			}

		});

	})
})