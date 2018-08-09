/*
 * Author:zwj
 * Date: 2016-11-16
 * */
define(['Plugin',  'KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.SlideBarLogin','KUYU.navHeader','KUYU.navFooterLink'],function(){
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        Map = $init.Map(),
        $param = KUYU.Init.getParam(),
        _env = KUYU.Init.getEnv(),
        _sever = KUYU.Init.getService(),
        path = _sever[_env.sever],
        $scope = KUYU.RootScope,
        UUID = $init.createUid(),
        slidBarLogin = KUYU.SlideBarLogin,
        navHeader = KUYU.navHeader,
        navFooterLink = KUYU.navFooterLink;
    $init.Ready(function() {
        $header.menuHover();
    })
    
    $header.topSearch();
    navFooterLink();
    //获取时间
    var createTimestamp = function() { // 取时间撮
		var dt = new Date()
		var y = dt.getFullYear()
		var M = dt.getMonth() + 1
		var d = dt.getDate()
		var h = dt.getHours()
		var m = dt.getMinutes()
		var sec = dt.getSeconds()
		var minsec = dt.getMilliseconds()
		var str = y + ''
		M = M < 10 ? '0' + M : M
		d = d < 10 ? '0' + d : d
		h = h < 10 ? '0' + h : h
		m = m < 10 ? '0' + m : m
		sec = sec < 10 ? '0' + sec : sec
		minsec = minsec < 1000 ? '0' + minsec : minsec
		str +='-'+ M +'-'+ d 
//		str += M + d + h + m + sec + minsec
		return str
	}
    var from = encodeURIComponent(location.href);
    function getCitysByProvince(obj, opp, cb){
        $.ajax({
            url: server+opp.url,
            type: 'GET',
            data: obj,
            success: function(data){
                if (data && data.length>0) {
                    if (opp.index==3) {
                        var html ='<div class="sel-item J-SelAddress"><select class="four-item four-n J-SelProvince" data-index="'+opp.index+'"><option value="">- 请选择 -</option>';
                    } else {
                        var html ='<div class="sel-item J-SelAddress"><select class="four-item J-SelProvince" data-index="'+opp.index+'"><option value="">- 请选择 -</option>';
                    }
                    data.map(function(item, index){
                        if(opp.uuid == item.uuid && !obj.isDefault) {
                            html += '<option selected = "selected" value="'+item.uuid+'">'+item[opp.types]+'</option>'
                        }else{
                            html += '<option value="'+item.uuid+'">'+item[opp.types]+'</option>'
                        }
                    });
                    html +='</select><span class="sel-hint J-SelAddressHint"></span></div>';
                    $('.J-ProvinceBox').append(html);
                    if(cb) cb();
                };
            },
            error: function(){

            }
        });
    }

    //获取地址
    var getAddressObj = {
        storeAddress:{
            province:'',
            city:'',
            region:'',
            street:''
        },
        getAddRess: function (cb) {
            $http.post({
                url: "/usercenter/customeraddress/toCustomerAddressKuyu",
                data: {ranNum : Math.random()},
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = window.location.origin+"/sign"
                    }
                    var html = "";
                    if(res.data && res.data.length) {
                        var result = '';
                        $.each(res.data, function (i, o) {
                            if(o.isDefault == 1) {
                                result = o;
                            }
                        });

                        result ? result : result = res.data[0];
                        
                        $(".J-PhoneVal").val(result.mobile);
                        $(".J-ContactsVal").val(result.consignee);
                        $(".J-Address").val(result.address);
                        getAddressObj.storeAddress = {
                            province: result.province,
                            city:result.city,
                            region:result.region,
                            street:result.street
                        }
                        if(cb) cb();
                    }else{
                        var ProvinceObj = {
                            index:0,
                            types: 'provinceName',
                            url: 'usercenter/region/getAllProvince',
                            uuid: '01',
                         }

                        //  checkedProvince = "01";
                        //  checkedCity = "100";
                        //  checkedRegion = "1000";
                        //  checkStreets = "10000";


                        getCitysByProvince({isDefault:true}, ProvinceObj, function () {
                            getCitysByProvince({
                                provinceUuid: '01',
                                isDefault:true
                            }, {
                                types : 'cityName',
                                url : 'usercenter/region/getCitysByProvinceUuid',
                                index:1,
                                uuid: '100'
                            }, function () {
                                getCitysByProvince({
                                    cityUuid: '100',
                                     isDefault:true
                                }, {
                                    types : 'regionName',
                                    url : 'usercenter/region/getRegionsByCityUuid',
                                    index:2,
                                    uuid: '1000'
                                }, function () {
                                    getCitysByProvince({
                                        regionUuid: '1000',
                                        isDefault:true
                                    }, {
                                        types : 'streetName',
                                        url : 'usercenter/region/getStreetsByRegionUuid',
                                        index:3,
                                        uuid: '10000'
                                    });
                                });
                            });
                        })

        
                    }
                }
            });
        }
    }

    //url处理
    //     var location = window.location.href;
    //     if(location.indexOf("#")<=0){
    //         window.location.href = "#";
    //     }
        //内容清空
        $("input").val("");
        $("textarea").val("");
        var obj = {};
        var server = '/rest/'
     /*************客服頁面**************/
    obj.install = function(pagetype){
        
        $init.Ready(function() {

        var locKey = $Store.get('istaff_token');
        
        if (!window.localStorage.getItem('istaff_token') &&  (pagetype == 'repair' || pagetype =='install')) {
            // function checkSSO (callback) {
            //     var script ="<script src={{sso}}></script>"
            //     $("body").append(script);
            //     cb = function (data){
            //         callback(data)
            //     };
            // }
        
            // if(!locKey) {
            //     checkSSO(function (data) {
            //         if(data.status == -1) {
            //             $init.nextPage("login",{});
            //             $Store.set(Date.now(), '云平台SSO检测失败')
            //         } else {
            //             $init.nextPage("cloudLogin", {msg:data.code})
            //         }
            //     })
            //     return;
            // } else {
            //     $binder.sync({'locKey':true});
            // }
            var script ="<script id='sso' src='{{sso}}'><\/script>";
            $("body").append(script);
    
            var SOK = function (res) {
                if(res.status != -1 && res.code) {
                    var token = $Store.get('istaff_token') ? $Store.get('istaff_token') : null;
                    
                    $.ajax({
                        url: '/rest/ssologin/check',
                        type:'get',
                        headers:{
                            'ihome-token' : token,
                        },
                        data:{code: res.code },
                        success: function (data) {
                            if(data.code == CODEMAP.status.success) {
                                localStorage.setItem('istaff_token', data.token);
                                $header.userInof();
                                $binder.sync({'locKey':true});
                            }else{
                                $init.nextPage("login",'')
                            }
                        }
                    })
                } else {
                    $init.nextPage("login",'')
                }
            }
            /*
            * 如果超时或者tokne不存在就发请求
            */
            cb = function (data){
                SOK(data);
            }
            
        }
    });
        var phonerag  = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

        $(document).on('click', '.J-SerTitle', function(){
            var _this = $(this).parent('.J-SerItem').find('ul');
            if (_this.hasClass('active')) {
                _this.removeClass('active');
                _this.slideUp(180);
            } else {
                _this.addClass('active');
                _this.slideDown(180);
            }
        });

        //日历选择
        // $(document).on('click', '.J-data', function(event) {
        //     event.stopPropagation();
        //     if($('.box_sha').length) {
        //         $("#box_sha").remove();
        //         return false;
        //     }
        //     showTade.init($(this));
        // });

        var time = new Date();
        var year = time.getFullYear()+'-'+(time.getMonth())+'-'+time.getDate()
        //获取到第二天的时间
        var tt = time.setTime(time.getTime()+24*60*60*1000)
        var tt = new Date(tt)
        var tmr = tt.getFullYear()+"-" + (tt.getMonth()<10?("0"+(tt.getMonth()+1)):(tt.getMonth()+1)) + "-" +  (tt.getDate()<10?("0"+tt.getDate()):tt.getDate());
       //判断上门时间
       var getT =  function(){
        if($(".j-val").val() > createTimestamp() ){
	        	$(".J-TimeType").html(
	        	'<option>08:00-10:00</option>'+
	            '<option>10:00-12:00</option>'+
	            '<option>12:00-14:00</option>'+
	            '<option>14:00-16:00</option>'+
	            '<option>16:00-18:00</option>'
	        	)
        }else{
		        if(time.getHours() >= 14){
        			$(".j-val").val(tmr)
		        	$(".J-TimeType").html(
		        	'<option>08:00-10:00</option>'+
		            '<option>10:00-12:00</option>'+
		            '<option>12:00-14:00</option>'+
		            '<option>14:00-16:00</option>'+
		            '<option>16:00-18:00</option>'
		        	)
		        }else{
		        	if(time.getHours() >= 8 && time.getHours() < 10){
		        		$(".j-val").val(createTimestamp())
		        		$(".J-TimeType").html(
			        	'<option disabled>08:00-10:00</option>'+
			            '<option disabled>10:00-12:00</option>'+
			            '<option>12:00-14:00</option>'+
			            '<option>14:00-16:00</option>'+
			            '<option>16:00-18:00</option>'
			        	)
		        	}else if(time.getHours() >= 10 && time.getHours() < 12){
		        		$(".j-val").val(createTimestamp())
		        		$(".J-TimeType").html(
			        	'<option disabled>08:00-10:00</option>'+
			            '<option disabled>10:00-12:00</option>'+
			            '<option disabled>12:00-14:00</option>'+
			            '<option>14:00-16:00</option>'+
			            '<option>16:00-18:00</option>'
			        	)
		        	}else if(time.getHours() >= 12 && time.getHours() < 14){
		        		$(".j-val").val(createTimestamp())
		        		$(".J-TimeType").html(
			        	'<option disabled>08:00-10:00</option>'+
			            '<option disabled>10:00-12:00</option>'+
			            '<option disabled>12:00-14:00</option>'+
			            '<option disabled>14:00-16:00</option>'+
			            '<option>16:00-18:00</option>'
			        	)
		        	}else {
		        		$(".j-val").val(createTimestamp())
		        		$(".J-TimeType").html(
			        	'<option>08:00-10:00</option>'+
			            '<option>10:00-12:00</option>'+
			            '<option>12:00-14:00</option>'+
			            '<option>14:00-16:00</option>'+
			            '<option>16:00-18:00</option>'
			        	)
		        	}
		        }
       		 }
        }
         getT ()
//		 $(document).on('blur', '.j-val', function(e){
//      	 var self = $(this) 
//	        	setTimeout(function(){
//      		getT()
//	            var val = $.trim(self.val());
//	            self.removeClass('border-rad');
//	            $('.J-DataTimeHint').text('');
//	            if (!val || val =='') {
//	                self.addClass('border-rad');
//	                $('.J-DataTimeHint').text("请输入上门时间!");
//	                return false;
//	            }
//	             },300)
//	        })
       
        laydate.render({
            elem: '#ctime',
            min: year,
            max: '2050-1-1',
          })


        // 获取图形验证码
        var Imgcode;
        ImgKey();
        $(document).on('click', '.J-ImgKey', function(){
            ImgKey();
        });
        function ImgKey(){
            Imgcode = Math.random();
            var key = server+'getCustomerRegCode?img-key='+Imgcode;
            $('.J-ImgKey').find('img').attr("src", key);
        }
        // 验证输入的内容是否合法
        $(document).on('blur', '.J-PhoneVal', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-PhoneHint').text("");
            if (!val || val=='') {
                $(this).addClass('border-rad');
                $('.J-PhoneHint').text("请输入电话号码！");
                return false;
            }
            if (!phonerag.test(val)) {
                $('.J-PhoneVal').addClass('border-rad');
                $('.J-PhoneHint').text("请输入正确的手机号码！");
                return false;
            }
        }).on('blur', '.J-ImgVal', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-ImgHint').text("");
            if (!val || val=='') {
                $(this).addClass('border-rad');
                $('.J-ImgHint').text("请输入图片验证码！");
                return false;
            }
        }).on('blur', '.J-PhoneCodeVal', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-PhoneCodeHint').text('');
            if (!val || val =='') {
                $(this).addClass('border-rad');
                $('.J-PhoneCodeHint').text("请输入短信验证码！");
                return false;
            }
        }).on('blur', '.J-Address', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-AddressHint').text('');
            if (!val || val =='') {
                $(this).addClass('border-rad');
                $('.J-AddressHint').text("请输入详细地址！");
                return false;
            }
        }).on('blur', '.J-ContactsVal', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-ContactsHint').text('');
            if (!val || val =='') {
                $(this).addClass('border-rad');
                $('.J-ContactsHint').text("请输入联系人姓名！");
                return false;
            }
        }).on('blur', '.J-ProductSn', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-ProductSnHint').text('');
            if (!val || val =='') {
                $(this).addClass('border-rad');
                $('.J-ProductSnHint').text("请输入产品型号！");
                return false;
            };
        }).on('blur', '.J-Demand', function(){
            var val = $.trim($(this).val());
            $(this).removeClass('border-rad');
            $('.J-DemandHint').text('');
            if (!val || val =='') {
                $(this).addClass('border-rad');
                $('.J-DemandHint').text("请输入需求描述！");
                return false;
            }
        })
       
        
        // .on('blur', '.j-val', function(){
        //     setTimeout(function(){
        //         $('.J-data').find('.box_sha').remove();
        //     }, 150);
        // });


        // 获取手机验证码
        var timer = null, number=59, power = true, phonekey;
        $(document).on('click', '.J-PhoneSubmit', function(){
            if (!power) {
                return false;
            };
            var _this = $(this);
            var obj = {
                "captchakey" : Imgcode,
                "captchadata" : $.trim($('.J-ImgVal').val()),
                "username" :  $.trim($('.J-PhoneVal').val()),
                "type" : 3,
                "img-key" : Math.random()
            }
            if (!obj.username || obj.username=='') {
                $('.J-PhoneVal').addClass('border-rad');
                $('.J-PhoneHint').text("请输入电话号码！");
                return false;
            }
            if (!phonerag.test(obj.username)) {
                $('.J-PhoneVal').addClass('border-rad');
                $('.J-PhoneHint').text("请输入正确的手机号码！");
                return false;
            }
            if (!obj.captchadata || obj.captchadata=="") {
                $('.J-ImgVal').addClass('border-rad');
                $('.J-ImgHint').text("请输入图片验证码！");
                return false;
            }
            power = false;
            $.ajax({
                url: server+'tclcustomerregist/sendMessagetoPhoneOrEmail',
                type: 'POST',
                data: obj,
                success: function(data){
                    if (data.code==0 || data.code==1) {
                        phonekey = obj['img-key'];
                        var timer = setInterval(function(){
                            if (number>0) {
                                _this.text(number+"后重新获取");
                                number--;
                            } else {
                                number = 59;
                                power = true;
                                clearInterval(timer);
                                _this.text("获取验证码");
                            }
                        },1000);
                    } else {
                        power = true;
                        ImgKey();
                        if (data.code==-3) {
                            $('.J-ImgVal').addClass('border-rad');
                            $('.J-ImgHint').text(data.message || data.msg);
                        } else {
                            $('.J-PhoneCodeVal').addClass('border-rad');
                            $('.J-PhoneCodeHint').text(data.message || data.msg);
                        }
                    }
                },
                error: function(){

                }
            });

        });

        // 获取产品分类
        $.ajax({
            url: server+'servicecenter/getProductCategory',
            type: 'POST',
            data: {},
            success:function(data){
                if (data&&data.data&&data.data.length>0) {
                    var o = data.data, html = '';
                    o.forEach(function(value,index){
                        html +='<option value="'+value.uuid+'">'+value.categoryName+'</option>'
                    });
                };
                $('.J-ProductClass').append(html);
            },
            error: function(){

            }
        });
        $(document).on('change', '.J-ProductClass', function(){
            var val = $(this).find('option:selected').text();
            if (!val || val =='' || val=='请选择产品分类') {
                $('.J-ProductClass').addClass('border-rad');
                $('.J-ProductClassHint').text("请选择产品分类");
            } else {
                $('.J-ProductClass').removeClass('border-rad');
                $('.J-ProductClassHint').text("");
                $('.J-ProductSn').val('');
            }
        });

        // 获取产品型号
        var endVal='';
        $(document).on('keyup', '.J-ProductSn', function(){
            var cateName = $('.J-ProductClass').find('option:selected').text();
            var val = $.trim($(this).val());
            if (cateName!='请选择产品分类') {
                var obj = {
                    "productVersion":val,
                    "cateName":cateName
                }
            } else {
                var obj = {
                    "productVersion":val,
                    "cateName": ''
                }
            }
            
            if (endVal==val) {
                return false;
            };
            endVal = val
            if (val && !val=="") {
                $http.post({
                    url: '/servicecenter/queryProductModel',
                    data: obj,
                    success:function(data){
                        $('.J-ProductModel').empty();
                        if (data.code==0) {
                            var html = '';
                            if(data.retData && data.retData.length>0) {
                                var o = data.retData;
                                o.map(function(item, index){
                                    html +='<li class="J-ProductItem">'+ item.name +'</li>';
                                });
                            } else {
                               html +='<li class="">无对应型号</li>'; 
                            }
                            $('.J-ProductModel').append(html).show();
                            var li =  $('.J-ProductModel li');
                           
                            $.each(li, function (i ,o ) {
                                $(this).on('click', function (e) {
                                    if($.trim($(o).text()) != '无对应型号') {
                                        $('.J-ProductSn').val($(o).text());
                                    }
                                    setTimeout(function(){
                                        $('.J-ProductModel').hide().empty();
                                    },120);
                                })
                            })
                        } else {
                            
                        }
                    },
                    error: function(){

                    }   
                })
            } else {
                $('.J-ProductModel').hide().empty();
            };
         })
         $(document).on('click', function(){
            $('.J-ProductModel').hide().empty();
         })

        // 上传图片
        var FaultPicture = 0;
        var video = 0
        var token = $Store.get('istaff_token') ? $Store.get('istaff_token') : null;
        $(document).on('change', '.J-loadImg', function(event){
            var _this = $(this);
            var formdata = new FormData();
            var fileObj = _this.get(0).files;
            console.log(fileObj[0])
            if(fileObj[0].type.indexOf("video")>-1&&fileObj[0].size/1024000 >20){
            	 plugin.Alert("上传视频太大，请重新上传", {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                    $('body').removeAttr('style');
                });
                _this.val('');
                return false
            }else if(fileObj[0].type.indexOf("image")>-1&&fileObj[0].size/1024000 >10){
            	 plugin.Alert("上传图片太大，请重新上传", {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                    $('body').removeAttr('style');
                });
                _this.val('');
                return false
            }
            formdata.append("file", fileObj[0]);
            if (FaultPicture>=3 && fileObj[0].type.indexOf("image")>-1) {
                plugin.Alert("最多只能上传三张图片加一个视频！", {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                    $('body').removeAttr('style');
                });
                _this.val('');
                return false
            }else{
            	if(video>=1 && fileObj[0].type.indexOf("video")>-1){
            		plugin.Alert("最多只能上传三张图片加一个视频！", {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                    $('body').removeAttr('style');
                    });
                    _this.val('');
                	return false
            	}
            }
            $.ajax({
                url: server+'servicecenter/upload', //usercenter/customercomplex/uploadImage
                type: 'POST',
                headers:{
						'ihome-token' : token,
					},
                cache: false,
                contentType: false,
                processData: false,
                data: formdata,
                success:function(data){
                    if (data.code==0 && data.data && data.data.filePath) {
                        if(fileObj[0].type.indexOf("video")>-1){
                        	video++
                        	var html = '<div class="sel-img-item J-LoadImgBox">'+
                                   '<video class="vsource" src="'+data.data.filePath+'"></video>'+
                                   '    <span class="close J-RemoveVid">×</span>'+
                                   '<img class="imgIndex" src="../../app/images/play.png">'+
                                   '</div>';
                    		$('.J-UpLoadImg').append(html); 
                        }
                        if(fileObj[0].type.indexOf("image")>-1){
                        	FaultPicture++;
                        	var html = '<div class="sel-img-item J-LoadImgBox">'+
                                   '<img class="psource" src="'+data.data.filePath+'" />'+
                                   '    <span class="close J-RemoveImg">×</span>'+
                                   '</div>';
                       		 $('.J-UpLoadImg').append(html); 
                        }
                        _this.val('');
                    } else {
                        plugin.Alert(data.msg || data.message, {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                            $('body').removeAttr('style');
                        });
                        _this.val('');  
                    }
                },
            });

        });
        // 删除上传的图片
        $(document).on('click', '.J-RemoveImg', function(){
        	var self = $(this)
        	var url = $(this).parents('.sel-img-item').find('img').attr("src")
        	$.ajax({
                    url: server+'fileupload/delete',
                    type: 'get',
                    headers:{
						'ihome-token' : token,
					},
                    data:{path:url},
                    success: function(data){
                    	if(data.code == 0){
                	   		FaultPicture--;
        					self.parents('.sel-img-item').remove();
        				}else {
                        plugin.Alert(data.msg || data.message, {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                            $('body').removeAttr('style');
                        });
                       }
                    }
                });
            
        });
        //删除视频
        $(document).on('click', '.J-RemoveVid', function(){
        	var self = $(this)
        	var url = $(this).parents('.sel-img-item').find('video').attr("src")
        	$.ajax({
                    url: server+'fileupload/delete',
                    type: 'get',
                    headers:{
						'ihome-token' : token,
					},
                    data:{path:url},
                    success: function(data){
                    	if(data.code == 0){
                	   		video--;
        					self.parents('.sel-img-item').remove();
                    	}else {
                        plugin.Alert(data.msg || data.message, {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                            $('body').removeAttr('style');
                        });
                       }
                    }
                });
        });
		
        // 获取服务菜单
        $.ajax({
            url: server+'servicecenter/getPolicy',
            type: 'POST',
            data: {},
            success: function(data){
                if (data && data.length>0) {
                    EachStandard(data);
                    // 获取内容
                }
                $.ajax({
                    url: server+'servicecenter/getStandard',
                    type: 'POST',
                    data: {},
                    success: function(data){
                        if (data && data.length>0) {
                            EachStandard(data);
                        }
                    },
                    error: function(){

                    }
                });
            },
            error: function(){

            }
        });

        // 获取省市区四级联动
        var ProvinceObj = {
           index:0,
           types: 'provinceName',
           url: 'usercenter/region/getAllProvince',
        }
        $(document).on('change', '.J-SelProvince', function(){
            var index = $(this).data('index');
            $(this).parent('.J-SelAddress').find('select').removeClass('border-rad');
            $(this).parent('.J-SelAddress').find('.J-SelAddressHint').text("");
            var obj = {
                uuid: $(this).val()
            }
            var op = {
                index: index+1
            }

            if (op.index==1) {
                op.types = 'cityName';
                obj.provinceUuid = $(this).val();
                op.url = 'usercenter/region/getCitysByProvinceUuid';
            }
            if (op.index==2) {
                op.types = 'regionName';
                obj.cityUuid = $(this).val();
                op.url = 'usercenter/region/getRegionsByCityUuid';
            }
            if (op.index==3) {
                op.types = 'streetName';
                obj.regionUuid = $(this).val();
                op.url = 'usercenter/region/getStreetsByRegionUuid'
            }
            $('.J-SelAddress').each(function(i, item){

                if (i>index) {
                    $(this).remove();
                };
            });
            getCitysByProvince(obj, op);
        });
        
        getAddressObj.getAddRess(function () {
            var ProvinceObj = {
                index:0,
                types: 'provinceName',
                url: 'usercenter/region/getAllProvince',
                uuid: getAddressObj.storeAddress.province
             }

             //;
            if(getAddressObj.storeAddress.province && getAddressObj.storeAddress.city && getAddressObj.storeAddress.region && getAddressObj.storeAddress.street) {
                getCitysByProvince({}, ProvinceObj, function () {
                    getCitysByProvince({
                        provinceUuid: getAddressObj.storeAddress.province
                    }, {
                        types : 'cityName',
                        url : 'usercenter/region/getCitysByProvinceUuid',
                        index:1,
                        uuid: getAddressObj.storeAddress.city
                    }, function () {
                        getCitysByProvince({
                            cityUuid: getAddressObj.storeAddress.city
                        }, {
                            types : 'regionName',
                            url : 'usercenter/region/getRegionsByCityUuid',
                            index:2,
                            uuid: getAddressObj.storeAddress.region
                        }, function () {
                            getCitysByProvince({
                                regionUuid: getAddressObj.storeAddress.region
                            }, {
                                types : 'streetName',
                                url : 'usercenter/region/getStreetsByRegionUuid',
                                index:3,
                                uuid: getAddressObj.storeAddress.street
                            });
                        });
                    });
                })
               
            }else{
                getCitysByProvince({}, ProvinceObj);
            }
        });
        //电视产品型号框
        $(document).on('click', '.sel-dir', function(){
        	$(".mask").show()
        	$(".sel-proModel").show()
        })
        $(document).on('click', '.i-btn,.pos', function(){
        	$(".mask").hide()
        	$(".sel-proModel").hide()
        })
        
        // 提交维修信息
        $(document).on('click', '.J-RepairSubmit', function(){

            if (pagetype=='repair') {
                var sendType = '2';
                var pics = "";
                var video = "";
                if ($('.J-UpLoadImg').length>0) {
                    $('.J-LoadImgBox').each(function(index,item){
                       if ($(this).find('.psource').attr('src')) {
	                       	if(pics == ""){
	                       		pics+=$(this).find('.psource').attr('src');
	                       	}else{
	                       		pics+= ','+$(this).find('.psource').attr('src');
	                       	}
                       } else {
                        video = $(this).find('.vsource').attr('src');
                       }
                    });
                }

            } else {
                var sendType = '1';
            }
            var obj = {
                "key": phonekey,
                "code": $.trim($('.J-PhoneCodeVal').val()),
                "linkman": $.trim($('.J-ContactsVal').val()),
                "address": $.trim($('.J-Address').val()),
                "mobile": $.trim($('.J-PhoneVal').val()),
                "pics": pics,
                'videos':video,
                "province": $('.J-SelAddress').eq(0).find('.J-SelProvince').find('option:selected').text(),
                "city": $('.J-SelAddress').eq(1).find('.J-SelProvince').find('option:selected').text(),
                "region": $('.J-SelAddress').eq(2).find('.J-SelProvince').find('option:selected').text(),
                "street": $('.J-SelAddress').eq(3).find('.J-SelProvince').find('option:selected').text(),
                "productCategoryName": $('.J-ProductClass').find('option:selected').text(),
                "productSubCategoryName": "",
                "serviceType": sendType,
                "description": $.trim($('.J-Demand').val()),
                "applyTime": $.trim($('.j-val').val()),
                "applyTimeType": $('.J-TimeType').find('option:selected').text(),
                "productSn": $.trim($('.J-ProductSn').val())
            }
            if (!obj.mobile || obj.mobile=='') {
                $('.J-PhoneVal').addClass('border-rad');
                $('.J-PhoneHint').text("请输入电话号码！");
                return false;
            } else {
                $('.J-PhoneCodeVal').removeClass('border-rad');
                $('.J-PhoneHint').text("");
            }
            if (!phonerag.test(obj.mobile)) {
                $('.J-PhoneVal').addClass('border-rad');
                $('.J-PhoneHint').text("请输入正确的手机号码！");
                return false;
            } else {
                $('.J-PhoneCodeVal').removeClass('border-rad');
                $('.J-PhoneHint').text("");
            }
            if (!obj.code || obj.code =='') {
                $('.J-PhoneCodeVal').addClass('border-rad');
                $('.J-PhoneCodeHint').text("请输入短信验证码！");
                return false;
            } else {
                $('.J-PhoneCodeVal').removeClass('border-rad');
                $('.J-PhoneCodeHint').text("");
            }
            if (!obj.linkman || obj.linkman =='') {
                $('.J-ContactsVal').addClass('border-rad');
                $('.J-ContactsHint').text("请输入联系人姓名！");
                return false;
            } else {
                $('.J-PhoneCodeVal').removeClass('border-rad');
                $('.J-PhoneHint').text("");
            }
            if (obj.province =='' || obj.province=='- 请选择 -') {
                $('.J-SelAddress').eq(0).find('select').addClass('border-rad');
                $('.J-SelAddress').eq(0).find('.J-SelAddressHint').text("请选择省份");
                return false;
            }else {
                $('.J-SelAddress').eq(0).find('select').removeClass('border-rad');
                $('.J-SelAddress').eq(0).find('.J-SelAddressHint').text("");
            }
            if (obj.city =='' || obj.city=='- 请选择 -') {
                $('.J-SelAddress').eq(1).find('select').addClass('border-rad');
                $('.J-SelAddress').eq(1).find('.J-SelAddressHint').text("请选择市");
                return false;
            }else {
                $('.J-SelAddress').eq(1).find('select').removeClass('border-rad');
                $('.J-SelAddress').eq(1).find('.J-SelAddressHint').text("");
            }
            if (obj.region =='' || obj.region=='- 请选择 -') {
                $('.J-SelAddress').eq(2).find('select').addClass('border-rad');
                $('.J-SelAddress').eq(2).find('.J-SelAddressHint').text("请选择区");
                return false;
            }else {
                $('.J-SelAddress').eq(2).find('select').removeClass('border-rad');
                $('.J-SelAddress').eq(2).find('.J-SelAddressHint').text("");
            }
            if (obj.street =='' || obj.street=='- 请选择 -') {
                $('.J-SelAddress').eq(3).find('select').addClass('border-rad');
                $('.J-SelAddress').eq(3).find('.J-SelAddressHint').text("请选择街道");
                return false;
            }else {
                $('.J-SelAddress').eq(3).find('select').removeClass('border-rad');
                $('.J-SelAddress').eq(3).find('.J-SelAddressHint').text("");
            }
            if (!obj.address || obj.address =='') {
                $('.J-Address').addClass('border-rad');
                $('.J-AddressHint').text("请输入详细地址！");
                return false;
            } else {
                $('.J-Address').removeClass('border-rad');
                $('.J-AddressHint').text("");
            }
            if (!obj.productCategoryName || obj.productCategoryName=='请选择产品分类') {
                $('.J-ProductClass').addClass('border-rad');
                $('.J-ProductClassHint').text("请选择产品分类");
                return false;
            } else {
                $('.J-ProductClass').removeClass('border-rad');
                $('.J-ProductClassHint').text("");
            }
            if (!obj.productSn || obj.productSn =='') {
                $('.J-ProductSn').addClass('border-rad');
                $('.J-ProductSnHint').text("请输入产品型号！");
                return false;
            } else {
                $('.J-ProductSn').removeClass('border-rad');
                $('.J-ProductSnHint').text("");
            }    
            if (!obj.description || obj.description =='') {
                $('.J-Demand').addClass('border-rad');
                $('.J-DemandHint').text("请输入产品描述！");
                return false;
            } else {
                $('.J-Demand').removeClass('border-rad');
                $('.J-DemandHint').text("");
            }
            if (!obj.applyTime || obj.applyTime =='') {
                $('.j-val').addClass('border-rad');
                $('.J-DataTimeHint').text("请输入上门时间！");
                return false;
            } else {
                $('.j-val').removeClass('border-rad');
                $('.J-DataTimeHint').text("");
            }
            if (window.localStorage.getItem('istaff_token')) {
               var token =  window.localStorage.getItem('istaff_token');
            }

            $.ajax({
                url: server+'servicecenter/saveService',
                type: 'POST',
                data: obj,
                headers: {
                    'ihome-token':token
                },
                success: function(data){
                    if (data.code==0) {
                        plugin.Alert("提交申请成功！", {'title': '提示', okText: '确定', cancelText: '关闭'},function(){
                            window.location.reload();
                            $('body').removeAttr('style');
                        });
                    }else {
                        if (data.code==-4) {
                            plugin.Alert('手机验证码错误！', {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                                $('body').removeAttr('style');
                            });
                        } else {
                            plugin.Alert(data.msg, {'title': '提示', okText: '确定', cancelText: '关闭'}, function(){
                                $('body').removeAttr('style');
                            });
                        }
                        
                    }
                },
                error: function(){

                }

            })
        });


        // 遍历菜单数据
        function EachStandard(data){
            var html = '';
            data.map(function(item, index){
                html += '<li class="ser-item child" data-uuid="'+item.uuid+'"><a href="policy.html?'+item.uuid+'">'+item.contentTitle+'</a></li>';
            });
            $('.J-Polocy').append(html);
        }
    };
    obj.policy = function(){
        var url = window.location.href,
            obj = {
                contentId: url.split('policy.html?')[1]
            };
        getAddressObj.getAddRess();
        
        // 获取服务菜单
        $.ajax({
            url: server+'servicecenter/getPolicy',
            type: 'POST',
            data: {},
            success: function(data){
                if (data && data.length>0) {
                    EachStandard(data);
                    // 获取内容
                }
                $.ajax({
                    url: server+'servicecenter/getStandard',
                    type: 'POST',
                    data: {},
                    success: function(data){
                        if (data && data.length>0) {
                            EachStandard(data);
                        }
                    },
                    error: function(){

                    }
                });
            },
            error: function(){

            }
        });

        // 显示&&影藏菜单
        $(document).on('click', '.J-SerItem', function(){
            var _this = $(this).find('ul');
            if (_this.hasClass('active')) {
                _this.removeClass('active');
                _this.slideUp(180);
            } else {
                _this.addClass('active');
                _this.slideDown(180);
            }
        });
        $.ajax({
            url: server+'servicecenter/getContent',
            type: 'POST',
            data: obj,
            success: function(data){
                if (data&&data.retData) {
                    $('.J-SelTitle').text(data.retData.contentTitle);
                    $('.J-SelTime').text(data.retData.createTime);
                    $('.J-SelContent').append(data.retData.introduction);
                };
            },
            error: function(){

            }
        });
        // 遍历菜单数据
        function EachStandard(data){
            var html = '';
            data.map(function(item, index){
                if (item.uuid == obj.contentId) {
                    html += '<li class="ser-item active child" data-uuid="'+item.uuid+'"><a href="policy.html?'+item.uuid+'">'+item.contentTitle+'</a></li>';
                } else {
                    html += '<li class="ser-item child" data-uuid="'+item.uuid+'"><a href="policy.html?'+item.uuid+'">'+item.contentTitle+'</a></li>';
                }
            });
            $('.J-Polocy').append(html);
        }
    };

    obj.problem = function(){
        var href = window.location.href,
            Urluuid = href.split('ProblemDetails.html?')[1],
            obj = {
                contentId: Urluuid
            }
        var token = localStorage.getItem('istaff_token') ? localStorage.getItem('istaff_token') : null;
        $.ajax({
            url: server+'servicecenter/getCommonProblems',
            type: 'POST',
            headers:{
                'ihome-token' : token,
                'platform' : 'platform_tcl_staff'
            },
            data: {},
            success: function(data){
                console.log(data);
                var html =  '', contentHtml = '';
                $('.J-MenuTitle').text(data.retData.categoryName);
                if (data && data.code==0 && data.retData.subCotentCategorys.length>0) {
                    var o = data.retData.subCotentCategorys;
                    o.map(function(item, index){
                       html+='<div class="ser-item J-SerItem"><p class="J-SerTitle">'+item.categoryName+'</p><span class="ser-sank"></span>';
                        if (item.contentList && item.contentList.length>0) {

                            var t = item.contentList;
                            var power = false;
                            var itemHtml = '';
                            t.map(function(ele,inde){
                                if (ele.uuid ==Urluuid) {
                                    power = true;
                                    itemHtml += '<li class="ser-item active child J-ChildItem" data-uuid="'+ele.uuid+'"><a href="ProblemDetails.html?'+ele.uuid+'">'+ele.contentTitle+'</a></li>';
                                    contentHtml +=  '<div class="server-r-item J-ServerBox" style="display:block"  data-uuid="'+ele.uuid+'">'+
                                                    '    <h3 class="sel-title">'+
                                                    '        <div class="sel-tit-fl">'+
                                                    '            <p class="J-SelTitle">'+ele.contentTitle+'</p>'+
                                                    '            <span class="tit-time J-SelTime">'+ele.opeTime+'</span>'+
                                                    '        </div>'+
                                                    '        <div class="right">'+
                                                    '            <span>扫描二维码 关注公众号</span>'+
                                                    '            <div class="sel-code"><img src="../../app/images/code-img.png" /></div>'+
                                                    '        </div>'+
                                                    '    </h3>'+
                                                    '    <div class="ser-form">';
                                    /*if (ele.contentList.length<=0 || !ele.contentList[0].introduction) {
                                    contentHtml +=  '        <div class="sel-content J-SelContent"></div>'+
                                                    '    </div>'+
                                                    '</div>';
                                    } else {*/
                                    contentHtml +=  '        <div class="sel-content J-SelContent">'+ele.introduction+'</div>'+
                                                    '    </div>'+
                                                    '</div>';
                                    /*}*/

                                } else {
                                    itemHtml += '<li class="ser-item child J-ChildItem" data-uuid="'+ele.uuid+'"><a href="ProblemDetails.html?'+ele.uuid+'">'+ele.contentTitle+'</a></li>';
                                    contentHtml +=  '<div class="server-r-item J-ServerBox" style="display:none"  data-uuid="'+ele.uuid+'">'+
                                                    '    <h3 class="sel-title">'+
                                                    '        <div class="sel-tit-fl">'+
                                                    '            <p class="J-SelTitle">'+ele.contentTitle+'</p>'+
                                                    '            <span class="tit-time J-SelTime">'+ele.opeTime+'</span>'+
                                                    '        </div>'+
                                                    '        <div class="right">'+
                                                    '            <span>扫描二维码 关注公众号</span>'+
                                                    '            <div class="sel-code"><img src="../../app/images/code-img.png" /></div>'+
                                                    '        </div>'+
                                                    '    </h3>'+
                                                    '    <div class="ser-form">';
                                    /*if (ele.contentList.length<=0 || !ele.contentList[0].introduction) {
                                    contentHtml +=  '        <div class="sel-content J-SelContent"></div>'+
                                                    '    </div>'+
                                                    '</div>';
                                    } else {*/
                                    contentHtml +=  '        <div class="sel-content J-SelContent">'+ele.introduction+'</div>'+
                                                    '    </div>'+
                                                    '</div>';
                                    /*}*/
                                }
                            });
                            html += power ? '<ul class="J-Polocy active" style="display:block">': '<ul class="J-Polocy" style="display:none">';
                            html +=itemHtml+'</ul>';
                        }
                        html +='</div>';
                    });
                    $('.J-MenuList').append(html);
                    $('.J-ServerContent').append(contentHtml);
                  
                }
            },
            error: function(){

            }

        });
		
        // 显示&&影藏菜单
        $(document).on('click', '.J-SerTitle', function(){
            var _this = $(this).parent('.J-SerItem').find('ul');
            if (_this.hasClass('active')) {
                _this.removeClass('active');
                _this.slideUp(180);
            } else {
                _this.addClass('active');
                _this.slideDown(180);
            }
        });
    };
    obj.kefu = function(){
        //售前咨询弹出页面
        $(".baiduChat").click(function() {
            var Uid = $('#span_customerName').attr('title');//获取用户ID
            //获取用户名
            NTKF_PARAM = {
                siteid:"kf_9428",		            //企业ID，为固定值，必填
                settingid:"kf_9428_1525949700591",	//接待组ID，为固定值，必填
                uid:Uid,		                	//用户ID，未登录可以为空，但不能给null，uid赋予的值显示到小能客户端上
                uname:Uid,		    				//用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
                isvip:"0",                          //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
                userlevel:"1"		                //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
            }
            NTKF.im_openInPageChat('kf_9428_1525949700591')
        });
        //售后咨询弹出页面
        $(".consultation").click(function(){
             var iWidth=830;         //弹出窗口的宽度;
             var iHeight=700;        //弹出窗口的高度;
             //获得窗口的垂直位置
             var iTop = (window.screen.availHeight-30-iHeight)/2;
             //获得窗口的水平位置
             var iLeft = (window.screen.availWidth-10-iWidth)/2;
             var params='width='+iWidth
             +',height='+iHeight
             +',top='+iTop
             +',left='+iLeft
             +',channelmode=yes'//是否使用剧院模式显示窗口。默认为 no
             +',directories=yes'//是否添加目录按钮。默认为 yes
             +',fullscreen=no' //是否使用全屏模式显示浏览器
             +',location=no'//是否显示地址字段。默认是 yes
             +',menubar=no'//是否显示菜单栏。默认是 yes
             +',resizable=no'//窗口是否可调节尺寸。默认是 yes
             +',scrollbars=no'//是否显示滚动条。默认是 yes
             +',status=no'//是否添加状态栏。默认是 yes
             +',titlebar=no'//默认是 yes
             +',toolbar=no'//默认是 yes
             ;
            window.open ('http://125.93.53.91:31337/app/chat.html','newwindow',params);})
    };

    return obj;
});
