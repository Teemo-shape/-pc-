/*
 * Author:Linxh
 * Date: 2016-11-29*/
require(['KUYU.Service','KUYU.plugins.slide','KUYU.Binder','KUYU.SlideBarLogin','juicer', 'KUYU.HeaderTwo','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        $scope = KUYU.RootScope,
        navFooterLink = KUYU.navFooterLink;
        $header.menuHover();
        $header.topSearch();
        navFooterLink();
    /*
     * @sortBy {string} 搜索排序条件
     * */
    var globalMap = {
        sortBy: "sortWeight",
        sortType: "1"
    }

    var u = location.search;
    if(u){
        u = u.substr(1);
        u = decodeURIComponent(u);
        u = u.split('&')[0].replace('keyword=','');
        toSearch(u);
    }else{
        toSearch('');
    };

    //执行搜索
     function toSearch(hotkeyword) {
         //不为空，则是从点击热门搜索词或其他页面带过来的关键词参数
         var keyword;
         if (hotkeyword) {
             keyword = hotkeyword;
         } else {
             var inputSearch = $(".nav-saerch");
             keyword = inputSearch.val();
         }
         $('#hdn_keyword').val(keyword);
         $('.searchRes strong').text(keyword);
         $('body').removeClass('hidescroll');
         $('.mask,.saerch, .nav-bor .close').hide();
         $('.menu').show();
         $('.header').removeClass('scale');
         queryList("1",1);
     }

    //价格区间"确定"按钮
    $('.priRange .confirm').click(function() {
        var priceStart = Number($('.price-start').val());
        var priceEnd = Number($('.price-end').val());
        (priceStart == '') && $('.price-start').val('0');
        if(priceStart >= priceEnd && priceEnd != ''){
            alert('请输入正确的价格区间！');
            $('.price-end').val('').focus();
            return;
        }
        queryProductsByPrice(priceStart, priceEnd);
    });
    $('.price-start').bind('blur keyup change',function(){
        (!$.isNumeric($(this).val())) && $(this).val(''); 
    });
    $('.price-end').bind('blur keyup change',function(){
        var priceEnd = $(this).val();
        if ((priceEnd && !$.isNumeric(priceEnd)) || (priceEnd && priceEnd == '0')) {
            $('.price-end').val('');
        }
    });
    //根据价格区间搜索商品
    function queryProductsByPrice(priceStart, priceEnd) {
        var attributePrice = priceStart + '-' + priceEnd;
        if (!attributePrice.split('-')[1] || priceEnd == 0) {
            attributePrice = priceStart;
        }
        $('#hdn_attributePrice').val(attributePrice);
        //加载数据
        queryList('1');
    };

    //排序按钮事件绑定
    //默认排序是综合排序
    globalMap.sortBy = 'sortWeight';
    globalMap.sortType = '1';
    $('.salsnum').toggle(function(){
        $('.priceRank').attr('sorttype','2').html('价格&nbsp;&nbsp;↑');
        $(this).attr('sorttype','1').html('销量&nbsp;&nbsp;↓');
    },function(){
        $(this).attr('sorttype','2').html('销量&nbsp;&nbsp;↑');
    });
    $('.priceRank').toggle(function(){
        $('.salsnum').attr('sorttype','2').html('销量&nbsp;&nbsp;↑');
        $(this).attr('sorttype','1').html('价格&nbsp;&nbsp;↓');
    },function(){
        $(this).attr('sorttype','2').html('价格&nbsp;&nbsp;↑');
    });
    $('.sort-list a').click(function() {
        $(this).addClass('selected').siblings('a').removeClass('selected');
        var sortBy = $(this).data("name");
        var sortType = $(this).attr('sorttype');
        globalMap.sortBy = sortBy;
        globalMap.sortType = sortType;
        //加载数据
        queryList("1");
    });
    
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
    
    //根据条件搜索商品
    function queryList(nowPage, flag) {
        var queryCondition = "";
        queryCondition += "&keywords2=" + $("#hdn_keywords2").val();
        //queryCondition += "&existProduct=" + ($("#existProduct").is(":checked") ? "1" : "0");
        queryCondition = queryCondition.replace(/&/, "");
        //var frontCategoryUuid = $("#hdn_frontCategoryUuid").val();
        var keyword = $("#hdn_keyword").val();
        var totalNum = $("#hdn_totalNum").val();
        var sortBy = globalMap.sortBy;
        var sortType = globalMap.sortType;
        //大图显示或者小图列表显示，目前只用大图显示
        var productPicType = $("#hdn_productPicType").val();
        //价格区间条件 0-100
        var attributePrice = $("#hdn_attributePrice").val();
        if (attributePrice) {
            queryCondition += "&attributePrice=" + attributePrice;
        }
        //搜索结果筛选添加功能
        var firstCategoryId = $('.features:eq(0)').find('span[type="catelog"]').attr("categoryuuid");
        firstCategoryId = !firstCategoryId ? "" : firstCategoryId;

        var url = '/itemsearch/toProductList';
        $('.iloading').css('opacity','1');
        $http.post({
            url:url,
            data:{
                nowPage: nowPage,
                pageShow: 12,
                totalNum: totalNum,
                queryCondition: queryCondition,
                //categoryUuid: frontCategoryUuid,
                keyword: keyword,
                firstCategoryId: firstCategoryId,
                //attributeAttrValueStr: attributeAttrValueStr,
                sortBy: globalMap.sortBy,
                sortType: globalMap.sortType,
                productPicType: productPicType,
                ranNum: Math.random()
            },
            success:function(data){
                $('.iloading').css('opacity','0');
                //搜索总计
                $('.searchRes em').text(data.totalNum);
                var pro = data.list;
                //console.log(data)
                var mapPro = data.mapProduct;
                var proList = '';
                if(pro.length > 0){
                    //右側商品數據
                    var tpl = ['{@each list as item,index}', '$${item,index|products_build}', '{@/each}' ].join('');
                    var funcPros = function(pro,index) {
                        index ++;
                        //console.log(pro.recommend.replace(/<\/?[^>]+>/g, ""));
                        /*var k = pro.recommend.indexOf('_blank>'),rec1 = '',rec2 = '';
                        if(k>-1){
                            rec1 = pro.recommend.substring(k);
                            rec2 = pro.recommend.replace(rec1,'');
                            rec2 = rec2.replace(/<span style='color:red'>/g,"").replace(/<\/span>/g,'') + 'target=' + rec1;
                        }*/
                        var html = '<li data-type="tv-'
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
                            + '<div class="commImg"><a target="_blank" href="/pages/productDetail/productDetail.html?uuid=' + pro.uuid + '"><img src="' + (pro.pic!=='' ? pro.pic : '/app/images/noimg.jpg') + '" alt="" /></a></div><div class="comm-text"><div class="intro"><strong>' + pro.name + '</strong><p>' + filterEs(pro.recommend)/*pro.recommend.replace(/<\/?[^>^<^a]+>/gi, "").replace(/<\/?[^>^<]+>/gi, "")*/ + '</p></div><div class="pri">';
                        if(pro.price > pro.promotionPrice && pro.promotionPrice > 0){
                            html +=  pro.promotionPrice;
                        }else{
                            html += pro.price;
                        }
                        html = html
                            + '元</div><a target="_blank" href="/pages/productDetail/productDetail.html?uuid=' + pro.uuid + '" class="addCart">立即购买</a></div></li>';
                        return html;
                    };
                    juicer.register('products_build', funcPros);
                    var result = juicer(tpl, data);
                    proList = '<ul>' + result + '</ul>';
                    //左側搜索條件
                    if(flag == 1){
                        if(data.attributeMap.length > 0 || data.categoryMap.length > 0){
                            var _html = '';
                            _html = _html
                            +'<div class="features">'
                            +'<strong>分类</strong><ul>';
                            $.each(data.categoryMap,function(i,item){
                                _html += '<li><span class="active" type="catelog" categoryUuid="' + item.id + '">' + item.name + '</span></li>';
                            })
                            _html = _html
                            +'</ul></div>';
                            $.each(data.attributeMap,function(i,item){
                                var attrId = data.attributeMap[i].id;
                                var attrVals = data.attributeValueMap[attrId];
                                _html = _html
                                +'<div class="features"><strong>'
                                +data.attributeMap[i].name+'</strong><ul>'
                                $.each(attrVals,function(m,n){
                                    _html = _html
                                    +'<li><span type="attributeValue" attributeUuid="' + attrId + '" attributeValueUuid="'+ attrVals[m].id +'">'+ attrVals[m].name +'</span></li>';
                                });
                                _html = _html
                                +'</ul></div>';
                            })
                            $('#tmpCheatCateSelect').append(_html);
                            $('#tmpCheatCateSelect').find('.features:gt(1)').hide();
                            var $features = $('.features');
                            ($features.length <= 2) ? $toggle.hide() : $toggle.show();
                        }
                    }
                    //分页
                    var totalNum = data.totalNum;
                    page(nowPage,12,totalNum);
                    $('#pagingDv').show();
                }else{
                      if(mapPro != null){
                        var noResult = '';
                        noResult = noResult
                                + '<div class="not-search"><p>很抱歉，没有符合您搜索条件的商品！<br>尝试改变关键词重新搜索吧～</p><div class="container-pic"><img src="../../app/images/notSearch.jpg" alt="没有搜索到相关商品"></div></div>';
                        var _tpl = ['{@each mapProduct as item,index}', '$${item,index|map_build}', '{@/each}' ].join('');
                        var mapFunc = function(mapPro,index){
                            var html = '';
                            html = html
                                + '<div class="recommend-commodity clearfloat"><h2>推荐商品</h2><div class="commodity-list">'
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
                                html += mapPro.value[3] + '元';
                            }else{
                                html += mapPro.value[4] + '元';
                            }
                            html += '</dd></a></dl>';
                            return html;
                        }
                        juicer.register('map_build',mapFunc);
                        var noRes_html = juicer(_tpl,data);
                        noResult += noRes_html;
                        noResult += '</div></div>';
                        proList = noResult;
                    }
                    $('#pagingDv').hide();
                }
                $('.comm-mar').html(proList);
            }
        })
    }

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
    })
    //2017年3月2日 15:57:49 by Lxiaohu
    //属性筛选条件点击折叠
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

    /*让IE旧版浏览器兼容placeholder */
    var doc = document,
        inputs = doc.getElementsByTagName('input'),
        supportPlaceholder = 'placeholder'in doc.createElement('input'),
    placeholder = function(input) {
        var text = input.getAttribute('placeholder'),
            defaultValue = input.defaultValue;
        if (defaultValue == '') {
            input.value = text
        }
        input.onfocus = function() {
            if (input.value === text) {
                this.value = ''
            }
        };
        input.onblur = function() {
            if (input.value === '') {
                this.value = text
            }
        }
    };
    if (!supportPlaceholder) {
        for (var i = 0, len = inputs.length; i < len; i++) {
            var input = inputs[i],
                text = input.getAttribute('placeholder');
            if (input.type === 'text' && text) {
                placeholder(input)
            }
        }
    }
});
