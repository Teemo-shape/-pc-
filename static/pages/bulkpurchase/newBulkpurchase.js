/*
 * author：Lin Xiaohu
 * time：2016-11-26 16:56:32
 * */
require(['KUYU.Login', 'KUYU.Service', 'KUYU.plugins.alert','KUYU.navFooterLink','KUYU.Binder','KUYU.HeaderTwo', 'KUYU.SlideBarLogin','base64',
     'xss'],function(){
        var $http = KUYU.Service,
            $init = KUYU.Init,
            $binder = KUYU.Binder,
            $header = KUYU.HeaderTwo,
            $Store = KUYU.Store,
            _env = KUYU.Init.getEnv(),
            _sever = KUYU.Init.getService(),
            navFooterLink = KUYU.navFooterLink,
            $scope = KUYU.RootScope,
            Login = KUYU.Login;
        var path = _sever[_env.sever];

            $scope = KUYU.RootScope;
            $header.menuHover();
            $header.topSearch();
            navFooterLink();

    var timer = '';
    // var userinfo = sessionStorage.getItem('userinfo') ? JSON.parse(sessionStorage.getItem('userinfo')) : '';
    var txt = {
        notLogin:[
            '<h3>企事业客户登录</h3>'+
            '<form id="loginForm">'+
    		'<strong id="Msg" style="color:red;"></strong>'+
    		'<div class="user-name input-box"><span class="user-ico"></span>'+
    		 '<input type="text" name="loginName" id="loginName" placeholder="邮箱/手机号码/TCL账号" value=""/>'+
    		'<strong ></strong>'+
    		'</div>'+
    		'<div class="user-name input-box">'+
    			'<span class="pass-ico"></span>'+
    			'<input type="password" name="loginPwd" id="loginPwd" placeholder="密码"/>'+
    		'</div>'+
    		'<div class="verify dvVerify" style="display: none;">'+
    		'<div class="user-name input-box" id="VilidateCode">'+
    			'<span class="pass-code"><a href="javascript:;"  binder-event="click|getValidateCode" ><img src="" id="imgcode" binder-data="vm.url"></a></span>'+
    			'<input type="hidden" name="captchakey" id="captchakey"/>'+
    			'<input type="text" name="captchadata" id="captchadata" placeholder="输入验证码" maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\D/g,\'\')"/>'+
    			'<strong id="verifyCodeMsg"></strong>'+
    		'</div>'+
    		'</div>'+
    		'<div class="login-but"><button class="buy">立即登录</button></div>'+
    		'</form>'+
            '<div class="login-foot">'+
                '<a href="/pages/register/register.html?from=procurement">注册TCL帐号</a>|<a href="/pages/fixpwd/fixpwd.html">忘记密码?</a>'+
            '</div>'
        ],
        notLoginUnTest:[
            '<h3>企事业客户登录</h3>'+
            '<div>'+
                '<a style="width:100%; margin:30px 0 130px; background-color:#f00; display:block; line-height:35px; height:35px; color:#fff; text-align:center; " href="http://testuser.tclo2o.cn/proxy/login?from='+encodeURIComponent(location.href) +'" style=" color:#fff; ">立即登录</a>'+
            '</div>'+
            '<div class="login-foot">'+
                '<a href="http://testuser.tclo2o.cn/proxy/register?from='+encodeURIComponent(location.href) +'">注册TCL帐号</a>|<a href="http://user.tcl.com/proxy/find/password/nologin?from='+encodeURIComponent(location.href)+'">忘记密码?</a>'+
            '</div>'
        ],
        notLoginUn:[
            '<h3>企事业客户登录</h3>'+
            '<div>'+
                '<a style="width:100%; margin:30px 0 130px; background-color:#f00; display:block; line-height:35px; height:35px; color:#fff; text-align:center; " href="http://user.tcl.com/proxy/login?from='+encodeURIComponent(location.href) +'" style=" color:#fff; ">立即登录</a>'+
            '</div>'+
            '<div class="login-foot">'+
                '<a href="http://user.tcl.com/proxy/register?from='+encodeURIComponent(location.href) +'">注册TCL帐号</a>|<a href="http://user.tcl.com/proxy/find/password/nologin?from='+encodeURIComponent(location.href) +'">忘记密码?</a>'+
            '</div>'
        ],
        incomplete: function (userinfo) {
            return [
                '<h4 class="incompleteTitle">欢迎你回来! <span></span></h4>'+
                '<p class="incompleteName">'+(userinfo ? ( (userinfo.customerName?userinfo.customerName:'统一用户中心找不到用户名') || userinfo.nickName):'未获取到用户信息')+'</p>'+
                '<div class="incomplete-but incomplete"><a href="/pages/regpurchase/regpurchase.html">提交资料</a><p>提交企业信息,申请大宗采购权限</p></div>'
            ].join();
        },
        unaudited: function (data) {
            return [
                '<h4 class="incompleteTitle">很抱歉 <span></span></h4>'+
                '<p class="incompleteName">'+data.companyName+'</p>'+
                '<div class="unaudited-but"><label><i></i>帐号状态:</label><div class="case1"><span>审核未通过</span><a href="/pages/regpurchase/regpurchase.html">重新提交资料</a></div><label><i></i>原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因:</label> <div class="case2"><span>'+(data.detail?data.detail:'审核未通过')+'</span></div></div>'
            ].join()
        },
        audited: function (data) {
            return [
                '<h4 class="incompleteTitle">欢迎你回来! <span></span></h4>'+
                '<p class="incompleteName">'+data.companyName+'</p>'+
                '<div class="unaudited-but"><label><i></i>帐号状态:</label><div class="case1"><span>审核通过</span></div></div>'
            ].join()
        },
        await: function (data) {
            return [
                '<h4 class="incompleteTitle">欢迎你回来! <span></span></h4>'+
                '<p class="incompleteName">'+data.companyName+'</p>'+
                '<div class="unaudited-but"><label><i></i>帐号状态:</label><div class="case1"><span>审核中</span></div></div>'
            ].join()
        },
        freeze: function (data) {
            return [
                '<h4 class="incompleteTitle">很抱歉 <span></span></h4>'+
                '<p class="incompleteName">'+data.companyName+'</p>'+
                '<div class="unaudited-but"><div style="float:inherit; overflow:hidden;"><label><i></i>帐号状态:</label><div class="case1"><span>已冻结</span></div></div><div style="float:inherit"><label><i></i>原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因:</label> <div class="case1"><span>'+(data.detail?data.detail:'冻结')+'</span></div></div></div>'
            ].join()
        },
    }
    //大宗采购改版
    var main = {
        getConsumer: function () {
            var dom = $("#loginFormBox");
            $http.get({
                url:'/bulkbuying/account/getMyAccountInfo?rand='+Math.random(),
                success: function (res) {  //0未审核 1审核通过 2未通过 3冻结
                    if(res.code == 1) { //注册完成没完善资料 //
                        timer = setInterval(function(){
                            if(sessionStorage.getItem('userinfo')){
                                clearInterval(timer)
                                // console.log(1)
                                var userinfo = sessionStorage.getItem('userinfo') ? JSON.parse(sessionStorage.getItem('userinfo')) : '';
                                dom.html(txt.incomplete(userinfo))
                            }
                        },200)
                    } else if(res.code ==0 && res.retData.state ==0) { //0 未审核
                        dom.css({width:'280px'})
                        dom.html(txt.await(res.retData))
                    } else if(res.code ==0 && res.retData.state ==1) { //1审核通过
                        dom.html(txt.audited(res.retData))
                    } else if(res.code ==0 && res.retData.state ==2) { //2未通过
                        dom.html(txt.unaudited(res.retData))
                        dom.css({width:'280px'})
                    } else if(res.code ==0 && res.retData.state ==3) { //3冻结
                        dom.html(txt.freeze(res.retData))
                        dom.css({width:'280px'})
                    }else if(!$Store.get('istaff_token')) {
                        var regBulk = "{{regBulk}}";
                        dom.html(txt[regBulk].join())
                        $binder.init()
                        Login.valid();
                    }
                }
            })
        }
    }
    // **
    $init.Ready(function () {
        main.getConsumer()
    })
})
