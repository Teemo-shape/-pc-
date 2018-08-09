require(['KUYU.Service', 'KUYU.SlideBarLogin', 'juicer','xss','KUYU.plugins.alert'], function() {
	var $http = KUYU.Service;
	var aa = KUYU.SlideBarLogin;
	var $init = KUYU.Init;
	var addinvoice = {};
	//抬头校验
function companyTest() {
	var addtitle = $("#add_companyName").val();
	if(addtitle == "") {
		$("#errortxt").text("请输入发票抬头");
		$("#add_companyName").addClass("active");
		$("#add_companyName").focus();
		return false;
	} else {
		$("#add_companyName").removeClass("active");

		return true;
	}
}
//纳税人识别号校验
function codeTest() {
	var addcode = $("#add_code").val();
	var err = $("#errortxt");
	var reg = /^[0-9a-zA-Z]{15,20}$/g;
	if(addcode==''||!reg.test(addcode)) {
			err.text("请输入正确纳税人识别号字母或数字15-20位之间").show();
			$("#add_code").addClass("active");
			$("#add_code").focus();
			return false;
	}else{
		err.text("");
		$("#add_code").removeClass("active");
		return true;
	}
}
//注册地址校验
function addressTest() {
	var address = $("#add_address").val();
	if(address == "") {
		$("#errortxt").text("请输入注册地址");
		$("#add_address").addClass("active");
		$("#add_address").focus();
		return false;
	} else {
		$("#add_address").removeClass("active");

		return true;
	}
}
//注册电话校验
var titlemobile_Reg =  /^(1[3|4|5|7|8][0-9]\d{8})$|^([0]\d{2,3}-\d{7,8})$/
function registerMobileTest() {
	var mobile = $("#add_registerMobile").val();
	if(mobile == "") {
		$("#errortxt").text("请输入注册电话");
		$("#add_registerMobile").addClass("active");
		$("#add_registerMobile").focus();
		return false;
	}else if(!titlemobile_Reg.test(mobile)) {
		$("#errortxt").text("请输入正确的注册电话手机或座机如:0755-1234567");
		$("#add_registerMobile").addClass("active");
		$("#add_registerMobile").focus();
		return false;
	}
	else {
		$("#add_registerMobile").removeClass("active");

		return true;
	}
}
$("p").on('keyup', '#add_registerMobile', function(event) {
	if(registerMobileTest()){
		$("#errortxt").text("");
		$("#add_registerMobile").removeClass("active");
	}
});

//开户行校验
var titleReg = /^[a-zA-Z0-9|\d|\u0391-\uFFE5]*$/;
function bankNameTest() {
	var bankname = $("#add_bankName").val();
	if(bankname == "") {
		$("#errortxt").text("请输入开户银行");
		$("#add_bankName").addClass("active")
		$("#add_bankName").focus();
		return false;
	}
	else if(!titleReg.test(bankname)) {
			$("#errortxt").text("请输入正确的开户行");
			$("#add_bankName").addClass("active")
			$("#add_bankName").focus();
			return false;
	} else {
		$("#add_bankName").removeClass("active");
		return true;
	}
}

//银行账户校验
function bankNoTest() {
	 var bank =  /^\d{16,19}$/;
	var bankno = $("#add_bankNo").val();
	if(bankno == "") {
		$("#errortxt").text("请输入银行账户");
		$("#add_bankNo").addClass("active");
		$("#add_bankNo").focus();
		return false;
	}else if(!bank.test(bankno)) {
		$("#errortxt").text("请输入正确的银行账户");
		$("#add_bankNo").addClass("active")
		$("#add_bankNo").focus();
		return false;
	}
	else {
		$("#add_bankNo").removeClass("active");
		return true;
	}
}
	$(function() {
			//获取发票设置列表
			$http.post({
				url: "/usercenter/addInvoice/getByCustomerUuid",
				data: {},
				success: function(res) {
					if(res.data.length > 0) {
						var data = res.data[0];
						$('#orderForm').attr("uuid", data.uuid);
						$("#add_companyName").val(data.companyName);
						$("#add_code").val(data.code);
						$("#add_address").val(data.address);
						$("#add_registerMobile").val(data.registerMobile);
						$("#add_bankName").val(data.bankName);
						$("#add_bankNo").val(data.bankNo);
						$("#add_uuid").val(data.uuid);
						$("#invoiceCate").val("2"); //设置电子发票；
					}
				}

			});
			//点击显示增值发票
			$(document).on('click', '#inci', function() {
				$("#invoiceCate").val("3");
					$(this).addClass('on').siblings('a').removeClass('on');
					$('#addinc').show();
					$("#addele").hide();
					//$('.i-inc').show()
					//$('#mask-inv').css({ opacity: 1, zIndex: '1501', visibility: 'visible', display: 'block' });
					addinvoice.add_companyName=$("#add_companyName").val();
					addinvoice.add_code=$("#add_code").val();
					addinvoice.add_address=$("#add_address").val();
					addinvoice.add_registerMobile=$("#add_registerMobile").val();
					addinvoice.add_bankName=$("#add_bankName").val();
					addinvoice.add_bankNo=$("#add_bankNo").val();
				})
			//保存发票
			$(document).on('click', '#saveInvo', function() {
				if((companyTest()) && (codeTest()) && (addressTest()) && (registerMobileTest()) && (bankNameTest()) && (bankNoTest())) {
					$("#invoiceCate").val("3");
					$(".mar-l span").removeClass("active");
					$(".mar-l span:eq(1)").addClass("active");
					$('#addinc').hide();
					//$('.i-inc').hide();
					//$('#mask-inv').hide();
					$("#errortxt").text("");
					Msg.Alert("","已保存",function(){});
				}
			})

			//去掉弹出框
			// $(document).on('click', '#addinc .y_close,#addinc .close,#mask-inv', function() {
			// 	$('#addinc').hide();
			// 	$('.i-inc').hide()
			// 	$('#mask-inv').hide();
			// 	$("#add_companyName").val(addinvoice.add_companyName);
			// 	$("#add_code").val(addinvoice.add_code);
			// 	$("#add_address").val(addinvoice.add_address);
			// 	$("#add_registerMobile").val(addinvoice.add_registerMobile);
			// 	$("#add_bankName").val(addinvoice.add_bankName);
			// 	$("#add_bankNo").val(addinvoice.add_bankNo);
			// })
		})

	$("p").on('keyup', '#add_bankNo', function(event) {
		if(bankNoTest()){
			$("#errortxt").text("");
			$("#add_bankNo").removeClass("active");
		}
	});
})
