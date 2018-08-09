require(['KUYU.Service', 'KUYU.Binder', 'KUYU.plugins.slide', 'KUYU.Store', 'KUYU.plugins.alert'], function() {
    var $http = KUYU.Service,
        $scope = KUYU.RootScope,
        $Store = KUYU.Store,
        $init = KUYU.Init,
        $binder = KUYU.Binder;
        
    function escapeHtml(value) {
        if (typeof value !== 'string') {
            return value
        }
        return value.replace(/[&<>`"'\/]/g, function(result) {
            return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '`': '&#x60;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2f;',
            }[result]
        });
    };

    var main = {
        init: function () {
            // main.postData();
        },
        postData: function() {
            var formData = {
                contents: '',
                activityName: 'P5',
                mobile: '',
                address: '',
                commentImgs: new Array(5)
            }
            var isAttend = false;

            $.ajax({
               url: 'http://10.120.40.40:8082/activity/comments/getJoinState',
               type: 'get',
               dataType: 'json',
               data: {
                    activityName: formData.activityName
               },
               success: function(res){
                    res = { //模拟数据
                        "code": "0",
                        "msg": "success",
                        "data": false
                    }
                    if(res.code == 0){
                        if(res.data){
                            isAttend = true;
                            $('.J_attend').text('已参与活动').addClass('disabled');
                        }else{
                            $('.J_attend').on('click', function(){
                                $('.mask,.act-detail').show();
                                clearInterval(countInterval);
                                countInterval = setInterval(function(){
                                    count--;
                                    $('.J_count').text('('+ count +'s)');
                                    if(count == 0){
                                        $('.J_count').hide();
                                        $('.act-detail .btn-attend').removeClass('disabled');
                                        clearInterval(countInterval);
                                        count = 5;
                                    }
                                },1000);
                            });
                        }
                    }
               },
               error: function(err){
                    console.log(err)
               }
            })

            $('.p5page').on('click', '.eva-pic img', function(){
                var src = $(this).attr('src');
                $('.mask').width($(document).width()).height($(document).height()).html('<div class="preview-box"><img src="'+ src +'" alt="pic" /><span class="J_closepic"></span></div>').show();
            });
            $('.mask').on('click','.J_closepic', function(){
                $('.mask').hide().html('');
            });

            var countInterval = null;
            var count = 5;
            var regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
            $('.btn-detail').on('click', function(){
                $('.mask,.act-detail').show();
                if(isAttend){
                    $('.act-detail .btn-attend').text('已参与活动')
                }else{
                    clearInterval(countInterval);
                    countInterval = setInterval(function(){
                        count--;
                        $('.J_count').text('('+ count +'s)');
                        if(count == 0){
                            $('.J_count').hide();
                            $('.act-detail .btn-attend').removeClass('disabled');
                            clearInterval(countInterval);
                            count = 5;
                        }
                    },1000);
                }
                
            });
            
            $('.p5page').on('click','.btn-closedet,.btn-cancel',function(){
                count = 5;
                $('.J_count').text('(5s)');
                clearInterval(countInterval);
                $('.mask,.attend-wrap,.act-detail').hide();
                $('.J_count').show();
                $('.act-detail .btn-attend').addClass('disabled');
            });

            $('.J_popattend').on('click', function(){
                if(!$(this).hasClass('disabled')){
                    $('.act-detail').hide();
                    $('.attend-wrap').fadeIn();
                }
            })

            $('.attend-wrap').on('blur', 'textarea', function(){
                formData.contents = escapeHtml($(this).val().trim());
            })
            $('.attend-wrap').on('blur', 'input[name="phone"]', function(){
                if(!regMobile.test($(this).val())){
                    $(this).css('border-color','#ff0000');
                    formData.mobile = '';
                }else{
                    $(this).css('border-color','#ccc');
                    formData.mobile = $(this).val();
                }
            })
            $('.attend-wrap').on('blur', 'input[name="address"]', function(){
                formData.address = $(this).val().trim();
            })

            // 图片上传
            KUYU.purUpload = function (dom, imgdom, index) {
               var self = $(dom);
               var form = self.parents('form');
               form.ajaxSubmit({
                   url: 'http://10.120.40.40:8082/fileupload/uploadImage?rand'+Math.random(),
                   type: 'post',
                   dataType:'json',
                 //contentType: "text/html; charset=utf-8",
                   success: function (res) {
                       if(res.code == 0) {
                           $("#"+imgdom).attr("src", res.retData).show().siblings('.spdelicon').show();
                            var state = 1,
                                imgType =0;
                            if(imgdom == 'upload1_img4'){
                                state = 0;
                                imgType = 1;
                            }
                            var oImg = {
                                imgUrl: res.retData,
                                state: state,
                                imgType: imgType
                            }
                            formData.commentImgs.splice(index,1,oImg);
                       }else{
                           // Msg.Alert("","上传失败错误代码:"+res.code, function () { })
                       }
                   }
               });
               // 删除图片
               $('.attend-wrap').on('click', '.spdelicon', function(){
                    var num = $(this).data('num');
                    console.log(num)
                    formData.commentImgs.splice(num, 1, [])
                    $(this).hide();
                    $(this).siblings('.uploadimgShow').hide().attr('src','');
               })

           }

           // 发布
           $('.J_release').on('click', function(){
                if(formData.contents.length < 100){
                    alert('发布文字不少于100个字');
                    return;
                }
                if(!formData.mobile){
                    alert('请正确填写手机号！');
                    return;
                }
                if(!formData.address){
                    alert('请填写邮寄地址！');
                    return;
                }
                var imgCount = 0;
                $.each(formData.commentImgs, function(i,v){
                    if(v) imgCount++;
                });
                if(!formData.commentImgs[4]){
                    alert('请上传发票图！');
                    return;
                }
                if(formData.commentImgs[4] && imgCount<4){
                    alert('评论图片不能少于3张！');
                    return;
                }
                console.log(formData)
                $.ajax({
                    url: 'http://10.120.40.40:8082/activity/comments/save',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        contents: formData.contents,
                        activityName: formData.activityName,
                        mobile: formData.mobile,
                        commentImgs: formData.commentImgs
                    },
                    success: function(res){
                        console.log(res)
                    },
                    error: function(err){
                        console.log(err)
                    }
                })

           })
        },
        getList: function (current, size) {
            $http.post({
                url:'http://10.120.40.40:8082/activity/comments/getList',
                data:{
                    activityName: "p5",
                    isPage: "1",
                    current: current,
                    size: size
                },
                success: function (data) {
                    // 模拟数据
                    data = {
                            "code": "0",
                            "msg": "success",
                            "transId": "b7899edf700b466db3bb8a2e2139db87",
                            "data": {
                                "offset": 0,
                                "limit": 2147483647,
                                "total": 1,
                                "size": 10,
                                "pages": 1,
                                "current": 1,
                                "searchCount": true,
                                "records": [{
                                        "uuid": "1",
                                        "opeTime": "1",
                                        "oper": "1",
                                        "operName": "铁粉小子",
                                        "operImg": 'http://localhost:3006/app/images/p5/avatar.jpg',
                                        "address": null,
                                        "mobile": null,
                                        "delFlag": "0",
                                        "titleName": "1",
                                        "contents": "再好的创意也离不开科技和品质的支持，随着互联网狂热的退潮，产品提质、品牌拔高成为各大电视厂商最紧迫的任务。除了拼画质之外，在人工智能领域的角逐也异常激烈。相对应的是用户的口味也愈发挑剔，对外观的审美，操作的体验性也都有越来越细分化的需求。而作为中国家电行业的代表，TCL在塑造大国品牌的战略中，把抢占技术制高点，为消费者提供最佳性能的产品，当做重中之重的任务，针对高端用户群体推出了X系列原色量子点电视。与此同时，也针对广大白领阶层、年轻群体等主流用户推出了C系列超薄平面和P系列曲面电视，立体丰富的产品线让TCL的新一代电视精品，以及它们蕴含的Q画质引擎、人工智能等相关技术能够惠及更多的用户群体。",
                                        "activityName": "p5eva",
                                        "state": "1",
                                        "floorNum": 1,
                                        "commentImgs": [{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic1.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic2.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic3.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic4.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic5.png',
                                            state: 0,
                                            imgType: 1
                                        }]
                                    },{
                                        "uuid": "1",
                                        "opeTime": "1",
                                        "oper": "1",
                                        "operName": "铁粉小子",
                                        "operImg": 'http://localhost:3006/app/images/p5/avatar.jpg',
                                        "address": null,
                                        "mobile": null,
                                        "delFlag": "0",
                                        "titleName": "1",
                                        "contents": "再好的创意也离不开科技和品质的支持，随着互联网狂热的退潮，产品提质、品牌拔高成为各大电视厂商最紧迫的任务。除了拼画质之外，在人工智能领域的角逐也异常激烈。相对应的是用户的口味也愈发挑剔，对外观的审美，操作的体验性也都有越来越细分化的需求。而作为中国家电行业的代表，TCL在塑造大国品牌的战略中，把抢占技术制高点，为消费者提供最佳性能的产品，当做重中之重的任务，针对高端用户群体推出了X系列原色量子点电视。与此同时，也针对广大白领阶层、年轻群体等主流用户推出了C系列超薄平面和P系列曲面电视，立体丰富的产品线让TCL的新一代电视精品，以及它们蕴含的Q画质引擎、人工智能等相关技术能够惠及更多的用户群体。",
                                        "activityName": "p5eva",
                                        "state": "1",
                                        "floorNum": 1,
                                        "commentImgs": [{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic4.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic2.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic3.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic5.png',
                                            state: 0,
                                            imgType: 1
                                        }]
                                    },{
                                        "uuid": "1",
                                        "opeTime": "1",
                                        "oper": "1",
                                        "operName": "铁粉小子",
                                        "operImg": 'http://localhost:3006/app/images/p5/avatar.jpg',
                                        "address": null,
                                        "mobile": null,
                                        "delFlag": "0",
                                        "titleName": "1",
                                        "contents": "再好的创意也离不开科技和品质的支持，随着互联网狂热的退潮，产品提质、品牌拔高成为各大电视厂商最紧迫的任务。除了拼画质之外，在人工智能领域的角逐也异常激烈。相对应的是用户的口味也愈发挑剔，对外观的审美，操作的体验性也都有越来越细分化的需求。而作为中国家电行业的代表，TCL在塑造大国品牌的战略中，把抢占技术制高点，为消费者提供最佳性能的产品，当做重中之重的任务，针对高端用户群体推出了X系列原色量子点电视。与此同时，也针对广大白领阶层、年轻群体等主流用户推出了C系列超薄平面和P系列曲面电视，立体丰富的产品线让TCL的新一代电视精品，以及它们蕴含的Q画质引擎、人工智能等相关技术能够惠及更多的用户群体。",
                                        "activityName": "p5eva",
                                        "state": "1",
                                        "floorNum": 1,
                                        "commentImgs": [{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic3.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic1.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic2.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic4.png',
                                            state: 1,
                                            imgType: 0
                                        },{
                                            imgUrl: 'http://localhost:3006/app/images/p5/com-pic5.png',
                                            state: 0,
                                            imgType: 1
                                        }]
                                    }
                                ],
                                "offsetCurrent": 0
                            }
                        }
                    // console.log(data)
                    if(data.code == 0) {

                        var list = data.data,
                            listItem = '';

                        // 分页
                        $("#page").paging({
                            pageNo: list.current,
                            totalPage: Math.ceil(list.pages / list.size),
                            totalSize: list.total,
                            callback: function(nextPage) {
                                // console.log(nextPage)
                                $('.currentPage').text(nextPage);
                                main.getList(nextPage, size);
                            }
                        })

                        $.each(list.records, function(i, o) {
                            var imgArr = o.commentImgs,
                                imgList = '';
                            $.each(imgArr, function(k,v) {
                                if(v.state != 0){
                                    imgList += '<img src="'+ v.imgUrl +'" alt="avatar" />'
                                }
                            })
                            listItem += '<li class="clearfix"><div class="left-cont"><img src="'+ o.operImg +'" alt="avatar" /><p>'+ o.operName +'</p></div><div class="right-cont"><p>'+ o.contents +'</p><div class="eva-pic">'+ imgList +'</div><p class="other-info"><span class="floor-count">'+ o.floorNum +'</span>楼<span class="release-time">'+ o.opeTime +'</span></p></div></li>';
                        })
                    }
                    $('.eva-wrap ul').html(listItem)
                }
            });
        }
    };


    $init.Ready( function () {
        /*$binder.init();
        main.init();
        main.renderList();
        setInterval(function() {
            main.renderList();
        }, 10000);*/

        main.getList(1,2);  // 当前页，每页条数
        main.postData();
        
    })

});
