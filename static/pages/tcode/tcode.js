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
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;

    $header.menuHover();
    $header.topSearch();
    navFooterLink();


    $init.Ready(function() {
        var locKey = $Store.get('_ihome_token_');
        
        // function checkSSO (callback) {
        //     var script ="<script src={{sso}}></script>"
        //     $("body").append(script);
        //     cb = function (data){
        //         callback(data)
        //     };
        // }
    
        // if(!locKey) {
        //     checkSSO(function (data) {
        //         if(data.status == -1) {
        //             $init.nextPage("login",{})
        //             $Store.set(Date.now(), '云平台SSO检测失败')
        //         } else {
        //             $init.nextPage("cloudLogin", {msg:data.code})
        //         }
        //     })
        //     return;
        // } else {
        //     $binder.sync({'locKey':true})
        // }

        var script ="<script id='sso' src='{{sso}}'><\/script>";
        $("body").append(script);

        var SOK = function (res) {
            if(res.status != -1 && res.code) {
				var token = $Store.get('_ihome_token_') ? $Store.get('_ihome_token_') : null;
				
                $.ajax({
                    url: '/rest/ssologin/check',
					type:'get',
					headers:{
						'ihome-token' : token,
					},
                    data:{code: res.code },
                    success: function (data) {
                        if(data.code == CODEMAP.status.success) {
                            localStorage.setItem('_ihome_token_', data.token);
                            $header.userInof();
                            $binder.sync({'locKey':true});
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


})
