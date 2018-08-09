/**
 * Created by huangchuang on 2018/4/16 0016.
 */
/**
 * Created by huangchuang on 2018/4/13 0013.
 */
require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.HeaderTwo','KUYU.navFooterLink','KUYU.Binder', 'KUYU.Store', 'ajaxfileupload','validate','xss'], function() {
    var  $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;

    // $header.menuHover();
    $init.Ready(function() {
        $header.menuHover();
    })
    $header.topSearch();
    navFooterLink();
    sessionStorage.removeItem("order");
    var thisPage={
        init:function(){
            this.pageParam={
                totalNum:0,
                pageShow:8,
                nowPage:1
            };
            this.loadGridData(this.pageParam);
            this.addEvent();

        },
        loadGridData:function (param) {
            var that=this;
            var url = '/usercenter/productfavorite/toProductFavoriteKuyu';
            $http.get({
                url: url,
                data: {
                    nowPage: param.nowPage,
                    pageShow: param.pageShow,
                    productName:'',
                    ranNum: Math.random()
                },
                success: function(res) {
                    if(res.code == 403 || res.code == "-6"){
                        window.location.href = "{{login}}";
                    }
                    that.loadGrid(res);
                    var pagination = res.data.pagination;
                    that.pageParam.totalNum = pagination.totalNum;
                    that.pageParam.pageShow = pagination.pageShow;
                    that.pageParam.nowPage = pagination.nowPage;
                    that.page(that.pageParam);
                },
                error: function(res) {

                }
            });
        },
        loadGrid:function (data) {
            var html = '';
            if (data) {
                for (var i = 0; i < data.data.productFavoriteModels.length; i++) {
                    var item = data.data.productFavoriteModels[i];
                    html+='<li style="width: 23%;" class="list-item">'+
                                (item.onSell?'':'<i class="onsell-not"></i>')+
                                '<a href="../productDetail/productDetail.html?uuid='+item.productUuid+'">'+
                                '<img src="'+item.pim.productImage.centerImageUrl+'">'+
                                '</a>'+
                                '<p class="listitle">'+item.productName+'</p>'+
                                '<p class="price">'+(item.pim.staffPrice?item.pim.staffPrice.toFixed(2):'0.00')+'元</p>'+
                                (item.onSell?('<a class="buynow" href="../productDetail/productDetail.html?uuid='+item.productUuid+'" target="_blank">马上购买</a>'+
                                '<a href="javascript:;" productUuid="'+item.productUuid+'" type="cancle" class="toCancelFavorite">取消收藏</a>'):'<a type="delete" class="buynow J_delete" productUuid="'+item.productUuid+'" href="javascript:void(0);" >删除</a>')+
                                '</li>';
                }
            } else {
                html += '<h1>没有收藏的商品！</h1>'
            }
            $(".block-list").empty().html(html);
            $(".block-list").append('<div class="padding-box"><div class="padding clearmar"></div></div>');
        },
        page:function(param){
           var totalPage = Math.ceil(param.totalNum/param.pageShow);
           param.totalPage = totalPage;
            var html = "";
            if(totalPage<8){
                html += '<button class="prev" ';
                if(param.nowPage == 1){
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';
                if(totalPage!=0){
                    for(var i = 1;i <= totalPage ;i++){
                        html += '<span class="page-item ';
                        if(param.nowPage == i){
                            html += 'active';
                        }
                        html +='" title="第'+i+'页">'+i+'</span>';
                    }
                }else{
                    html += '<span class="page-item active" title="第1页">1</span>';
                }


                html += '<button class="next" ';
                if(param.nowPage == totalPage){
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';

                $(".page-list").html(html);
            }else{
                if(totalPage >= 8 && param.nowPage < 7){
                    html += '<button class="prev" ';
                    if(param.nowPage == 1){
                        html += 'disabled';
                    }
                    html += ' style="background:#fff"><</button>';

                    for(var i = 1; i <= 7 ;i++){
                        html += '<span class="page-item ';
                        if(param.nowPage == i){
                            html += 'active';
                        }
                        html +='" title="第'+i+'页">'+i+'</span>';
                    }

                    html += '<button class="next" ';
                    if(param.nowPage == totalPage){
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';

                    $(".page-list").html(html);
                }else{
                    html += '<button class="prev" ';
                    if(param.nowPage == 1){
                        html += 'disabled';
                    }
                    html += ' style="background:#fff"><</button>';

                    html += '<span class="page-item" title="第1页">1</span>';
                    html += '<span class="page-item" title="第2页">2</span>';
                    html += '<span class="page-item" title="第3页">3</span>';
                    html += '<span class="page-item" title="第...页">...</span>';
                    var before = param.nowPage - 1;
                    var after = param.nowPage + 1;
                    var sbefore = before - 1;
                    if(param.nowPage == totalPage){
                        html += '<span class="page-item" title="第'+ sbefore +'页">'+sbefore+'</span>';
                    }
                    html += '<span class="page-item" title="第'+ before +'页">'+before+'</span>';



                    if(param.nowPage <= totalPage){
                        html += '<span class="page-item active" title="第'+ nowPage +'页">'+nowPage+'</span>';
                    }
                    if(param.nowPage+1<=totalPage){
                        html += '<span class="page-item" title="第'+ after +'页">'+after+'</span>';

                    }


                    html += '<button class="next" ';
                    if(param.nowPage == totalPage){
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';
                    $(".page-list").html(html);
                }

            }
        },
        addEvent:function () {
            var that=this;

            //取消收藏
            $(document).on('click','.toCancelFavorite,.J_delete',function(e){
                var uuid = $(this).attr('productUuid');
                var type = $(this).attr('type');
                var tip = (type=='delete')?'确定要删除该商品吗？':'确定将该商品取消收藏吗？';
                var url = '/usercenter/productfavorite/cancelFavoriteKuyu';
                Msg.Confirm('', tip, function () {
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
                            that.loadGridData(that.pageParam);
                        }
                    },
                    error: function(res) {

                    }
                });
                })
            })

            $(document).on('click','#J_clean',function() {
              var url = '/usercenter/productfavorite/removeFavoriteNoSellKuyu';
              $http.post({
                  url: url,
                  success: function(res) {
                      if (res.code == "0") {
                        Msg.Alert('','清除成功!',function(){
                          that.loadGridData(that.pageParam);
                        })
                      }
                  },
                  error: function(res) {

                  }
              });
            })

            //页码点击
            $(document).on("click",".page-item:gt(0),page-item:lt(8)",function(){
               var nowPage = $(this).html();
                if(nowPage.indexOf("...") > -1){
                    return
                }else{
                    that.pageParam.nowPage=nowPage;
                    $(this).addClass('active').siblings().removeClass('active');
                    that.loadGridData(that.pageParam);
                    $('body,html').animate({scrollTop: 0 },200);
                }
            })
            $(document).on("click",".prev",function(){
                if(that.pageParam.nowPage>1){
                    that.pageParam.nowPage = that.pageParam.nowPage - 1;
                }
                that.loadGridData(that.pageParam);
                $('body,html').animate({scrollTop: 0 },200);
            })
            $(document).on("click",".next",function(){
                if(that.pageParam.nowPage < that.pageParam.totalPage){
                    that.pageParam.nowPage = that.pageParam.nowPage + 1;
                }
                that.loadGridData(that.pageParam);
                $('body,html').animate({scrollTop: 0 },200);
            })
        }
    }
    thisPage.init();
})
