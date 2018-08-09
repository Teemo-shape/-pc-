/*
 * author: linxiaohu
 * time: 2016-12-05 11:11:08
 * */
require(['juicer', 'Plugin', 'KUYU.plugins.slide', 'KUYU.Service', 'KUYU.HeaderTwo','KUYU.SlideBarLogin', 'KUYU.Filter','KUYU.navFooterLink'],function(){
    var $http = KUYU.Service,
        $param = KUYU.Init.getParam(),
        $header = KUYU.HeaderTwo,
        $init = KUYU.Init,
        slidBarLogin = KUYU.SlideBarLogin,
        $filter = KUYU.Filter,
        navFooterLink = KUYU.navFooterLink;
        navFooterLink();
        $header.menuHover();
        $header.topSearch();
        plugin.init(),
        channel = '';

        if (!Array.prototype.map) {
            Array.prototype.map = function(callback) {
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

    //价格格式化
    var formatPrice = function (val) {
        return $filter.toFiexd(val)
    }
    //url 获取频道
    function parseQuery(pkey) {
        var search = window.location.search;
        var args = search.substring(1).split('&');
        var argsParsed = {};
        var i, arg, kvp, key, value;
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            if (-1 === arg.indexOf('=')) {
                argsParsed[$.trim(decodeURIComponent(arg))] = true;
            } else {
                kvp = arg.split('=');
                key = $.trim(decodeURIComponent(kvp[0]));
                value = $.trim(decodeURIComponent(kvp[1]));
                argsParsed[key] = value;
            }
        }
        if (pkey) {
            return argsParsed[pkey];
        }
        return argsParsed;
    };
    channel = parseQuery('channelId');
    channel == 'homeappliance' && (channel = 'health');
    //幻灯片
    function getChannelAds(channel) {
        var  url = '/getChannelAds/pc';
        $http.post({
            url: url,
            data : {
                channel :channel
            },
            success : function (res) {
                var html  = '<div class="banner">' +
							'<div class="banner-content" id="banner-content">';
                if ( !res.code ) {

                    $.each(res,function( key ,value) {
                        html += '<div class="banner-slide slide-active">' +
								'<a target="_blank" href="' + value.href + '" class="inner-link">' +
								'<img src="' + value.src + '" alt="' + value.alt + '" class="src">' +
								'</a>' +
								'</div>';
                        //if(key==0 ) return;
                    });

                    $('#chanBanner .banner-content').empty().append(html);

                    $(".banner").Slide({
                        eles: $(".banner-slide"),
                        dots: $(".banner-dots"),
                        slideshow: true
                    });
                } else if(res.code) {
                    $init.nextPage('404', {

                    })
                }
            }
        })
    }
    getChannelAds(channel);

    /*主体内容随窗口滚动添加固定样式*/
   //不要这个固定效果，暂时先注释，以后再看删不删
//  var searchTop = $('.commodity').offset().top;
//  addFixed(searchTop);
//  $(window).scroll(function() {
//      addFixed(searchTop);
//  })
//  function addFixed(scrollT) {
//      if ($(window).scrollTop() > ($('.commodity').offset().top + 90)) {
//          $('.comm-search-content').addClass("fixed");
//      } else {
//          $('.comm-search-content').removeClass("fixed");
//      }
//  }

    //重新筛选条件绑定点击事件
    var filter = 0;
    $(document).off('click', '.features li>span');
    $(document).on('click', '.features li>span', function() {
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
        queryList("1");
    });

    //排序按钮事件绑定
    //默认排序是综合排序
    $('.salsnum').toggle(function(){
        //$('.priceRank').attr('sorttype','2').html('价格&nbsp;&nbsp;↑');
        $(this).attr('sorttype','1').html('销量&nbsp;&nbsp;↓');
    },function(){
        $(this).attr('sorttype','2').html('销量&nbsp;&nbsp;↑');
    });
    $('.priceRank').toggle(function(){
        $(this).attr('sorttype','2').html('价格&nbsp;&nbsp;↑');
        //$('.salsnum').attr('sorttype','2').html('销量&nbsp;&nbsp;↑');
    },function(){
        $(this).attr('sorttype','1').html('价格&nbsp;&nbsp;↓');
    });
    $('#hdn_sortBy').val('sortWeight');
    $('#hdn_sortType').val('1');
    $('.sort-list a').click(function() {
        $(this).addClass('selected').siblings('a').removeClass('selected');
        var sortBy = $(this).data("name");
        var sortType = $(this).attr('sorttype');
        $("#hdn_sortBy").val(sortBy);
        $("#hdn_sortType").val(sortType);
        //加载数据
        queryList("1");
    });

    //筛选条件
    function getFilterStr() {
        var span_typeKeyword1 = $("span[type='spanType1'].active");
        var span_typeKeyword2 = $("span[type='spanType2'].active");
        var span_typeKeyword3 = $("span[type='spanType3'].active");
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
        keyword = !keyword ? "" : keyword;
        categorys = !categorys ? "" : categorys;
        return {
            keyword: keyword,
            categorys: categorys
        };
    }
    
    function filterEs(es) {
		if(es[0] != '<' || es[1] != 'a'){
			return es;
		}
		var tmp = '';
		var filter = false;
		var findEnd = false;
		var htmlStart = false;
		for(var i in  es){
			var c = es[i];
			// if(findEnd){
			// 	tmp += c;
			// 	continue;
			// }
			if(c == '>'){
				if(!filter){
					htmlStart = false;
					tmp += c;
				}
				filter = false;
				continue;
			}
			if(c == '<'){
				if(htmlStart){
					filter = true;
					continue;
				}else{
					htmlStart = true;
				}
			}
			// if(c == '【'){
			// 	findEnd = true;
			// 	tmp += '【';
			// 	continue;
			// }
			if(!filter){
				tmp += c;
			}

		}
		return tmp;
	}	

    //根据不同频道请求不同接口
    var cuuids = {
        tv: '456a4e26d34540eab1b31c7212a5fd98',
        mobile: '9dcd3d03e0674150831553d1bcd86176',
        air: '325fe3718b3f4d4f8abe611373df821a',
        toIcebox: 'bbef5c0d59e74f04a1aadcc8003d9511',
        toIceWash: '51dc2554485d4c549503a63298c34fae',
        toHealthEleKuyu: '778c3418ca0a459b925a1edd09620c88'
    };

    var cid = channel;
    channel == 'refrigerator' && (cid = 'toIcebox');
    channel == 'washer' && (cid = 'toIceWash');
    channel == 'health' && (cid = 'toHealthEleKuyu');

    var _url = '';
    _url = '/newchannel/' + cid;

    var cText = {
        tv: [{
            txt: '距离选尺寸',
            value: ['32英寸', '40-43英寸', '48-50英寸', '55-60英寸', '60英寸以上'],
            key: ['尺寸-32英寸', '尺寸-40-43英寸', '尺寸-48-50英寸', '尺寸-55-60英寸','尺寸-60英寸以上']
        }, {
            txt: '特色',
            value: ['曲面屏', '高色域', '4K超高清', '安卓智能', '互联网', '蓝光'],
            key: ['屏幕类型-曲面电视', '色域-高色域', '分辨率-3840*2160（4K分辨率/UHD）', '电视类型-智能电视,操作系统-Android', '电视类型-互联网电视', '3301B'],
        }],
        mobile: [{
            txt: '屏幕尺寸筛选',
            value: ['3.5 英寸以下', '3.6~4.5英寸', '4.6~5.5英寸', '5.5英寸以上'],
            key: ['屏幕尺寸-手机-3.5英寸以下', '屏幕尺寸-手机-3.6-4.5英寸', '屏幕尺寸-手机-4.6-5.5英寸', '屏幕尺寸-手机-5.5英寸以上']
        }, {
            txt: '系列筛选',
            value: ['么么哒系列', 'idol系列', 'POP系列', '老人机系列', '平板系列', '手机配件'],
            key: ['系列-么么哒系列', '系列-idol系列', '系列-POP系列', '系列-老人机系列', '系列-平板系列', '系列-手机配件']
        }],
        toIceWash: [{ //洗衣机
            txt: '体积容量筛选',
            value: ['5kg以下', '5-6kg', '6-7kg', '7-8kg','8kg以上'],
            key: ['脱水容量-5kg以下', '脱水容量-5-6kg', '脱水容量-6-7kg', '脱水容量-7-8kg','脱水容量-8kg以上'],
        }, {
            txt: '类别筛选',
            value: ['波轮变频', '波轮全自动', '滚筒变频', '滚筒定频'],
            key: ['洗衣机类别-波轮变频', '洗衣机类别-波轮全自动', '洗衣机类别-滚筒变频', '洗衣机类别-滚筒定频']
        }],
        toIcebox: [{ //冰箱
            txt: '体积容量筛选',
            value: ['100L以下', '101L-200L', '201L-300L', '301L-500L', '500L以上'],
            key: ['总有效容积（L）-100L以下', '总有效容积（L）-101-200L', '总有效容积（L）-201-300L', '总有效容积（L）-301-500L', '总有效容积（L）-500L']
        }, {
            txt: '类别筛选',
            value: ['单门式', '双门式', '三门式', '多门式', '对开门式'],
            key: ['冰箱类别-单门式', '冰箱类别-双门式', '冰箱类别-三门式', '冰箱类别-多门式', '冰箱类别-对开门式']
        }],
        air: [{
            txt: '匹数',
            value: ['1匹', '1.5匹', '2匹', '3匹'],
            key: ['匹数-1P', '匹数-1.5P', '匹数-2P', '匹数-3P']
        }, {
            txt: '特点',
            value: ['壁挂式', '立柜式', '圆柱式', '移动式'],
            key: ['特点-壁挂式', '特点-立柜式', '特点-圆柱式', '特点-移动式']
        }, {
            txt: '变频/定频',
            value: ['无氟变频', '高效定频'],
            key: ['定频/变频-变频', '定频/变频-定频']
        }],
        toHealthEleKuyu: [{
            txt: '类别筛选',
            value: ['空气净化器', '净水机', '吸尘器', '除螨仪', '电热水器','原汁机', '加湿器'],
            key: ['空气净化器', '净水机', '吸尘器', '除螨仪','电热水器', '原汁机', '加湿器']
        }],
    };

    var typeIn = false; //属性筛选条件是否加载完毕
    //根据条件搜索商品
    function queryList(nowPage) {
        if (!channel) {
            alert('参数丢失，请返回重试！');
        };
        //筛选条件
        var filterObj = getFilterStr();
        var keyword = filterObj.keyword;
        var categorys = filterObj.categorys;
        var totalNum = $('#hdn_totalNum').val();
        totalNum = !totalNum ? 100 : totalNum;
        var sortBy = $('#hdn_sortBy').val();
        var sortType = $('#hdn_sortType').val();

        $('.commodity img.iloading').css('opacity',1).show();
        $http.get({
            url:_url,
            data:{
                nowPage: nowPage,
                pageShow: 12,
                totalNum: totalNum,
                keyword1: keyword,
                categoryUuid: cuuids[cid],
                sortBy: sortBy,
                sortType: sortType,
                categorysStr: categorys
            },
            success:function(data){
                //属性筛选
                if (!typeIn) {
                    var _html = '';
                    cText[cid].map(function (m,k) {
                        _html += '<div class="features"><strong>根据' + m.txt + '</strong><ul><li class="all"><span type="spanType' + (k+1) + '" key="" value="" class="active">全部</span></li>';
                        m.value.map(function (n, i) {
                            _html = _html
                             + '<li><span type="spanType' + (k+1) + '" key="'+ n +'" value="'+ m.key[i] +'">' + n + '</span></li>';
                        });
                        _html += '</ul></div>'
                    });
                    $('#tmpCheatCateSelect').append(_html);
                    $('#tmpCheatCateSelect').find('.features:gt(1)').hide();
                    ($('.features').length <= 2) ? $('.toggle').hide() : $('.toggle').show();
                    typeIn = true;
                };

                //商品列表数据
                $('.commodity img.iloading').css('opacity',0).hide();
                var pro = data.list;
                var mapPro = data.mapProduct;
                if(pro.length > 0){
                    //右側商品數據
                    var tpl = ['{@each list as item,index}', '$${item,index|products_build}', '{@/each}' ].join('');
                    var funcPros = function(pro,index) {
                        index ++;
                        var html = '';

                        html += '<li data-type="tv-'
                                + index
                                + '">';
                        if(pro.promotionDesc!=''){
                            html += '<div class="badge">' + pro.promotionDesc + '</div>';
                        }else{
                            if(pro.price > pro.promotionPrice && pro.promotionPrice > 0){
                                html += '<div class="badge">促销</div>';
                            }                            
                        }
                        html = html
                            + '<div class="commImg"><a target="_blank" href="/pages/productDetail/productDetail.html?uuid=' + pro.uuid + '"><img src="' + (pro.pic!=='' ? pro.pic : '/app/images/noimg.jpg') + '" alt="" /></a></div><div class="comm-text"><div class="intro"><strong>' + pro.name + '</strong><p>' + filterEs(pro.recommend) + '</p></div><div class="pri">';
                        if(pro.price > pro.promotionPrice && pro.promotionPrice > 0){
                            html +=  formatPrice(pro.promotionPrice);
                        }else{
                            html += formatPrice(pro.price);
                        }
                        html = html
                            + '元</div><a target="_blank" href="/pages/productDetail/productDetail.html?uuid=' + pro.uuid + '" class="addCart">立即购买</a></div></li>';

                        return html;
                    };
                    juicer.register('products_build', funcPros);
                    var result = '<ul>' + juicer(tpl, data) + '</ul>';
                    $('.comm-mar').html(result);

                    //分页
                    var totalNum = data.totalNum;
                    page(nowPage,12,totalNum);
                    $('#pagingDv').show();
                }else{
                      var noResult = '';
                      noResult += '<div class="noResults">很抱歉，没有符合您搜索条件的商品！</div>';
                      var noRes_html = '';
                      if(mapPro != null){
                        noRes_html += '<div class="recommend-commodity clearfloat"><h2>推荐商品</h2><div class="commodity-list">';
                        var _tpl = ['{@each mapProduct as item,index}', '$${item,index|map_build}', '{@/each}' ].join('');
                        var mapFunc = function(mapPro,index){
                            var html = '';
                            html = html
                                + '<dl><a href="'
                                + mapPro.value[0]
                                + '" target="_blank"><dt><img src="'
                                + mapPro.value[1]
                                + '" alt="'
                                + mapPro.value[2]
                                + '"></dt><dd class="comm-name">'
                                + mapPro.value[2]
                                + '</dd><dd class="comm-price">';
                            if(mapPro.value[4] == ''){
                                html += formatPrice(mapPro.value[3]) + '元';
                            }else{
                                html += formatPrice(mapPro.value[4]) + '元';
                            }
                            html += '</dd></a></dl>';
                            return html;
                        }
                        juicer.register('map_build',mapFunc);
                        noRes_html = noRes_html
                        + juicer(_tpl,data)
                        + '</div></div>';
                    }
                    noResult += noRes_html;
                    $('.comm-mar').html(noResult);
                    $('#pagingDv').hide();
                }

            }
        })
    }
    queryList("1");
    //分页处理方法
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
            nowPage = $(this).html();
            $(this).addClass('active').siblings().removeClass('active');
            $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
            queryList(nowPage);
    })
    $(".padding-box .clearmar").on("click",".prev",function(){
        if(param.nowPage>1){
            nowPage = parseInt(param.nowPage) - 1;
        }
        $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
        queryList(nowPage);
    })
    $(".padding-box .clearmar").on("click",".next",function(){
        if(param.nowPage < param.totalPage){
            nowPage = parseInt(param.nowPage) + 1;
        }
        $("body, html").animate({
                "scrollTop": scrollBoxTop
            }, 500)
        queryList(nowPage);
    });
    //属性筛选条件折叠
    var $tmpCheatCateSelect = $('#tmpCheatCateSelect'),
        $toggle = $tmpCheatCateSelect.find('.toggle'),
        $features = $tmpCheatCateSelect.find('.features');
    $toggle.toggle(function(){
        $(this).addClass('rotate');
        $tmpCheatCateSelect.find('.features:gt(1)').show();
    },function(){
        $(this).removeClass('rotate');
        $tmpCheatCateSelect.find('.features:gt(1)').hide();
    })
});
