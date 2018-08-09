/*
 * author：Lin Xiaohu
 * time：2016-11-26 16:56:32
 * */
require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.navFooterLink','KUYU.Binder','KUYU.HeaderTwo', 'KUYU.SlideBarLogin','base64',
     'xss'],function(){
        var $http = KUYU.Service,
            $init = KUYU.Init,
            $binder = KUYU.Binder,
            $header = KUYU.HeaderTwo,
            $Store = KUYU.Store,
            _env = KUYU.Init.getEnv(),
            _sever = KUYU.Init.getService(),
            navFooterLink = KUYU.navFooterLink,
            $scope = KUYU.RootScope;
        var path = _sever[_env.sever];

            $scope = KUYU.RootScope;
            $header.menuHover();
            $header.topSearch();
            navFooterLink();


        $(function() {
            $("#provinceId").change(function() {
                var provinceId = $(this).val();
                showCity(provinceId)
                if(provinceId){
                    $("#areasId").show();
                    $("#regionsId").hide();
                    $("#streets").hide();
                }else{
                    $("#areasId").hide();
                    $("#regionsId").hide();
                    $("#streets").hide();
                }
            })
            $('#cityId').change(function() {
                var cityId = $(this).val();
                showRegion(cityId);
                if(cityId){
                    $("#regionsId").show();
                    $("#streets").hide();
                }else{
                    $("#regionsId").hide();
                    $("#streets").hide();
                }
            })
            $('#regionId').change(function() {
                var regionId = $(this).val();
                showStreet(regionId);
                if(regionId){
                    $("#streets").show();
                }else{
                    $("#streets").hide();
                }
            })
        //获取省
        $http.get({
                url: "/usercenter/region/getAllProvince",
                success: function(res) {
                    var html = "";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        html += '<option value="' + list.uuid + '">' + list.provinceName + '</option>'
                    }
                    $("#provinceId").append(html);


                }
            })
        })
        //获取市
        function showCity(provinceId) {
            $("#cityId").empty()
            $http.get({
                url: "/usercenter/region/getCitysByProvinceUuid?provinceUuid=" + provinceId,
                data: {},
                success: function(res) {
                    var html = "<option value=''>--请选择--</option>";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        html += '<option value="' + list.uuid + '">' + list.cityName + '</option>'
                    }
                    $("#cityId").append(html)

                }
            })
        }
        //获取县
        function showRegion(cityId) {
            $("#regionId").empty()
            $http.get({
                url: "/usercenter/region/getRegionsByCityUuid?cityUuid=" + cityId,
                data: {},
                success: function(res) {
                    var html = "<option value=''>--请选择--</option>";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        html += '<option value="' + list.uuid + '">' + list.regionName + '</option>'
                    }
                    $("#regionId").append(html)

                }
            })
        }
        //获取街道
        function showStreet(regionId) {
            $("#street").empty()
            $http.get({
                url: "/usercenter/region/getStreetsByRegionUuid?regionUuid=" + regionId,
                data: {},
                success: function(res) {
                    var html = "<option value=''>--请选择--</option>";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        html += '<option value="' + list.uuid + '">' + list.streetName + '</option>'
                    }
                    $("#street").append(html)
                }
            })
        }



        $('.j-contact').blur(function(){
            var contact = $.trim($(this).val());
            if(contact == ''){
                $(this).next('.error-tip').text('请输入联系人姓名！').css('color','red');
                return;
            }else{
                $(this).next('.error-tip').text('');
                return true;
            }
        })
        //联系方式
        $('.j-num').blur(function(){
            var num = $.trim($(this).val());
            var reg = /(^1[3|4|5|7|8]\d{9}$)|(^(0\d{2,3}-?)?\d{7,8}$)/;
            if(num == ''){
                $(this).next('.error-tip').text('请输入联系方式！').css('color','red');
                return;
            }else if(!reg.test(num)){
                $(this).next('.error-tip').text('请输入正确的座机号或者手机号').css('color','red');
                return;
            }else{
                $(this).next('.error-tip').text('');
                return true;
            }
        })

        $('.j-email').blur(function(){
            var val = $(this).val();
            var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
            if(!reg.test(val)) {
                $(this).next('.error-tip').text('请输入正确的邮箱格式').css('color','red').show();
            } else {
                $(this).next('.error-tip').hide();
            }
        })

        //需求留言
        $('.j-request').blur(function(){
            if($.trim($(this).val()) == ''){
                $(this).parent().find('.error-tip').text('留言不能为空！').css('color','red');
                return;
            }else{
                $(this).parent().find('.error-tip').text('');
                return true;
            }
        })
        //需求输入框的剩余字符数
        $('.j-request').bind('keyup',function(){
            var n = 499 - $(this).val().length;
            $('.j-n').html(n);
        });
        //验证码
        $('.code-num').blur(function(){
            if($.trim($(this).val()) == ''){
                $(this).parent().find('.error-tip').text('验证码不能为空！').css('color','red');
                return;
            }else{
                $(this).parent().find('.error-tip').text('');
                return true;
            }
        })

		/*//提交需求
        $("#bigbuyform").submit(function(e){
            submit();
            e.preventDefault();
        });
        function submit(){
            $('#bigbuyform input,#bigbuyform textarea').trigger('blur');
        }*/


    $(function(){
        getValidateCode();

        $("#bigbuyform").submit(function(e){
            e.preventDefault();
            submit();
        });

        //需求输入框的剩余字符数
        $('.j-request').bind('keyup',function(){
            var n = 500 - $(this).val().length;
            $('.j-n').html(n);
        });

        //需求输入框的剩余字符数
        $('.j-request').bind('keyup',function(){
            var n = 500 - $(this).val().length;
            $('.j-n').html(n);
        });






        function submit(){
            var captchakey = $("#captchakey").val();
            var captchadata = $(".j-code").val();
            $http.get({
                url: "/tclcustomerregist/checkcaptcha",
                data:{
                    "captchakey":captchakey,
                    "captchadata":captchadata,
                    ranNum:Math.random()
                },
                success:function(data){
                    if(data.status != '1'){
                        Msg.Alert("","验证码有误",function(){});
                        $('.j-code').val("").focus();
                        getValidateCode();

                    }else{
                        if($('.j-contact').val() == ""){
                            return;
                        }else if($("#provinceId").val() == "" || $("#cityId").val() == "" || $("#regionId").val() == "" || $("#street").val() == ""){
                            Msg.Alert("","请选择正确的地址！",function(){});
                            return;
                        }else if(!/(^1[3|4|5|7|8]\d{9}$)|(^(0\d{2,3}-?)?\d{7,8}$)/.test($('.j-num').val())){
                            return;
                        }else if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test($('.j-email').val())){
                            return;
                        }else if($('.j-request').val() == ""){
                            return;
                        }else{
                            //提交按钮变灰
                            $('.submit-request.j-sr').attr('class','mgt50 tac submit-request j-sr disabled');
                            var name = filterXSS($('.j-contact').val());
                            var phone = $('.j-num').val();
                            var address = filterXSS($('.j-address').val());
                            var email = $('.j-email').val();
                            var company_name = filterXSS($('.j-company_name').val());
                            var message = filterXSS($('.j-request').val());
                            var url = path+"/bulkpurchase/savemsg";
                            $.ajax({
                                url:url,
                                type:"POST",
                                data:{
                                    name:name,
                                    phone:phone,
                                    address:address,
                                    email:email,
                                    company:company_name,
                                    message:message,
                                    ranNum:Math.random()
                                },
                                success:function(res){
                                    if(res.status == "success"){
                                        Msg.Alert("",res.msg,function(){
                                            window.location.reload();
                                        });
                                    }else{
                                        Msg.Alert("",res.msg,function(){
                                            window.location.reload();
                                        });
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    })


    //刷新验证码
    $(".fsize_12").click(function(e){
        e.preventDefault();
        getValidateCode();
    })

    $("#imgcode").click(function(){
        getValidateCode();
    })

    /* 刷新验证码 */
    function getValidateCode(){
       $http.get({
            url:'/tclcustomerregist/getcaptcha',
            data:{
                ranNum:Math.random()
            },
            success:function(res){
                if(res.status == '1'){
                    $("#imgcode").attr("src",res.url);
                    $("#captchakey").val(res.key);
                }

            }
       })
    }


    $(document).on("change",".form-group select",function(){
        var provinceText = $.trim($("#provinceId option:selected").text());
        var cityText = $.trim($("#cityId option:selected").text());
        var regionText = $.trim($("#regionId option:selected").text());
        var streetText = $.trim($("#street option:selected").text());
        var address = provinceText + cityText + regionText +streetText;
        $('.j-address').val(address);

    })













})
