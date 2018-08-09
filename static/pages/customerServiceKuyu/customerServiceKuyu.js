 require(['KUYU.Service', 'KUYU.plugins.slide', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'juicer', 'base64', 'loadPlate',
     'platHead', 'platTopCart',  'KUYU.plugins.alert', 'comm', 'index', 'jquery.flexslider-min', 'limitOrder',
     'opCookieUtil', 'y_member'
 ], function() {
     var $http = KUYU.Service;
     var slidBarLogin = KUYU.SlideBarLogin;
 
 
 
     /**
      * js整理
      * 服务页面主页
      * @Author:赵源
      * @date:2016-09-07
      */
     define(function() {
         var obj = {};
         obj.index = function() {
             function searchJdcx() {
                 var fwzcurl = jsContextPath + "/servicecenter/serviceDolicyKuyu";
                 $.get(fwzcurl, { leaderFlag: "${leaderFlag}", ranNum: Math.random() }, function(data) {
                     $("#fwzc").html(data);
                 })
             }
 
             function makeService(val) {
                 var url = url_1;
                 $.ajaxSettings.async = false;
                 $.getJSON(url, { ranNum: Math.random() }, function(data) {
                     if (!data.rsp) {
                         location.href = data.accountLoginUrl + location.href;
                     } else {
                         location.href = url_2 + "=" + val;
                     }
                 })
 
             }
 
             $(document).on('click', '.j-repair li', function() {
 
                 var index = $(this).index();
 
                 $(this).addClass('active').siblings().removeClass('active');
                 /* $('.j-bigbox').find('li').hide();
                 $('.j-bigbox').find('li').eq(index).show(); */
 
                 var valuetype = $(this).attr("typevalue");
                 $("#valuetype").val(valuetype);
                 getServiceType();
 
             }).on('click', '.j-twotab li', function() {
 
                 var index = $(this).index();
 
                 $(this).addClass('active').siblings().removeClass('active');
                 $('.two-content').find('ul').hide();
                 $('.two-content').find('ul').eq(index).show();
 
             }).on('click', '.j-threetab li', function() {
 
                 var index = $(this).index();
 
                 $(this).addClass('active').siblings().removeClass('active');
                 $('.j-threebox').find('li').hide();
                 $('.j-threebox').find('li').eq(index).show();
 
             }).on('click', '.jincuchaxun', function() {
                 var mobile = $('#jindu').val();
                 if (mobile == '') {
                     Msg.Alert("","请填写电话",function(){});
                     return false;
                 } else {
                     var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                     if (!reg.test(mobile)) { //|| !reg1.test(mobileNo) 验证座机
                         Msg.Alert("","电话格式不正确",function(){});
                         return false;
                     }
                 }
                 //var cjwturl = jsContextPath+"/servicecenter/serviceDemandDealProcessKuyu?mobile="+mobile ;	
                 //window.open(cjwturl);
                 /* $.post(cjwturl,{leaderFlag:"${leaderFlag}",mobile:mobile,ranNum:Math.random()} ,function(data){
                 	if(data){
                 		$("#serviceDemandDealProcess").html(data) ;
                 	}else{
                 		$("#serviceDemandDealProcess").empty();
                 	}				
                 }) */
                 //huangrc 20160822
                 var cjwturl = jsContextPath + "/servicecenter/serviceDemandDealProcessKuyu";
                 post(cjwturl, { 'mobile': mobile });
 
             }).on('click', '.elecPolicy', function() {
                 var mobile = $('#elecPolicy').val();
                 if (mobile == '') {
                     Msg.Alert("","请填写电话",function(){});
                     return false;
                 } else {
                     var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                     if (!reg.test(mobile)) { //|| !reg1.test(mobileNo) 验证座机
                         Msg.Alert("","电话格式不正确",function(){});
                         return false;
                     }
                 }
                 //var dzbdurl = '${pageContext.servletContext.contextPath}/servicecenter/toElecPolicy?mobile='+mobile;
                 //window.open(dzbdurl);
                 var dzbdurl = url_3;
                 post(dzbdurl, { 'mobile': mobile });
             });
 
             $(document).ready(function() {
                 $.ajax({
                     url: url_4,
                     dataType: "json",
                     type: "GET",
                     success: function(data) {
                         if (data) {
                             var str = "<option value=''>请选择产品类别</option>";
                             var checked = "";
                             $.each(data, function(k, v) {
                                 if (v.uuid == '${productCategory}') {
                                     checked = "selected";
                                     str = str + "<option value='" + v.uuid + "' " + checked + ">" + v.categoryName + "</option>";
                                 } else {
                                     str = str + "<option value='" + v.uuid + "'>" + v.categoryName + "</option>";
                                 }
                             })
                             $("#productCategory").html(str);
                             if (checked == "selected") {
                                 subCategory('${productCategory}');
                             }
                         }
                     }
                 });
                 getServiceType();
 
                 var fwzcurl = jsContextPath + "/servicecenter/serviceDolicyKuyu";
                 $.get(fwzcurl, { leaderFlag: "${leaderFlag}", ranNum: Math.random() }, function(data) {
                     $("#fwzc").html(data);
                 })
 
                 var cjwturl = jsContextPath + "/frontback/tclcontent/showTCLservicecontentListKuyu/1/30";
                 $.post(cjwturl, { leaderFlag: "${leaderFlag}", ranNum: Math.random() }, function(data) {
                     $("#changjianwenti").html(data);
                 })
                 $('.z_tijiao').show();
 
 
             })
 
             function post(url, params) {
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
         };
         /**
          * js整理
          * 相关下载页面
          * @Author:赵源
          * @date:2016-09-07
          */
         //类型切换
         obj.downld = function() {
             $(".product-text dd").click(function() {
                 var uuid = $(this).attr("data-id");
                 var subcategory = $("#subcategoryname");
                 $.get(url_5 + "=" + uuid + "&ranNum=" + Math.random(),
                     function(data) {
                         if (data) {
                             subcategory.html("");
                             $.each(data, function(i, item) {
                                 subcategory.append("<a data-subid=\"" + item.uuid + "\" href=\"javascript:;\" class=\"j-close\">" + item.categoryName + "</a>");
                             })
                             $(".select-mask").css({ "z-index": 1, "opacity": 1 }).show();
                             $(this).addClass("active").siblings("dd").removeClass("active");
                             $(".select-first").show();
                         }
                     }, "json");
 
             })
 
 
             $("body .select-first").on("click", ".j-close", function() {
                 var $this = $(this);
                 var uuid = $(this).attr("data-subid");
                 var pversion = $("#productversion");
                 $.get(url_6 + "=" + uuid + "&ranNum=" + Math.random(),
                     function(data) {
                         if (data) {
                             pversion.html("");
                             $.each(data, function(i, item) {
                                 pversion.append("<a href=\"javascript:;\" data-version=\"" + item.uuid + "\" class=\"j-close\">" + item.categoryName + "</a>");
                             })
                             $this.addClass("active").siblings("a").removeClass("active");
                             $(".select-first").hide();
                             $(".select-second").show();
                         }
                     }, "json");
 
             })
 
             $("body .select-second").on("click", ".j-close", function() {
                 var $this = $(this);
                 $this.addClass("active").siblings("a").removeClass("active");
                 var uuid = $(this).data("version");
                 $.get(url_7 + "=" + uuid + "&ranNum=" + Math.random(),
                     function(data) {
                         if (data.status == 'success') {
                             var tempwindow = window.open('_blank');
                             tempwindow.location = data.explainDownload.url; // 'https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/handbook/' + data.explainDownload.fileName;
                             //window.open('https://s3.cn-north-1.amazonaws.com.cn/f0.tcl.com/news/attached/ftpupload/handbook/' + data.explainDownload.fileName);
                         } else {
                             Msg.Alert("","对不起，该型号暂时不存在对应的说明文档！",function(){});
                         }
                     }, "json");
             })
 
             //选择类型之后显示  型号
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
         /**
          * js整理
          * 客服页面
          * @Author:赵源
          * @date:2016-09-07
          */
         obj.kefu = function() {
             //售前咨询弹出页面
             $(".baiduChat").click(function() {
                 if ($("#nb_invite_ok")) {
                     $("#nb_invite_ok").click();
                 } else {
                     var iWidth = 830; //弹出窗口的宽度;
                     var iHeight = 700; //弹出窗口的高度;
                     //获得窗口的垂直位置
                     var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                     //获得窗口的水平位置
                     var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                     var params = 'width=' + iWidth + ',height=' + iHeight + ',top=' + iTop + ',left=' + iLeft + ',channelmode=yes' //是否使用剧院模式显示窗口。默认为 no
                         + ',directories=yes' //是否添加目录按钮。默认为 yes
                         + ',fullscreen=no' //是否使用全屏模式显示浏览器
                         + ',location=no' //是否显示地址字段。默认是 yes
                         + ',menubar=no' //是否显示菜单栏。默认是 yes
                         + ',resizable=no' //窗口是否可调节尺寸。默认是 yes
                         + ',scrollbars=no' //是否显示滚动条。默认是 yes
                         + ',status=no' //是否添加状态栏。默认是 yes
                         + ',titlebar=no' //默认是 yes
                         + ',toolbar=no' //默认是 yes
                     ;
 
                     window.open('http://p.qiao.baidu.com//im/index?siteid=9318717&ucid=6393691', 'newwindow', params);
                 }
 
             });
             //售后咨询弹出页面
             $(".consultation").click(function() {
                 var iWidth = 830; //弹出窗口的宽度;
                 var iHeight = 700; //弹出窗口的高度;
                 //获得窗口的垂直位置
                 var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                 //获得窗口的水平位置
                 var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                 var params = 'width=' + iWidth + ',height=' + iHeight + ',top=' + iTop + ',left=' + iLeft + ',channelmode=yes' //是否使用剧院模式显示窗口。默认为 no
                     + ',directories=yes' //是否添加目录按钮。默认为 yes
                     + ',fullscreen=no' //是否使用全屏模式显示浏览器
                     + ',location=no' //是否显示地址字段。默认是 yes
                     + ',menubar=no' //是否显示菜单栏。默认是 yes
                     + ',resizable=no' //窗口是否可调节尺寸。默认是 yes
                     + ',scrollbars=no' //是否显示滚动条。默认是 yes
                     + ',status=no' //是否添加状态栏。默认是 yes
                     + ',titlebar=no' //默认是 yes
                     + ',toolbar=no' //默认是 yes
                 ;
 
                 window.open('http://125.93.53.91:31337/app/chat.html', 'newwindow', params);
             })
         };
         /**
          * js整理
          * 进度查询页面
          * @Author:赵源
          * @date:2016-09-07
          */
         obj.jindu = function() {
 
             /*视差滚动插件初始化*/
             //屏蔽此js是因为报错，页面无法提交
             //var s3 = skrollr.init({
             //		forceHeight: false
             //	});
 
             $(".btn-custom2").click(function() {
                 var mobile = $('#mobile').val();
                 if (mobile == '') {
                     alert("请填写电话");
                     return false;
                 } else {
                     var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                     if (!reg.test(mobile)) { //|| !reg1.test(mobileNo) 验证座机
                         alert("电话格式不正确");
                         return false;
                     }
                 }
                 $("#progressForm").submit();
             })
         };
         /**
          * js整理
          * 电子保单页面
          * @Author:赵源
          * @date:2016-09-07
          */
         obj.baodan = function() {
 
             $(function() {
                 $('#insurance_smbtn').click(function() {
                     search();
                 }); //click end
                 var mobile = '${mobile}';
                 if (mobile != '') {
                     search();
                 }
             });
 
             function search() {
                 var mobile = $('#mobile').val();
                 if (mobile == '') {
                     alert("请填写电话");
                     return false;
                 } else {
                     var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                     if (!reg.test(mobile)) { //|| !reg1.test(mobileNo) 验证座机
                         alert("电话格式不正确");
                         return false;
                     }
                 }
                 $.ajax({
                     type: 'POST',
                     url: url_8,
                     data: {
                         mobile: mobile,
                     },
                     success: function(obj) {
                         if (obj.code == 1) {
                             var str = "";
                             for (var i = 0; i < obj.data.length; i++) {
                                 str += "<li id='insurance_list" + (i + 1) + "'>";
                                 str += "<h4><em class='num'>NO." + (i + 1) + "</em>";
                                 str += "<em class='title'>";
                                 str += "<span>保单号：" + obj.data[i].orderno + "</span>";
                                 str += "<span>产品品类：" + obj.data[i].prodtype + " </span>";
                                 str += "<span>购买时间：" + obj.data[i].buytime + "</span>"
                                 str += "<span class='red'>" + obj.data[i].status + "</span>";
                                 str += "<a href='#' class='open'>打开</a>";
                                 str += "</em></h4>";
                                 if (obj.data[i].justview == 0) {
                                     str += "<div class='search_result no_effect'>";
                                 } else {
                                     str += "<div class='search_result y_effect'>";
                                 }
                                 str += "<ul>";
                                 str += "<li><span>保单号：</span><em>" + obj.data[i].orderno + "</em></li>";
                                 str += "<li><span>客户姓名：</span><em>" + obj.data[i].custname + "</em></li>";
                                 str += "<li><span>客户电话：</span><em>" + obj.data[i].custtel + "</em></li>";
                                 str += "<li><span>客户地址：</span><em>" + obj.data[i].custaddr + "</em></li>";
                                 str += "<li><span>产品品类：</span><em>" + obj.data[i].prodtype + "</em></li>";
                                 str += "<li><span>产品型号：</span><em>" + obj.data[i].prodmodel + "</em></li>";
                                 str += "<li><span>购买商场：</span><em>" + obj.data[i].buymarket + "</em></li>";
                                 str += "<li><span>购买时间：</span><em>" + obj.data[i].buytime + "</em></li>";
                                 str += "<li><span>激活状态：</span><em>" + obj.data[i].status + "</em></li>";
                                 if (obj.data[i].justview == 1) {
                                     str += "<li><span>机号：</span><em>" + obj.data[i].macsn + "</em></li>";
                                 } else {
                                     str += "<li class='txt_jihao'><span>机号：</span><input name='macno" + (i + 1) + "' id='macno" + (i + 1) + "' type='text'></li>";
                                 }
                                 str += "</ul>";
                                 if (obj.data[i].justview == 0) { //0为需要激活，1为不需要激活
                                     str += "<input type='hidden' id='orderid" + (i + 1) + "'  name='orderid" + (i + 1) + "' value='" + obj.data[i].orderid + "'>";
                                     str += "<a href='javascript:sbt_jihuo(" + (i + 1) + ");' class='btn'>激 活</a>";
                                 }
                                 str += "</div>";
                                 str += "</li>";
                             }
                             //alert(str);
                             $("#showinsurancelist").html(str);
 
                             $(".baodan_result li h4 a").click(function(e) {
                                 e.preventDefault();
                                 $(this).toggleClass("open");
                                 $(this).parents("h4").siblings(".search_result").slideToggle();
                                 $(this).parents("li").siblings().find("h4").find("a").addClass("open");
                                 $(this).parents("li").siblings().find(".search_result").slideUp();
                             });
                         } else {
                             alert(obj.message);
                             return false;
                         }
 
                     }, //success end
                     error: function() {
                         alert("出错啦！请从查询！");
                         return false;
                     }
 
                 });
             }
 
             //保单激活 sbt_jihuo---start
             function sbt_jihuo(id) {
 
                 var macno = $('#macno' + id).val();
                 var orderid = $('#orderid' + id).val();
 
                 $.post(url_9, { orderid: orderid, macno: macno }, function(data) {
                     if (data.code == 1) {
                         alert(data.message);
                         $("#insurance_list" + id + " .no_effect .btn").siblings("ul").find("li:nth-last-child(2)").remove();
                         $("#insurance_list" + id + " .title .red").remove();
                         $('<span class="red">生效</span>').appendTo("#insurance_list" + id + " .title");
                         $("#insurance_list" + id + " .no_effect .btn").siblings("ul").find("li:nth-last-child(1)").remove();
                         $("#insurance_list" + id + " .no_effect .btn").parent("div").attr({ "class": "search_result y_effect" });
                         $('<li><span>激活状态：</span><em>已激活</em></li><li><span>机号：</span><em>' + macno + '</em></li>').appendTo("#insurance_list" + id + " .y_effect ul");
                         $("#insurance_list" + id + " .y_effect .btn").remove();
                     } else {
                         alert(data.message);
                     }
 
                 });
             } //sbt_jihuo---end
 
         };
         return obj;
     });
 	
	
 })