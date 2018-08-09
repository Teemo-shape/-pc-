require(['KUYU.Service', 'KUYU.plugins.alert','KUYU.navFooterLink','KUYU.Binder','base64',
     'xss'],function(){
        var $http = KUYU.Service,
            $init = KUYU.Init,
            // $binder = KUYU.Binder,
            $Store = KUYU.Store,
            _env = KUYU.Init.getEnv(),
            _sever = KUYU.Init.getService(),
            navFooterLink = KUYU.navFooterLink,
            $scope = KUYU.RootScope;
        var path = _sever[_env.sever];

            $scope = KUYU.RootScope;
        var ImgIsUpload = false;
            navFooterLink();

   // if(!$Store.get('_ihome_token_')) {
   //     Msg.Alert("","会话失效或者未登录", function () {
   //         $init.nextPage("newBulkpurchase",{})
   //     })
   // }

   $(function () {
       $("#companyProvince").change(function() {
           var provinceId = $(this).val();
           main.getCity(provinceId, 'company')
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
       $('#companyCity').change(function() {
           var cityId = $(this).val();
           main.getRegion(cityId, 'company');
           if(cityId){
               $("#regionsId").show();
               $("#streets").hide();
           }else{
               $("#regionsId").hide();
               $("#streets").hide();
           }
       })
   });
   /*-----------------发票地址-----------------*/
   $(function () {
       $("#invoiceProvince").change(function() {
           var provinceId = $(this).val();
           main.getCity(provinceId)
           if(provinceId){
               $("#areasId2").show();
               $("#regionsId2").hide();
               $("#streets2").hide();
           }else{
               $("#areasId2").hide();
               $("#regionsId2").hide();
               $("#streets2").hide();
           }
       })
       $('#invoiceCity').change(function() {
           var cityId = $(this).val();
           main.getRegion(cityId);
           if(cityId){
               $("#regionsId2").show();
               $("#streets2").hide();
           }else{
               $("#regionsId2").hide();
               $("#streets2").hide();
           }
       })
   });

    jQuery.validator.addMethod("mobile", function(value,element) {
        var mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[6780]|18[0-9]|14[57])[0-9]{8}$/;
        return this.optional(element) || (mobile.test(value));
    }, "请正确填写联系电话");
    jQuery.validator.addMethod("tel", function(value,element) {
        var tel = /^\d{3,4}-\d{7,8}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写固定电话如"); //registrationNo
    jQuery.validator.addMethod("registrationNo", function(value,element) {
        var tel = /^[0-9a-zA-Z]{15,20}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确纳税人识别号字母或数字15-20位之间");
    var main = {
        verifiForm: function () {
            $("#loginForm").validate({ //验证表单
                rules: {
                    companyName: {
                        required: true
                    },
                    bussinessLicense: {
                        required: true
                    },
                    contactMan: {
                        required: true
                    },
                    contactMobile: {
                        required: true,
                        mobile: true
                    },
                    companyProvince:{
                        required: true
                    },
                    companyCity:{
                        required: true
                    },
                    companyRegion:{
                        required: true
                    },
                    companyAddress: {
                        required: true
                    },
                    contactTel: {
                        required: true,
                        tel:true
                    },
                    companyBankNo: {
                        required: true
                    },
                    bankOpenerName: {
                        required: true
                    },
                    bankName: {
                        required: true
                    },
                    taxpayerRegistrationNo: {
                        required: true,
                        registrationNo: true
                    },
                    invoiceProvince: {
                        required: true
                    },
                    invoiceCity: {
                        required: true
                    },
                    invoiceRegion:{
                        required: true
                    },
                    invoiceAddress:{
                        required: true
                    },
                    invoiceReceiver:{
                        required: true
                    },
                    invoiceReceiverMobile : {
                        required: true,
                        mobile:true
                    },
                },
                messages: {
                    companyName: {
                        required: "请输入企业名称"
                    },
                    bussinessLicense: {
                        required: "请输入营业执照代码"
                    },
                    contactMan: {
                        required: "请输入企业联系人"
                    },
                    contactMobile: {
                        required: "请输入联系人电话",
                        mobile: "请输入正确的联系电话"
                    },
                    companyProvince:{
                        required: "请选择省"
                    },
                    companyCity:{
                        required: "请选择市"
                    },
                    companyRegion:{
                        required: "请选择区县"
                    },
                    companyAddress: {
                        required: "请输入详细地址"
                    },
                    contactTel: {
                        required: "请输入固定电话",
                        tel:"请正确填写固定电话如:xxxx-xxxxxxx"
                    },
                    companyBankNo: {
                        required: "请输入开户行帐号"
                    },
                    bankOpenerName: {
                        required: "请输入开户人姓名"
                    },
                    bankName: {
                        required: "请输入开户银行"
                    },
                    taxpayerRegistrationNo: {
                        required: "请输入纳税人识别号",
                        registrationNo:'请输入正确纳税人识别号字母或数字15-20位之间'
                    },
                    invoiceProvince:{
                        required: "请选择省"
                    },
                    invoiceCity:{
                        required: "请选择市 "
                    },
                    invoiceRegion:{
                        required: "请选择区县"
                    },
                    invoiceAddress: {
                        required: "请输入详细寄送地址"
                    },
                    invoiceReceiver: {
                        required: "请输入发票收件人"
                    },
                    invoiceReceiverMobile: {
                        required: "请输入收件人电话",
                        mobile: "请输入正确收件人电话"
                    },
                },
                focusInvalid:true,
                onkeyup:false,
                errorClass: 'lable-tap', //输入错误时的提示标签类名
                invalidHandler: function(form, validator) {
                    if(validator.errorList.length>0) {
                        Msg.Alert("", validator.errorList[0].message, function () {})
                    }
                },
                submitHandler: function(form) {
                    if(ImgIsUpload){
                        main.regfunc(form);
                        $("#imgUpError").hide();
                    }else{
                        $("#imgUpError").show();
                    }
                }
            });
        },
        regfunc: function (form) {
            var bussinessLicensePhoto = $("#upload1_img0").attr("src");
            var taxCertificate = $("#upload1_img1").attr("src");
            var organizationPhoto = $("#upload1_img2").attr("src");
            var data = $(form).serialize()
            data = data+'&bussinessLicensePhoto='+bussinessLicensePhoto+'&taxCertificate='+taxCertificate+'&organizationPhoto='+organizationPhoto
            var url = "/bulkbuying/account/saveOrUpdateAccountInfo";
            $http.post({
                    url: url,
                    type:'POST',
                    data:data,
                    dataType:'json',
                    success: function (res) {
                        if(res.code == 0) {
                            form.reset()
                            $init.nextPage("regpurchaseSucc",{})
                        } else if(res.code == 403) {
                            Msg.Alert("","会话失效或者未登录", function () {
                                $init.nextPage("newBulkpurchase",{})
                            })
                        }
                    }
            })
        },
        uploadsIE: function () {
            var doms = $(".upload_file");
            var upload1_img0 = $("#upload1_img0");

            KUYU.purUpload = function (dom, imgdom) {
               var self = $(dom);
               var form = self.parents('form');
               form.ajaxSubmit({
                   url: '/rest/fileupload/uploadImage?rand'+Math.random(),
                   type: 'post',
                   dataType:'json',
                 //contentType: "text/html; charset=utf-8",
                   success: function (res) {
                       if(res.code == 0) {
                           $("#"+imgdom).attr("src", res.retData).show();
                           if($("#upload1_img0").attr("src")) {
                               ImgIsUpload = true;
                            }
                       }else{
                           Msg.Alert("","上传失败错误代码:"+res.code, function () {
                          })
                       }
                   }
               })
           }

        //     $.each(doms, function (i, o) {
        //         var id = $(this).attr('id');
        //         $('#'+id).uploadify({
        //        　　 'swf'      :'/app/swf/uploadify.swf',
        //             'buttonText': '+',
        //             'fileTypeExts': '*.jpg; *.png',
        //             'fileObjName':'imgFile',
        //             'height': 128,
        //             'width': 128,
        //             'auto': true,
        //             'multi': false,
        //      　　　 'uploader':'/rest/fileupload/uploadImage',
        //             onUploadSuccess : function (file, data, response) {
        //                 var res = JSON.parse(data);
        //                 debugger
        //                 // if(res.code == 0) {
        //                 //     $("#upload1_img"+i).attr("src", res.retData).show();
        //                 //     if(upload1_img0.attr("src")) {
        //                 //         ImgIsUpload = true;
        //                 //     }
        //                 // }
        //             },
        //             onUploadError: function(file,errorCode,erorMsg,errorString){
        //                 console.log(file)
        //                 console.log(errorCode)
        //                 console.log(erorMsg)
        //                 console.log(errorString)
        //                 Msg.Alert("","上传失败错误代码:"+errorCode, function () {
         //
        //                 })
        //             },
        //         　　 // Put your options here
        //  　　　 });
        //     })
        },
        queryInfo: function () {
            $http.get({
                url:'/bulkbuying/account/getMyAccountInfo?rand='+Math.random(),
                success: function (res) {
                    if(res.code == 0) {
                        var ms = {
                            0:"未审核的用户不能修改信息",
                            1:"审核通过的用户不能修改信息",
                            3:"冻结的用户不能修改信息",  //2审核不通过
                        }
                        if(res.retData.state ==1 || res.retData.state ==0 ||res.retData.state ==3 ) {
                            $("#companyName").val(res.retData.companyName).attr("disabled", true)
                            $("#bussinessLicense").val(res.retData.bussinessLicense).attr("disabled", true)
                            $("#contactMan").val(res.retData.contactMan).attr("disabled", true)
                            $("#contactMobile").val(res.retData.contactMobile).attr("disabled", true)

                            $("#companyProvince").attr("disabled", true)
                            $("#companyCity").attr("disabled", true)
                            $("#companyRegion").attr("disabled", true)

                            main.getProvince(res.retData.companyProvince, 'company');
                            main.getCity(res.retData.companyProvince, 'company', res.retData.companyCity)
                            main.getRegion(res.retData.companyCity, 'company', res.retData.companyRegion)
                            $("#areasId").show();
                            $("#regionsId").show();

                            $("#companyAddress").val(res.retData.companyAddress).attr("disabled", true)
                            $("#contactTel").val(res.retData.contactTel).attr("disabled", true)
                            $("#companyBankNo").val(res.retData.companyBankNo).attr("disabled", true)
                            $("#bankOpenerName").val(res.retData.bankOpenerName).attr("disabled", true)
                            $("#bankName").val(res.retData.bankName).attr("disabled", true)
                            $("#taxpayerRegistrationNo").val(res.retData.taxpayerRegistrationNo).attr("disabled", true)
                            $("#invoiceProvince").val(res.retData.invoiceProvince).attr("disabled", true)
                            $("#invoiceCity").val(res.retData.invoiceCity).attr("disabled", true)
                            $("#invoiceRegion").val(res.retData.invoiceRegion).attr("disabled", true)

                            main.getProvince(res.retData.invoiceProvince );
                            main.getCity(res.retData.invoiceProvince, '', res.retData.invoiceCity)
                            main.getRegion(res.retData.invoiceCity, '', res.retData.invoiceRegion)
                            $("#areasId2").show();
                            $("#regionsId2").show();

                            $("#invoiceAddress").val(res.retData.invoiceAddress).attr("disabled", true)
                            $("#invoiceReceiver").val(res.retData.invoiceReceiver).attr("disabled", true)
                            $("#invoiceReceiverMobile").val(res.retData.invoiceReceiverMobile).attr("disabled", true)

                            res.retData.bussinessLicensePhoto ? $("#upload1_img0").attr("src", res.retData.bussinessLicensePhoto).show() : false
                            res.retData.taxCertificate ? $("#upload1_img1").attr("src", res.retData.taxCertificate).show() : false
                            res.retData.organizationPhoto ? $("#upload1_img2").attr("src", res.retData.organizationPhoto).show() : false
                            $(".uploadify").hide();
                            $(".file").css("cursor", "not-allowed")

                            Msg.Alert("",ms[res.retData.state], function () {
                                $init.nextPage("newBulkpurchase",{})
                            })
                        } else {
                            $("#companyName").val(res.retData.companyName).attr("disabled", false)
                            $("#bussinessLicense").val(res.retData.bussinessLicense).attr("disabled", false)
                            $("#contactMan").val(res.retData.contactMan).attr("disabled", false)
                            $("#contactMobile").val(res.retData.contactMobile).attr("disabled", false)

                            $("#companyProvince").attr("disabled", false)
                            $("#companyCity").attr("disabled", false)
                            $("#companyRegion").attr("disabled", false)

                            main.getProvince(res.retData.companyProvince, 'company');
                            main.getCity(res.retData.companyProvince, 'company', res.retData.companyCity)
                            main.getRegion(res.retData.companyCity, 'company', res.retData.companyRegion)
                            $("#areasId").show();
                            $("#regionsId").show();

                            $("#companyAddress").val(res.retData.companyAddress).attr("disabled", false)
                            $("#contactTel").val(res.retData.contactTel).attr("disabled", false)
                            $("#companyBankNo").val(res.retData.companyBankNo).attr("disabled", false)
                            $("#bankOpenerName").val(res.retData.bankOpenerName).attr("disabled", false)
                            $("#bankName").val(res.retData.bankName).attr("disabled", false)
                            $("#taxpayerRegistrationNo").val(res.retData.taxpayerRegistrationNo).attr("disabled", false)
                            $("#invoiceProvince").val(res.retData.invoiceProvince).attr("disabled", false)
                            $("#invoiceCity").val(res.retData.invoiceCity).attr("disabled", false)
                            $("#invoiceRegion").val(res.retData.invoiceRegion).attr("disabled", false)

                            main.getProvince(res.retData.invoiceProvince );
                            main.getCity(res.retData.invoiceProvince, '', res.retData.invoiceCity)
                            main.getRegion(res.retData.invoiceCity, '', res.retData.invoiceRegion)
                            $("#areasId2").show();
                            $("#regionsId2").show();

                            $("#invoiceAddress").val(res.retData.invoiceAddress).attr("disabled", false)
                            $("#invoiceReceiver").val(res.retData.invoiceReceiver).attr("disabled", false)
                            $("#invoiceReceiverMobile").val(res.retData.invoiceReceiverMobile).attr("disabled", false)

                            if(res.retData.bussinessLicensePhoto){
                                ImgIsUpload = true;
                            }
                            res.retData.bussinessLicensePhoto ? $("#upload1_img0").attr({
                                "src": res.retData.bussinessLicensePhoto,
                                "flag": true
                            }).show() : false
                            res.retData.taxCertificate ? $("#upload1_img1").attr({
                                "src": res.retData.taxCertificate,
                                "flag": true
                            }).show() : false
                            res.retData.organizationPhoto ? $("#upload1_img2").attr({
                                "src": res.retData.organizationPhoto,
                                "flag": true
                            }).show() : false
                        }
                        var file= $(".file");
                        $.each(file, function (i, o) {

                            $(this).hover(function (){
                                if($(this).find('img').attr("flag") =='true') {
                                    $(this).find('font').css({
                                        'position': 'absolute',
                                        'left': '30px'
                                    })
                                }
                            }, function(){
                                $(this).find('font').css({
                                    'position': 'initial',
                                    'left': 'initial'
                                })
                            })
                        });
                    } else if (res.code == 403 || res.code == -6 ){
                        Msg.Alert("", res.msg, function () {
                            $init.nextPage("newBulkpurchase",{})
                        })
                    } else {
                        main.getProvince();
                        main.getProvince('', 'company');
                    }
                }
            })
        },
        getProvince: function (selected, type) {
            $http.get({
                url: "/usercenter/region/getAllProvince",
                success: function(res) {
                    var html = "";
                    var htm2 = ""
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        if(type == "company") {

                            if(selected == list.uuid) {
                                html += '<option selected value="' + list.uuid + '">' + list.provinceName + '</option>'
                            }else{
                                html += '<option value="' + list.uuid + '">' + list.provinceName + '</option>'
                            }
                        } else {
                            if(selected == list.uuid) {
                                htm2 += '<option selected value="' + list.uuid + '">' + list.provinceName + '</option>'
                            }else{
                                htm2 += '<option value="' + list.uuid + '">' + list.provinceName + '</option>'
                            }
                        }
                    }
                    $("#companyProvince").append(html);
                    $("#invoiceProvince").append(htm2);

                }
            })
        },
        getCity: function (provinceId, type, selected) {
            if(type == 'company') {
                $("#companyCity").empty()
            }else{
                $("#invoiceCity").empty()
            }
            $http.get({
                url: "/usercenter/region/getCitysByProvinceUuid?provinceUuid=" + provinceId,
                data: {},
                success: function(res) {
                    var html = "<option value=''>--请选择--</option>";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        if(selected == list.uuid) {
                            html += '<option selected value="' + list.uuid + '">' + list.cityName + '</option>'
                        }else{
                            html += '<option value="' + list.uuid + '">' + list.cityName + '</option>'
                        }
                    }
                    if(type == 'company') {
                        $("#companyCity").append(html);
                    }else{
                        $("#invoiceCity").append(html)
                    }
                }
            })
        },
        getRegion: function (cityId, type, selected) {
            if(type == 'company') {
                $("#companyRegion").empty()
            }else{
                $("#invoiceRegion").empty()
            }
            $http.get({
                url: "/usercenter/region/getRegionsByCityUuid?cityUuid=" + cityId,
                data: {},
                success: function(res) {
                    var html = "<option value=''>--请选择--</option>";
                    for(i = 0; i < res.length; i++) {
                        var list = res[i];
                        if(selected == list.uuid) {
                            html += '<option selected value="' + list.uuid + '">' + list.regionName + '</option>'
                        }else{
                            html += '<option value="' + list.uuid + '">' + list.regionName + '</option>'
                        }
                    }
                    if(type == 'company') {
                        $("#companyRegion").append(html);
                    }else{
                        $("#invoiceRegion").append(html)
                    }
                }
            })
        }
    };
    $init.Ready(function () {
        // $binder.init()
        main.verifiForm();
        main.uploadsIE();
        main.queryInfo();

        // main.getProvince('','company');
        //main.getProvince();

    })
})
