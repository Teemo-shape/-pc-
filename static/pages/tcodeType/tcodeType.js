/*
 *author:chenlong
 */
require(['KUYU.Service','KUYU.plugins.slide', 'KUYU.HeaderTwo','KUYU.navFooterLink','KUYU.Binder',
	'KUYU.SlideBarLogin', 'KUYU.Store'
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








})