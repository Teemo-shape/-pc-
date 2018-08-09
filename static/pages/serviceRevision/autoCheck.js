require([ 'KUYU.plugins.alert','KUYU.Store','KUYU.HeaderTwo','KUYU.Service', 'KUYU.Binder','KUYU.navHeader',],function(){
    var Store = KUYU.Store,
        $http = KUYU.Service,
        $init = KUYU.Init,
        navHeader = KUYU.navHeader,
        $param = KUYU.Init.getParam(),
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $scope = KUYU.RootScope;
         $header.menuHover();
    $header.topSearch();
    var map = new Map();
    var keys = new Map();
    var flag = [];
    var gb = [];
    var globalUUId = $param.uuid ? $param.uuid : '';
    map.set('keys', keys);
    var api = {
        params:{
            pageNo:1,
            pageSize:10,
            type:2,
            categoryUuid:globalUUId
        },
        initList: '/selfcheck/serviceqa/getIndexData',
        condition: '/selfcheck/serviceqa/getByCondition',
        getList:'/selfcheck/serviceqa/list',
        getchild: '/selfcheck/serviceqa/getChildren',
        getParent:'/selfcheck/serviceqa/getParent'
    }
    
    var HTTP = {
        getProduct: function (cb) {
            $http.post({
                url: api.initList,
                data: api.params,
                success: function (res) {
                    if(res.code == 0) {
                        if($.isFunction(cb)) cb(res.data); 
                    }
                }
            })
        },
        getCondition: function (param, cb) {
            $http.post({
                url: api.condition,
                data: (param ? param : api.params),
                success: function (res) {
                    if(res.code == 0) {
                        if($.isFunction(cb)) cb(res.data); 
                    }
                }
            })
        },
        getList: function (param, cb) {
            $http.post({
                url: api.getList,
                data:param,
                success: function (res) {
                    if(res.code ==0) {
                        if($.isFunction(cb)) cb(res.data);
                    }
                }
            })
        },
        getChild: function (param, cb) {
            $http.post({
                url: api.getchild,
                data:param,
                success: function (res) {
                    if(res.code ==0) {
                        if($.isFunction(cb)) cb(res.data);
                    }
                }
            })
        },
        getParent: function (param, cb) {
            $http.post({
                url: api.getParent,
                data:param,
                success: function (res) {
                    if(res.code ==0) {
                        if($.isFunction(cb)) cb(res.data);
                    }
                }
            })
        }
    };

    var mainFun = {
        getParentNode: function (id){
            HTTP.getParent({uuid:id}, function (res) {
            })
        },
        getChildNode: function (id) {
            var AC_con_content = $(".AC_con_content");
            var AC_result = $(".AC_result");
            var values = map.get('keys');
            if(!values.get(id)) {
                HTTP.getChild({uuid:id}, function (res) {
                    var dom = '',result= [];
                    if(!res.length) {
                        result.push({title:'未找到相关的答案.'})
                    };
                  
                    
                    $.each(res, function (i, o) {
                        var ol = '';
                        if(o.children) {
                            $.each(o.children, function (i, o) {
                                ol+= '<li class="se_floor" data-id='+o.uuid+' data-categoryUuid='+o.categoryUuid+' data-parentUuid='+o.parentUuid+'><div class="video-list"><em class="sortNum">'+(i+1)+'、</em><a class="title" href="javascript:;"><i class="arrow-right"></i>'+o.title+'</a>'+(o.videoUrl ? '<span _t='+o.title+' class="playvideo" video='+o.videoUrl+' onclick="KUYU.$scope.open(this)">查看视频教程 <i class="vido-icon"></i></span>': '' )+'</div></li>'
                            });
                        }
                        if(o.type==3) { //问题
                            dom+='<div class="li first_floor  child_into '+id+'" data-id='+o.uuid+' data-categoryuuid='+o.categoryuuid+' data-parentuuid='+o.parentUuid+'><div class="video-list"><a class="title" href="javascript:;"><i class="arrow-right"></i>'+o.title+'</a><span class="v-edit" style="display:none;">修改</span>'+(o.videoUrl ? '<span _t='+o.title+' class="playvideo" video='+o.videoUrl+' onclick="KUYU.$scope.open(this)">查看视频教程 <i class="vido-icon"></i></span>': '' )+'</div><ol class="ulchild '+id+'">'+ol+'</ol></div>';
                        }
                        if(o.type ==5) {
                           result.push(o)
                        }
                    });
                    if($("."+id).length<2) {
                        AC_con_content.append(dom);
                    }

                    map.set('result', result);
                    keys.set(id, id);
                    map.set('keys', keys);

                  
                    var end = map.get('result');
                    if(end.length) {
                        mainFun.getResult(end)
                    }
                    var lis = $("."+id).children("li");
                    $.each(lis, function (i, o) {
                        var uuid = $(this).attr("data-id");
                        $(this).on('click','a',function (e) {
                            mainFun.getChildNode(uuid);
                            $(this).parents('li').siblings('li').hide();
                            $(".v-edit").hide()
                            $(".v-edit").siblings('span').css({
                                'margin-left':'40px',
                                "border-left": "none",
                                "padding-left": "0",
                            });
                            if(AC_result.css("display") != 'block' ) {
                                var vedit =  $(this).parents(".ulchild").prev('.video-list').find('.v-edit');
                                vedit.show();
                                vedit.siblings('span').css({
                                    "border-left": "1px solid #e3e3e3",
                                    "padding-left": "10px",
                                    "margin-left": "0px"
                                })
                            }
                        });
                    });

                    $(".v-edit").on("click", function (e) {
                        $(this).hide();
                        $(this).siblings('span').css({
                            'margin-left':'40px',
                            "border-left": "none",
                            "padding-left": "0",
                        });
                        var parent = $(this).parents('.first_floor'), lis =  parent.children("ol").children("li");
                        var xid = parent.attr("data-parentUuid");
                        lis.show();
                        var vedit =  $(this).parents(".first_floor").prev('.first_floor').children(".video-list").find('.v-edit');
                        vedit.show();
                        vedit.siblings('span').css({
                            "border-left": "1px solid #e3e3e3",
                            "padding-left": "10px",
                            "margin-left": "0px"
                        })
                        
                        parent.next().remove()
                        $.each(lis, function (i, o) {
                            var _id = $(o).attr("data-id");
                            keys.delete(_id);
                        })

                    })
                })
            }   
        },
        getResult: function (res) {
            
            var ACresult= $(".AC_result"),kfff=$("#kfff"), playvideo = $(".playvideo"),
                rsvd = $("#rsvd");
            var p = '';
            ACresult.show();
            kfff.show();
            playvideo.hide();
            
            p +='<p>'+res[0].title+'</p>';
            if(!res[0].isCommit) {
                $("#isCommit").hide();
            }else{
                $("#isCommit").show();            
            }
            if(!res[0].isRecheck) {
                $("#recheck").hide();
            }else{
                $("#recheck").show();            
            }
          
            if(res[0].children && res[0].children.length) {
                $.each(res[0].children, function (i, o) {
                    p+='<p>'+o.title+'</p>';
                });
            }
            ACresult.find(".AC_child_rest").html(p);
            if(res[0].videoUrl) {
                rsvd.show();
            }else{
                rsvd.hide();
            }
            $("#resultVideo").attr("video",res[0].videoUrl);
            $(".v-edit").hide()
            $(".v-edit").siblings('span').css({
                'margin-left':'40px',
                "border-left": "none",
                "padding-left": "0",
            });
            map.delete('result');

        },
        atarchFun: function(m, AC_con_content, index, dom, bk) {
            var d= $(m.prop("outerHTML")),AC_result = $(".AC_result");
            AC_con_content.html(d);
            AC_con_content.addClass("second_step")

            var self =$(dom).eq(index)
            var uuid = self.attr("data-id");
            $.each(d, function (i, o) {
                if($(this).hasClass('se_floor')) {
                    $(this).addClass('first_floor first_into');
                    $(this).removeClass('se_floor');
                }
            })
            HTTP.getCondition({parentUuid:uuid}, function (res) {
                var childhtml = '';
                $.each(res, function (i, o) {
                    childhtml+= '<li class="se_floor" data-id='+o.uuid+' data-categoryUuid='+o.categoryUuid+' data-parentUuid='+o.parentUuid+'><div class="video-list"><em class="sortNum">'+(i+1)+'、</em><a class="title" href="javascript:;"><i class="arrow-right"></i>'+o.title+'</a>'+(o.videoUrl ? '<span _t='+o.title+' class="playvideo" video='+o.videoUrl+' onclick="KUYU.$scope.open(this)">查看视频教程 <i class="vido-icon"></i></span>': '' )+'</div></li>'
                });
                if(self.find('.ulchild').length < 1) {
                    self.append('<ol class="ulchild '+uuid+'">'+childhtml+'</ol>');
                }

                var lis = $("."+uuid).children("li");
                $.each(lis, function (i, o) {
                    var uuid = $(this).attr("data-id");
                    $(this).on('click', 'a', function (e) {
                        mainFun.getChildNode(uuid);
                        $(this).parents('li').siblings('li').hide();
                        if(AC_result.css("display") != 'block' ) {
                            var vedit = $(this).parents(".ulchild").prev('.video-list').find('.v-edit');
                            vedit.show();
                            vedit.siblings('span').css({
                                "border-left": "1px solid #e3e3e3",
                                "padding-left": "10px",
                                "margin-left": "0px"
                            })
                        }
                    });
                })
            })
        },
        initList: function(recheck) {
            var rdom = $("#recheck");
            
            HTTP.getProduct(function(res) {
                var tagList = res.tagList ? res.tagList : [];
                var categoryList = res.categoryList ? res.categoryList : [];
                var questionPage = res.questionPage ? res.questionPage.recordList:[];
               
                var li='',li2 = '', li3= '',ps='', ACProduct= $(".AC_product"),AC_con_pannel =$(".AC_con_pannel"),AC_con_content=$(".AC_con_content"),AC_contents=$(".AC_contents");
                var defalutShow = {};
                globalUUId =  globalUUId ? globalUUId : categoryList[0].uuid;
                //产品类型
                $.each(categoryList, function (i, o) {
                    li+= '<li class='+(o.uuid==globalUUId ? 'active':  '')+' ><a href="/pages/serviceRevision/autoCheck.html?uuid='+o.uuid+'" data-id='+o.uuid+' data-type='+o.type+' data-categoryUuid='+o.categoryUuid+'><img src='+o.imgUrl+'  /><span title='+o.title+'>'+o.title+'</span></a></li>'
                });
                
                ACProduct.html('<ul>'+li+'</ul>');
                
                //问题类型
                if(!tagList.length) {
                    li2 = '<li>没数据</li>'
                }
                $.each(tagList, function (i, o) {
                    li2+= '<li data-id='+o.uuid+' class='+(i ==0 ? 'active': '')+' data-categoryUuid='+o.categoryUuid+' data-parentUuid='+o.parentUuid+'>'+o.title+'</li>';
                });
                AC_con_pannel.html('<ul>'+li2+'</ul>');
                
                //默认TAB
                if(tagList.length) {
                    if(recheck) {
                        Tab(recheck);
                        rdom.data('id', recheck)
                    }else{
                        Tab(tagList[0].uuid);
                        rdom.data('id', tagList[0].uuid)
                    }
                   
                }
               
            });

            function Tab(defaultId) {
                var list= $(".AC_con_pannel ul li"),AC= $(".AC_contents");
                var page = $("<div id='page' class='page' style='display:none;'></div>");
                
                list.removeClass("active");
                $.each(list, function (i, o) {
                    if($(this).attr("data-id") == defaultId) {
                        $(this).addClass("active");
                    }
                   $(this).on('click', function (e) {
                     list.removeClass("active");
                      $(this).addClass('active');
                      $(".AC_result").hide();
                      $("#kfff").hide();
                      $(".AC_child_rest").empty();
                      $(".AC_con_content").removeClass("second_step")  
                      map.delete('result');
                      keys.clear()
                      var id = $(this).attr("data-id");
                      rdom.data('id', id)
                      
                      $("#page").remove();
                      AC.append(page);
                      
                      setTimeout(function () {
                        mainFun.renderPage(id, $('#page'));
                      },100)

                   })
                });

                AC.append(page)
                setTimeout(function () {
                    mainFun.renderPage(defaultId, $("#page"));
                },100)
                
            };
        },
        tab: function () {

        },
        renderPage: function(id, dom) {
            dom.Page({
                skin:false,
                url:'/rest'+api.getList,
                start:1,
                pageSize:10,
                countPages:999,
                prev:"<",
                next:">",
                param:{
                    dataTotal:'totalCount',
                    size: 'pageNo',
                    page: 'pageSize',
                    keys:{
                        parentUuid: id
                    }
                },
                cb:function(data, curIndex) {
                    var questionPage = data.recordList ? data.recordList : data.data.recordList, li3='',AC_con_content=$(".AC_con_content");
                    if(questionPage.length) {
                        dom.show();
                        $.each(questionPage, function (i, o) {
                            li3+= '<div class="li first_floor "  data-id='+o.uuid+' data-categoryUuid='+o.categoryUuid+' data-parentUuid='+o.parentUuid+'><div class="video-list"><a class="title" href="javascript:;"><i class="arrow-right"></i>'+o.title+'</a><span class="v-edit" style="display:none;">修改</span>'+(o.videoUrl ? '<span _t='+o.title+' video='+o.videoUrl+' class="playvideo" onclick="KUYU.$scope.open(this)">查看视频教程 <i class="vido-icon"></i></span>': '' )+'</div></div>'
                        });
                    
                        AC_con_content.html(li3);
                      
                        var first_floors = $(".first_floor");
                        $.each(first_floors, function(i, o) {
                            var self = $(this);
                            self.one('click',".title",function (e) {
                                self.addClass("first_into");
                                mainFun.atarchFun(self, AC_con_content, 0, '.first_floor');
                                $("#page").hide();
                            })
                        })
                    }else{
                        AC_con_content.html('<div style="padding:10px; text-align:center;">没数据</div>');
                    }
                   
                }
            }) 
        }
    }
    
    $init.Ready(function () {
        KUYU.$scope = {};
        KUYU.$scope.open = function (url) {
            var video = url.getAttribute("video");
            
            var t = url.getAttribute("_t") ;
            var dom = '<video id="video" src='+video+' controls="controls">浏览器版本不支持,请升级浏览器</video>';
            Msg.Alert(t,dom, function () {
                
            })
            $("#mb_btn_ok").val('×');       
        }
        KUYU.$scope.recheck = function () {
            var recheck = $("#recheck").data("id");
            map.delete('result');
            keys.clear()
            $("#page").remove();
            
            mainFun.initList(recheck);
            $(".AC_con_content").removeClass("second_step")
            $(".AC_result").hide();
            $("#kfff").hide();
            $(".AC_child_rest").empty();
            //$("#page").show();
        }
        mainFun.initList();
        function search(value) {
            value = $.trim(value)
            if(value) {
                window.location.href = '/pages/serviceRevision/autoCheckSearch.html?key='+value+'&uuid='+ globalUUId;
            }
        }
        var autoCheckInput = $("#autoCheckInput"),autoCheckBtn = $("#autoCheckBtn");
        autoCheckInput.on('keydown', function (e) {
            var value= $(this).val();
            if(e.keyCode == 13) {
                search(value)
            }
        });
        autoCheckBtn.on('click', function (e) {
            var value = autoCheckInput.val();
            search(value)
        })
    })
});