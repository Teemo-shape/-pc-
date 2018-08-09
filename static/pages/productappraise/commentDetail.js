/**
 * Created by huangchuang on 2018/4/19 0019.
 */
require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.HeaderTwo', 'KUYU.navFooterLink', 'KUYU.Binder', 'KUYU.Store', 'ajaxfileupload', 'validate', 'xss'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        $scope = KUYU.RootScope;
    var UPLOADLIST = $init.Map();
    $header.menuHover();
    $header.topSearch();
    navFooterLink();
    sessionStorage.removeItem("order");

    var thisPage;
    var json = []
    thisPage = {
        init: function() {
            this.imgArr = [];
            this.imgObj = {};
            this.uuid = location.search.split("?")[1]; //订单id
            this.orderDetailUuid = ''; //订单编号
            this.flag = false; // 是否是追评标记，true为是，false为不是
            this.viewFlag = false; //是否是查看标记，true为是，false为不是
            this.loadPage();
            this.addEvent();
        },
        loadPage: function() {
            var that = this;
            var url = "/usercenter/order/ajaxviewKuyuByAfterComment";
            $http.post({
                url: url,
                data: {
                    uuid: that.uuid,
                    ranNum: Math.random()
                },
                success: function(res) {
                    if (res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if (res.data) {
                        var data = res.data
                        that.doCommentsResponse(data);
                        $('body').on('change', '.uploadImg', function() {
                                that.initUpload(this, 'upload1_img0', $(this).data('uuid'));
                            })
                            //页面请求加载完成后，在判断是否加载星标的事件
                        if (!that.flag && !that.viewFlag) {
                            that.initStarEvent();
                        }
                    }
                },
                error: function(res) {}
            });
        },
        doCommentsResponse: function(data) {
            console.log('data', data)
            var htmlComment = function(orderDetail) {
                var htmlComment = ''
                htmlComment += '<div class="product-detail-item">' +
                    '<div class="product-info fl">\n' +
                    ' <div><a  class="to_product_detail" href="../productDetail/productDetail.html?uuid=' + orderDetail.productUuid + '">' +
                    '<img class="product_img" src="' + orderDetail.specUuid + '" alt="产品图片"></a></div>\n' +
                    '<p class="product_title">' + orderDetail.productName + '</p>\n' +
                    '<p class="product_param"></p>\n' +
                    '<p class="product_price"></p>\n' +
                    '</div>'

                htmlComment +=
                    '<div class="comment_form">\n' +
                    '<div class="comment_star">\n' +
                    '<div class="j-start zqstar clearfloat">\n' +
                    '<span class="form_label"><i class="red">*</i> 描述相符:</span>\n' +
                    '<ul class="stars stars_Product">\n' +
                    '<li class=""><a href="javascript:;">1</a></li>\n' +
                    '<li class=""><a href="javascript:;">2</a></li>\n' +
                    '<li class=""><a href="javascript:;">3</a></li>\n' +
                    '<li class=""><a href="javascript:;">4</a></li>\n' +
                    '<li class=""><a href="javascript:;">5</a></li>\n' +
                    '</ul>\n' +
                    '<span class="yellow J-product"></span>' +
                    '</div>\n' +
                    '<div class="j-start zqstar clearfloat">\n' +
                    '<span class="form_label">卖家服务:</span>\n' +
                    '<ul class="stars stars_CustomerService">\n' +
                    '<li class=""><a href="javascript:;">1</a></li>\n' +
                    '<li class=""><a href="javascript:;">2</a></li>\n' +
                    '<li class=""><a href="javascript:;">3</a></li>\n' +
                    '<li class=""><a href="javascript:;">4</a></li>\n' +
                    '<li class=""><a href="javascript:;">5</a></li>\n' +
                    '</ul>\n' +
                    '<span class="yellow J-customer"></span>' +
                    '</div>\n' +
                    '<div class="j-start zqstar clearfloat">\n' +
                    '<span class="form_label">发货速度:</span>\n' +
                    '<ul class="stars stars_TransportService">\n' +
                    '<li class=""><a href="javascript:;">1</a></li>\n' +
                    '<li class=""><a href="javascript:;">2</a></li>\n' +
                    '<li class=""><a href="javascript:;">3</a></li>\n' +
                    '<li class=""><a href="javascript:;">4</a></li>\n' +
                    '<li class=""><a href="javascript:;">5</a></li>\n' +
                    '</ul>\n' +
                    '<span class="yellow J-transport"></span>' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div id="commented_content" class="form_item commented_content"></div>\n' +
                    '<form method="post" enctype="multipart/form-data">\n' +
                    '<div id="comment_form" class="comment_form_item">\n' +
                    '<div>\n' +
                    '<span class="form_label j-comment-txt-one">评价商品:</span>\n' +
                    '<textarea name="" class="commit_coment" placeholder="开始对我们的产品评价吧，最多可以上传5张图"></textarea>\n' +
                    '</div>\n' +
                    '<div class="form_item">\n' +
                    '<div class="form_item_content">\n' +
                    '<span class="form_label j-comment-txt-two">晒图:</span>\n' +
                    '<a href="javascript:;" class="file">\n' +
                    '<input type="file" name="file" accept="image/png,image/jpeg,image/jpg" fileElementId="upload1" class="uploadImg upbtn" data-uuid="' + orderDetail.uuid + '">\n' +
                    '<img src="" class="uploadimgShow" class="upload1_img0">\n' +
                    '<font class="font-config">+</font>\n' +
                    '</a>\n' +
                    '</div>\n' +
                    '<dl class="imgList imgList-id">\n' +
                    '</dl>\n' +
                    '</div>\n' +
                    '<dl>\n' +
                    '<dd>\n' +
                    '</dl>\n' +
                    '</div>\n' +
                    '</form>\n' +
                    '</div>' +
                    '</div>'
                return htmlComment
            }
            for (var k = 0; k < data.detailList.length; k++) {
                var self = this;
                var orderDetail = data.detailList[k];
                self.orderDetailUuid = orderDetail.uuid;
                var htmlContent = htmlComment(orderDetail)
                $(".comment-btn-submit").before(htmlContent)
                if (orderDetail.spec) {
                    var specObj = eval("(" + orderDetail.spec + ")");
                    var html = "";
                    for (var i = 0; i < specObj.length; i++) {
                        html += "<span>" + specObj[i].name + "：<span>" + specObj[i].value + "</span></span>";
                    }
                    $('.product_param').eq(k).append(html);
                } else {
                    $('.product_param').eq(k).remove();
                }
                $('.product_price').eq(k).text('￥' + orderDetail.payMoney);
                if (orderDetail.shopCommentModel) { //如果已经评价，显示星形
                    self.flag = true;
                    $('.commented_content').eq(k).append('<span class="form_label fl">已评价：</span><span class="form_label_content">' + orderDetail.shopCommentModel.comments) + '</span>';
                    if (orderDetail.shopCommentModel.showImgList.length) {
                        var html = '<div class="form_item"><span class="form_label fl">评价图片：</span>';
                        html += '<dl class="imgList fl">';
                        for (var i = 0; i < orderDetail.shopCommentModel.showImgList.length; i++) {
                            html += '<dd> <a target="_blank" href='+orderDetail.shopCommentModel.showImgList[i].imgUrl+'><img src=' + orderDetail.shopCommentModel.showImgList[i].imgUrl + ' alt=""></a></dd>'
                        }
                        html += '</dl>';
                        $('.commented_content').eq(k).append(html);
                    }
                    $(".j-comment-txt-one").text("追加评价");
                    $(".j-comment-txt-two").html("追加晒图");
                    $(".j-comment-txt-btn").html("追加评价");
                }
                if (orderDetail.shopCommentModel) {
                    // $('#stars_Product li:lt(' + orderDetail.shopCommentModel.productScore + ')').addClass('on');
                    $('.stars_Product').eq(k).find('li:lt(' + orderDetail.shopCommentModel.productScore + ')').addClass('on');
                    $('.stars_CustomerService').eq(k).find('li:lt(' + orderDetail.shopCommentModel.customerServiceScore + ')').addClass('on');
                    $('.stars_TransportService').eq(k).find('li:lt(' + orderDetail.shopCommentModel.transportServiceScore + ')').addClass('on');
                    // $('#stars_CustomerService li:lt(' + orderDetail.shopCommentModel.customerServiceScore + ')').addClass('on');
                    // $('#stars_TransportService li:lt(' + orderDetail.shopCommentModel.transportServiceScore + ')').addClass('on');
                }
                if (orderDetail.shopCommentModel && orderDetail.shopCommentModel.afterComment) { //从是否已经追评来判断是否是查看评价
                    self.viewFlag = true;
                    $('.comment_form_item').remove();
                    var str = '<div class="form_item"><span class="form_label fl">追评:</span><span class="form_label_content">' + orderDetail.shopCommentModel.afterShopComment.comments + '</span>';
                    if (orderDetail.shopCommentModel.afterShopComment.showImgList.length > 0) {
                        str += '<div class="form_item"><span class="form_label fl">追评图片:</span>';
                        str += '<dl class="imgList fl">';
                        for (var i = 0; i < orderDetail.shopCommentModel.afterShopComment.showImgList.length; i++) {
                            str += '<dd><img src=' + orderDetail.shopCommentModel.afterShopComment.showImgList[i].imgUrl + ' alt=""></dd>'
                        }
                        str += '</dl>';
                    }
                    $('.comment_form').eq(k).append(str);
                    $('#save_appraise').remove();
                }
                json[k] = new Object()
                json[k].orderDetailUuid = orderDetail.uuid
            }
        },
        initUpload: function(dom, imgdom, detailUuid) {
            var that = this;
            var self = $(dom);
            var imageNum = self.closest('.form_item').children('.imgList.imgList-id').children('dd').length
            var id = self.attr("fileElementId");
            var form = self.parents('form');
            var imgs = "";
            if (imageNum < 5) {
                form.ajaxSubmit({
                    url: '/rest/usercenter/batchfileupload/batch/upload?rand' + Math.random(),
                    type: 'post',
                    //dataType:'json',
                    //contentType: "text/html; charset=utf-8",
                    success: function(res) {
                        if (typeof res === "string") {
                            res = JSON.parse(res)
                        }
                        if (res.code == 0) {
                            if (res.data) {
                                UPLOADLIST.put(res.data.imgName, { key: res.data.imgName, value: res.data.fileUrl });
                                self.parents('.form_item').find('.imgList-id').append("<dd key='" + res.data.imgName + "' name='" + res.data.imgName + "' path='" + res.data.fileUrl + "'><span class='del_img'>×</span><img src='" + res.data.fileUrl + "'></dd>");
                            }
                        } else {
                            var errcode = {
                                '-1': '文件大小超限',
                                '-2': '非法的文件格式',
                                '-3': '上传文件为空',
                            };
                            Msg.Alert("", "上传失败:" + errcode[res.code], function() {})
                            form[0].reset()
                        }
                    }
                })
            } else {
                Msg.Alert("", "最多可上传5张图片", function() {});
            }
        },
        deletImg: function(obj) {
            var key = $(obj).parent().attr('key');
            $(obj).parent().remove();
            UPLOADLIST.removeByKey(key)
            $('.uploadImg').val('')
        },
        saveAppraise: function() {
            var self = this;
            var fail = false;
            for (var i = 0; i < json.length; i++) {
                var imgString = ''
                var imgArr = $('.imgList-id').eq(i).find('dd');
                for (var j = 0; j < imgArr.length; j++) {
                    imgString += $(imgArr[j]).attr('key') + ',' + $(imgArr[j]).attr('path') + ';'
                }
                if (imgString.length) {
                    imgString = imgString.substring(0, imgString.length - 1)
                }
                json[i].orderId = this.uuid
                json[i].productScore = $('.stars_Product').eq(i).find('li.on').length;
                json[i].customerServiceScore = $('.stars_CustomerService').eq(i).find('li.on').length
                json[i].transportServiceScore = $('.stars_TransportService').eq(i).find('li.on').length
                json[i].content = filterXSS($(".commit_coment").eq(i).val())
                json[i].imgString = imgString
                json[i].appTags = "";
                json[i].terminalType = '01';
                if (!self.flag && (json[i].productScore == "" || json[i].customerServiceScore == "" || json[i].transportServiceScore == "")) {
                    fail = true;
                    Msg.Alert("", "产品评分不能为空！", function() {});
                    return;
                }
                if (json[i].content.length <= 0) {
                    fail = true;
                    Msg.Alert("", "请填写评价内容！", function() {});
                    return;
                }
                if (json[i].content.length > 150) {
                    fail = true;
                    Msg.Alert("", "请填写150字以内的评价内容！", function() {});
                    return;
                }
                var param = {};
                if (!fail) {
                    var url = '';
                    if (self.flag) { //如果是追评，则删除评星参数
                        url = '/usercenter/productappraise/saveAfterAppraiseKuyu';
                        delete json[i].productScore;
                        delete json[i].customerServiceScore;
                        delete json[i].transportServiceScore;
                        param.data = JSON.stringify(json[i]);
                    } else {
                        url = "/usercenter/productappraise/saveAppraiseKuyu";
                        var arr = [];
                        arr.push(json[i])
                        param.data = JSON.stringify(arr)
                    }
                    $http.post({
                        url: url,
                        data: param,
                        success: function(res) {
                            if (res.code == "403" || res.code == "-6") {
                                window.location.href = "{{login}}"
                            }
                            if (res.code == 0) {
                                Msg.Alert("", "评价成功！", function() {
                                    window.location.reload();
                                    $('.commit_coment').val('')
                                });
                            } else {
                                Msg.Alert("", "评价失败,您可能已评价或稍后再试！", function() {
                                    //window.location.href = "productAppraise.html"
                                });
                            }
                        }
                    })
                }
            }

            // json.orderDetailUuid = this.orderDetailUuid;
            // json.productScore = $("#stars_Product li.on").length;
            // json.customerServiceScore = $("#stars_CustomerService li.on").length;
            // json.transportServiceScore = $("#stars_TransportService li.on").length;
            // json.content = filterXSS($("#commit_coment").val());
            // json.imgString = imgString;
        },
        initStarEvent: function() {
            $("#mian_right").on("mouseover", ".j-start li", function(event) {
                var index = $(this).index();
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on');
                $parent.find("li:lt(" + (index + 1) + ")").addClass('on');
            });

            //鼠标离开后恢复上次评分
            $("#mian_right").on("mouseout", ".j-start li", function() {
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on');
                $parent.find("li.isClick").addClass('on');
            });

            //点击后进行评分处理
            $("#mian_right").on("click", ".j-start li", function() {
                var $parent = $(this).parent();
                $parent.find("li").removeClass('on isClick');
                var index = $(this).addClass('on isClick').index();
                $parent.find("li:lt(" + (index + 1) + ")").addClass('on isClick');
                if ($parent.hasClass('stars_Product')) {
                    $('.J-product').html($('.stars_Product').find('li.on').length + '分');
                }
                if ($parent.hasClass('stars_CustomerService')) {
                    $('.J-customer').html($('.stars_CustomerService').find('li.on').length + '分');
                }
                if ($parent.hasClass('stars_TransportService')) {
                    $('.J-transport').html($('.stars_TransportService').find('li.on').length + '分');
                }
            });
        },
        addEvent: function() {
            var that = this;
            //删除图片
            $(document).on("click", ".del_img", function(e) {
                e.preventDefault();
                var detailUuid = $(this).parent().parent().attr("detailUuid");
                that.deletImg(this);
            })

            //提交评价按钮
            $('#save_appraise').click(function() {
                that.saveAppraise();
            })
        }
    };
    thisPage.init();


    //评分
    /* $(function() {
         //var $aLi = $(".j-start li");
         $("#mian_right").on("mouseover",".j-start li", function(event) {
             var index = $(this).index();
             var $parent = $(this).parent();
             $parent.find("li").removeClass('on');
             $parent.find("li:lt(" + (index + 1) + ")").addClass('on');
         });

         //鼠标离开后恢复上次评分
         $("#mian_right").on("mouseout",".j-start li", function() {
             var $parent = $(this).parent();
             $parent.find("li").removeClass('on');
             $parent.find("li.isClick").addClass('on');
         });

         //点击后进行评分处理
         $("#mian_right").on("click",".j-start li", function() {
             var $parent = $(this).parent();
             $parent.find("li").removeClass('on isClick');
             var index = $(this).addClass('on isClick').index();
             $parent.find("li:lt(" + (index + 1) + ")").addClass('on isClick');
         });
     });*/
})
