/**
 * Created by huangchuang on 2018/4/13 0013.
 */
require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.HeaderTwo', 'KUYU.navFooterLink', 'KUYU.Binder', 'KUYU.Store', 'ajaxfileupload', 'validate', 'xss'], function () {
    var $http = KUYU.Service,
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
    var UPLOADLIST = $init.Map();
    var thisPage = {
        init: function () {
            this.pageParam = {
                totalNum: 0,
                pageShow: 50,
                nowPage: 1
            };
            this.loadGridData(this.pageParam);
            this.addEvent();
        },
        loadGridData: function (param) {
            var that = this;
            var url = '/usercenter/producthistory/getStaffLookedGods';
            $http.get({
                url: url,
                data: {
                    terminalType: '01',
                    nowPage: param.nowPage,
                    pageShow: param.pageShow,
                    ranNum: Math.random()
                },
                success: function (res) {
                    if (res.code == 403 || res.code == "-6") {
                        window.location.href = "{{login}}";
                    }
                    that.loadGrid(res.data);
                    that.page(that.pageParam);
                },
                error: function (res) {

                }
            });
        },
        clean:function(){
          var that = this;
          var url = '/usercenter/producthistory/deleteStaffNoSellGods';
          $http.get({
              url: url,
              data: {},
              success: function (res) {
                if(res.msg=="success"){
                  Msg.Alert('','清除成功！',function(){
                      that.loadGridData(that.pageParam);
                  })

                }
              },
              error: function (res) {

              }
          });
        },
        loadGrid: function (data) {
            var html = '';
            var uuids = '';
            if (data && JSON.stringify(data) != "{}") {
                var a = [];
                $.each(data, function(key, val) { a[a.length] = key;  });
                a.sort(function(x,y) {
                    if (x > y)
                        return -1;
                    else
                        return 1;
                });
                $.each(a, function(i, key) {
                   // window.alert("key = " + key+",val="+obj[key]); // 访问JSON对象属性
                    html += '<div class="foot-ps"><span class="J-GoodsTime">' + key + '</span><span class="J-deletedAll" id="delLookedGood" data-uuid="delLookedGoodsUuids">删除</span></div>';
                    html += '<ul class="block-list">';
                    data[key].map(function (item, index) {
                        uuids = uuids + item.goodsId + ','
                        html += '<li class="list-item">' +
                            '<a href="../productDetail/productDetail.html?uuid=' + item.goodsId + '">' +
                            '<img src="'+item.goodsImgUrl+'">' +
                            '</a>' +
                            '<p class="listitle">' + item.goodsName + '</p>' +
                            '<p class="price">' + (item.price?item.price.toFixed(2):'0.00') + '元</p>'
                        '</li>';
                    })
                    html = html.replace(/delLookedGoodsUuids/, uuids);
                    uuids = '';
                    html += '</ul>';
                });
            } else {
                html += '<h1>没有浏览过的商品！</h1>'
            }
            $("#block_wrap").empty().html(html);
            $("#block_wrap").append('<div class="padding-box"><div class="padding clearmar"></div></div>');
            $("#productUuids").val(uuids);
        },
        page: function (param) {
            var totalPage = Math.ceil(param.totalNum / param.pageShow);
            // param.totalPage = totalPage;
            var html = "";
            if (totalPage < 8) {
                html += '<button class="prev" ';
                if (param.nowPage == 1) {
                    html += 'disabled';
                }
                html += ' style="background:#fff"><</button>';
                if (totalPage != 0) {
                    for (var i = 1; i <= totalPage; i++) {
                        html += '<span class="page-item ';
                        if (param.nowPage == i) {
                            html += 'active';
                        }
                        html += '" title="第' + i + '页">' + i + '</span>';
                    }
                } else {
                    html += '<span class="page-item active" title="第1页">1</span>';
                }


                html += '<button class="next" ';
                if (param.nowPage == totalPage) {
                    html += 'disabled';
                }
                html += ' style="background:#fff">></button>';

                $(".page-list").html(html);
            } else {
                if (totalPage >= 8 && param.nowPage < 7) {
                    html += '<button class="prev" ';
                    if (param.nowPage == 1) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff"><</button>';

                    for (var i = 1; i <= 7; i++) {
                        html += '<span class="page-item ';
                        if (param.nowPage == i) {
                            html += 'active';
                        }
                        html += '" title="第' + i + '页">' + i + '</span>';
                    }

                    html += '<button class="next" ';
                    if (param.nowPage == totalPage) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';

                    $(".page-list").html(html);
                } else {
                    html += '<button class="prev" ';
                    if (param.nowPage == 1) {
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
                    if (param.nowPage == totalPage) {
                        html += '<span class="page-item" title="第' + sbefore + '页">' + sbefore + '</span>';
                    }
                    html += '<span class="page-item" title="第' + before + '页">' + before + '</span>';


                    if (param.nowPage <= totalPage) {
                        html += '<span class="page-item active" title="第' + nowPage + '页">' + nowPage + '</span>';
                    }
                    if (param.nowPage + 1 <= totalPage) {
                        html += '<span class="page-item" title="第' + after + '页">' + after + '</span>';

                    }


                    html += '<button class="next" ';
                    if (param.nowPage == totalPage) {
                        html += 'disabled';
                    }
                    html += ' style="background:#fff">></button>';
                    $(".page-list").html(html);
                }
            }
        },
        addEvent: function () {
            var _that = this;
            $(".m_content").on("click", "#delLookedGood",function(){
                var uuid = $(this).attr('data-uuid')
                deleteFootermark(uuid)
            })
            $('.m_content').on('click',"#J_clean",function(){
              _that.clean();
            })
            //删除足迹
            function deleteFootermark(uuid) {
                var that = _that
                Msg.Confirm("删除该足迹", "确认删除该足迹？", function() {
                    var url = '/usercenter/producthistory/deleteStaffLookedGods';
                    $http.post({
                        url: url,
                        data: {
                            "terminalType": '01',
                            "productUuids": uuid,
                            "ranNum": Math.random()
                        },
                        success: function (res) {
                            if (res.code == 403 || res.code == "-6") {
                                window.location.href = "{{login}}";
                            }
                            if (res.code == "0") {
                                that.loadGridData(that.pageParam);
                            }
                        },
                        error: function (res) {
                        }
                    })
                })
            }


            //页码点击
            $(".page-list.clearfloat").on("click", "span:gt(0),span:lt(8)", function () {
                var nowPage = $(this).html();
                if (nowPage.indexOf("...") > -1) {
                    return
                } else {
                    $(this).addClass('active').siblings().removeClass('active');
                    that.loadGridData(that.pageParam);
                    $('body,html').animate({scrollTop: 0}, 200);
                }
            })
            $(document).on("click", ".prev", function () {
                if (this.pageParam.nowPage > 1) {
                    this.pageParam.nowPage = this.pageParam.nowPage - 1;
                }
                that.loadGridData(that.pageParam);
                $('body,html').animate({scrollTop: 0}, 200);
            })
            $(document).on("click", ".next", function () {
                if (this.pageParam.nowPage < this.pageParam.totalPage) {
                    this.pageParam.nowPage = this.pageParam.nowPage + 1;
                }
                that.loadGridData(that.pageParam);
                $('body,html').animate({scrollTop: 0}, 200);
            })
        }
    }
    thisPage.init();

})
