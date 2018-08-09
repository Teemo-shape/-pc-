/*
 * author: linxiaohu
 * time: 2016-12-05 11:11:08
 * */
require([ 'KUYU.plugins.slide', 'KUYU.Service','KUYU.Filter'], function () {
    var $http = KUYU.Service,
        $param = KUYU.Init.getParam(),
        $init = KUYU.Init,
        $filter = KUYU.Filter
        channel = '';
    
    var main = {
        init: function () {
            main.banner();
        },
        banner: function () {
            $(".banner").Slide({
                eles: $(".banner-slide"),
                dots: $(".banner-dots"),
                slideshow: true
            });
        }
    }
    
    var html = ["<div class=\"goTop\">",
        "           <a href='#item1' href='javascript:;' class='uepos'>自助</br>服务</a> ",
        "           <a href='#item2'  href='javascript:;' class='uepos'>体验</br>与反馈</a> ",
        "           <a href='#item3'  href='javascript:;' class='uepos'>社区</br>精华</a> ",
        "           <a href='#item4'  href='javascript:;' class='uepos'>积分</br>兑换</a> ",
        "           <a href='javascript:;'><img src='/app/images/ueCenter_qrcode.png' /><div id='qrcodePos'></div></a> ",
        "            <a href=\"javascript:void(0);\" onclick=\"NTKF.im_openInPageChat(\'kf_9428_1525949700591\')\">",
        "                <div class=\"item\"></div>",
        "            </a>",
        "			<a onclick=\"$(\'body,html\').animate({scrollTop: 0 },500);\"></a>",
        "		</div>"
    ].join("");
    $("body").append(html);
    $init.Ready( function () {
        main.init();
    })
});
