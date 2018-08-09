;(function(window, document, $){

	var defaults = {
		timer: 500,
		ipseed: 80,
		sortIndex: null,
		sortPower: true
	}
	

	var Plugin = function (element, options){
		this.element = element;

		this.screens = [
 		 parseInt(document.documentElement.clientWidth || document.body.clientWidth)/2,
 		 parseInt(document.documentElement.clientHeight || document.body.clientHeight)/2,
 		];
 		
	}
	//
	Plugin.prototype = {
		init: function(options){

			/*var self = this;
			var myBrowser = this.Browser();
			console.log($('.j_moveimg').length);
			var positionX = $('.j_moveimg').position().left;
			var positionY = $('.j_moveimg').position().top;
			options = options ? self.extend(defaults, options) : defaults;

			$('#banner').on('mousemove', function(event){

				event.stopPropagation();
				//当浏览器为IE或者Firefox时,移动lefe top
				if(myBrowser=='IE' || myBrowser =='Firefox'){

					var moveX = positionX + (self.screens[0]-event.pageX)/options.ipseed +'px'
			  	      , moveY = positionY + (self.screens[1] - event.pageY)/options.ipseed +'px';

			  	    $('.j_moveimg').css({left: moveX, top: moveY}); 

				}
				else{

					var moveX = (self.screens[0]-event.pageX)/options.ipseed +'px'
			  	      , moveY = (self.screens[1] - event.pageY)/options.ipseed +'px';

			  	    var text_moveX = (self.screens[0]-event.pageX)/options.ipseed*1.5 +'px'
			  	      , text_moveY = (self.screens[1] - event.pageY)/options.ipseed*1.5 +'px';

			  	    var back_moveX = (self.screens[0]-event.pageX)/options.ipseed*0.6 +'px'
			  	      , back_moveY = (self.screens[1] - event.pageY)/options.ipseed*0.6 +'px';


			  	    self.setTranslate('.j_movetext', text_moveX, text_moveY, options.timer);
			  	    self.setTranslate('.j_moveback', back_moveX, back_moveY, options.timer);
			  	    self.setTranslate('.j_moveimg', moveX, moveY, options.timer);

				}

			});*/

		},
		setTranslate: function (element, moveX, moveY, timer){
			$(element).css('transform', 'translate3d(' + moveX + ', '+moveY+', 0px)');
			$(element).css('-webkit-transform', 'translate3d(' + moveX + ', '+moveY+', 0px)');
			$(element).css('-webkit-transition-duration', timer+'ms');
		},
		clickLight: function(element, clas, callback){
			$(document).on('click', element, function(){
				var text = $(this).text();
				$(this).parent().addClass(clas).siblings().removeClass(clas);
				//执行回调函数
				callback ? callback($(this), text) : null;
			});
		},
		clickSlide: function (element, ele, clas, timer, callback){
			var slow = timer ? timer : 260;
			$(document).on('click', element, function(){
				if($(this).hasClass(clas)) {
					$(this).next(ele).slideUp(slow);
					$(this).removeClass(clas);
				}
				else {
					$(this).next(ele).slideDown(slow);
					$(this).addClass(clas);
				}
				//执行回调函数
				callback ? callback() : null;
			});
		},
		editNumber: function(element, callback){
			$(document).on('click', element, function(){
				var arr = $(this).attr('class').split('.');
				var el = $(this).parents('.j-select').find('.val');
				var text = arr[arr.length-1];
				var val = el.val();

				text=='add' ? val++ : val--;
				if(val==0 || val>=999){
					return false;
				}
				el.val(val)
				//执行回调函数
				callback ? callback($(this)) : null;
			});
		},
		clickSort: function(element, callback){
			$(document).on('click', element, function(){
				var text = $(this).text();
				//执行回调函数
				callback ? callback(text) : null;
			});
		},
		priceSort: function(element, clas, callback){
			var self = this
			$(document).on('click',element, function(){
				self.sortPower = false;
				self.sortIndex = $(this).index();
				$(this).addClass(clas).siblings().removeClass(clas);
				$('.price-start').val($(this).data('start'));
				if($(this).data('end') ==Infinity) {
					$('.price-end').val(" ");
					return false;
				}
				$('.price-end').val($(this).data('end'));

			}).on('mouseover',element, function(){
				$(this).addClass(clas).siblings().removeClass(clas);
				$('.price-start').val($(this).data('start'));
				if($(this).data('end') ==Infinity) {
					$('.price-end').val(" ");
					return false;
				}
				$('.price-end').val($(this).data('end'));
			}).on('mouseout',element, function(){
				console.log('mouseout', self.sortIndex);
				$(element).removeClass(clas);
				if (!self.sortPower){
					if(self.sortIndex=='undefined' || self.sortIndex==null){
						$('.price-start').val($('.price-start').data('start'));
						$('.price-end').val($('.price-end').data('end'));
						return false;
					}

					$(element).eq(self.sortIndex).addClass(clas);
					$('.price-start').val($(element).eq(self.sortIndex).data('start'));
					if($(element).eq(self.sortIndex).data('end') ==Infinity) {
						$('.price-end').val(" ");
						return false;
					}
					$('.price-end').val($(element).eq(self.sortIndex).data('end'));
					
				}
				else {
					$('.price-start').val("");
					$('.price-end').val("");
				}
				
			});
		},
		addSort: function(index){
			self.sortIndex = index;
			console.log('addSort', self.sortIndex);
		},
		removeSort: function(){
			this.sortIndex = null;
		},
		allSelect: function(element, clas, callback){
			$(document).on('click', element, function(){
				if($(this).hasClass(clas)){
					$(this).removeClass(clas);
					$('.j-odd').removeClass(clas);
				}
				else{
					$(this).addClass(clas);
					$('.j-odd').addClass(clas);
				}
				//执行回调函数
				callback ? callback($(this)) : null;
			});
		},
		oddSelect: function(element, clas, callback){
			$(document).on('click', element, function(){
				if($(this).hasClass(clas)){
					$(this).removeClass(clas);
				}
				else{
					$(this).addClass(clas);
				}
				//执行回调函数
				callback ? callback($(this)) : null;
			});
		},
		clickRadio: function(element, clas, callback){
			$(document).on('click', element, function(){
				$(this).parents('.cont-item').addClass(clas).siblings().removeClass(clas);

				//执行回调函数
				callback ? callback() : null;
			});
		},
		Alert: function(obj, config ,callback){

			var self = this;
			var Browser = self.Browser();
			var parameter  = {
				title     : '提示',
				content   : '55英寸观影王2代纤薄版',
				ok        : true,
				cancel    : false,
				okText    : '确定',
				cancelText: '取消'
			}
			if(config) parameter = $.extend({},true, parameter, config)
			var html = '';

			if(typeof obj =='string'){

				html = '<div class="alert-box j-alert">'+
							'<h3 class="alert-title">'+(parameter.title?parameter.title:'')+'<span class="close j-close">&#xe63b;</span></h3>'+
							'<div class="content">'+
								'<p class="text">'+obj+'</p>'+
								'<p class="fr"><span class="but ok j-ok">'+(parameter.okText?parameter.okText:'')+'</span></p>'+
							'</div>'+
						'</div>';

			}
			else if(typeof obj =='object'){
				
				parameter = obj ? self.extend(parameter, obj) : parameter;
				html = '<div class="alert-box j-alert">'+
							'<h3 class="alert-title">'+parameter.title?parameter.title:''+'<span class="close j-close">&#xe63b;</span></h3>'+
							'<div class="content">'+
								'<p class="text">'+parameter.content+'</p>'+
								'<p class="fr"><span class="but ok j-ok">'+(parameter.okText?parameter.okText:'')+'</span>';

				if(parameter.cancel){
					html += ' <span class="but cancel j-cancel">'+parameter.cancelText+'</span>';
				}
				
				html += '</p></div></div>';
			}
			
			$('body').append(html);
			
			var top = ($(window).height()-$('.j-alert').height())/3;
			$('.j-alert').css({top: top + 'px'});
			$('body').css({overflow: 'hidden'});
			if(Browser=='IE8'){
				$('.j-alert').show();
				$('.mask').show();
			}
			else{
				$('.mask').css({opacity: 0.8, zIndex: 10, display: 'block'});
				$('.j-alert').css({opacity: 1, zIndex: 20, display: 'block'});	
			}
            if(parameter.autoClose) {
                setTimeout(function () {
                    closeAlert(callback);
                    callback ? callback() : null;
                },parameter.timer||3000)
            }
            function closeAlert(callback) {
                $('.j-alert').remove();
                $('body').removeAttr("style");
                $('.mask').hide();
				if($.isFunction(callback)) callback();
            }
            $(document).on('click', '.j-close, .j-ok, .j-cancel, .mask',function(event){
                event.stopPropagation();
                closeAlert(callback)
                if($(this).hasClass('j-ok')){
                    //执行回调函数
                    callback ? callback() : null;
                }

            });

			
		},
		selectDrop: function(element, obj, callback){
			var item = $('.element').next().find('.j-select-item');
			var html = '';
			for (var i in obj) {
				html+= '<li class="select-item j-select-item">'+obj[i].titleContent+'</li>';
			}
			$(document).on('click', '.j-select-list .j-select-item', function(){
				var index = $(this).index();
				var text = $(element).next().find('.j-select-item').eq(index).text();
				$(element).val(text);
				$(element).next().removeClass('active');
			});
			
			//执行回调函数
			callback ? callback(html) : null;
		},
		Browser: function(){
			//取得浏览器的userAgent字符串
			var userAgent = navigator.userAgent;
			var isOpera = userAgent.indexOf('Opera')!=-1
			if (isOpera){
				return 'Opera';
			}
			if (userAgent.indexOf('Firefox')!=-1){
				return 'Firefox';
			}
			if (userAgent.indexOf('Chrome')!=-1){
				return 'Chrome';
			}
			if (userAgent.indexOf('Safari')!=-1){
				return 'Safari';
			}
			if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		        // return "IE";
			    if(navigator.userAgent.indexOf("MSIE 8.0")>0)  
			    {  
					return "IE8";
			    }   
			    return 'IE';

			}; 
			
		},
		extend: function(defaults, options){
			//合并参数列表并返回
			for(var i in defaults){
				if(options[i]){
					defaults[i] = options[i];
				}
			}
			return defaults;
		}
	}

	return plugin = new Plugin();

})(window,document,jQuery);
(function($){
	var ShowTade = function(){
	}
	ShowTade.prototype.init = function(obj){
		obj.addClass('active');

		var self = obj.find('.j-val');

		var html ="<div id='box_sha' class='box_sha'><div class='box_top'><div class='select-data'><p class='year j-chooseYear'><code class='j-Year'></code>年<span class=' sanjiao'></span></p>"+
		  "<p class='month j-chooseMonth'><code class='j-Month'></code>月<span class='sanjiao'></span></p><div class='chooseyear'><ul class='centent'></ul></div>"+
		  "<div class='chooseym'><div class='cho_bottom'><table id='cho_table' width='100%' border='0' cellspacing='0' cellpadding='0'><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td>"+
		  "<td>5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr><tr><td>10</td><td>11</td><td>12</td></tr></table></div></div></div></div><div class='box_bottom'>"+
		  "<table width='100%' border='0' cellspacing='0' cellpadding='0'><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th>"+
		  "<th>六</th></tr></thead><tbody id='idCalendar'></tbody></table></div></div>";
		if(document.getElementById('box_sha')==null){
			obj.append(html);
		}
		var year = null;
		var month = null;
		var today = null;
		var t = obj.height();
		$("#box_sha").css({top:t});
		
		if(self.val()){
			var selfVal = self.val();
			var arr = selfVal.split('-');
			year = arr[0];
			month = arr[1];
			today = arr[2];
		}
		else {
			var t = new Date();
			year = t.getFullYear();
			month = t.getMonth() + 1;
			today = t.getDate();
			self.val(year +"-"+month +"-"+ today);
		}
		$(".j-Year").text(year);
		$(".j-Month").text(month);
	    week(today);
	    $("#box_sha").show();
		
		//click select year
		$(document).on('click', '.j-chooseYear', function(event){
			event.stopPropagation();
		    ChooseYear(year, false);
		    closeYearMonth();
		 });
		//click select Month
		$(document).on('click', '.j-chooseMonth', function(event){
			event.stopPropagation();
		    ChooseYearMonth();
		    closeYear();
		 });
		
		//select data
		$(document).on('click', '.box_bottom .j-day', function(event){
			event.stopPropagation();
			var CourY = $(".j-Year").text();	
			var CourM = $(".j-Month").text();
			var CourD = $(this).text();
			self.val(CourY +"-"+CourM +"-"+ CourD);

			setTimeout(function(){
				$("#box_sha").remove();
				obj.removeClass('active');
			},100);
		});
		 
		//click select data
		$(document).on('click', '#mine', function(event){
			var text = self.val();
			text--;
			self.val(text--);
			if(text < 0){
			self.val(0);
			}
		});

		$(document).on('click', '#cho_table td', function(event){
			event.stopPropagation();
			$(".j-Month").text($(this).text());
			closeYearMonth();
			week(today);
		});

		$(document).on('click', '.chooseyear .item', function(event){
			event.stopPropagation();
			$(".j-Year").text($(this).text());
			closeYear();
			week(today);
		});

		//click select Month function 
		function ChooseYearMonth(){
			$(".chooseym").show();
		};

		//click close Moth messageBox
		function closeYearMonth(){
			$(".chooseym").hide();
		};

		//click select Year function 
		function ChooseYear(num, bool){

			var html = '';
			var preYear = new Date().getFullYear();
			var index = preYear - 100;
			for (var i = preYear; i >= index ; i--) {
				html+='<li class="item">'+i+'</li>';
			};
			$(".chooseyear").find('.centent').empty();

			$(".chooseyear").find('.centent').append(html);
			$(".chooseyear").show();
		};

		//click close Year messageBox
		function closeYear(){
			$(".chooseyear").hide();
		};

		function week(dayVal) {
			var weekY = $(".j-Year").text();
			var weekM = $(".j-Month").text();

			var weekD =  '01';
			var d = new Date();
			d.setFullYear(weekY,weekM-1,weekD);
			var Sub = d.getDay();
			var weekday=new Array("日","一","二","三","四","五","六");
			var week = weekday[Sub];
			
			var d = new Date(weekY,weekM,0)
			var days = d.getDate();
			if(weekM==1){
				var preM =31;
		    }
			else{
				var pre = new Date(weekY,weekM-1,0)
				var preM = pre.getDate();
			};

			 var t = new Date();
			t.setFullYear(weekY,weekM-1,days);
			var today = t.getDay();
			
		    Calendar(Sub,days,preM,today,dayVal);
		};
		//Traversal calendar list
		function Calendar(ub,ds,pm,td,diy){
			//Used to save the date list
			var arr = [];
			if(!diy){
				var dd = new Date();
				var diy = dd.getDate();
			}
			//var Odiv = document.getElementById('idCalendar');
			
			$("#idCalendar").empty();
		    
			for(var i=(pm-ub+1); i<=pm; i++){ 
			    var addtd = document.createElement("td");
				addtd.className = 'mi';
				addtd.innerHTML=i;
				arr.push(addtd);
			};
			
			for(var t=1; t<=ds; t++){ 
			    var addtd = document.createElement("td");	
			    addtd.className = 'j-day';
				if(t==diy){
					addtd.className='j-day active';
					};
				addtd.innerHTML=t;
				arr.push(addtd);
			};
			for(var j=1; j<(7-td); j++){ 
			    var addtd = document.createElement("td");
				addtd.className = 'j-day mi';
				addtd.innerHTML=j;
				arr.push(addtd);	
			};
			var _addtr =  document.createElement("tr");
			//alert(arr.length);
			for(_a = 1;_a <= arr.length;_a++){
				_addtr.appendChild(arr[_a-1]);
				if(_a%7==0){
					 $("#idCalendar").append(_addtr);
					_addtr = document.createElement("tr");
				};
				if(_a == arr.length- 1&&_a %7 !=0){
					$("#idCalendar").append(_addtr);
				};
			};
			
		};
	};
	return showTade = new ShowTade();
})(jQuery);


