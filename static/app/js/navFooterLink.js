/**
 * Created by 18776978844 on 2016/12/10.
 * Updated by Linxh on 2016/12/12.
 */
define('KUYU.navFooterLink', ['KUYU.Service', 'KUYU.Header', 'KUYU.Binder', 'KUYU.Store'], function () {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
		_sever = KUYU.Init.getService();
    var func = function () {
        var helpHtml = '<div class="min-wid">'+
        '<dl>'+
        '<dt>帮助中心</dt>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/serviceRevision/ProblemDetails.html?42a6aef400b94765a3299204bf777391">购物指南</a>'+
        '</dd>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/serviceRevision/ProblemDetails.html?b1b5ae3780394e0ba1b68f79a5c2ea95">支付方式</a>'+
        '</dd>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/serviceRevision/ProblemDetails.html?00a69be22f1e4408bf0d9a5e563adb1e">配送方式</a>'+
        '</dd>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/serviceRevision/ProblemDetails.html?0c770574bebd48618017e9602ff592fb">交易条款</a>'+
        '</dd>'+
        '</dl>'+
        '<dl>'+
        '<dt>服务支持</dt>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/page/serviceRevision/policy?id=56d4f28d21ca473f871a3b845f61aee9" class="__md_shfw">售后服务</a>'+
        '</dd>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/serviceRevision/repair.html">自助服务</a>'+
        '</dd>'+
        '<dd>'+
        '<a target="_blank" rel="nofollow" href="/pages/service-home/index.html#query-wrapper">进度查询</a>'+
        '</dd>'+
        '<dd>'+
           '<a target="_blank" rel="nofollow" style="color:red" href="http://fans.tcl.com/uec/">用户体验中心</a>'+
        '</dd>'+
        '</dl>'+
        '<dl>'+
        '<dt>客户服务</dt>'+
        '<dd><a style="color:red" target="_blank" rel="nofollow" href="http://www.pengpengmall.com/">内购平台</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="/pages/bulkpurchase/newBulkpurchase.html">大宗采购</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.tcl.com/dealer/toLogin">经销商之家</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.shifendaojia.com/index.html">十分到家</a></dd>'+
        '</dl>'+
        '<dl>'+
        '<dt>关注我们</dt>'+
        '<dd><a target="_blank" rel="nofollow"href="/pages/connectWithUs/connectWithUs.html">联系我们</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" class="botSina" href="http://weibo.com/tcljituan?topnav=1&wvr=6&topsug=1&is_hot=1">官方微博</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://fans.tcl.com/">铁粉社区</a></dd>'+
        '</dl>'+
        '<dl>'+
        '<dt>应用服务</dt>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.ffalcon.my7v.com/">雷鸟</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.huan.tv/toIndex.action">欢网</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="https://jr.tcl.com/home.html">金融</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.imooc.com/">教育</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.golive-tv.com/">全球播</a></dd>'+
        '<dd><a target="_blank" rel="nofollow" href="http://www.tcl-smarthome.com/">智能家居</a></dd>'+
        '</dl>'+
        ' <dl>'+
        '    <dt>TCL官网商城及二维码</dt>'+
        '    <dd><img style="height:120px;width:120px;" src="../../app/images/wechat.jpg"></dd>'+
        '</dl>'+
        '<dl class="last-r">'+
        '<p class="red phone">4008-123456</p>'+
        '<p class="grey">（24小时在线，仅收市话费）</p>'+
        '<a href="/pages/service/customerServiceKuyu.html" target="_self"><i>&#xe64a;</i>24小时在线客服</a>'+
        '</dl>'+
        '</div>';

        var footerHtml = '<div>'+
        '<div class="foot-logo">&#xe674;</div>'+
        '<p class="blod"><a target="_blank" rel="nofollow" href="/group/companyInfo/index">关于TCL</a>|<a target="_blank" rel="nofollow" href="/group/investors/index">投资者关系</a>|<a target="_blank" rel="nofollow" href="/group/societyDuty/index">社会责任</a>|<a rel="nofollow" target="_blank" href="/group/news/index">新闻中心</a>|<a rel="nofollow" target="_blank" href="/group/recruitment/index">人才招聘</a>|<a target="_blank" rel="nofollow" href="/group/companyInfo/slipPath?type=6">成员网站</a></p>'+
        '<p>©2010-2016 TCL CORPORATION All Rights Reserved. TCL集团股份有限公司版权所有 粤ICP备05040863号<a target="_blank" rel="nofollow" class="marginL" href="/pages/low/content.html">使用条款</a>|<a target="_blank" rel="nofollow" href="http://www.tcl.com/group/companyInfo/slipPath?type=5">法律声明</a>|<a rel="nofollow" target="_blank" href="/group/companyInfo/slipPath?type=4">隐私保护</a></p>'+
        '<p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44133002100088" rel="nofollow"><img style="margin: -3px 3px 0 0; width:16px;" src="/app/images/beian.png">粤网公安备案44133002100088号</a></p>'+
        '<div class="foot-r"><div class="language"><a href="/pages/index/index.html" class="lang-item active" rel="nofollow">中文简体</a>|<a href="http://news.tcl.com/English.php/index/index.html" rel="nofollow" class="lang-item ">English</a></div></div></div>'+
        '<div class="AC">'+
        '    <div><img src="/app/images/credibility.png"/></div>'+
        '    <div><a href="http://wljg.gdgs.gov.cn/corpsrch.aspx?key=440000000011990" target="_blank" title="企业名称：TCL集团股份有限公司&#10;法定代表人：李东生&#10;标识状态：已激活 粤工商备P131801001423"><img src="http://wljg.gdgs.gov.cn/upload/image/20141126/20141126002933.png" alt="" style="border:0;"/></a></div>'+
        '</div>';
        $('.help').html(helpHtml);
        $('.footer').html(footerHtml);


        //百度的
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?34c66f7b3d3ed0d0791c81ebe5ee7340";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

        //广告监测
       // !(function(a,b,c,d,e,f){
       //     var g="",h=a.sessionStorage,i="__admaster_ta_param__",j="tmDataLayer"!==d?"&dl="+d:"";
       //      if(a[f]={},a[d]=a[d]||[],a[d].push({startTime:+new Date,event:"tm.js"}),h){
       //          var k=a.location.search,
       //          l=new RegExp("[?&]"+i+"=(.*?)(&|#|$)").exec(k)||[];
       //          l[1]&&h.setItem(i,l[1]),l=h.getItem(i), l&&(g="&p="+l+"&t="+ +new Date)}var m=b.createElement(c),n=b.getElementsByTagName(c)[0];
       //          m.src="//tag.cdnmaster.cn/tmjs/tm.js?id="+e+j+g,
       //          m.async=!0,n.parentNode.insertBefore(m,n)
       // })(window,document,"script","tmDataLayer","TM-I92QS0","admaster_tm");

        //广告监测
        // var _gsq = _gsq ? _gsq:  window._gsq = [];
        // (function () {
        //     var s = document.createElement('script');
        //     s.type = 'text/javascript';
        //     s.async = true;
        //     s.src = (location.protocol == 'https:' ? 'https://ssl.' : 'http://static.') + 'gridsumdissector.com/js/Clients/GWD-002914-F6ABA6/gs.js';
        //     var    firstScript = document.getElementsByTagName('script')[0];
        //     firstScript.parentNode.insertBefore(s, firstScript);
        // })();

        // //璧合广告监测
        // ;(function () {
        //     $.get("http://v.myrtb.net/js/bgnms.js", function( data ) {
        //         beheActiveView({at: "arrive", src: "1697009386", cid: "", sid: "27295"});
        //     },'script');
        //     var iframe = document.createElement("iframe");
        //     iframe.src="http://v.myrtb.net/js/0.html";
        //     $("body").append(iframe);
        // })();
        //百度推送
        (function(){
            var bp = document.createElement('script');
            var curProtocol = window.location.protocol.split(':')[0];
            if (curProtocol === 'https'){
                bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
            }
            else{
                bp.src = 'http://push.zhanzhang.baidu.com/push.js';
            }
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(bp, s);
        })();
    };
    _APP.inject('KUYU.navFooterLink', func);

});
