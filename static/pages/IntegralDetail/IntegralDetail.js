require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.userInfo', 'KUYU.SlideBarLogin','KUYU.navFooterLink','KUYU.plugins.alert'], function() {
	var $http = KUYU.Service,
		slidBarLogin = KUYU.SlideBarLogin,
		userInfo = KUYU.userInfo,
		Header = KUYU.HeaderTwo,
		navFooterLink =  KUYU.navFooterLink;
	Header.menuHover();
	Header.topSearch();
	 navFooterLink();
	$(function() {
		getCode(1, 10)
			//获取积分
		function getCode(nowPage, pageShow) {

			$http.post({ 
				url: "/usercenter/tclcustomer/queryIntegralDetailListKuyu/" + nowPage + "/" + pageShow,
				success: function(data) {
                    console.log(data)
					if(data.code== "403"||data.code== "-6"){
						window.location.href = "{{login}}"
					}
					var totalNum = data.totalNum;
					var data = data.data;
					if(totalNum > 0){
							page(nowPage, pageShow, totalNum);
							var html = '<tbody>' +
								'<tr>' +
								'<th width="200">来源业务描述</th>' +
								'<th width="100">积分值</th>' +
								'<th width="140">时间</th>' +
								'<th width="120">渠道标示</th>' +
								'</tr>' +
								'</tbody>';
							for(var i = 0; i < data.length; i++) {
								var list = data[i];
								html += '<tr>' +
									'<td>' + list.sourceDescription + '</td>'
								if(list.type == '1') {
									html += '<td>-' + list.inteValue + '</td>'
								}
								if(list.type == '0') {
									html += '<td>+' + list.inteValue + '</td>'
								}
								html += '<td>' + list.billDate + '</td>'+
								'<td>' + list.sourceName + '</td>'
								'</tr>'
							}
							$("table").html("")
							$("table").append(html)
					}
					else{
						Msg.Alert("","你还未拥有积分！",function(){});
					}
				}
			})
		}

		

		//底部页码
		var param={};
		function page(nowPage,pageShow,totalNum){
            nowPage = parseInt(nowPage);
            totalNum = parseInt(totalNum);
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

		$(".padding-box .clearmar").on("click", "span:gt(0),span:lt(8)", function() {
			nowPage = $(this).html();
			if(nowPage.indexOf("...") > -1){
				return
			}else{
				$(this).addClass('active').siblings().removeClass('active');
				getCode(nowPage,param.pageShow);
				$('body,html').animate({scrollTop: 0 },200);
			}
		})
		$(".padding-box .clearmar").on("click", ".prev", function() {
			if(param.nowPage > 1) {
				nowPage = param.nowPage - 1;
			}
			getCode(nowPage, param.pageShow);
			$('body,html').animate({
				scrollTop: 0
			}, 200);
		})
		$(".padding-box .clearmar").on("click", ".next", function() {
			if(param.nowPage < param.totalPage) {
				nowPage = param.nowPage + 1;
			}
			getCode(nowPage, param.pageShow);
			$('body,html').animate({
				scrollTop: 0
			}, 200);
		})

	})
})