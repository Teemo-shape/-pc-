require(['KUYU.Service', 'KUYU.SlideBarLogin','juicer'], function() {
	var $http = KUYU.Service;
	var aa = KUYU.SlideBarLogin;
	var slidBarLogin = KUYU.SlideBarLogin;
	var invoice = {};
	var Map = KUYU.Init.Map();
	$(function() {
		$("#invoiceCate").val("2");
		//获取发票设置列表
		$http.post({
			url: "/usercenter/electronInvoice/getByCustomerUuid",
			success: function(res) {
				// 设置电子发票类型
				if ( res.data && res.data.length > 0 ) {
					$("#electron_titleContent").val(res.data[0].titleContent);
					$("#electron_titleContent").attr("uuid",res.data[0].uuid);
                    $("#electron_ratepayer").val(res.data[0].code)
                    Map.put('name', res.data[0].code)
					var result = "";
					for(var i=0;i<res.data.length;i++){
						var  list = res.data[i];
						result += '<li class="select-item j-select-item" code='+(list.code ? list.code : '""' )+'   customerAddressUuid=' + list.uuid + '>' + list.titleContent + '</li>'
					}
					$("#myul").append(result)
				}
			}
		});

		//点进电子发票显示下拉框
		$(document).on('click', '.select-item', function() {
            var html = $(this).html(),uuid = $(this).attr("customerAddressUuid"),code = $(this).attr("code");
            $("#electron_titleContent").val(html)
            $("#electron_titleContent").attr("uuid",uuid);
            $("#electron_ratepayer").val(code)
            $("#myul").hide()
        })
			//滑动时候下拉框颜色
		$(document).on('click', '.j-select-arrow', function(event) {
            $("#myul").toggle();
            var self = $(this).next();
            if(self.next().find('.select-item').length > 0 && self.next('.select-list').hasClass('active')) {
                self.next('.j-select-list').removeClass('active');
                return false;
            } else if(self.next().find('.select-item').length > 0 && !self.next('.select-list').hasClass('active')) {
                self.next('.j-select-list').addClass('active');
                return false;
            }
        });

        $(document).on('click', function (e) {
            e.stopPropagation();
            $("#myul").hide()
        })
				//电子发票：企业1 || 个人0
	  $(document).on('click', '.pers_enter', function() {
			 $('#eletitle').text('');
				$(this).addClass('on').siblings('a').removeClass('on');
				if($(this).attr('id')=='enterpri'){
					$('#enterCate').val('1')
					$('#sbh').show()
				}else{
					$('#enterCate').val('0')
					$('#sbh').hide()
				}
		})
		$(document).on('click', '#elei', function() {
			//$('.ele').show();
			$("#invoiceCate").val("2");
					$(this).addClass('on').siblings('a').removeClass('on');
			$("#addele").show();
			$('#addinc').hide();
			//$('#mask-ele').css({ opacity: 1, zIndex: '1501', visibility: 'visible', display: 'block' });
			invoice.electron_titleContent= $("#electron_titleContent").val();
		});
		//保存发票
		$(document).on('click', '#saveElei', function() {
					let electron_ratepayer = $("#electron_ratepayer").val(),err = $("#eletitle"),reg = /^[0-9a-zA-Z]{15,20}$/g;
					if($('#enterCate').val()=='0'){
						if(titleTest()) {
							Msg.Alert("","已保存",function(){});
							$("#invoiceCate").val("2");
							$("#eletitle").text("");
						}else{
							err.text("请输入发票抬头").show();
							return false;
						}
					}else if($('#enterCate').val()=='1'){
							if(titleTest()){
								if(!reg.test(electron_ratepayer)){
									err.text("请输入正确纳税人识别号15-20位").show();
									return false;
								}else{
									Msg.Alert("","已保存",function(){});
										//$(".mar-l span").removeClass("active");
										//$(".mar-l span:eq(0)").addClass("active");
									 // $('.i-ele').hide();
										//$("#addele").hide();
										//$('#mask-ele').hide();
										$("#invoiceCate").val("2");
										$("#eletitle").text("");
								}
							}else{
								err.text("请输入发票抬头").show();
								return false;
							}
	        }
	    });
			//去掉弹出框
		// $(document).on('click', '#addele .y_close,#addele .close,#mask-ele', function() {
    //         $('.i-ele').hide();
    //         $("#addele").hide();
    //         $('#mask-ele').hide();
    //          var err =  $("#eleratepayer");
    //         $("#electron_titleContent").val(invoice.electron_titleContent);
    //         err.hide();
    //         var electron_ratepayer = $("#electron_ratepayer")
    //         if(Map.get('name') != electron_ratepayer.val()) {
    //             electron_ratepayer.val('');
    //         }
    //     });
        //抬头校验
		function titleTest() {
			var eletitle = $("#electron_titleContent").val();
            var err = $("#eletitle");
			if(eletitle == "") {
				err.show()
				err.text("请输入电子发票抬头");
				$("#electron_titleContent").addClass("active");
				$("#electron_titleContent").focus();
				return false;
			} else {
				$("#electron_titleContent").removeClass("active");
                 err.hide();
				return true
			}
		}
		//验证纳税人识别号
		function checkElectron_ratepayer() {
		    var electron_ratepayer = $("#electron_ratepayer").val(),err = $("#eletitle");

            var reg = /^[0-9a-zA-Z]{15,20}$/g;
            if(electron_ratepayer) {
                if(reg.test(electron_ratepayer)) {
                    err.text("");
                    Map.put('name', electron_ratepayer)
                    return true
                }else{
                    err.text("请输入正确纳税人识别号15-20位").show();
                    return false;
                }
            }else{
                Map.set('name', '')
                return true;
            }
        }
	})
})
