require(['KUYU.Service', 'KUYU.Binder', 'KUYU.plugins.slide', 'KUYU.Store', 'KUYU.plugins.alert' ], function() {
    var $http = KUYU.Service,
        $scope = KUYU.RootScope,
        $Store = KUYU.Store,
        $init = KUYU.Init,
        $binder = KUYU.Binder;
        
    var submit=$("#submit");
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
            main.sub();
            main.banner();

            var vd=$(".vd");
            $.each(vd, function(i ,o ) {
                $(o).on("click", function () {
                    var url = $(this).attr("data-v");
                    var t = $(this).attr("data-t");
                    var v = '<video autoplay="autoplay" width="640px;" height="360px;" controls="controls" ><source src='+url+' type="video/mp4" /></video>';
                    Msg.Alert(t, v, function (e) {
                        if($(v)[0].paused) {
                            $(v)[0].pause();
                        }
                    });
                    $("#mb_btn_ok").val('×');  
                
                })
            });

            main.news();
            main.reduceTime();
        },
        reduceTime: function () {
            var timer = null;
            
            function d2() { 
                var endTime = new Date('2018/3/6 14:30').getTime(),
                t = endTime - new Date().getTime(),
                seconds = Math.floor((t / 1000) % 60),
                minutes = Math.floor((t / 1000 / 60) % 60),
                hours = Math.floor((t / (1000 * 60 * 60)) % 24),
                days = Math.floor(t / (1000 * 60 * 60 * 24));
                return {
                    'days': days,
                    'hours': hours,
                    'minutes': minutes,
                    'seconds': seconds,
                    't':t
                }
             };
            var dom = $("#reduces");
            var d1 = d2();
            if(d1.hours <=0 && d1.minutes <= 0 && d1.seconds<=0) {
                $(".reduceTime").remove();
            };

            timer = setInterval(function () {
                var d = d2();
                if(d.hours <=0 && d.minutes <= 0 && d.seconds<=0) {
                    clearInterval(timer);
                    $(".reduceTime").remove();
                };
                dom.html('<i>'+ d.hours +'</i>小时<i>'+ d.minutes+ '</i>分<i>'+ d.seconds +'</i>秒');
            },1000)
        },
        banner: function () {
            $("#chanBanner").Slide({
                eles: $(".banner-slide"),
                dots: $(".banner-dots"),
                slideshow: true,
                stop:true
            });
        },
        sub: function () {
           $scope.submit = function (e) {
                var txt= $.trim($("#txt").val());
                if( $Store.get('istaff_token')) {
                    var name = $("#onlyName").text();
                    if(txt) {
                        txt = escapeHtml(txt);
                        if(txt.length >200) {
                           alert("输入字数太多了，请少于200");
                            return false;
                        }else{
                            $http.post({
                                url:'/activity/comments/save',
                                data:{
                                    titleName: '',
                                    contents: txt,
                                    activityName: "live"
                                },
                                success: function (data) {
                                    if(data.code == 0) {
                                        $.trim($("#txt").val(''))
                                        main.renderList();
                                    }
    
                                }
                            });
                        }
                        
                    }
                }else{
                    var path = encodeURIComponent(location.href);
                    window.location.href="{{login}}?from="+path; 
                }
           }
        },
        renderList: function() {
            var ul = $(".comment-list ul"), li = '';
            $http.post({
                url:'/activity/comments/getList',
                data:{
                    activityName: "live"
                },
                success: function (data) {
                    if(data.code == 0) {
                        var list = data.data;
                        $.each(list, function(i, o) {
                            var m = o.opeTime.replace(/\-/g, '/');
                            var t = (Date.now() - new Date(m).getTime())/60000;
                           
                            t = t < 1 ? '刚刚' :  (t>60 ? Math.floor(t/60)+'小时前' : Math.floor(t)+'分钟前') ;
                            li+= '<li><p class="t"><span>'+o.operName+'</span><i>'+t+'</i></p><p>'+o.contents+'</p></li>'
                        })
                        ul.html(li);
                    }

                }
            });
        },
        news: function() {
            $.ajax({
                url:'/group/news/findJsonData?type=4&pageNumber=1&listAccount=8',
                type:'post',
                success: function (res) {
                   if(res.code == 200 ) {
                        var data = res.data,li='';

                        $.each(data.records, function (i, o) {
                            var href = '/group/news/newsDetails?id='+o.id+'&type=4'
                            li+='<li class="fans-item">'+
                                '<a href='+href+' target="_blank"><img width="296" height="226" class="hot-img" src='+o.pic+' alt='+o.alt+'></a>'+
                                '<div class="fans-box">'+
                                    '<div class="fans-title">'+
                                        '<span class="fans-news">新闻</span>'+o.title+''+
                                    '</div>'+
                                    '<div class="fans-describe">'+o.description.substring(0, 40)+'</div>'+
                                    '<a href='+href+' class="fans-details" target="_blank">查看详情 &gt;&gt; </a>'+
                                '</div>'+
                            '</li>';
                        })
                        $("#news").html(li);
                   }
                }
            })
        }
    };


    $init.Ready( function () {
        $binder.init();
        main.init();
        main.renderList();
        setInterval(function() {
            main.renderList();
        }, 10000);

        
    })
});
