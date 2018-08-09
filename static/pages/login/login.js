require(['KUYU.Login','KUYU.HeaderTwo', 'KUYU.navFooterLink', 'placeholder'], function () {
    var Login = KUYU.Login,
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService();
        navFooter = KUYU.navFooterLink;
    navFooter();
    Login.valid();

    //为了IE8
    if(!Array.of) {
        $("input[type='text'], input[type='password'], textarea").placeholder();
    }
    $(function () {
        var path , host;
        if ( window.location.port ) {
            path = window.location.protocol + "//" + window.location.hostname  + ":"  +window.location.port;
        }else {
            path = window.location.protocol + "//" + window.location.hostname
        }
        if(location.hostname == 'www.tcl.com' ) {
            host = 'https://login.tclclouds.com/account/thirdParty/login?from='
        }else{
            host = 'https://logintest.tclclouds.com/account/thirdParty/login?from='
        }

        var html = '<li><a href="'+ host +path+'/pages/index/index.html&source=1&type=1&appId=14046695&targetUrl='+ window.location.hostname+ '/pages/login/login.html"><span class="sina"></span></a></li>'
                    +'<li><a href="'+ host +path+'/pages/index/index.html&source=1&type=2&appId=14046695"><span class="qq"></span></a></li>'
                    +'<li><a href="'+ host +path+'/pages/index/index.html&source=1&type=3&appId=14046695"><span class="weixin"></span></a></li>'
            $(".login-ul").empty().append(html);
    })
});