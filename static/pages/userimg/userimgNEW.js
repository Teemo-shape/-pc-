require(['KUYU.Service', 'KUYU.plugins.alert', 'KUYU.Binder', 'KUYU.userInfo', 'ajaxfileupload','KUYU.navFooterLink'], function() {
	var $http = KUYU.Service,
		$scope = KUYU.RootScope,
		$binder = KUYU.Binder,
		$init = KUYU.Init,
		userInfo = KUYU.userInfo,
		_env = KUYU.Init.getEnv(),
		navFooterLink =  KUYU.navFooterLink;
		$Store = KUYU.Store,
		_sever = KUYU.Init.getService();
	var path = _sever[_env.sever];
	 navFooterLink();
	$(function() {
		getUserInfo()
		sizeshow()
			//获取用户基本信息
		var user;
		user = JSON.parse(sessionStorage.getItem('userinfo'));
		if(user && user != null) {
			if(user.customerImgUrl) {
				$("#show_pic_round").attr("src", user.customerImgUrl)
				$(".y_viewpicdl img").attr("src", user.customerImgUrl)
			}
		} else {
			userInfo(function(res) {
				user = JSON.parse(sessionStorage.getItem('userinfo'));
				if(user.customerImgUrl) {
					$("#show_pic_round").attr("src", user.customerImgUrl)
					$(".y_viewpicdl img").attr("src", user.customerImgUrl)
				}
			});
		}
		//点击改变图片样式
		$(".title-imagebox").hover(function() {
			$(this).find(".change-image").fadeIn();
		}, function() {
			$(this).find(".change-image").fadeOut();
		});
		var all = $("#imageUl li");
		all.each(function() {
			$(this).click(function() {
				all.removeClass("m_cur");
				$(this).addClass("m_cur");
				var srcvalue = $(this).find("img").attr("src");
				$("#sysFile").val(srcvalue);
				uploadSysImage();
			});
		});
	});
	//更改小图片的路径
	function uploadSysImage() {
		var path = $("#sysFile").val();
		$("#show_pic").html("");
		$("#show_pic").append("<dl class='y_viewpicdl'>" + "<dt>" + "<img src='" + path + "'/>" + "</dt><dd>158像素X158像素</dd>" + "</dl><dl class='y_viewpicdl y_view50'><dt>" + "<img src='" + path + "'/>" + "</dt><dd>50像素X50像素</dd></dl>");
		$("#show_pic_round").attr('src', path);
	}

	//更新上传图片
	function upload() {
		var img = $("#show_pic_round").attr('src');
		if(img.indexOf("../../app") > -1) {
			img = img.split("../..")[1]
		} else {
			img = $("#show_pic_round").attr('src');
		}
		$http.post({
			url: "/usercenter/customercomplex/updateImage",
			data: {
				"img": img,
				ranNum : Math.random()
			},
			success: function(res) {
				if(res.code == "403" || res.code == "-6") {
					window.location.href = "{{login}}"
				}
				if(res.code == '0') {
					getUserInfo();
					Msg.Alert("","头像修改成功！",function(){
						window.location.reload();
					});
					
				}
			}
		})
	}
	//尺寸数字显示
	var size = 0;
	function sizeshow() {
		$http.get({
			url: "/fileupload/imageFileUploadConfig",
			success: function(data) {
				if (data.code == 0) {
					size = data.retData.maxByte/1024
					$('.y_upinfo').html('仅支持JPG、GIF、PNG、JPEG、BMP格式，文件小于'+parseInt(size)+'k')
				};
			}
		})
	}
	//更新图片
	function uploadImage() {
		var imgs = "";
		//$(".zqaddimgli").show();
		var formData = new FormData();
		formData.append("imgFile", document.getElementById("imgFile").files[0]);
		$.ajax({
			url: path + "/usercenter/customercomplex/uploadImage",
			type: "POST",
			data: formData,
			/**
			 *必须false才会自动加上正确的Content-Type
			 */
			contentType: false,
			/**
			 * 必须false才会避开jQuery对 formdata 的默认处理
			 * XMLHttpRequest会对 formdata 进行正确的处理
			 */
			processData: false,
			success: function(res) {
				if(res.code == '-1') {
					Msg.Alert("","上传失败",function(){
					});
				} else if(res.code == '-2') {
					Msg.Alert("","图片大小不能超过"+parseInt(size)+"k",function(){
					});
				} else if(res.code == '-3') {
					Msg.Alert("","请选择正确的图片格式",function(){
					});
				} else if(res.code == '0') {
					$("#show_pic").html("");
					$("#show_pic").append("<input type='hidden' name='imgName' value='" + res.data.picName + "' id='imgName'/>");
					$("#show_pic").append("<dl class='y_viewpicdl'><dt><img id='bigimg' src='" + res.data.remotePath + "'></dt><dd>158像素X158像素</dd></dl><dl class='y_viewpicdl y_view50' id='show_round_pic'><dt><img src='" + res.data.remotePath + "'></dt><dd>50像素X50像素</dd></dl>");
					$("#show_pic_round").attr('src', res.data.remotePath);
				}
			}
		})
	}
	//更新之后及时获取用户信息
	function getUserInfo() {
		var userinfo = {}
		$http.get({
			async: false,
			url: "/tclcustomer/userInfo",
			data: {
				ranNum: Math.floor(Math.random() * 10000)
			},
			success: function(data) {
				if(data.code == "403" || data.code == "-6") {
					window.location.href = "{{login}}"
				}
				if(data.code == CODEMAP.status.success) {
					var user = JSON.stringify(data.data)
					sessionStorage.setItem("userinfo", user);
				};
			}
		})
	}
	$("#imgFile").change(function(){
		uploadImage()
	})
	$(".save").click(function(){
		upload()
	})
//	$scope.upload = upload;
//	$scope.uploadImage = uploadImage;
	$init.Ready(function() {
		$binder.init();
	});
})