/*
 *author:chenlong
 */
require(['KUYU.Service', 'KUYU.HeaderTwo' ,'KUYU.Binder', 'KUYU.Store','juicer','KUYU.navFooterLink'], function() {
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

    $(function () {
        toProductHistoryList();
        $(document).on('click','.zqstate a',function(){
            $(this).addClass('active').siblings().removeClass('active');
        });

        //回车
        $("#inputPname").on('keydown', function(e){
            if(e.keyCode == 13){
                toProductHistoryList();
            }
        });

    });

    function toProductHistoryList() {
        var pcategory = $("#hdn_productCategory").val() ? $("#hdn_productCategory").val() : "";
        var pname = $.trim($("#inputPname").val()) ? $.trim($("#inputPname").val()) : "";

        var url = '/usercenter/producthistory/queryProductHistoryKuyu';
        //toggleLoadding();
        $http.post({
            url: url,
            data: {
                pcategory: pcategory,
                pname: pname
            },
            success: function(res) {
                if(res.code == 403){
                    window.location.href = "{{login}}";
                }else{
                    toProductHistoryHtml(res);
                }
            },
            error: function(res) {

            }
        });
    }


    function filterByCategory(categoryUuid) {
        $("#hdn_productCategory").val(categoryUuid);
        $("#inputPname").val("");
        toProductHistoryList();
    }

    var filter_history = 0; //遍历一次 分类栏
    function toProductHistoryHtml(res) {
        $("#nowTimeHistory").empty();
        $("#beforeHistory").empty();
        $("#not_data").empty();
        if(res.data){
            if(res.data.rows){
                var rows = res.data.rows;
            }
        }
        var nowTime = new Date();
        var yy = nowTime.getFullYear();      //年
        var mm = nowTime.getMonth() + 1;     //月
        var dd = nowTime.getDate();          //日
        var nowTimeStr = (yy+'-'+mm+'-'+dd).replace(/-/g,'/');

        if (res.data && res.data.categorys && filter_history == 0) {
            var categorys_html = '<a href="javascript:;" class="active" id="all">全部分类</a>';
            var categorys = res.data.categorys;
            filter_history = 1;
            for (var i = 0; i < categorys.length; i++ ) {
                var item = categorys[i];
                if(item.categoryName.indexOf("测试") == -1 && item.categoryName.indexOf("周边") == -1){
                    categorys_html += '<b>|</b><a href="javascript:;" id="'+item.uuid+'">'+item.categoryName+'</a>';
                }
            }
            $("body").on('click',"#zqstate a",function(event){
                //根据ID 取消全部分类隐藏域
                if( event.target.id == 'all') {
                    filterByCategory("");
                }else {
                    filterByCategory(event.target.id);
                }
            });
            $("#zqstate").append(categorys_html);
        }

        if ( rows && rows.length > 0) {
            var now_html ='';
            var before_html ='';
            for(var i = 0; i < rows.length;i++) {
                var item = rows[i];
                var opeTime = rows[i].opeTime.substring(0,10).replace(/-/g,'/');
                var compareNowTime = new Date(nowTimeStr).getTime();
                var compareOpeTime = new Date(opeTime).getTime();

                if(compareNowTime == compareOpeTime) {
                    now_html += '<li>'+
                                '<div class="zqallimg">' +
                                '<img style="width:190px;height: 190px" src="'+item.product.productImage.centerImageUrl+'" alt="loading..."></div>'+
                                '<p class="zqalltxt">'+item.product.productMain.productName+'</p>'+
                                '<div class="zqonebtn">'+
                                '<form>'+
                                '<a href="../productDetail/productDetail.html?uuid='+item.product.productMain.uuid+'" class="y_btn y_btn_custom1" style="text-align:center">加入购物车</a>'+
                                '</form>'+
                                '</div>'+
                                '</li>';
                }
                else if (compareNowTime != compareOpeTime) {
                    before_html += '<li>'+
                                    '<div class="zqallimg">' +
                                    '<img style="width:190px;height: 190px" src="'+item.product.productImage.centerImageUrl+'" alt="loading..."></div>'+
                                    '<p class="zqalltxt">'+item.product.productMain.productName+'</p>'+
                                    '<div class="zqonebtn">'+
                                    '<form>'+
                                    '<a href="../productDetail/productDetail.html?uuid='+item.product.productMain.uuid+'" class="y_btn y_btn_custom1" style="text-align:center">加入购物车</a>'+
                                    '</form>'+
                                    '</div>'+
                                    '</li>';
                }

            }
            if(now_html.indexOf("li") > -1){
                $("#nowTimeHistory").html('<p class="zqscsj"><span class="zqsccn">今天</span><span class="zqsctime">'+nowTimeStr+'</span></p>'+now_html);
            }
            if(before_html.indexOf("li") > -1){
                $("#beforeHistory").html('<p class="zqscsj"><span class="zqsccn">更早之前</span><span class="zqsctime"></span></p>'+before_html);
            }

        } else {
            $("#nowTimeHistory").empty();
            $("#beforeHistory").empty();
            $("#not_data").html('<h1>无历史浏览记录！</h1>');
        }
    }


    $(document).on('click','#button6',function(e){
        toProductHistoryList();
    });






})
