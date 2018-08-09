/**
 * Created by lxh on 2018/4/27
 */

require(['KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.plugins.alert','KUYU.Store','KUYU.Binder', 'juicer', 'KUYU.navFooterLink'], function () {
    var $header = KUYU.HeaderTwo,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        $binder = KUYU.Binder,
        _env = KUYU.Init.getEnv(),
        navFooterLink = KUYU.navFooterLink;

    navFooterLink();
    // $header.menuHover();
    $header.topSearch();

    var serviceUuid, orderDetailId, $dialog, $text, $mask;

    var $http = KUYU.Service;
    $init.Ready(function() {
        $header.menuHover();
    })
    var $init = KUYU.Init,
        $binder = KUYU.Binder,
        $scope = KUYU.RootScope;
    var thisPage = {
      init:function(){
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        this.getData(this.pageParam);
        this.addEvent();
      },
      getData:function(param){
          var chooseTab = $("#nowChooseTab").val();
          var searchName = $.trim($("#searchName").val());
        var that=this;
        var url = "/usercenter/afterSale/listKuyu";
        $http.post({
            url: url,
            data: {
                "nowPage": param.nowPage,
                "pageShow": param.pageShow,
                "nowChooseTab": chooseTab,
                "searchName": searchName,
                "terminalType":'01',
                "ranNum":Math.random()
            },
            success: function (res) {
                var html = '';
                if(res.code && res.code == 403){
                    window.location.href = "{{login}}";
                }
                if (!res.data) {
                    return;
                }
                var dataList = res.data.dataList;
                if (dataList.length > 0) {
                    for (var i = 0; i < dataList.length; i++) {
                        var m = dataList[i];
                        html += '<tr><td title='+m.afterServiceNo+'>'
                                  + m.afterServiceNo
                                  + '</td><td>';
                                  switch(m.applyType){
                                    case '1':
                                    html += '退货';
                                    break;
                                    case '2':
                                    html += '退款';
                                    break;
                                    case '3':
                                    html += '换货';
                                    break;
                                  }
                        html += '</td><td title='+m.orderId+'>'
                                  + m.orderId
                                  + '</td><td>'
                        if (m.detailModelList) {
                            var obj = m.detailModelList;
                            for (var k = 0; k < obj.length; k++) {
                                html += '<a href="/pages/productDetail/productDetail.html?uuid='
                                     + obj[k].productUuid
                                     + '">'
                                     + obj[k].productName
                                     + '</a>';
                            }
                        }
                        html += '</td><td>'
                                  + m.applyTime
                                  + '</td><td>'
                                  + m.statusName
                                  + '</td><td><a href="/pages/aftersale/backGoods.html?id='+m.orderId+'" class="red">查看详情</a></td></tr>';
                    }
                    $(".aftersaletable").show();
                    $(".j-norecord").hide();
                    $('#refundOrderList .rightbox tbody').html(html);
                    that.pageParam = res.data.pagination;
                    that.page(that.pageParam);
                }
                else {
                    $(".aftersaletable").hide();
                    $(".j-norecord").show();

                }
            }
        })
      },
      page:function(param){
         var totalPage = Math.ceil(param.totalNum/param.pageShow);
          // param.totalPage = totalPage;
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
      addEvent:function(){
          var that = this;
          //页码点击
          $(document).on("click","span:gt(0),span:lt(8)",function(){
             that.pageParam.nowPage = $(this).html();
              if(that.pageParam.nowPage.indexOf("...") > -1){
                  return
              }else{
                  $(this).addClass('active').siblings().removeClass('active');
                  that.getData(that.pageParam);
                  $('body,html').animate({scrollTop: 0 },200);
              }
          })
          $(document).on("click",".prev",function(){
              if(that.pageParam.nowPage>1){
                  that.pageParam.nowPage = that.pageParam.nowPage - 1;
              }
              that.getData(that.pageParam);
              $('body,html').animate({scrollTop: 0 },200);
          })
          $(document).on("click",".next",function(){
              var totalPage = Math.ceil(that.pageParam.totalNum/that.pageParam.pageShow);
              if(that.pageParam.nowPage < totalPage){
                  that.pageParam.nowPage = that.pageParam.nowPage + 1;
              }

              that.getData(that.pageParam);
              $('body,html').animate({scrollTop: 0 },200);
          })
      }
    }
    var url = window.location.toString();
    var id = url.split("#")[1];
    var orderId = url.split("#")[0].split("searchName=")[1];
    console.log(orderId)
    if(id =='backmoney' || id == 'backgoods' || id =='changegoods'){
        $("#nowChooseTab").val(id);
        $("#searchName").val(orderId?orderId:'');
        $(".tuihuo").removeClass("active");
        $("#"+id).addClass("active");
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        thisPage.getData(this.pageParam);
    }else {
        thisPage.init();
    }
    //:搜索
    $("#searchBtn").click(function () {
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        thisPage.getData(this.pageParam);
    })

    //退款申请
    $("#backmoney").click(function () {
        $("#nowChooseTab").val("backmoney");
        $(".tuihuo").removeClass("active");
        $("#backmoney").addClass("active");
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        thisPage.getData(this.pageParam);
    })

    //:退货申请
    $("#backgoods").click(function () {
        $("#nowChooseTab").val("backgoods");
        $(".tuihuo").removeClass("active");
        $("#backgoods").addClass("active");
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        thisPage.getData(this.pageParam);
    })

    //:换货申请
    $("#changegoods").click(function () {
        $("#nowChooseTab").val("changegoods");
        $(".tuihuo").removeClass("active");
        $("#changegoods").addClass("active");
        this.pageParam={
            totalNum:0,
            pageShow:10,
            nowPage:1
        };
        thisPage.getData(this.pageParam);
    })


});
