/*
 *author:chenlong
 */
require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Store' ,'KUYU.Binder', 'KUYU.SlideBarLogin','juicer','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        Header = KUYU.HeaderTwo;


        var locKey = $Store.get('istaff_token');
        if(!locKey) {
            $init.nextPage("login",'')
        } else {
            $binder.sync({'locKey':true})
        }

    Header.menuHover();
    Header.topSearch();
    navFooterLink();



    //:初始化页面加载数据
    $(function() {
        loadFavouriteProducts(1,6);
    });




    //:搜索收藏的商品
    $("#searchBtn").click(function() {
        loadFavouriteProducts(1,6);
    });
    $("#searchName").on('keydown',function(e){
        if(e.keyCode == 13){
            loadFavouriteProducts(1,6);
        }
    });


    //:ajax加载收藏商品列表数据
    function loadFavouriteProducts(nowPage, pageShow) {
        var searchName = $.trim($("#searchName").val());
        var url = '/usercenter/productfavorite/toProductFavoriteKuyu';
        $http.get({
            url: url,
            data: {
                nowPage: nowPage,
                pageShow: pageShow,
                productName: searchName,
                ranNum: Math.random()
            },
            success: function(res) {
                if(res.code == 403 || res.code == "-6"){
                    window.location.href = "{{login}}";
                }
                doFavouriteResponse(res);
                var pagination = res.data.pagination;
                var totalNum = pagination.totalNum;
                var pageShow = pagination.pageShow;
                var nowPage = pagination.nowPage;
                page(nowPage,pageShow,totalNum);
            },
            error: function(res) {

            }
        });
    }

    function doFavouriteResponse(res) {
        var html = '';
        if (res) {
            html += '<ul class="zqallbb" >';
            for (var i = 0; i < res.data.productFavoriteModels.length; i++) {
                var item = res.data.productFavoriteModels[i];
                html += '<li productUuid="'+item.productUuid+'">'+
                        '<div class="zqallimg">'+
                        '<a href="../productDetail/productDetail.html?uuid='+item.productUuid+'">' +
                        '<img src="'+item.pim.productImage.centerImageUrl+'" width="190px" height="190px"></a>'+
                        '</div>'+
                        '<p class="zqalltxt">'+
                        '<a href="../productDetail/productDetail.html?uuid='+item.productUuid+'">' +
                        ''+item.productName+'</a></p>'+
                        '<p class="zqallmoney"><span/>'+item.pim.shopPrice.toFixed(2)+'元</p>'+
                        '<div class="zqtwobtn">'+
                        '<a href="../productDetail/productDetail.html?uuid='+item.productUuid+'" target="_blank" class="zqtbtn zqclick y_btn_custom1">加入购物车</a>'+
                        '<a href="javascript:void(0);" productUuid="'+item.productUuid+'" id="toCancelFavorite" class="zqtbtn y_btn_custom2">取消收藏</a>'+
                        '</div>'+
                        '</li>';
            }
        } else {
            html += '<h1>没有收藏的商品！</h1>'
        }
        $("#listFavorite").empty().html(html);
        $("#listFavorite").append('<div class="padding-box"><div class="padding clearmar"></div></div>');

    }


    //取消收藏
    $(document).on('click','#toCancelFavorite',function(e){
        var uuid = $(this).attr('productUuid');
        var url = '/usercenter/productfavorite/cancelFavoriteKuyu';
        $http.post({
            url: url,
            data: {
                "productUuid": uuid,
                "ranNum":Math.random()
            },
            success: function(res) {
                if(res.code == 403 || res.code == "-6"){
                    window.location.href = "{{login}}";
                }
                if (res.code == "0") {
                    loadFavouriteProducts(1, 6);
                }
            },
            error: function(res) {

            }
        });
    })


    //底部页码
    var param={};
    function page(nowPage,pageShow,totalNum){
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
    $(document).on("click","span:gt(0),span:lt(8)",function(){
        nowPage = $(this).html();
        if(nowPage.indexOf("...") > -1){
            return
        }else{
            $(this).addClass('active').siblings().removeClass('active');
            loadFavouriteProducts(nowPage,param.pageShow);
            $('body,html').animate({scrollTop: 0 },200);
        }
    })
    $(document).on("click",".prev",function(){
        if(param.nowPage>1){
            nowPage = param.nowPage - 1;
        }
        loadFavouriteProducts(nowPage,param.pageShow);
        $('body,html').animate({scrollTop: 0 },200);
    })
    $(document).on("click",".next",function(){
        if(param.nowPage < param.totalPage){
            nowPage = param.nowPage + 1;
        }
        loadFavouriteProducts(nowPage,param.pageShow);
        $('body,html').animate({scrollTop: 0 },200);
    })












});
