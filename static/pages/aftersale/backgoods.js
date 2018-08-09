/**
 * Created by lxh on 2018/04/27.
 */
require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.HeaderTwo' ,'KUYU.Binder', 'KUYU.SlideBarLogin','juicer','KUYU.navFooterLink'], function() {
    var $http = KUYU.Service,
        slidBarLogin = KUYU.SlideBarLogin,
        navFooterLink = KUYU.navFooterLink,
        Header = KUYU.HeaderTwo;

    navFooterLink();
    Header.menuHover();
    Header.topSearch();

    var $param = KUYU.Init.getParam();

    var $init = KUYU.Init,
        $binder = KUYU.Binder,
        $scope = KUYU.RootScope;

    var thisPage = {
        init:function(){
            this.id = $param['id'];
            this.serviceUuid='';
            this.orderDetailId='';
            this.getData();
            this.addEvent();
        },
        getData:function(){
          var that=this;
          var url = "/usercenter/afterSale/listKuyu";
          $http.post({
              url: url,
              data: {
                  "nowPage": 1,
                  "pageShow": 10,
                  "nowChooseTab": '',
                  "searchName": that.id,
                  "terminalType":'01',
                  "ranNum":Math.random()
              },
              success: function (res) {
                  that.renderPage(res);
                  that.serviceUuid = res.data.dataList[0].uuid;
                  that.orderDetailId = res.data.dataList[0].detailModelList[0].od.uuid;
              }
          })
        },
        renderPage:function(res){
            if(!res.data.dataList) return;
             var obj = res.data.dataList[0],html = '';
            html += '<div class="item-wrap border-bottom">'
                +'<div class="item-wrap-header">'
                    +'<h2>售后查看</h2>'
                +'</div>'
                +'<dl>'
                    +'<dd><span class="item-form-title">售后编号：</span><span class="item-form-txt">'
                    + obj.afterServiceNo
                    +'</span></dd>'
                    +'<dd><span class="item-form-title">售后类型：</span><span class="item-form-txt">'
                    switch(obj.applyType){
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
                    html+='</span></dd>'
                    +'<dd class="clearfloat">'
                        +'<span class="item-form-title">售后状态：</span><span class="red">'
                        +obj.statusName
                        +'</span>'
                            if(obj.state != 4 && obj.state != 8 && obj.state != 9 && obj.state != 10){
                                html +='<span class="btn-sale btn-cancelApply fr" id="cancleApply">取消申请</span>'
                            }
                    // if(obj.applyType!='2'){
                    //   html+='<span class="btn-sale btn-sendBack fr" id="sendBack">寄回商品</span>'
                    // }
                    html+='</dd>'
                +'</dl>'
            +'</div>'
            //+'<div class="item-wrap border-bottom">'
                // +'<div class="item-wrap-header">'
                //     +'<h2>物流信息</h2>'
                // +'</div>'
                // +'<dl class="padding-left">'
                //     +'<dd><span class="item-form-title">物流公司：</span><span class="item-form-txt">顺丰速递</span></dd>'
                //     +'<dd><span class="item-form-title">物流单号：</span><span class="item-form-txt">135039234283925</span></dd>'
                // +'</dl>'
                // var pro = obj.detailModelList;
                // for(var i=0;i<pro.length;i++){
                //   html+='<div class="product-info clearfloat">'
                //       +'<div class="fl">'
                //           +'<img src="http://img.mall.tcl.com/dev1/0/000/393/0000393351.fid" alt="">'
                //       +'</div>'
                //       +'<div class="fl">'
                //           +'<p class="product-title">'
                //           + pro[i].productName
                //           +'</p>'
                //           +'<p class="product-size"><span>颜色：深空灰</span><span>尺寸：55寸</span></p>'
                //       +'</div>'
                //       +'<div class="product-price fl">'
                //           +'<span>¥ '+
                //           +pro[i].od.payMoney
                //           +'</span><span class="product-count">x'
                //           +pro[i].od.buyNum
                //           +'</span>'
                //       +'</div>'
                //   +'</div>'
                // }
            //html+='</div>'
            html+='<div class="item-wrap">'
                +'<div class="item-wrap-header">'
                    +'<h2>售后申请信息</h2>'
                +'</div>'
                +'<dl class="form-info clearfloat padding-left">'
                    +'<dd>'
                        +'<span class="item-form-title fl">问题描述：</span>'
                        +'<p class="item-form-txt desc">'
                        +obj.description
                        +'</p>'
                    +'</dd>'
                    +'<dd class="clearfloat">'
                       /* +'<span class="item-form-title fl">问题图片：</span>'
                        +'<ul class="fl clearfloat">'
                        if(obj.evidence1Url && obj1.evidence1Url!=''){
                          html+='<li><img src="'+obj1.evidence1+'" alt=""></li>'
                        }
                        if(obj.evidence2Url && obj1.evidence2Url!=''){
                          html+='<li><img src="'+obj1.evidence2Url+'" alt=""></li>'
                        }
                        if(obj.evidence3Url && obj1.evidence3Url!=''){
                          html+='<li><img src="'+obj1.evidence3Url+'" alt=""></li>'
                        }
                    html+='</ul>'*/
                        +'</dd>'
                    +'<dd>'
                        +'<span class="item-form-title">申请时间：</span>'
                        +'<span class="item-form-txt">'
                        +obj.applyTime
                        +'</span>'
                    +'</dd>'
                +'</dl>'
            +'</div>'
            //换货，则需要收货信息
            if(obj.applyType == 3){
                html+= '<div class="item-wrap">'
                    +'<div class="item-wrap-header">'
                    +'<h2>收货信息</h2>'
                    +'</div>'
                    +'<dl class="padding-left">'
                    +'<dd><span class="item-form-title">订单编号：</span><span class="item-form-txt">'
                    +obj.orderId
                    +'</span></dd>'
                    +'<dd><span class="item-form-title">收货人姓名：</span><span class="item-form-txt">'
                    +obj.customerName
                    +'</span></dd>'
                    +'<dd><span class="item-form-title">联系电话：</span><span class="item-form-txt">'
                    + (obj.customerTel!=null?obj.customerTel:'')
                    +'</span></dd>'
                    +'<dd><span class="item-form-title">收货地址：</span><span class="item-form-txt">'
                    +obj.customerAddress
                    +'</span></dd>'
                    +'</dl>'
                    +'</div>'
            }
            $('#content').html(html)
        },
        cancle:function(serviceUuid,orderDetailId){
            var cancelUrl = '/usercenter/afterSale/cancelKuyu';
            $http.get({
                url: cancelUrl,
                data: {
                    serviceUuid: serviceUuid,
                    orderDetailId: orderDetailId,
                    cancelContent: '',
                    reason: '',
                    ranNum:Math.random()
                },
                success: function (res) {
                    if(res.code && res.code == 403){
                        window.location.href = "{{login}}";
                    }
                    if(res.code == "-1"){
                        Msg.Confirm("","取消失败，请稍后重试！",function(){
                            window.location.reload();
                        });
                    }
                    console.log(res);
                    if (res.code == '0') {
                        Msg.Alert("","取消成功！",function(){
                            window.location.reload();
                        });
                        setTimeout(function(){
                            window.location.reload();
                        },2000)

                    }
                },
                error: function (res) {
                    Msg.Alert("","申请售后服务的uuid不存在！",function(){
                        window.location.reload();
                    });
                }
            })
        },
        addEvent:function(){
            var that = this;
            $(document).on('click','#cancleApply',function(){
              Msg.Confirm("","取消申请，将无法再次发起售后申请！是否取消？",function(){
                  that.cancle(that.serviceUuid,that.orderDetailId);
              });
            })
        }
    }
    thisPage.init();
});
