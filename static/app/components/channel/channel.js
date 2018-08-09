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
    $param.nowPage = parseInt(window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1)) || 1;
    var u = window.location.href
    // console.log(u)
    //内购优化 匹配自定义频道页的需求 -- http://localhost/pc011A2?catId=724c4933e2834814b2ac92af8b94b995&choose=tv
    //并且保留以前的六大频道 http://localhost/tv
    //开始截取频道编号
    var subpath = u.split('/')[3];
    if(subpath.indexOf('?') > 0) {
        var endposition = subpath.indexOf('?');
        channel = subpath.substring(0, endposition);
    } else {
        channel = subpath;
    }
    
    if(channel == undefined || channel == '') {
        if (u.indexOf('tv') > 0) {
            channel = 'tv'
        } else if (u.indexOf('mobile') > 0) {
            channel = 'mobile'
        } else if (u.indexOf('air') > 0) {
            channel = 'air'
        } else if (u.indexOf('refrigerator') > 0) {
            channel = 'refrigerator'
        } else if (u.indexOf('washer') > 0) {
            channel = 'washer'
        } else if (u.indexOf('homeappliance') > 0) {
            channel = 'homeappliance'
        }
    }
    //开始截取当前uri上面的catId , choose, keyword 参数
    var catId = _get('catId');
    var choose = _get('choose');
    var mykeyword = _get('keyword2');


    $(".features .all > span").addClass('active');

    //获取参数匹配筛选条件
    if ($param.keyword) {
        var k = $param.keyword
        var keyArr = k.split(';')
        //第一个
        var span = $(".features li>span[type='spanType1']")
        span.removeClass('active')
        for (var i = 0; i < span.length; i++) {
            var s = span[i]
            if ($(s).attr('value') == keyArr[0]) {
                $(s).addClass('active')
            }
        }
        //第二个
        var span = $(".features li>span[type='spanType2']")
        span.removeClass('active')
        for (var i = 0; i < span.length; i++) {
            var s = span[i]
            if ($(s).attr('value') == keyArr[1]) {
                $(s).addClass('active')
            }
        }
        //第三个
        var span = $(".features li>span[type='spanType3']")
        span.removeClass('active')
        for (var i = 0; i < span.length; i++) {
            var s = span[i]
            if ($(s).attr('value') == keyArr[2]) {
                $(s).addClass('active')
            }
        }

        var span = $(".features li>span[type='spanType4']")
        span.removeClass('active')
        for (var i = 0; i < span.length; i++) {
            var s = span[i]
            if ($(s).attr('value') == keyArr[3]) {
                $(s).addClass('active')
            }
        }

        //三行以上要显示
        if(keyArr[2]){
            $('.toggle').addClass('rotate')
            $('.features:gt(1)').show()
        }
    }

    //销量和价格
    if ($param.sortBy == 'salsnum') {
        $('.salsnum').addClass('selected')
        if ($param.sortType == '1') {
            $('.salsnum').html('销量&nbsp;&nbsp;↓')
        } else {
            $('.salsnum').html('销量&nbsp;&nbsp;↑');
        }
    } else if ($param.sortBy != null && $param.sortBy != undefined && $param.sortBy.toLowerCase().indexOf('price') > 0) {
        $('.priceRank').addClass('selected')
        if ($param.sortType == '1') {
            $('.priceRank').html('价格&nbsp;&nbsp;↓')
        } else {
            $('.priceRank').html('价格&nbsp;&nbsp;↑');
        }
    }

    //sortBy
    if($param.sortBy == 'sortWeight'){
        $('.sortWeight').addClass('selected')
    }

    //sortType
    $('#hdn_sortType').val($param.sortType)
    $('#hdn_sortBy').val($param.sortBy)

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback) {
            var T, A, k;
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }
            if (arguments.length > 1) {
                T = arguments[1];
            }
            A = new Array(len);
            k = 0;
            while (k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[k];

                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }


    $(".banner").Slide({
        eles: $(".banner-slide"),
        dots: $(".banner-dots"),
        slideshow: true
    });

    /*主体内容随窗口滚动添加固定样式*/
    var searchTop = $('.commodity').offset().top;
    addFixed(searchTop);
    $(window).scroll(function () {
        addFixed(searchTop);
    })
    function addFixed(scrollT) {
        if ($(window).scrollTop() > ($('.commodity').offset().top + 90)) {
            $('.comm-search-content').addClass("fixed");
        } else {
            $('.comm-search-content').removeClass("fixed");
        }
    }

    //重新筛选条件绑定点击事件
    var filter = 0;
    $(document).off('click', '.features li>span');
    $(document).on('click', '.features li>span', function () {
        //执行回调函数
        var type = $(this).attr("type");
        var tabtype = "tab_" + $(this).attr("type");
        //已经是筛选条件了，不重复查询数据
        if ($(this).hasClass('active')) {
            return;
        };
        var value = $(this).attr("value");
        var key = $(this).attr("key");
        $('span[type="' + type + '"]').removeClass("active");
        $(this).addClass('active');
        /*queryList(1, key);*/
        queryList(1);
    });


    //点击销量
    $('.salsnum').click(function () {
        if ($param.sortBy == 'salsnum') {
            if ($param.sortType == '1') {
                $(this).html('销量&nbsp;&nbsp;↑');
                $(this).attr('sorttype', '2')
            } else {
                $(this).html('销量&nbsp;&nbsp;↓')
                $(this).attr('sorttype', '1')
            }
        }
    })
    //点击价格
    $('.priceRank').click(function () {
        if ($param.sortBy != null && $param.sortBy != undefined && $param.sortBy.toLowerCase().indexOf('price') > 0) {
            if ($param.sortType == '1') {
                $(this).html('价格&nbsp;&nbsp;↑');
                $(this).attr('sorttype', '2')
            } else {
                $(this).html('价格&nbsp;&nbsp;↓')
                $(this).attr('sorttype', '1')
            }
        }
    })

    // $('#hdn_sortBy').val('sortWeight');
    // $('#hdn_sortType').val('1');
    $('.sort-list a').click(function () {
        $(this).addClass('selected').siblings('a').removeClass('selected');
        var sortBy = $(this).data("name");
        var sortType = $(this).attr('sorttype');
        $("#hdn_sortBy").val(sortBy);
        $("#hdn_sortType").val(sortType);
        //加载数据
        queryList(1);
    });

    //筛选条件
    function getFilterStr() {
        var span_typeKeyword1 = $("span[type='spanType1'].active");
        var span_typeKeyword2 = $("span[type='spanType2'].active");
        var span_typeKeyword3 = $("span[type='spanType3'].active");
        var span_typeKeyword4 = $("span[type='spanType4'].active");
        var keyword = "";
        var categorys = "";
        //第一个筛选条件
        if (span_typeKeyword1.attr("categorys")) {
            categorys = !span_typeKeyword1.attr("categorys") ? "" : span_typeKeyword1.attr("categorys");
        } else {
            keyword = !span_typeKeyword1.attr("value") ? "" : span_typeKeyword1.attr("value");
        }
        //第二个筛选条件
        if (span_typeKeyword2.attr("categorys")) {
            categorys += "," + (!span_typeKeyword2.attr("categorys") ? "" : span_typeKeyword2.attr("categorys"));
        } else {
            keyword += ";" + (!span_typeKeyword2.attr("value") ? "" : span_typeKeyword2.attr("value"));
        }
        //第三个筛选条件
        if (span_typeKeyword3.attr("categorys")) {
            categorys += "," + (!span_typeKeyword3.attr("categorys") ? "" : span_typeKeyword3.attr("categorys"));
        } else {
            keyword += ";" + (!span_typeKeyword3.attr("value") ? "" : span_typeKeyword3.attr("value"));
        }

        //第4个筛选条件
        if (span_typeKeyword4.attr("categorys")) {
            categorys += "," + (!span_typeKeyword4.attr("categorys") ? "" : span_typeKeyword4.attr("categorys"));
        } else {
            keyword += ";" + (!span_typeKeyword4.attr("value") ? "" : span_typeKeyword4.attr("value"));
        }
        keyword = !keyword ? "" : keyword;
        categorys = !categorys ? "" : categorys;
        return {
            keyword: keyword,
            categorys: categorys
        };
    }


    $('.features').length <= 2 ? $('.toggle').hide() : $('.toggle').show();

    var typeIn = false; //属性筛选条件是否加载完毕
    //根据条件搜索商品
    function queryList(nowPage, queryCondition) {
        //筛选条件
        var filterObj = getFilterStr();
        var keyword = filterObj.keyword;
        var categorys = filterObj.categorys;
        // var totalNum = $('#isRender').val();
        // totalNum = !totalNum ? 100 : totalNum;
        var sortBy = $('#hdn_sortBy').val();
        var sortType = $('#hdn_sortType').val();
        var a = $(".clearmar a");
        var reg = /[\u4e00-\u9fa5]|\w+/;

        //增加关键词
        if(reg.test(mykeyword) && keyword.indexOf(mykeyword) == -1){
            //若新增的关键词没有在的，补充进去
            keyword = _replaceLast(';', ';'+mykeyword+';', keyword);
        }
        if(queryCondition == undefined) {
            queryCondition = '';
        }

        if( reg.test(keyword)|| categorys || sortBy || sortType || catId || choose || queryCondition) {
            /* 分页的东西？ 不需要了 - 由nodejs直接渲染
            $.each(a, function (i, o) {
                var hrfe= $(this).attr("href")+ '?keyword=' + keyword + '&categorysStr=' + categorys + '&sortBy=' + sortBy + '&sortType=' + sortType +'#filter';
                $(this).attr("href",hrfe);
            })*/
            window.location.href = '/' + channel + /**  '/' + nowPage +  */ '?' + 'catId=' + catId + '&choose=' + choose + '&keyword=' + encodeURI(keyword) + '&keyword2=' + mykeyword + '&queryCondition=' + queryCondition + '&categorysStr=' + categorys + '&sortBy=' + sortBy + '&sortType=' + sortType+'#filter';
        }else{
            window.location.href = '/' + channel + '/' + nowPage;
        }
    }

    function load() {
        var filterObj = getFilterStr();
        var keyword = filterObj.keyword;
        var categorys = filterObj.categorys;
        // var totalNum = $('#isRender').val();
        // totalNum = !totalNum ? 100 : totalNum;
        var sortBy = $('#hdn_sortBy').val();
        var sortType = $('#hdn_sortType').val();
        var a = $(".clearmar a");
        var reg = /[\u4e00-\u9fa5]|\w+/;
        if( reg.test(keyword) || categorys || sortBy || sortType) {
            $.each(a, function (i, o) {
                var hrfe= $(this).attr("href")+ '?keyword=' + keyword + '&categorysStr=' + categorys + '&sortBy=' + sortBy + '&sortType=' + sortType  +'#filter';
                $(this).attr("href",hrfe);
            })
        }else{

        }
    };
    //分页的东西？ 不需要了 - 由nodejs直接渲染 load();


    //如果不是服务端渲染
    var param = {
        nowPage: $param.nowPage
    };

    var isRender = $("#isRender");
    if (isRender.data('render') == 'sever') {
       page(1, 12, isRender.val());
    } else {
        queryList(1);
    }

    //分页处理方法
    //底部页码
    function page(nowPage, pageShow, totalNum) {
        totalPage = Math.ceil(totalNum / pageShow);
        if ($param.nowPage) {
            param.nowPage = $param.nowPage;
            nowPage = $param.nowPage;
        }
        param.pageShow = pageShow;
        param.totalNum = totalNum;
        param.totalPage = totalPage;

    }
    //页码点击
    var scrollBoxTop = $(".box.commodity").offset().top;

    // $(".padding-box .clearmar").on("click", "span:gt(0),span:lt(8)", function () {
    //     nowPage = $(this).html();
    //     $(this).addClass('active').siblings().removeClass('active');
    //     $("body, html").animate({
    //         "scrollTop": scrollBoxTop
    //     }, 500)
    //     queryList(nowPage);
    // })
    // $(".padding-box .clearmar").on("click", ".prev", function () {
    //     if (param.nowPage > 1) {
    //         nowPage = parseInt(param.nowPage) - 1;
    //     }
    //     $("body, html").animate({
    //         "scrollTop": scrollBoxTop
    //     }, 500)
    //     queryList(nowPage);
    // })
    // $(".padding-box .clearmar").on("click", ".next", function () {
    //     if (param.nowPage < param.totalPage) {
    //         nowPage = parseInt(param.nowPage) + 1;
    //     }
    //     $("body, html").animate({
    //         "scrollTop": scrollBoxTop
    //     }, 500)
    //     queryList(nowPage);
    // });
    //属性筛选条件折叠
    var $tmpCheatCateSelect = $('#tmpCheatCateSelect'),
        $toggle = $tmpCheatCateSelect.find('.toggle'),
        $features = $tmpCheatCateSelect.find('.features');
    $toggle.toggle(function () {
        $(this).removeClass('rotate');
        $tmpCheatCateSelect.find('.features:gt(1)').hide();
    }, function () {
        $(this).addClass('rotate');
        $tmpCheatCateSelect.find('.features:gt(1)').show();
    })
    //搜索
    var $param = KUYU.Init.getParam();//通过url获取相关参数
    var attributePrice = $param.queryCondition;
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
        //toSearch();
        queryList(1, attributePrice);
    })
    //搜索函数
    function toSearch() {
        
        window.location.href = '/search/search?' + 'keyword=' + globalMap.keyword + '&sortBy=' + globalMap.sortBy + '&sortType=' + globalMap.sortType + '&nowPage=' + globalMap.nowPage + '&pageShow=' + globalMap.pageShow + '&totalNum=100' + '&queryCondition=' + (attributePrice||'');
        /*$('.price-start').val($param.queryCondition.split('-')[0]);
         $('.price-end').val($param.queryCondition.split('-')[1]);*/    //window.history.pushState({},0,'http://'+window.location.host+'/search?'+u);
    }

    /**
    * Function to retrieve a get parameter from the current document (using location.href)
    * 
    * @param parameter {String} Key of the get parameter to retrieve
    */
    function _get(parameter) {
        var reg = new RegExp('[?&]' + parameter + '=([^&#]*)', 'i');
        var string = reg.exec(window.location.href);
        return string ? string[1] : '';
    }

    function _replaceLast(find, replace, string) {
        var lastIndex = string.lastIndexOf(find);
        
        if (lastIndex === -1) {
            return string;
        }
        
        var beginString = string.substring(0, lastIndex);
        var endString = string.substring(lastIndex + find.length);
        
        return beginString + replace + endString;
    }

});
