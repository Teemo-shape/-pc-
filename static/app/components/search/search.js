$(function () {
    var $param = KUYU.Init.getParam();
    $('.searchRes strong').text($param.keyword);
    $('.ser-input').val($param.keyword);
    $('.sort-list a').addClass('selected').siblings('a').removeClass('selected');
    if($param.sortBy != null && $param.sortBy != undefined && $param.sortBy.toLowerCase().indexOf('price') > 0){
        $('.priceRank').addClass('selected');
        if ($param.sortType == '1') {
            $('.priceRank').html('价格&nbsp;&nbsp;↓');
        } else {
            $('.priceRank').html('价格&nbsp;&nbsp;↑');
        }
    }else if($param.sortBy == 'salsnum'){
        $('.salsnum').addClass('selected')
        if ($param.sortType == '1') {
            $('.salsnum').html('销量&nbsp;&nbsp;↓');
        } else {
            $('.salsnum').html('销量&nbsp;&nbsp;↑');
        }
    }else{
        $('.sortWeight').addClass('selected')
    }
    //价格文本框验证    
    $('.price-start').bind('blur keyup change',function(){
        (!$.isNumeric($(this).val())) && $(this).val('');
    });
    $('.price-end').bind('blur keyup change',function(){
        var priceEnd = $(this).val();
        if ((priceEnd && !$.isNumeric(priceEnd)) || (priceEnd && priceEnd == '0')) {
            $('.price-end').val('');
        }
    });
    var attributePrice = $param.queryCondition;
    $('.confirm').on('click',function(){
        var priceStart = Number($('.price-start').val());
        var priceEnd = Number($('.price-end').val());
        (priceStart == '') && $('.price-start').val('0');
        if(priceStart >= priceEnd && priceEnd != ''){
            alert('请输入正确的价格区间！');
            $('.price-end').val('').focus();
            return;
        }
        attributePrice = priceStart + '-' + priceEnd;
        if (!attributePrice.split('-')[1] || priceEnd == 0) {
            attributePrice = priceStart;
        }
        //globalMap.queryCondition = attributePrice;
        toSearch();
        
    })
    var keyword = '',
        queryCondition = '',
        globalMap = {
            keyword: $param.keyword || '',
            sortBy: $param.sortBy || 'sortWeight',
            sortType: $param.sortType || 1,
            nowPage: $param.nowPage || 1,
            pageShow: 12,
            //queryCondition: attributePrice || '',
            totalNum: 100}
    //toSearch();
    //点击销量
    $('.salsnum').click(function () {
        if ($param.sortBy == 'salsnum') {
            if ($param.sortType == '1') {
                //$(this).html('销量&nbsp;&nbsp;↑');
                $(this).attr('sorttype', '2')
            } else {
                //$(this).html('销量&nbsp;&nbsp;↓')
                $(this).attr('sorttype', '1')
            }
        }
    })
    //点击价格
    $('.priceRank').click(function () {
        if ($param.sortBy != null && $param.sortBy != undefined && $param.sortBy.toLowerCase().indexOf('price') > 0) {
            if ($param.sortType == '1') {
                //$(this).html('价格&nbsp;&nbsp;↑');
                $(this).attr('sorttype', '2')
            } else {
                //$(this).html('价格&nbsp;&nbsp;↓')
                $(this).attr('sorttype', '1')
            }
        }
    })
    $('.sort-list a').click(function() {
        globalMap.nowPage = 1;
        var sortBy = $(this).data("name");
        var sortType = $(this).attr('sorttype');
        globalMap.sortBy = sortBy;
        globalMap.sortType = sortType;
        attributePrice = 0
        toSearch()
    });
    //搜索函数
    var totalNum = $('.searchRes em').html()
    function toSearch() {
        window.location.href = '/search/search?' + 'keyword=' + encodeURI(globalMap.keyword) + '&sortBy=' + globalMap.sortBy + '&sortType=' + globalMap.sortType + '&nowPage=' + globalMap.nowPage + '&pageShow=' + globalMap.pageShow + '&totalNum=' + totalNum + '&queryCondition=' + (attributePrice||'');
        /*$('.price-start').val($param.queryCondition.split('-')[0]);
        $('.price-end').val($param.queryCondition.split('-')[1]);*/    //window.history.pushState({},0,'http://'+window.location.host+'/search?'+u);
    }
    //如果不是服务端渲染
    var param={};
    var isRender = $("#isRender");
    if (isRender.data('render') == 'sever') {
        page(1, 12, isRender.val());
    } else {
        globalMap.nowPage = 1;
       // toSearch();
    }
    //分页处理方法
    //底部页码
    function page(nowPage,pageShow,totalNum){
        totalPage = Math.ceil(totalNum/pageShow);
        param.nowPage = nowPage;
        if ($param.nowPage) {
            param.nowPage = $param.nowPage;
            nowPage = $param.nowPage;
        }
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;
        html = "";
        if(totalPage<8){
            html += '<button class="prev" ';
            if(nowPage == 1){
                html += 'disabled';
            }else if(nowPage > 1){
                $('.prev').removeAttr('disabled');
            }
            html += '>&lt;</button>';
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
            }else if(nowPage < totalPage){
                $('.next').removeAttr('disabled');
            }
            html += '>&gt;</button>';

            $(".padding-box .clearmar").html(html);
        }else{
            if(totalPage >= 8 && nowPage < 7){
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }else if(nowPage > 1){
                    $('.prev').removeAttr('disabled');
                }
                html += '>&lt;</button>';

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
                }else if(nowPage < totalPage){
                    $('.next').removeAttr('disabled');
                }
                html += '>&gt;</button>';

                $(".padding-box .clearmar").html(html);
            }else{
                html += '<button class="prev" ';
                if(nowPage == 1){
                    html += 'disabled';
                }else if(nowPage > 1){
                    $('.prev').removeAttr('disabled');
                }
                html += '>&lt;</button>';

                html += '<span class="item" title="第1页">1</span>';
                html += '<span class="item" title="第2页">2</span>';
                html += '<span class="item" title="第3页">3</span>';
                html += '<span class="item" title="第...页">...</span>';
                var before = nowPage - 1;
                var after = nowPage + 1;
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
                }else if(nowPage < totalPage){
                    $('.next').removeAttr('disabled');
                }
                html += '>&gt;</button>';
                $(".padding-box .clearmar").html(html);
            }

        }

    }
    //页码点击
    var scrollBoxTop = $(".box.commodity").offset().top;
    $(".padding-box .clearmar").on("click","span:gt(0),span:lt(8)",function(){
            $(this).addClass('active').siblings().removeClass('active');
            $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
            
            globalMap.nowPage = $(this).html();
            attributePrice = $param.queryCondition;
            toSearch();
    })
    $(".padding-box .clearmar").on("click",".prev",function(){
        if(param.nowPage>1){
            globalMap.nowPage = parseInt(param.nowPage) - 1;
        }
        $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
        attributePrice = $param.queryCondition;
        toSearch();
    })
    $(".padding-box .clearmar").on("click",".next",function(){
        if(param.nowPage < param.totalPage){
            globalMap.nowPage = parseInt(param.nowPage) + 1;
        }
        $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
        attributePrice = $param.queryCondition;
        toSearch();
    })

})
