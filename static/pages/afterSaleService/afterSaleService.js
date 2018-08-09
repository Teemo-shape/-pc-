/*
 *author:chenlong
 */

require(['KUYU.Service', 'KUYU.plugins.slide','KUYU.navFooterLink', 'KUYU.HeaderTwo','KUYU.Binder',  'KUYU.SlideBarLogin', 'KUYU.Store'
 ], function() {
    var $http = KUYU.Service,
         $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
		navFooterLink = KUYU.navFooterLink,

        $scope = KUYU.RootScope;
        $header.menuHover();
        $header.topSearch();
		navFooterLink();

	$(function(){
		var u = location.search;
		var u = u.substr(1);
		var arr = u.split("&");
		orderUuid = arr[0];
		detailUuid = arr[1];
		state = arr[2];
		doAfterSaleServiceRes(orderUuid,detailUuid,state);
	})


	//售后服务按钮传两个uuid和state过来
	function doAfterSaleServiceRes(){
		var html="";
		if(state > '4'){
			html += '<li>'+
					'<a href="../toOrderRefund/toOrderRefund.html?'+orderUuid +'&'+detailUuid+'&1">'+
					'	<div class="zqico">'+
					'		<img src="../../app/images/zqsh2.png">'+
					'	</div>'+
					'	<p class="zqiconame">退货</p>'+
					'</a></li>';
		}else{
			html += '<li>'+
					'<a href="../toOrderRefund/toOrderRefund.html?'+orderUuid +'&'+detailUuid+'&2">'+
					'	<div class="zqico">'+
					'		<img src="../../app/images/zqsh1.png">'+
					'	</div>'+
					'	<p class="zqiconame">退款</p>'+
					'</a></li>';
		}
		html += '<li>'+
				'<a href="../toOrderRefund/toOrderRefund.html?'+orderUuid +'&'+detailUuid+'&3">'+
				'	<div class="zqico">'+
				'		<img src="../../app/images/zqsh3.png">'+
				'	</div>'+
				'	<p class="zqiconame">换货</p>'+
				'</a></li>';
		$(".mian_right .zqshfw").prepend(html);

	}




















})