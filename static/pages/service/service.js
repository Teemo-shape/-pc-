/*
 * Author:Linxh
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
    $header.menuHover();
    $header.topSearch();
    navFooterLink();
      
    //url处理
    //     var location = window.location.href;
    //     if(location.indexOf("#")<=0){
    //         window.location.href = "#";
    //     }
        //内容清空
        $("input").val("");
        $("textarea").val("");
        var obj = {};
        obj.index = function(){
            //日历选择
            $(document).on('click', '.j-data', function(event) {
                event.stopPropagation();
                if($('.box_sha').length) {
                    $("#box_sha").remove();
                    return false;
                }
                showTade.init($(this));
            });
            //我要维修、安装——选择地址
            var provinces = new Array() ;
            var citys = new Array() ;
            var regions = new Array() ;
            var streets = new Array() ;
            function Province(){}
            function City(){}
            function Region(){}
            function Street(){}
            function Area() {
                this.id="" ;
                this.parentId = "" ;
                this.name="" ;
            }
            Province.prototype.add = function(id,provinceName ,parendId){
                var area = new Area() ;
                area.id = id ;
                area.name = provinceName ;
                area.parentId = parendId ;
                provinces.push(area) ;
            }
            City.prototype.add = function(id,provinceName ,parendId){
                var area = new Area() ;
                area.id = id ;
                area.name = provinceName ;
                area.parentId = parendId ;
                citys.push(area) ;
            }

            Region.prototype.add = function(id,provinceName ,parendId){
                var area = new Area() ;
                area.id = id ;
                area.name = provinceName ;
                area.parentId = parendId ;
                regions.push(area) ;
            }

            Street.prototype.add = function(id,provinceName ,parendId){
                var area = new Area() ;
                area.id = id ;
                area.name = provinceName ;
                area.parentId = parendId ;
                streets.push(area) ;
            }
            var province = new Province() ;
            var city = new City() ;
            var region = new Region() ;
            var street = new Street();
            var checkedProvince = "" ;
            var checkedCity = "" ;
            var checkedRegion = "" ;
            var checkedStreet = "" ;
            //我要维修、安装——选择地址——省份加载
            $http.get({
                url:"/usercenter/region/getAllProvince",
                success:function(data){
                    if(data){
                        var provinceStr = "<option value=''>--请选择地址--</option>";
                        $.each(data,function(k,v){
                            var checked = "" ;
                            if(v['uuid']==checkedProvince) {
                                checked = "selected" ;
                            }
                            provinceStr = provinceStr + "<option value='"+v['uuid']+"'"+checked+">"+v['provinceName']+"</option>" ;
                        })
                        $("#sel_province").html(provinceStr) ;
                    }
                },
                error:function(){
                    alert('加载失败，请稍后重试')
                }
            });
            //我要维修、安装——选择地址——选择省出现市
            $("#sel_province").change(function(){
                var provinceId = $(this).val() ;
                showCity(provinceId ,"") ;
                $("#dv_region").hide() ;
                $("#dv_street").hide();
            })
            function showCity(provinceId ,checkedCity) {
                $http.get({
                    url:"/usercenter/region/getCitysByProvinceUuid?provinceUuid=" + provinceId,
                    data:{uuid:provinceId},
                    success:function(data){
                        if(data){
                            //console.log(data)
                            var cityStr = "<option value=''>--请选择--</option>" ;
                            $.each(data,function(k,v){
                                var checked = "" ;
                                if(v['uuid']==checkedCity) {
                                    checked = "selected" ;
                                }
                                cityStr = cityStr + "<option value='"+v['uuid']+"'"+checked+">"+v['cityName']+"</option>" ;
                            });
                            $("#sel_city").html(cityStr) ;
                            $("#dv_city").show();
                        }
                    }
                });

            };
            if(""!=checkedCity) {
                showCity(checkedProvince ,checkedCity) ;
            }
            //我要维修、安装——选择地址——选择市出现区县
            $('#sel_city').change(function(){
                var cityId = $(this).val() ;
                showRegion(cityId ,"") ;
                $("#streets").html("") ;
            })
            function showRegion(cityId ,checkRegion) {
                $http.get({
                    url:"/usercenter/region/getRegionsByCityUuid?cityUuid=" + cityId,
                    data:{uuid:cityId},
                    success:function(data){
                        if(data){
                            var regionStr = "<option value=''>--请选择--</option>" ;
                            $.each(data,function(k,v){
                                var checked = "" ;
                                if(v['uuid']==checkRegion) {
                                    checked = "selected" ;
                                }
                                regionStr = regionStr + "<option value='"+v['uuid']+"'"+checked+">"+v['regionName']+"</option>" ;
                            });
                            $("#sel_region").html(regionStr) ;
                            $("#dv_region").show();
                        }
                    }
                });
            };
            if(""!=checkedRegion) {
                showRegion(checkedCity ,checkedRegion) ;
            }
            //我要维修、安装——选择地址——选择区县出现街道
            $('#sel_region').change(function(){
                var regionId = $(this).val();
                showStreet(regionId,"");
            })
            function showStreet(regionId ,checkStreet){
                $http.get({
                    url:"/usercenter/region/getStreetsByRegionUuid?regionUuid=" + regionId,
                    data:{uuid:regionId},
                    success:function(data){
                        //console.log(data)
                        if(data){
                            var streetStr = "<option value=''>--请选择--</option>";
                            $.each(data,function(k,v){
                                var checked = "" ;
                                if(v['uuid']==checkStreet) {
                                    checked = "selected" ;
                                }
                                streetStr = streetStr + "<option value='"+v['uuid']+"'"+checked+">"+v['streetName']+"</option>" ;
                            });
                            $("#sel_street").html(streetStr) ;
                            $("#dv_street").show();
                        }
                    }
                });
            };
            if(""!=checkedStreet) {
                showStreet(checkedRegion ,checkedStreet) ;
            }
            //防止键盘连续按下事件
            var _timer = {};
            function delay_till_last(id, fn, wait) {
                if (_timer[id]) {
                    window.clearTimeout(_timer[id]);
                    delete _timer[id];
                }
                return _timer[id] = window.setTimeout(function() {
                    fn();
                    delete _timer[id];
                }, wait);
            };
            //我要维修、安装——验证验证码
            $('.appointment-text,#query').on('keyup',function(){
                var $len = $(this).val().length;
                var typeName = '';
                if($(this).hasClass('appointment-text')){
                    typeName = 'repairAndinstall';
                }
                var validateCode = $(this).val();
                if($len != 4){//验证码长度
                    /*验证码错误*/
                    $('.btn-confirm').prop("disabled","true");
                    $('.code-tips').children('span').filter('.active').removeClass('active');
                    if($(this).hasClass('appointment-text')){
                        $('.check-code .code-err').addClass('active');
                    }else{
                        $('.code-main .code-err').addClass('active');
                    }
                }else if(!checkCode(validateCode,typeName)){
                        /*验证码错误*/
                        $('.btn-confirm').prop("disabled","true");
                        $('.code-tips').children('span').filter('.active').removeClass('active');
                        if($(this).hasClass('appointment-text')){
                            $('.check-code .code-err').addClass('active');
                        }else{
                            $('.code-main .code-err').addClass('active');
                        }
                }else{
                    /*验证码正确*/
                    $('.btn-confirm').removeAttr("disabled");
                    $('.code-tips').children('span').filter('.active').removeClass('active');
                    if($(this).hasClass('appointment-text')){
                        $('.check-code .code-true').addClass('active');
                    }else{
                        $('.code-main .code-true').addClass('active');
                    }
                }
            });
            /*获取验证码*/
            function getValidateCaptchaCode(typeName){
                if(typeName == 'repairAndinstall'){
                    var $tips = $('.check-code .code-tips span').filter('.active');
                    if($tips.length != 0){//点击更换验证码时判断清空
                        $tips.removeClass("active");
                        //$("input.appointment-text").val("");
                    }
                    var _rand1 = Math.random();
                    $('#imgKey1').val(_rand1);
                    $("#appointment-img").attr('src',path + '/getCustomerRegCode?img-key=' + _rand1);
                }else{
                    var $tips = $('.code-main .code-tips span').filter('.active');
                    if($tips.length != 0){/*点击更换验证码时判断清空*/
                        $tips.removeClass("active");
                        $("input[name='typeValidateCode']").val('');
                    }
                    $("input[name='typeValidateCode']").attr("id",typeName);
                    var _rand2 = Math.random();
                    $('#imgKey2').val(_rand2);
                    $("#code-img-cont").attr('src',path + '/getCustomerRegCode?img-key=' + _rand2);
                }
            }
            getValidateCaptchaCode("repairAndinstall");
            /*验证验证码*/
            function checkCode(validateCode,typeName){
                var flag = true,$imgKey;
                if(typeName == 'repairAndinstall'){
                    $imgKey = $('#imgKey1').val();
                }else{
                    $imgKey = $('#imgKey2').val();
                }
                if(validateCode == "" || validateCode == null){
                    /*alert("请填写验证码！");*/
                    plugin.Alert("请填写验证码！", {'title': '提示', okText: '确定', cancelText: '关闭'});
                    flag = false;
                }else{
                    $http.post({
                        url: '/tclcustomerregist/checkValidateCode',
                        data:{
                            'img-key':$imgKey,
                            inputcode:validateCode
                        },
                        success: function (data) {
                            //console.log(data)
                            if(data.msg == 'success' ) {
                                $("#cont_code_img").attr("src",data.url);
                                $("#verificationKeycontent").val(data.key);
                                $('.code-tips').children('span').filter('.active').removeClass('active');
                                if(typeName == 'repairAndinstall'){
                                    $('.check-code .code-true').addClass('active');
                                }else{
                                    $('.code-main .code-true').addClass('active');
                                }
                                $('.btn-confirm').removeAttr("disabled");
                                flag = true;
                            }else{
                                $('.code-tips').children('span').filter('.active').removeClass('active');
                                if(typeName == 'repairAndinstall'){
                                    $('.check-code .code-err').addClass('active');
                                }else{
                                    $('.code-main .code-err').addClass('active');
                                }
                                $('.btn-confirm').prop("disabled","true");
                                //getValidateCaptchaCode(typeName);
                                flag = false;
                            }
                        },
                        error:function(res){
                            //console.log(res + '错误');
                        }
                    })
                }
                return flag;
            }
            $(document)
                .on('click','#setBtn1',function(){
                    $('.j-repair li').eq(0).click();
                })
                .on('click','#setBtn2',function(){
                    $('.j-repair li').eq(1).click();
                })
                //我要维修、我要安装——选项卡
                .on('click', '.j-repair li', function(){
                    var index = $(this).index();
                    $(this).addClass('active').siblings().removeClass('active');
                    var valuetype = $(this).attr("typevalue");
                    $("#valuetype").val(valuetype);
                    getServiceType(valuetype);
                })
                //请选择需要服务和对应产品类型——选项卡
                .on('click', '.j-twotab li', function(){
                    var index = $(this).index();
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.two-content').find('ul').hide();
                    $('.two-content').find('ul').eq(index).show();
                })
                //进度查询
                .on('click', '.jincuchaxun',function(){
                    var mobile = $('#jindu').val();
                    //var _c = new Object();
                    if(mobile==''){
                        plugin.Alert("请填写电话",{'title':'提示',okText: '确定',cancelText: '关闭'});
                        return false;
                    } else{
                        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                        if(!reg.test(mobile)){  //|| !reg1.test(mobileNo) 验证座机
                            plugin.Alert("电话格式不正确",{'title':'提示',okText: '确定',cancelText: '关闭'});
                            return false;
                        }
                    }

                    /*图形验证码弹窗*/
                    $('.mask').css({'opacity':1,'z-index':1051}).show();;
                    $('body').css('overflow','hidden');
                    getValidateCaptchaCode('query');
                    $('.code-container').show();
                    $('.btn-confirm').attr('disabled','true');
                    $('.code-main .code-tips').children('span').filter('.active').removeClass('active');
                })
                /*验证码弹窗点击X关闭*/
                .on('click','.code-close',function(){
                        $('.code-container').hide();
                        $('.mask').hide();
                        $('body').css('overflow','visible');
                        $(".code-input input[name='typeValidateCode']").val("");

                 })
                /*.on('keyup','.code-input>input',function(){
                    delay_till_last('code-press',function(){//防止键盘连续按下
                        //验证码输入框键盘按下事件
                        var $len = $('.code-input input').val().length;
                        var validateCode = $(".code-input input[name='typeValidateCode']").val();
                        var typeName = $(".code-input input[name='typeValidateCode']").attr('id');
                        if($len == 4){//验证码长度
                            if(!checkCode(validateCode,typeName)){
                                //验证码错误
                                $('.code-main .code-tips').children('span').filter('.active').removeClass('active');
                                $('.code-main .code-err').addClass('active');
                                return;
                            }else{
                                $('.btn-confirm').removeAttr("disabled");
                                //验证码正确
                                $('.code-main .code-tips').children('span').filter('.active').removeClass('active');
                                $('.code-main .code-true').addClass('active');
                            }

                        }else{
                            //验证码错误
                            $('.code-main .code-tips').children('span').filter('.active').removeClass('active');
                            $('.code-main .code-err').addClass('active');
                        }
                    },300)
                })*/
                //弹窗验证码按下确认按钮 验证成功后跳转页面
                .on('click','.btn-confirm',function(){
                    var  validateCode = $(".code-input input[name='typeValidateCode']").val();
                    var typeName = $(".code-input input[name='typeValidateCode']").attr('id');
                    if(!$('.btn-confirm').attr('disabled')){
                        $('.code-main .code-true').removeClass('active');
                        /*跳转进度查询请求*/
                        if(typeName == 'query'){
                            var mobile = $.trim($('#jindu').val());
                            sessionStorage.setItem("jdcxhc",mobile)
                            /*var cjwturl = +"/servicecenter/serviceDemandDealProcessKuyu";
                            post(cjwturl,{'mobile':mobile,"validateCode":validateCode});*/
                            $http.post({
                                url:'/servicecenter/serviceDemandDealProcessKuyu',
                                data:{mobile:mobile},
                                success:function(data){
                                    //console.log(data);
                                    //window.open('serviceDemandDealProcessKuyu.html?mobile=' + mobile);
                                    window.open('serviceDemandDealProcessKuyu.html');
                                    if (windowOpen == null || typeof(windowOpen)=='undefined'){
                                        window.location.href = 'serviceDemandDealProcessKuyu.html';
                                    }
                                }
                            })
                        }
                        /*跳转电子保单查询请求*/
                        if(typeName == 'elecPolicy'){
                            var mobile = $.trim($('#elecPolicy').val());
                            sessionStorage.setItem("dzbdhc",mobile)
                            $http.post({
                                url:'/servicecenter/queryKeyinElecPolicy',
                                data:{mobile:mobile},
                                success:function(data){
                                    //console.log(data);
                                    //window.open('toElecPolicy.html?mobile='+mobile);
                                    window.open('toElecPolicy.html');
                                    if (windowOpen == null || typeof(windowOpen)=='undefined'){
                                        window.location.href = 'toElecPolicy.html';
                                    }
                                }
                            })
                        }
                        /*点击确定 隐藏弹出框,并清空输入框内容*/
                        $(".code-input input[name='typeValidateCode']").val('')
                        $('.code-container').hide();
                        $('.mask').hide();
                        $('body').css('overflow','visible');
                    }
                })


                //电子保单
                .on('click', '.elecPolicy',function(){
                    var mobile = $('#elecPolicy').val();
                    if(mobile==''){
                        plugin.Alert("请填写电话",{'title':'提示',okText: '确定',cancelText: '关闭'});
                        return false;
                    } else{
                        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                        if(!reg.test(mobile)){  //|| !reg1.test(mobileNo) 验证座机
                            plugin.Alert("电话格式不正确",{'title':'提示',okText: '确定',cancelText: '关闭'});
                            return false;
                        }
                    }
                    /*图形验证码弹窗*/
                    $('.mask').css({'opacity':1,'z-index':1051}).show();
                    $('body').css('overflow','hidden');
                    getValidateCaptchaCode('elecPolicy');
                    $('.code-container').show();
                    $('.btn-confirm').attr('disabled','true');
                })
                //维修、安装——点击验证图码刷新
                .on('click','#appointment-img,#j-tochange',function(){
                    getValidateCaptchaCode('repairAndinstall');
                    $('#repairAndinstallCode').val('');
                })
                //维修、安装——查询进度弹窗验证码刷新
                .on('click','#code-img-cont',function(){
                    getValidateCaptchaCode();
                });
                //我要维修、安装——类型(维修/安装)请求
                function getServiceType(valuetype){
                    $http.get({
                        url:'/servicecenter/getServiceType',
                        success:function(data){
                            if(data){
                                var str = "" ;
                                var selected =
                                $.each(data.data,function(k,v){
                                    var checked = "" ;
                                    var valuetype = $("#valuetype").val();
                                    if(v.name == '安装' && valuetype == "1") {
                                        str = str + "<option value='"+v.uuid+"' selected>"+v.name+"</option>" ;
                                    }
                                    if(v.name == '维修' && valuetype == "0"){
                                        str = str + "<option value='"+v.uuid+"' selected>"+v.name+"</option>" ;
                                    }
                                });
                                $("#serviceType").html(str);
                            }
                        }
                    })
                    /*var valuetype;
                    var $option = '';
                    if(valuetype == '0'){
                        $option = '<option value="7824311d79b84d3d85147706d8aeee0a" selected="selected">维修</option>';
                    }else{
                        $option = '<option value="ce68a9f1d29a43138669eab762b9aac4" selected="">安装</option>';
                    }
                    $("#serviceType").html($option);*/
                }
                $('.j-repair li.active').click();


                //请选择需要服务和对应产品类型——选项卡内容加载
//              var fwzcurl = "data/fwzc.html" ;
//              $.get(fwzcurl,function(data){
//                  $("#fwzc").html(data) ;
//              })
                //常見問題——内容加载
//              var cjwturl = "data/cjwt.html" ;
//              $.post(cjwturl,function(data){
//                  $("#changjianwenti").html(data) ;
//              })
                $('.z_tijiao').show();
                 //post请求函数
                 function post(url,params) {
                    var tempForm = document.createElement("form");
                    tempForm.action = url;
                    tempForm.target = "_blank";
                    tempForm.method = "post";
                    tempForm.style.display = "none";
                    for (var param in params) {
                        var opt = document.createElement("textarea");
                        opt.name = param;
                        opt.value = params[param];
                        tempForm.appendChild(opt);
                    }
                    document.body.appendChild(tempForm);
                    tempForm.submit();
                }
        /*************************/
        var lastproductCategoryName = '';
        var productCategory = '';
        var productVersion = '';

        //我要维修、安装——请选择产品类别
        $http.get({
            url:'/servicecenter/getProductCategory',
            success:function(data){
                if(data){
                    //console.log(data)
                    var str = "<option value=''>请选择产品类别</option>";
                    var checked = "" ;
                    $.each(data.data,function(k,v){
                        /*if(v.uuid == '${productCategory}') {
                            checked = "selected" ;
                            str = str + "<option value='"+v.uuid+"' "+checked+">"+v.categoryName+"</option>" ;
                        } else {
                            str = str + "<option value='"+v.uuid+"'>"+v.categoryName+"</option>" ;
                        }*/
                        str = str + "<option value='"+v.uuid+"'>"+v.categoryName+"</option>" ;
                    })
                    $("#productCategory").html(str) ;
                    /*if(checked == "selected"){
                        subCategory('${productCategory}');
                    }*/
                }
            }
        });
        $(document).on('change','#productCategory',function(){
            subCategory(this.value);
            $("#productVersion").html('<option value="">--请选择--</option>');
        }).on('change','#lastproductCategoryName',function(){
            changeSubCategory(this.value);
        })
        //维修、安装——选择产品类别出现子产品类别
        function subCategory(uuid){
            $http.get({
                url:"/servicecenter/getSubCategoryByCategoryUuid",
                data:{categoryUuid:uuid},
                success:function(data){
                    if(data){
                        //console.log(data)
                        var str = "<option value=''>--请选择--</option>" ;
                        var checked = "" ;
                        $.each(data.data,function(k,v){
                            /*if(v.uuid == lastproductCategoryName) {
                                checked = "selected" ;
                                str = str + "<option value='"+v.uuid+"' "+ checked +">"+v.categoryName+"</option>" ;
                            } else {
                                str = str + "<option value='"+v.uuid+"'>"+v.categoryName+"</option>" ;
                            }*/
                            str = str + "<option value='"+v.uuid+"'>"+v.categoryName+"</option>" ;
                        });
                        $("#lastproductCategoryName").html(str) ;
                        /*if(checked == "selected" ){
                            changeSubCategory(lastproductCategoryName);
                        }*/
                    }
                }
            });
        }
        //维修、安装——选择子产品类别出现产品型号
        function changeSubCategory(uuid){
            $http.get({
                url:"/servicecenter/getProductModelBySubCategoy",
                data:{subCategoryId:uuid},
                success:function(data){
                    if(data){
                        //console.log(data)
                        var str = "<option value=''>--请选择--</option>" ;
                        $.each(data.data,function(k,v){
                            /*var checked = "" ;
                            if(v.productSn == '') {
                                checked = "selected" ;
                                str = str + "<option value='"+v.productSn+"'"+ checked +">"+v.productSn+"</option>" ;
                            } else {
                                str = str + "<option value='"+v.productSn+"'>"+v.productSn+"</option>" ;
                            }*/
                            str = str + "<option value='"+v.productSn+"'>"+v.productSn+"</option>";
                        });
                        str = str + "<option value = '0' >其他</option>";
                        $("#productVersion").html(str) ;
                    }
                }
            });
        }



            //我要维修、安装——选择产品型号
        //兼容处理：ie9以下没有动画效果
        var browser=navigator.appName
        var b_version=navigator.appVersion
        var version=b_version.split(";");
        var trim_Version = "";
        if(!!version[1]) {
            trim_Version = version[1].replace(/[ ]/g,"");
        }
        $("body").on("change", "#productVersion", function(){
            var $this = $(this);
            if($this.val() == "0") {
                $this.css({"width":"80px", "margin-right": 0, "border-right": 0, "float":"left"}).removeAttr('name');
                if(trim_Version == "MSIE8.0" || trim_Version== "MSIE9.0"){
                    $('#setPro').remove();
                    $this.after("<input name='productVersion' id='setPro' style='margin-left: 0;height: 50px;width: 211px;float: left;' placeholder='请输入产品型号'>");
                    $('input[name="productVersion"]').placeholder();
                }else {
                    $('#setPro').remove();
                    //setTimeout(function() {
                        $this.after("<input name='productVersion' id='setPro' style='margin-left: 0;height: 50px;width: 211px;float: left;' placeholder='请输入产品型号'>");
                    //},250)
                }
            }else {
                $this.attr('name',"productVersion").removeAttr('style').siblings('input[name="productVersion"]').remove();}
        })

        //验证提示
        function tipShow(isShow, $this, msg) {
            var $tip = $this.siblings('.error-tip');
            if($tip.length < 1) {
                $this.after('<span class="error-tip"></span>');
                $tip = $this.siblings('.error-tip');
            }
            if(isShow) {
                $tip.text(msg)
                $this.addClass('error-box');
                return false;
            }else {
                $tip.text("")
                $this.removeClass('error-box')
            }
        }
        $("#productCategory,#lastproductCategoryName,#productVersion,#serviceType,#sel_province,#sel_city,#sel_region,#sel_street").change(function(){
            if($(this).val() !== ''){
                tipShow(false, $(this),'');
            }
        })
        $("#linkman").blur(function(){
            var linkman = $(this).val();
            if(linkman == ""){
                return tipShow(true, $(this), "请输入姓名")
            }else if(linkman.length > 10 || linkman.length < 2) {
                return tipShow(true, $(this), "姓名长度必须在2-10之间")
            }else {
                tipShow(false, $(this),'');
            }
        });
        $("#mobile").blur(function(){
            var mobile = $(this).val();
            if(mobile == ""){
                return tipShow(true, $(this), '请输入手机号');
            }else if(!/^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(mobile)){
                return tipShow(true, $(this), "请输入正确手机号码");
            }else {
                tipShow(false, $(this));
            }
        });
        $('#email').blur(function(){
            var email = $(this).val();
            if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email) || email == "")){
                return tipShow(true, $(this), "请输入正确邮箱地址");
            }else {
                tipShow(false, $(this));
            }
        })
        $("#applyTime").blur(function(){
            var applyTime = $(this).val();
            if(applyTime == ""){
                return tipShow(true, $(this), '请输入上门日期');
            }else {
                tipShow(false, $(this));
            }
        })
        $("#addressDetail").blur(function(){
            var addressDetail = $(this).val();
            if(addressDetail == ""){
                return tipShow(true, $(this), '请输入详细地址');
            }else if(addressDetail.length > 100) {
                return tipShow(true, $(this), "详细地址长度不能超过100个字符");
            }else {
                tipShow(false, $(this));
            }
        })
        $("#description").blur(function(){
            var description = $(this).val();
            if(description == ""){
                return tipShow(true, $(this), '请输入需求描述');
            }else if(description.length > 200){
                return tipShow(true, $(this), "需求描述最多允许输入200个字符");
            }else {
                tipShow(false, $(this));
            }
        })
        $('#repairAndinstallCode').blur(function(){
            var $validateCode = $.trim($(this).val());
            if($validateCode == ""){
                return tipShow(true, $(this), '请输入验证码');
            }else {
                tipShow(false, $(this));
            }
        })
        //我要维修、安装——验证姓名——只允许输入字母和中文
        var oldName = "";
        $("#linkman").keyup(function() {
            $(this).val($(this).val().replace(/[^\u4E00-\u9FA5a-zA-Z]/g,''));
        })

        //我要维修、安装——联系电话——只允许输入数字
        $("#mobile").keyup(function() {
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        //维修、安装——提交表单
        $('#z_tijiao').click(function(){
            submintForm();
        });
        //我要维修、安装——“提交申请”按钮
        var $p_val = '';
        function submintForm(){
            //姓名
            var $linkman = $("#linkman");
            var linkman = $linkman.val();
            if(linkman == ""){
                return tipShow(true, $linkman, "请输入姓名")
            }else if(linkman.length > 10 || linkman.length < 2) {
                return tipShow(true, $linkman, "姓名长度必须在2-10之间")
            }else {
                tipShow(false, $linkman,'');
            }
            //手机
            var $mobile = $("#mobile");
            var mobile = $mobile.val();
            if(mobile == ""){
                return tipShow(true, $mobile, '请输入手机号');
            }else if(!/^(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(mobile)){
                return tipShow(true, $mobile, "请输入正确手机号码");
            }else {
                tipShow(false, $mobile);
            }
            //邮箱
            var $email = $("#email");
            var email = $email.val();
            if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email) || email == "")){
                return tipShow(true, $email, "请输入正确邮箱地址");
            }else {
                tipShow(false, $email);
            }
            //时间
            var $applyTime = $("#applyTime");
            var applyTime = $applyTime.val();
            if(applyTime == ""){
                return tipShow(true, $applyTime, '请输入上门日期');
            }else {
                tipShow(false, $applyTime);
            }
            //省
            var $province = $("#sel_province");
            var province = $.trim($province.val());
            if(province == ""){
                return tipShow(true, $province, '请选择省');
            }else{
                tipShow(false, $province);
            }
            //市
            var $city = $("#sel_city");
            var city = $.trim($city.val());
            if(city == ""){
                return tipShow(true, $city, '请选择市');
            }else {
                tipShow(false, $city);
            }
            //县
            var $region = $("#sel_region")
            var region = $.trim($region.val());
            if(region == ""){
                return tipShow(true, $region, '请选择区/县');
            }else {
                tipShow(false, $region);
            }
            //街道
            var $street = $("#sel_street");
            var street = $.trim($street.val());
            if(street == ""){
                return tipShow(true, $street, '请选择街道');
            }else {
                tipShow(false, $street);
            }
            //详细街道
            var $addressDetail = $("#addressDetail")
            var addressDetail = $addressDetail.val();
            if(addressDetail == ""){
                return tipShow(true, $addressDetail, '请输入详细地址');
            }else if(addressDetail.length > 100) {
                return tipShow(true, $addressDetail, "详细地址长度不能超过100个字符");
            }else {
                tipShow(false, $addressDetail);
            }
            //选择产品类型及型号
            var $productCategory = $("#productCategory")
            var productCategory = $.trim($productCategory.val());
            if(productCategory == ""){
                return tipShow(true, $productCategory, '请选择产品类别');
            }else{
                tipShow(false, $productCategory);
            }
            var $lastproductCategoryName = $("#lastproductCategoryName");
            var lastproductCategoryName = $.trim($lastproductCategoryName.val());
            if(lastproductCategoryName == ""){
                return tipShow(true, $lastproductCategoryName, '请选择产品子类');
            }else {
                tipShow(false, $lastproductCategoryName);
            }
            var $productVersion = $("[name='productVersion']");
            var productVersion = $.trim($productVersion.val());
            if(productVersion == "" || productVersion == 0){
                if ($productVersion.is("input")) $("#productVersion").addClass('error-box');
                return tipShow(true, $productVersion, '请选择或输入产品型号');
                $p_val = $.trim($('#setPro').val());
            }else {
                if ($productVersion.is("input")) $("#productVersion").removeClass('error-box');
                tipShow(false, $productVersion);
                $p_val = productVersion;
            }
            //console.log($p_val);
            //需求描述
            var $description = $("#description");
            var description = $description.val();
            if(description == ""){
                return tipShow(true, $description, '请输入需求描述');
            }else if(description.length > 200){
                return tipShow(true, $description, "需求描述最多允许输入200个字符");
            }else {
                tipShow(false, $description);
            }
            //验证码验证
            var $validateCode = $('.appointment-text');
            var validateCode = $validateCode.val();
            if($.trim(validateCode) == ""){
                return tipShow(true, $validateCode, '请输入验证码');
            }else {
                tipShow(false, $validateCode);
            }

            $("#area").val(province+city+region+street);
            var formData = $('#serviceForm').serialize();
            // navHeader(function( res ) {
            //     //console.warn(res)
            //     if(res.code == CODEMAP.status.success) {
                    //console.log('已经登录!');
                    sut();
            //     }else if(res.code == CODEMAP.status.notLogin || res.code == CODEMAP.status.TimeOut) {
            //         //console.log('请登录后操作！');
            //         var _localUrl = window.location.href;
            //         if(_localUrl.indexOf("#")){
            //             _localUrl = _localUrl.substring(0,_localUrl.indexOf("#"));
            //         }
            //         window.location.href = '{{login}}?backUrl=' + _localUrl + '?' + formData;
            //     }
            // });
            function sut(){
                $('#productVersion').val();
                $http.post({
                    url: '/servicecenter/saveServiceKuyu',
                    data: {
                        'linkman':$('#linkman').val(),
                        'userUuid':'',
                        'mobile' : $('#mobile').val(),
                        'email' : $('#email').val(),
                        'province' : $('#sel_province').val(),
                        'city' : $('#sel_city').val(),
                        'region' : $('#sel_region').val(),
                        'street' : $('#sel_street').val(),
                        'addressDetail' : $('#addressDetail').val(),
                        'lastproductCategoryName' : $('#lastproductCategoryName').val(),
                        'productVersion' : $p_val,
                        'serviceTypeUuid' : $('#serviceType').val(),
                        'description' : $('#description').val(),
                        'applyTime' : $('#applyTime').val(),
                        'productBrandName':'',
                        //'terminalType':'',
                        'imgKey': $('#imgKey1').val(),
                        'inputCode': $('#repairAndinstallCode').val()
                    },/*
                    beforeSend: function () {
                        $('.z_tijiao').hide();
                    },*/
                    success: function (data) {
                        //console.log(data)
                        if(data.code == 0){
                            $('.z_tijiao').show();
                            $("#linkman").val("");
                            $("#mobile").val("");
                            $("#email").val("");
                            $("#applyTime").val("");
                            $("#addressDetail").val("");
                            $("#description").val("");
                            plugin.Alert("预约服务成功",{'title':'提示',okText: '确定',cancelText: '关闭'});
                            //window.location.reload();
                            $('#serviceForm').find('input,select,textarea').val('');
                            $('.code-tips span').removeClass('active');
                        }else if(data.code == '-4'){
                            plugin.Alert("验证码错误！请重试。",{'title':'提示',okText: '确定',cancelText: '关闭'});
                        }else{
                            plugin.Alert("预约失败！请重试。",{'title':'提示',okText: '确定',cancelText: '关闭'});
                        }
                    }
                });
            }
        }


    };
     /*************产品服务政策******************/
    	fwzc();
        function fwzc(){
		$http.post({
                  url : '/servicecenter/getPolicy',
                  success: function(data){
                  	//console.log(data)
                  	var html = "";
                  	for(var i=0;i<data.length;i++){
                  	html += '<li data-id="'+data[i].uuid+'">'+
								'<a href="airChargingStandard.html?'+data[i].uuid+'">'+
									'<span class="">'+
									'<img src="'+data[i].iconPath+'">'+
									'</span>'+
									'<p class="iconname ">'+
										data[i].contentTitle
									'</p>'
								'</a>'
							'</li>'
                	  }
                  	$("#ul1").append(html)
                  }
    			});
    	}
        sfbz();
        function sfbz(){
		$http.post({
                  url : '/servicecenter/getStandard',
                  success: function(data){
                  	//console.log(data)
                  	var html = '';
                  	for(var i=0;i<data.length;i++){
                  	html += '<li data-id="'+data[i].uuid+'">'+
								'<a href="airChargingStandard.html?'+data[i].uuid+'">'+
									'<span class="">'+
									'<img src="'+data[i].iconPath+'">'+
									'</span>'+
									'<p class="iconname ">'+
										data[i].contentTitle
									'</p>'
								'</a>'
							'</li>'
                	  }
                  	$("#ul2").append(html)
                  }
    			});
    	}
        //常见问题
        cjwt();
        function cjwt(){
		$http.post({
                  url : '/servicecenter/getCommon',
                  success: function(data){
                  	//console.log(data)
                  	var html = '';
                  	for(var i=0;i<data.length;i++){
                  	html += '<dd><a href="airChargingStandard.html?'+data[i].uuid+'">'+data[i].contentTitle+'</a></dd>'
                	  }
                  	$(".listinfo").append(html)
                  }
    			});
    	}
    /*电子保单页面*/
     obj.baodan = function(){
//      var mobile_val = window.location.href.split('=')[1].replace('#','');
        var mobile_val=sessionStorage.getItem("dzbdhc");
        var img_key = window.sessionStorage.getItem('dzbd_img_key');
        var img_vcode = window.sessionStorage.getItem('dzbd_img_vcode');
        $('#mobile').attr('value',mobile_val);
        search();
        function search(){
            var mobile = $('#mobile').val();
            /*if(mobile==''){
                alert("请填写电话");
                return false;
            } else{
                var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if(!reg.test(mobile)){  //|| !reg1.test(mobileNo) 验证座机
                    alert("电话格式不正确");
                    return false}
            } */
            $http.post({
                url : '/servicecenter/queryKeyinElecPolicy',
                  data: {
                        mobile : mobile,
                    captchakey: img_key,
                    captchadata: img_vcode
                  },
                  success: function(obj){
                    if(obj.code == '1'){
                        var str = "";
                        var _data = obj.data;
                        for(var i=0;i<_data.length;i++){
                            str += "<li id='insurance_list" + (i+1) + "'>";
                            str += "<h4><em class='num'>NO."+ (i+1) +"</em>";
                            str +=   "<em class='title'>";
                            str +=      "<span>保单号："+_data[i].orderno+"</span>";
                            str +=      "<span>产品品类："+_data[i].prodtype+" </span>";
                            str +=      "<span>购买时间："+_data[i].buytime+"</span>"
                            str	+=		"<span class='red'>"+_data[i].status+"</span>";
                            str	+=		"<a href='#' class='open'>打开</a>";
                            str	+=	 "</em></h4>";
                            if(_data[i].justview == 0){
                                str +=	"<div class='search_result no_effect'>";
                            }else{
                                str +=	"<div class='search_result y_effect'>";
                            }
                            str +=		"<ul>";
                            str +=		"<li><span>保单号：</span><em>"+_data[i].orderno+"</em></li>";
                            str +=		"<li><span>客户姓名：</span><em>"+_data[i].custname+"</em></li>";
                            str +=		"<li><span>客户电话：</span><em>"+_data[i].custtel+"</em></li>";
                            str +=		"<li><span>客户地址：</span><em>"+_data[i].custaddr+"</em></li>";
                            str +=		"<li><span>产品品类：</span><em>"+_data[i].prodtype+"</em></li>";
                            str +=		"<li><span>产品型号：</span><em>"+_data[i].prodmodel+"</em></li>";
                            str +=		"<li><span>购买商场：</span><em>"+_data[i].buymarket+"</em></li>";
                            str +=		"<li><span>购买时间：</span><em>"+_data[i].buytime+"</em></li>";
                            str +=		"<li><span>激活状态：</span><em>"+_data[i].status+"</em></li>";
                            if(obj.data[i].justview == 1){
                            str +=		"<li><span>机号：</span><em>"+_data[i].macsn+"</em></li>";
                            }else{
                            str +=		"<li class='txt_jihao'><span>机号：</span><input name='macno"+(i+1)+"' id='macno"+(i+1)+"' type='text'></li>";
                            }
                            str +=		"</ul>";
                            if(_data[i].justview == 0){//0为需要激活，1为不需要激活
                            str += "<input type='hidden' id='orderid"+(i+1)+"'  name='orderid"+(i+1)+"' value='"+_data[i].orderid+"'>";
                            str += "<a href='javascript:;' data-itm="+ (i+1) +" class='btn'>激 活</a>";
                            }
                            str +=   "</div>";
                            str +=  "</li>";
                        }
                         $("#showinsurancelist").html(str);
                         $(".baodan_result li h4 a").click(function(e){
                            e.preventDefault();
                            $(this).toggleClass("open");
                            $(this).parents("h4").siblings(".search_result").slideToggle();
                            $(this).parents("li").siblings().find("h4").find("a").addClass("open");
                            $(this).parents("li").siblings().find(".search_result").slideUp();
                        });
                    }else{
                        alert('未找到对应电子保单信息！');
                        return false;
                    }
                },
                error : function() {
                alert("出错啦！请从查询！");
                return false;}
            })
        }
         //展示详情
         $(document).on('click','.num',function(){
             $(this).parents('li').find('.search_result').toggle();
         }).on('click','.search_result .btn',function(){
             var itm = $(this).data('itm');
             sbt_jihuo(itm);
         })
        //保单激活(待拿到正确机号重新测试 Linxh 2016-12-14)
        function sbt_jihuo(id){
            var macno = $('#macno'+id).val();
            var orderid = $('#orderid'+id).val();
            $http.post({
                url:'/servicecenter/activeKeyinMacsn',
                data:{orderid:orderid,macno:macno},
                success:function(data){
                    if(data.code==1){
                         $("#insurance_list"+id+" .no_effect .btn").siblings("ul").find("li:nth-last-child(2)").remove();
                         $("#insurance_list"+id+" .title .red").remove();
                         $('<span class="red">生效</span>').appendTo("#insurance_list"+id+" .title");
                         $("#insurance_list"+id+" .no_effect .btn").siblings("ul").find("li:nth-last-child(1)").remove();
                         $("#insurance_list"+id+" .no_effect .btn").parent("div").attr({"class":"search_result y_effect"});
                         $('<li><span>激活状态：</span><em>已激活</em></li><li><span>机号：</span><em>'+macno+'</em></li>').appendTo("#insurance_list"+id+" .y_effect ul");
                         $("#insurance_list"+id+" .y_effect .btn").remove();
                     }else{
                         alert(data.message);
                     }
                }
            })
        }
     }
     /*************客服頁面**************/
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
          if (!window.localStorage.getItem('istaff_token')) {
              window.location.href=window.location.origin+"/sign";
            return;
          }
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

    /*************进度查询******************/
    obj.jindu = function(){
//      var mobile_val = window.location.href.split('=')[1].replace('#','');
         var mobile_val = sessionStorage.getItem("jdcxhc");
         var img_key = sessionStorage.getItem('jdcx_img_key');
         var img_vcode = sessionStorage.getItem('jdcx_img_vcode');
        $('#mobile').attr('value',mobile_val);
        jdcx();
        function jdcx(){
            var data = $Store.get('serviceDemandDealProcessKuyu') ? JSON.parse($Store.get('serviceDemandDealProcessKuyu')) : '';
            if(data){
                var arr_len =data.serviceDemandModelList.length;
                if(arr_len == 0){
                    var html = '';
                    html += '<tr><td colspan = "6"><span>'+data.msg+'</span></td></tr>';
                    $('.service_download').find('tbody').html(html);
                }else{
                    //显示查询到的数据
                    var html = '';
                    var obj = data.serviceDemandModelList;
                    $.each(obj,function(i,item){
                        var _name = safeInfo(obj[i].customername,1,0),
                            _customertel = obj[i].customertel,
                            _tel = '';
                        if(_customertel){
                            var arr = _customertel.split('/');
                            _tel = safeInfo(arr[0],7,0);
                        }
                        if (i % 2 === 1) html += '<tr class="even">';
                        else html += '<tr>';
                        html += '<td>' + _name + '</td><td>' + _tel + '</td><td>' + obj[i].createtime + '</td><td>' + obj[i].status + '</td><td>' + obj[i].productbig + '</td><td>' + obj[i].protypename + '</td></tr>';
                    })
                    $('.service_download').find('tbody').html(html);
                }
            }
        }
        //电话号码、姓名保护处理 lxh
        function safeInfo(str,beginLen,endLen){
            var len = str.length - beginLen - endLen;
            var mask = '';
            for(var i = 0;i < len; i++){
                mask += '*';
            }
            return str.substring(0,beginLen) + mask + str.substring(str.length - endLen);
        }
    };
    /*************购物指南******************/
    obj.toHelp = function(){
        $(".help-center .m_box a").click(function() {
            var $this = $(this);
            $this.siblings().removeClass('red');
            var index = $this.addClass("red").index();
            $(".m_content_item:eq("+index+")").removeClass('hidden').siblings(".m_content_item").addClass('hidden');
        })
        var u = window.location.search;
        if(u){
            u = u.substr(1);
            u = decodeURIComponent(u);
            var i = parseInt(u.replace('hid=','')) - 1;
            $(".help-center .m_box a").eq(i).click();
        }
    }
    /********下载页面***********/
    //类型切换
    obj.download = function(){
       //类型切换
		$(".product-text dd").click(function() {
			 var uuid = $(this).attr("data-id");
            //console.log(uuid)
			 var subcategory = $("#subcategoryname");
            $http.get({
                //url:'data/subcategoryname.json',
                url:"/servicecenter/subcategoryname?categoryId="+ uuid +"&ranNum="+Math.random(),
                success: function(data){
                    //console.log(data)
                    if(data){
                         subcategory.html("");
                         $.each(data,function(i,item){
                             subcategory.append("<a data-subid=\""+item.uuid+"\" href=\"javascript:;\" class=\"j-close\">"+item.categoryName+"</a>");
                         })
                         $(".select-mask").css({"z-index": 1, "opacity": 1}).show();
                         $(this).addClass("active").siblings("dd").removeClass("active");
                         $(".select-first").show();}
                }
            })
		})
		$("body .select-first").on("click", ".j-close", function() {
			var $this= $(this);
			var uuid = $(this).attr("data-subid");
            //console.log(uuid)
			var pversion = $("#productversion");
            $http.get({
                //url:'data/productversion.json',
                url:"/servicecenter/productversion?subCategoryId="+ uuid +"&ranNum="+Math.random(),
                success:function(data){
                    if(data){
							pversion.html("");
							 $.each(data,function(i,item){
								 pversion.append("<a href=\"javascript:;\" data-version=\""+item.uuid+"\" class=\"j-close\">"+item.name+"</a>");
							 })
							 $this.addClass("active").siblings("a").removeClass("active");
							 $(".select-first").hide();
							 $(".select-second").show();}
                }
            })
		})
		$("body .select-second").on("click", ".j-close", function() {
			var $this = $(this);
			    $this.addClass("active").siblings("a").removeClass("active");
			var uuid =$(this).data("version");
            $http.get({
                //url:'data/downservice.json',
                url:"/servicecenter/downservice?versionId="+ uuid +"&ranNum="+Math.random(),
                success:function(data){
                    if(data && data.length >0){
//							var tempwindow = window.open('_blank');
//                            //var downldUrl = KUYU.Init.getService().downldUrl;
//							//tempwindow.location = downldUrl + data[0].fileName;
//                            var downld = data[0].url;
//							tempwindow.location.href = downld;
                        window.open(data[0].url,'_blank');

					} else{
                        plugin.Alert("对不起，该型号暂时不存在对应的说明文档！",{'title':'提示',okText: '确定',cancelText: '关闭'});
					}
                }
            })
		})
		//选择类型之后显示型号
		$("body").on("click", ".j-closebox", function() {
			$(this).parents(".select-box").hide();
			$(".select-mask").hide();
		});
		//返回上一步
		$(".back-step").click(function() {
			$('.select-box:visible').hide();
			$(".select-first").show();
		})
    };
    return obj;




});
