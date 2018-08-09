require(['KUYU.Service', 'KUYU.plugins.slide', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'juicer'], function() {
	var $http = KUYU.Service,
		slidBarLogin = KUYU.SlideBarLogin,
		Header = KUYU.HeaderTwo;
	Header.menuHover();
	Header.topSearch();
	$param = KUYU.Init.getParam();
	var rushBuyBeginTime = $param.rushBuyBeginTime;
	var secondParentCategoryName = $param.secondParentCategoryName;
    $("#preserveTitle").html(secondParentCategoryName);
    $("#rushBuyBeginTime").html(rushBuyBeginTime)

});