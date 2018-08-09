require(['KUYU.Service', 'KUYU.plugins.alert', 'Plugin', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.userInfo', 'KUYU.navFooterLink', 'xss'], function() {
    var $http = KUYU.Service,
        slidBarLogin = KUYU.SlideBarLogin,
        userInfo = KUYU.userInfo,
        Header = KUYU.HeaderTwo,
        navFooterLink = KUYU.navFooterLink;
    // Header.menuHover();
    Header.topSearch();
    // $init.Ready(function() {
    //
    // })
    // Header.topSearch();
    navFooterLink();
    $(function() {
        Header.menuHover();
        //年月日
        var yearNow = new Date().getFullYear(), yearStr = '<option value="">--请选择--</option>',
            monthStr = '<option value="">--请选择--</option>', dayStr = '<option value="">--请选择--</option>';
        for(var i = yearNow; i >= 1900; i--) {
            yearStr += "<option value=" + i + ">" + i + "</option>";
        }
        $('#year').html(yearStr);
        var monthFun = function() {
            for(var i = 1; i <= 12; i++) {
                if(i < 10) {
                    monthStr += "<option value=0" + i + ">" + i + "</option>";
                } else {
                    monthStr += "<option value=" + i + ">" + i + "</option>";
                }
            }
            $('#month').html(monthStr);
        }
        monthFun();
        var dayFun = function() {
            var year = parseInt($('#year').val());
            var month = parseInt($('#month').val());
            var dayCount = 0;
            switch(month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    dayCount = 31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    dayCount = 30;
                    break;
                case 2:
                    dayCount = 28;
                    if((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                        dayCount = 29;
                    }
                    break;
                default:
                    break;
            }
            dayStr = '<option value="">--请选择--</option>';//每次需初始化
            for(var i = 1; i <= dayCount; i++) {
                if(i < 10) {
                    dayStr += "<option value=0" + i + ">" + i + "</option>";
                } else {
                    dayStr += "<option value=" + i + ">" + i + "</option>";
                }
            }
            $('#day').html(dayStr);
        }
        // $('#year').on('change',function(){
        // 		if($(this).val()==''){
        // 			$('#month').html('<option value="">--请选择--</option>')
        // 			$('#day').html('<option value="">--请选择--</option>')
        // 		}else{
        // 				dayFun()
        // 		}
        // })
        $('#month').on('change', function() {
            if($('#year').val() == '') {
                Msg.Alert("", "请选择出生年份", function() {
                    $('#month').val('')
                })
            } else {
                dayFun()
            }
            if($(this).val() == '') {
                $('#day').html('<option value="">--请选择--</option>')
            }
        })
        // $('#day').on('change',function(){
        // 		if($('#year').val()==''||$('#month').val()==''){
        // 			Msg.Alert("","请选择出生年月",function(){
        // 				$('#day').val('')
        // 			})
        // 		}
        // })
        getUserInfo();
        //日历选择
        // $(document).on('click', '.j-data', function(event) {
        // 	event.stopPropagation();
        // 	if($('.box_sha').length) {
        // 		$("#box_sha").remove();
        // 		return false;
        // 	}
        // 	showTade.init($(this));
        // });
        var user;
        user = JSON.parse(sessionStorage.getItem('userinfo'));
        if(user && user != null) {
            if(user.customerImgUrl) {
                $("#show_pic_round").attr("src", user.customerImgUrl)
            }
            if(user.bindMail && user.bindMail != null && user.bindMail != '') {
                $("#cemail").html('<span>' + user.bindMail + '</span>' + '<a href="/pages/manageuser/manageuser.html?type=mail">修改&gt;&gt;</a>')
            } else {
                $("#cemail").html('<a href="/pages/manageuser/manageuser.html?type=mail">绑定&gt;&gt;</a>')
            }
            if(user.bindPhone && user.bindPhone != null && user.bindPhone != '') {
                $("#cPhone").html('<span>' + user.bindPhone + '</span>' + '<a href="/pages/manageuser/manageuser.html?type=phone">修改&gt;&gt;</a>')
            } else {
                $("#cPhone").html('<a href="/pages/manageuser/manageuser.html?type=phone">绑定&gt;&gt;</a>')
            }
            // if(user.province) {
            // 	//直接获取省市区
            // 	getadd(user)
            // }else{
            // 	getadd(1)
            // }
            if(user.customerUuid) {
                $("#cuuid").val(user.customerUuid);
            }
            if(user.hobby) {
                $(".con-like").val(user.hobby)
            }
            if(user.nickName) {
                $("#nickName").val(user.nickName)
            }
            if(user.realName) {
                $("#realName").val(user.realName)
            }
            if(user.companyName) {
                $("#companyName").val(user.companyName)
            }
            if(user.departmentName) {
                $("#departmentName").val(user.departmentName)
            }
            if(user.sex) {
                $("input:radio[name='sex']").eq(user.sex).attr("checked", true);
                $('.selsex label i').removeClass('on');
                $("input:radio[name='sex']").eq(user.sex).prev('i').addClass('on');
            }
            if(user.birthday !== '') {
                var arr = user.birthday.split('-');
                $('#year').val(arr[0]);
                $('#month').val(arr[1]);
                dayFun();
                $('#day').val(arr[2]);
                //$("#birthday").val(user.birthday)
            }
        } else {
            userInfo(function(res) {
                user = JSON.parse(sessionStorage.getItem('userinfo'));
                if(user.customerImgUrl) {
                    $("#show_pic_round").attr("src", user.customerImgUrl)
                }
                if(user.bindMail && user.bindMail != null && user.bindMail != '') {
                    $("#cemail").html('<span>' + user.bindMail + '</span>' + '<a href="/manageuser/manageuser.html?type=mail">修改&gt;&gt;</a>')
                } else {
                    $("#cemail").html('<a href="/manageuser/manageuser.html?type=mail">绑定&gt;&gt;</a>')
                }
                if(user.bindPhone && user.bindPhone != null && user.bindPhone != '') {
                    $("#cPhone").html('<span>' + user.bindPhone + '</span>' + '<a href="/manageuser/manageuser.html?type=phone">修改&gt;&gt;</a>')
                } else {
                    $("#cPhone").html('<a href="/manageuser/manageuser.html?type=phone">绑定&gt;&gt;</a>')
                }
                if(user.customerName) {
                    $(".form_static").html(user.customerName)
                }
                if(user.province) {
                    //直接获取省市区
                    getadd(user)
                } else {
                    getadd(1)
                }
                if(user.customerUuid) {
                    $("#cuuid").val(user.customerUuid);
                }
                if(user.hobby) {
                    $(".con-like").val(user.hobby)
                }
                if(user.nickName) {
                    $("#nickName").val(user.nickName)
                }
                if(user.realName) {
                    $("#realName").val(user.realName)
                }
                if(user.companyName) {
                    $("#companyName").val(user.companyName)
                }
                if(user.departmentName) {
                    $("#departmentName").val(user.departmentName)
                }
                if(user.sex) {
                    $("input:radio[name='sex']").eq(user.sex).attr("checked", true);
                    $('.selsex label i').removeClass('on');
                    $("input:radio[name='sex']").eq(user.sex).prev('i').addClass('on');
                }
                if(user.birthday) {
                    //$("#birthday").val(user.birthday)
                    var arr = user.birthday.split('-');
                    $('#year').val(arr[0]);
                    $('#month').val(arr[1]);
                    dayFun();
                    $('#day').val(arr[2]);
                }
            })
        }
        
        //提交表单
        $('.selsex label').click(function() {
            $('.selsex label i').removeClass('on');
            $(this).children('i').addClass('on');
        })
        $("#submit").click(function() {
            var $realName = $("#realName"), realName = $realName.val(), $nickName = $('#nickName'),
                nickName = $nickName.val(),
                $companyName = $('#companyName'), companyName = $companyName.val(),
                $departmentName = $('#departmentName'), departmentName = $departmentName.val();
            if(realName == '') {
                return tipShow(true, $realName, "请填写姓名")
            } else if((realName.length > 10 || realName.length < 2) && realName != "") {
                return tipShow(true, $realName, "姓名长度必须在2-10之间")
            } else {
                tipShow(false, $realName);
            }
            if(nickName == '') {
                return tipShow(true, $nickName, "请填写昵称")
            }
            if(companyName == '') {
                return tipShow(true, $companyName, "请填写公司名称")
            }
            if(departmentName == '') {
                return tipShow(true, $departmentName, "请填写部门名称")
            }
            // var $email = $(".con-email");
            // var email = $email.val();
            // if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email) || email == "")) {
            // 	return tipShow(true, $email, "请输入正确邮箱地址");
            // } else {
            // 	tipShow(false, $email);
            // }
            var customerInfo = {};
            // customerInfo.province = $("#provinceId option:selected").val();
            // customerInfo.city = $("#cityId option:selected").val();
            // customerInfo.region = $("#regionId option:selected").val();
            // customerInfo.street = $("#streets option:selected").val();
            // customerInfo.email = email;
            // customerInfo.hobby = filterXSS($(".con-like").val());
            if($('#year').val() == '') {
                customerInfo.birthday = ''
            } else {
                if($('#month').val() == '' || $('#day').val() == '') {
                    Msg.Alert("", "请选择正确的出生年月", function() {
                        customerInfo.birthday = ''
                        return false
                    })
                } else {
                    customerInfo.birthday = $('#year').val() + '-' + $('#month').val() + '-' + $('#day').val();
                }
            }
            
            customerInfo.sex = $('input:radio[name="sex"]:checked').val();
            customerInfo.realName = filterXSS(realName);
            customerInfo.nickName = filterXSS($("#nickName").val());
            customerInfo.companyName = filterXSS($("#companyName").val());
            customerInfo.departmentName = filterXSS($("#departmentName").val());
            //customerInfo.customerName = $(".form_static").html();
            customerInfo.customerUuid = $("#cuuid").val();
            $http.post({
                url: "/usercenter/customercomplex/doModifyCustomerInfoKuyu",
                data: customerInfo,
                success: function(res) {
                    if(res.code == "403" || res.code == "-6") {
                        window.location.href = "{{login}}"
                    }
                    if(res.code == "0") {
                        getUserInfo()
                        Msg.Alert("", "保存成功！", function() {
                            window.location.reload();
                        })
                    }
                }
            });
            
            var oldName = "";
            $("body").on("keyup", ".con-realName", function() {
                $(this).val($(this).val().replace(/[^\u4E00-\u9FA5a-zA-Z]/g, ''));
            })
        });
        
        //封装的判断输入表格的提示
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
            } else {
                $tip.text("")
                $this.removeClass('error-box')
            }
        }
        
        //更新之后及时获取用户信息
        function getUserInfo() {
            var userinfo = {}
            $http.get({
                url: "/usercenter/tclcustomer/userInfo",
                headers: {
                    'platform': 'platform_tcl_staff'
                },
                data: {
                    ranNum: Math.floor(Math.random() * 10000)
                },
                success: function(data) {
                    if(data.code == CODEMAP.status.success) {
                        var user = JSON.stringify(data.data)
                        sessionStorage.setItem("userinfo", user);
                    }
                    ;
                }
            })
        }
        
        // function getadd(user){
        // 	//参数是1的时候是没保存过地址，不为1保存过地址
        // 	if(user ==1){
        // 		var checkedProvince = "";
        // 		var checkedCity = "";
        // 		var checkedRegion = "";
        // 		var checkedStreet = "";
        // 	}
        // 	else {
        // 		var checkedProvince = user.province;
        // 		var checkedCity = user.city;
        // 		var checkedRegion = user.region;
        // 		var checkedStreet = user.street;
        // 	}
        // 	$(document).on('change', '#provinceId', function() {
        // 		var provinceId = $(this).val();
        // 		showCity(provinceId, "");
        // 		$("#regionsId").html("");
        // 		$("#streets").html("");
        // 	})
        // 	$(document).on('change', '#cityId', function() {
        // 		var cityId = $(this).val();
        // 		showRegion(cityId, "");
        // 		$("#streets").html("");
        // 	})
        // 	$(document).on('change', '#regionId', function() {
        // 		var regionId = $(this).val();
        // 		showStreet(regionId, "");
        // 	})
        // 	if("" != checkedCity) {
        // 		showCity(checkedProvince, checkedCity);
        // 	}
        // 	if("" != checkedRegion) {
        // 		showRegion(checkedCity, checkedRegion);
        // 	}
        //
        // 	if("" != checkedStreet) {
        // 		showStreet(checkedRegion, checkedStreet);
        // 	}
        //
        // 	//获取省
        // 	var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
        // 	$http.post({
        // 		async: false,
        // 		url: "/usercenter/region/getAllProvince",
        // 		success: function(data) {
        // 			if(data) {
        // 				$.each(data, function(k, v) {
        // 					var checked = "";
        // 					if(v['uuid'] == checkedProvince) {
        // 						checked = "selected";
        // 					}
        // 					provinceStr = provinceStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['provinceName'] + "</option>";
        // 				})
        // 			}
        // 		}
        // 	});
        // 	provinceStr = provinceStr + "</select>";
        // 	$("#provinces").html(provinceStr);
        //
        // 	function showCity(provinceId, checkedCity) {
        // 		var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
        // 		$http.post({
        // 			async: false,
        // 			url: "/usercenter/region/getCitysByProvinceUuid",
        // 			data: {
        // 				provinceUuid: provinceId
        // 			},
        // 			success: function(data) {
        // 				if(data) {
        // 					$.each(data, function(k, v) {
        // 						var checked = "";
        // 						if(v['uuid'] == checkedCity) {
        // 							checked = "selected";
        // 						}
        // 						cityStr = cityStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['cityName'] + "</option>";
        // 					})
        // 				}
        // 			}
        // 		});
        // 		cityStr = cityStr + "</select>";
        // 		$("#areasId").html(cityStr);
        // 	}
        //
        // 	function showRegion(cityId, checkRegion) {
        // 		var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
        // 		$http.post({
        // 			async: false,
        // 			url: "/usercenter/region/getRegionsByCityUuid",
        // 			data: {
        // 				cityUuid: cityId
        // 			},
        // 			success: function(data) {
        // 				if(data) {
        // 					$.each(data, function(k, v) {
        // 						var checked = "";
        // 						if(v['uuid'] == checkRegion) {
        // 							checked = "selected";
        // 						}
        // 						regionStr = regionStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['regionName'] + "</option>";
        // 					})
        // 				}
        // 			}
        // 		});
        // 		regionStr = regionStr + "</select>";
        // 		$("#regionsId").html(regionStr);
        // 	}
        //
        // 	function showStreet(regionId, checkStreet) {
        // 		var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
        // 		$http.post({
        // 			async: false,
        // 			url: "/usercenter/region/getStreetsByRegionUuid",
        // 			data: {
        // 				regionUuid: regionId
        // 			},
        // 			success: function(data) {
        // 				if(data) {
        // 					$.each(data, function(k, v) {
        // 						var checked = "";
        // 						if(v['uuid'] == checkStreet) {
        // 							checked = "selected";
        // 						}
        // 						streetStr = streetStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['streetName'] + "</option>";
        // 					})
        // 				}
        // 			}
        // 		});
        // 		streetStr = streetStr + "</select>";
        // 		$("#streets").html(streetStr);
        // 	}
        // }
        
    })
    //年月日
    var yearNow = new Date().getFullYear(), yearStr = '<option value="">--请选择--</option>',
        monthStr = '<option value="">--请选择--</option>', dayStr = '<option value="">--请选择--</option>';
    for(var i = yearNow; i >= 1900; i--) {
        yearStr += "<option value=" + i + ">" + i + "</option>";
    }
    $('#year').html(yearStr);
    var monthFun = function() {
        for(var i = 1; i <= 12; i++) {
            if(i < 10) {
                monthStr += "<option value=0" + i + ">" + i + "</option>";
            } else {
                monthStr += "<option value=" + i + ">" + i + "</option>";
            }
        }
        $('#month').html(monthStr);
    }
    monthFun();
    var dayFun = function() {
        var year = parseInt($('#year').val());
        var month = parseInt($('#month').val());
        console.log($('#day').val());
        var dayCount = 0;
        switch(month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                dayCount = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                dayCount = 30;
                break;
            case 2:
                dayCount = 28;
                if((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                    dayCount = 29;
                }
                break;
            default:
                break;
        }
        dayStr = '<option value="">--请选择--</option>';//每次需初始化
        for(var i = 1; i <= dayCount; i++) {
            if(i < 10) {
                dayStr += "<option value=0" + i + ">" + i + "</option>";
            } else {
                dayStr += "<option value=" + i + ">" + i + "</option>";
            }
        }
        $('#day').html(dayStr);
    }
    // $('#year').on('change',function(){
    // 		if($(this).val()==''){
    // 			$('#month').html('<option value="">--请选择--</option>')
    // 			$('#day').html('<option value="">--请选择--</option>')
    // 		}else{
    // 				dayFun()
    // 		}
    // })
    $('#month').on('change', function() {
        if($('#year').val() == '') {
            Msg.Alert("", "请选择出生年份", function() {
                $('#month').val('')
            })
        } else {
            dayFun()
        }
        if($(this).val() == '') {
            $('#day').html('<option value="">--请选择--</option>')
        }
    })
    // $('#day').on('change',function(){
    // 		if($('#year').val()==''||$('#month').val()==''){
    // 			Msg.Alert("","请选择出生年月",function(){
    // 				$('#day').val('')
    // 			})
    // 		}
    // })
    getUserInfo();
    //日历选择
    // $(document).on('click', '.j-data', function(event) {
    // 	event.stopPropagation();
    // 	if($('.box_sha').length) {
    // 		$("#box_sha").remove();
    // 		return false;
    // 	}
    // 	showTade.init($(this));
    // });
    var user;
    user = JSON.parse(sessionStorage.getItem('userinfo'));
    if(user && user != null) {
        if(user.customerImgUrl) {
            $("#show_pic_round").attr("src", user.customerImgUrl)
        }
        if(user.bindMail && user.bindMail != null && user.bindMail != '') {
            $("#cemail").html('<span>' + user.bindMail + '</span> ' +'<a href="/pages/manageuser/manageuser.html?type=mail">修改&gt;&gt;</a>')
        } else {
            $("#cemail").html('<a href="/pages/manageuser/manageuser.html?type=mail">绑定&gt;&gt;</a>')
            // $("#cemail").html("无")
            // $("#cemailtest").remove();
        }
        if(user.bindPhone && user.bindPhone != null && user.bindPhone != '') {
            $("#cPhone").html('<span>' + user.bindPhone + '</span>' + '<a href="/pages/manageuser/manageuser.html?type=phone">修改&gt;&gt;</a>')
        } else {
            $("#cPhone").html('<a href="/pages/manageuser/manageuser.html?type=phone">绑定&gt;&gt;</a>')
        }
        // if(user.province) {
        // 	//直接获取省市区
        // 	getadd(user)
        // }else{
        // 	getadd(1)
        // }
        if(user.customerUuid) {
            $("#cuuid").val(user.customerUuid);
        }
        if(user.hobby) {
            $(".con-like").val(user.hobby)
        }
        if(user.nickName) {
            $("#nickName").val(user.nickName)
        }
        if(user.realName) {
            $("#realName").val(user.realName)
        }
        if(user.companyName) {
            $("#companyName").val(user.companyName)
        }
        if(user.departmentName) {
            $("#departmentName").val(user.departmentName)
        }
        if(user.sex) {
            $("input:radio[name='sex']").eq(user.sex).attr("checked", true);
            $('.selsex label i').removeClass('on');
            $("input:radio[name='sex']").eq(user.sex).prev('i').addClass('on');
        }
        if(user.birthday !== '') {
            let arr = user.birthday.split('-');
            $('#year').val(arr[0]);
            $('#month').val(arr[1]);
            console.log($('#month').val());
            dayFun();
            $('#day').val(arr[2]);
            //$("#birthday").val(user.birthday)
        }
    } else {
        userInfo(function(res) {
            user = JSON.parse(sessionStorage.getItem('userinfo'));
            if(user.customerImgUrl) {
                $("#show_pic_round").attr("src", user.customerImgUrl)
            }
            if(user.bindMail && user.bindMail != null && user.bindMail != '') {
                $("#cemail").html('<span>' + user.bindMail + '</span>' + '<a href="/manageuser/manageuser.html?type=mail">修改&gt;&gt;</a>')
            } else {
                $("#cemail").html('<a href="/manageuser/manageuser.html?type=mail">绑定&gt;&gt;</a>')
            }
            if(user.bindPhone && user.bindPhone != null && user.bindPhone != '') {
                $("#cPhone").html('<span>' + user.bindPhone + '</span>' + '<a href="/manageuser/manageuser.html?type=phone">修改&gt;&gt;</a>')
            } else {
                $("#cPhone").html('<a href="/manageuser/manageuser.html?type=phone">绑定&gt;&gt;</a>')
            }
            if(user.customerName) {
                $(".form_static").html(user.customerName)
            }
            if(user.province) {
                //直接获取省市区
                getadd(user)
            } else {
                getadd(1)
            }
            if(user.customerUuid) {
                $("#cuuid").val(user.customerUuid);
            }
            if(user.hobby) {
                $(".con-like").val(user.hobby)
            }
            if(user.nickName) {
                $("#nickName").val(user.nickName)
            }
            if(user.realName) {
                $("#realName").val(user.realName)
            }
            if(user.companyName) {
                $("#companyName").val(user.companyName)
            }
            if(user.departmentName) {
                $("#departmentName").val(user.departmentName)
            }
            if(user.sex) {
                $("input:radio[name='sex']").eq(user.sex).attr("checked", true);
                $('.selsex label i').removeClass('on');
                $("input:radio[name='sex']").eq(user.sex).prev('i').addClass('on');
            }
            if(user.birthday) {
                //$("#birthday").val(user.birthday)
                let arr = user.birthday.split('-');
                $('#year').val(arr[0]);
                $('#month').val(arr[1]);
                dayFun();
                $('#day').val(arr[2]);
            }
        })
    }
    
    //提交表单
    $('.selsex label').click(function() {
        $('.selsex label i').removeClass('on');
        $(this).children('i').addClass('on');
    })
    $("#submit").click(function() {
        var $realName = $("#realName"), realName = $realName.val(), $nickName = $('#nickName'),
            nickName = $nickName.val(),
            $companyName = $('#companyName'), companyName = $companyName.val(), $departmentName = $('#departmentName'),
            departmentName = $departmentName.val();
        if(realName == '') {
            return tipShow(true, $realName, "请填写姓名")
        } else if((realName.length > 10 || realName.length < 2) && realName != "") {
            return tipShow(true, $realName, "姓名长度必须在2-10之间")
        } else {
            tipShow(false, $realName);
        }
        if(nickName == '') {
            return tipShow(true, $nickName, "请填写昵称")
        }
        if(companyName == '') {
            return tipShow(true, $companyName, "请填写公司名称")
        }
        if(departmentName == '') {
            return tipShow(true, $departmentName, "请填写部门名称")
        }
        // var $email = $(".con-email");
        // var email = $email.val();
        // if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email) || email == "")) {
        // 	return tipShow(true, $email, "请输入正确邮箱地址");
        // } else {
        // 	tipShow(false, $email);
        // }
        var customerInfo = {};
        // customerInfo.province = $("#provinceId option:selected").val();
        // customerInfo.city = $("#cityId option:selected").val();
        // customerInfo.region = $("#regionId option:selected").val();
        // customerInfo.street = $("#streets option:selected").val();
        // customerInfo.email = email;
        // customerInfo.hobby = filterXSS($(".con-like").val());
        if($('#year').val() == '') {
            customerInfo.birthday = ''
        } else {
            if($('#month').val() == '' || $('#day').val() == '') {
                Msg.Alert("", "请选择正确的出生年月", function() {
                    customerInfo.birthday = ''
                    return false
                })
            } else {
                customerInfo.birthday = $('#year').val() + '-' + $('#month').val() + '-' + $('#day').val();
            }
        }
        
        customerInfo.sex = $('input:radio[name="sex"]:checked').val();
        customerInfo.realName = filterXSS(realName);
        customerInfo.nickName = filterXSS($("#nickName").val());
        customerInfo.companyName = filterXSS($("#companyName").val());
        customerInfo.departmentName = filterXSS($("#departmentName").val());
        //customerInfo.customerName = $(".form_static").html();
        customerInfo.customerUuid = $("#cuuid").val();
        $http.post({
            url: "/usercenter/customercomplex/doModifyCustomerInfoKuyu",
            data: customerInfo,
            success: function(res) {
                if(res.code == "403" || res.code == "-6") {
                    window.location.href = "{{login}}"
                }
                if(res.code == "0") {
                    getUserInfo()
                    Msg.Alert("", "保存成功！", function() {
                        window.location.reload();
                    })
                }
            }
        });
        
        var oldName = "";
        $("body").on("keyup", ".con-realName", function() {
            $(this).val($(this).val().replace(/[^\u4E00-\u9FA5a-zA-Z]/g, ''));
        })
    });
    
    //封装的判断输入表格的提示
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
        } else {
            $tip.text("")
            $this.removeClass('error-box')
        }
    }
    
    //更新之后及时获取用户信息
    function getUserInfo() {
        var userinfo = {}
        $http.get({
            url: "/usercenter/tclcustomer/userInfo",
            headers: {
                'platform': 'platform_tcl_staff'
            },
            data: {
                ranNum: Math.floor(Math.random() * 10000)
            },
            success: function(data) {
                if(data.code == CODEMAP.status.success) {
                    var user = JSON.stringify(data.data)
                    sessionStorage.setItem("userinfo", user);
                }
                ;
            }
        })
    }
    
    // function getadd(user){
    // 	//参数是1的时候是没保存过地址，不为1保存过地址
    // 	if(user ==1){
    // 		var checkedProvince = "";
    // 		var checkedCity = "";
    // 		var checkedRegion = "";
    // 		var checkedStreet = "";
    // 	}
    // 	else {
    // 		var checkedProvince = user.province;
    // 		var checkedCity = user.city;
    // 		var checkedRegion = user.region;
    // 		var checkedStreet = user.street;
    // 	}
    // 	$(document).on('change', '#provinceId', function() {
    // 		var provinceId = $(this).val();
    // 		showCity(provinceId, "");
    // 		$("#regionsId").html("");
    // 		$("#streets").html("");
    // 	})
    // 	$(document).on('change', '#cityId', function() {
    // 		var cityId = $(this).val();
    // 		showRegion(cityId, "");
    // 		$("#streets").html("");
    // 	})
    // 	$(document).on('change', '#regionId', function() {
    // 		var regionId = $(this).val();
    // 		showStreet(regionId, "");
    // 	})
    // 	if("" != checkedCity) {
    // 		showCity(checkedProvince, checkedCity);
    // 	}
    // 	if("" != checkedRegion) {
    // 		showRegion(checkedCity, checkedRegion);
    // 	}
    //
    // 	if("" != checkedStreet) {
    // 		showStreet(checkedRegion, checkedStreet);
    // 	}
    //
    // 	//获取省
    // 	var provinceStr = "<select name='province' id='provinceId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
    // 	$http.post({
    // 		async: false,
    // 		url: "/usercenter/region/getAllProvince",
    // 		success: function(data) {
    // 			if(data) {
    // 				$.each(data, function(k, v) {
    // 					var checked = "";
    // 					if(v['uuid'] == checkedProvince) {
    // 						checked = "selected";
    // 					}
    // 					provinceStr = provinceStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['provinceName'] + "</option>";
    // 				})
    // 			}
    // 		}
    // 	});
    // 	provinceStr = provinceStr + "</select>";
    // 	$("#provinces").html(provinceStr);
    //
    // 	function showCity(provinceId, checkedCity) {
    // 		var cityStr = "<select name='city' id='cityId' class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
    // 		$http.post({
    // 			async: false,
    // 			url: "/usercenter/region/getCitysByProvinceUuid",
    // 			data: {
    // 				provinceUuid: provinceId
    // 			},
    // 			success: function(data) {
    // 				if(data) {
    // 					$.each(data, function(k, v) {
    // 						var checked = "";
    // 						if(v['uuid'] == checkedCity) {
    // 							checked = "selected";
    // 						}
    // 						cityStr = cityStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['cityName'] + "</option>";
    // 					})
    // 				}
    // 			}
    // 		});
    // 		cityStr = cityStr + "</select>";
    // 		$("#areasId").html(cityStr);
    // 	}
    //
    // 	function showRegion(cityId, checkRegion) {
    // 		var regionStr = "<select name='region' id='regionId'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
    // 		$http.post({
    // 			async: false,
    // 			url: "/usercenter/region/getRegionsByCityUuid",
    // 			data: {
    // 				cityUuid: cityId
    // 			},
    // 			success: function(data) {
    // 				if(data) {
    // 					$.each(data, function(k, v) {
    // 						var checked = "";
    // 						if(v['uuid'] == checkRegion) {
    // 							checked = "selected";
    // 						}
    // 						regionStr = regionStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['regionName'] + "</option>";
    // 					})
    // 				}
    // 			}
    // 		});
    // 		regionStr = regionStr + "</select>";
    // 		$("#regionsId").html(regionStr);
    // 	}
    //
    // 	function showStreet(regionId, checkStreet) {
    // 		var streetStr = "<select name='street' id='street'  class='select2-me form_control' data-rule-required='true'><option value=''>--请选择--</option>";
    // 		$http.post({
    // 			async: false,
    // 			url: "/usercenter/region/getStreetsByRegionUuid",
    // 			data: {
    // 				regionUuid: regionId
    // 			},
    // 			success: function(data) {
    // 				if(data) {
    // 					$.each(data, function(k, v) {
    // 						var checked = "";
    // 						if(v['uuid'] == checkStreet) {
    // 							checked = "selected";
    // 						}
    // 						streetStr = streetStr + "<option value='" + v['uuid'] + "'" + checked + ">" + v['streetName'] + "</option>";
    // 					})
    // 				}
    // 			}
    // 		});
    // 		streetStr = streetStr + "</select>";
    // 		$("#streets").html(streetStr);
    // 	}
    // }
    
})
