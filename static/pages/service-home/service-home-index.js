
define(['Plugin', 'KUYU.Service', 'KUYU.HeaderTwo', 'KUYU.Binder', 'KUYU.SlideBarLogin', 'KUYU.navHeader', 'KUYU.navFooterLink'], function () {
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

//  // [ 在线客服-售后咨询弹出页面
//  (function () {
//   $('.consultation').click(function () {
//     if (!window.localStorage.getItem('istaff_token')) {
//       $init.nextPage('login', {});
//       return;
//     }
//     var iWidth = 830;         //弹出窗口的宽度;
//     var iHeight = 700;        //弹出窗口的高度;
//     //获得窗口的垂直位置
//     var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
//     //获得窗口的水平位置
//     var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
//     var params = 'width=' + iWidth
//         + ',height=' + iHeight
//         + ',top=' + iTop
//         + ',left=' + iLeft
//         + ',channelmode=yes'//是否使用剧院模式显示窗口。默认为 no
//         + ',directories=yes'//是否添加目录按钮。默认为 yes
//         + ',fullscreen=no' //是否使用全屏模式显示浏览器
//         + ',location=no'//是否显示地址字段。默认是 yes
//         + ',menubar=no'//是否显示菜单栏。默认是 yes
//         + ',resizable=no'//窗口是否可调节尺寸。默认是 yes
//         + ',scrollbars=no'//是否显示滚动条。默认是 yes
//         + ',status=no'//是否添加状态栏。默认是 yes
//         + ',titlebar=no'//默认是 yes
//         + ',toolbar=no'//默认是 yes
//       ;
//     window.open('http://125.93.53.91:31337/app/chat.html', 'newwindow', params);
//   });
// })();
// // ] 在线客服-售后咨询弹出页面

  var obj = {
    index: function () {

      // [ alert
      var alert = (function () {
        var callback = null, final_callback = null;
        var open = function (msg, cb, fcb) {
          $('.service-home-wrapper > .alert > .msg').text(msg);
          $('.service-home-wrapper > .shade, .service-home-wrapper > .alert').fadeIn();
          callback = cb;
          final_callback = fcb;
        };
        var close = function () {
          $('.service-home-wrapper > .shade, .service-home-wrapper > .alert').fadeOut();
          final_callback && final_callback();
        };
        $('.service-home-wrapper > .alert > .x').click(close);
        $('.service-home-wrapper > .alert > .btn').click(function () {
          callback && callback();
          close();
        });
        return {open: open};
      })();
      // ] alert

      // [ banner
      (function () {
        var $banner_wrapper = $('.service-home-wrapper > .banner-wrapper');
        var $items = $banner_wrapper.children('.items');
        var $circles = $banner_wrapper.children('.circles');
        var init = function () {
          var $circle = $circles.children();
          if ($circle.length === 1) {
            $circles.remove();
            return;
          }
          $circles.css('margin-left', - $circles.outerWidth() / 2);
          var $item = $items.children();
          $items.children(':not(:first)').hide();
          $circles.children(':first').addClass('cur');
          $circle.mouseenter(function () {
            var $this = $(this), index = $this.index();
            $this.addClass('cur').siblings('.cur').removeClass('cur');
            $item.filter(':visible').stop().fadeOut(100, function () {
              $($item[index]).fadeIn(100);
            });
          });
          var intervalToggle = true;
          setInterval(function () {
            if (!intervalToggle) return;
            var $next = $circle.filter('.cur').next();
            if ($next.length === 0) $next = $circle.filter(':first');
            $next.mouseenter();
          }, 3000);
          $banner_wrapper.hover(function (e) {
            if ($(e.target).is('.circle')) return ;
            intervalToggle = false;
          }, function () {
            intervalToggle = true;
          });
        };
        $http.get({
          url: '/platbanner/getActives?terminalType=01',
          success: function (res) {
            if (res.code === '0') {
              var itemHtml = '', circleHtml = '';
              res.retData.forEach(function (obj) {
                itemHtml += '<a class="item" href="' + obj.url + '" target="_blank" style="background-image: url(' + obj.imageUrl + ');"></a>';
                circleHtml += '<span class="circle"></span>';
              });
              $items.html(itemHtml);
              $circles.html(circleHtml);
              init();
            }
          }
        });
      })();
      // ] banner

      // [ 搜索支持
      (function () {
        var $input = $('.service-home-wrapper > .search-support-wrapper > .input');
        var $opts = $('.service-home-wrapper > .search-support-wrapper > .opts');
        var $opt = $('.service-home-wrapper > .search-support-wrapper > .opts > .opt');
        var $title = $('.service-home-wrapper > .search-support-wrapper > .opts > .title');
        $input.focus(function () {
          $opts.show();
        });
        $input.blur(function () {
          setTimeout(function () {
            $opts.hide();
          }, 150);
        });
        $input.keyup(function () {
          clearTimeout($input.data('timeout'));
          $input.data('timeout', setTimeout(function () {
            var optArr = Array.prototype.slice.call($opt);
            var value = $.trim($input.val());
            if (value === '') {
              optArr.forEach(function (elem) {
                var $cur = $(elem);
                var text = $cur.data('text');
                $cur.text(text);
              });
              $opt.show();
              $title.text('快速链接');
              return ;
            }
            optArr.forEach(function (elem) {
              var $cur = $(elem);
              var text = $cur.data('text');
              if (text.indexOf(value) === -1) $cur.hide();
              else {
                $cur.html(text.replace(value, '<span style="color:#ff0000;">' + value + '</span>'));
                $cur.show();
              }
            });
            if ($opt.filter(':visible').length === 0) $title.text('无匹配');
            else $title.text('快速链接');
          }, 300));
        });
      })();
      // ]

      // [ 服务进度查询
      (function () {
        var $fwjdcq_img = $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .txyzm > img');
        var $sjhm = $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .sjhm');
        var $sjhm_vmsg = $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .sjhm-vmsg');
        var $txyzm = $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .txyzm > input');
        var $txyzm_vmsg = $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .txyzm-vmsg');
        var loadFwjdcqTxyzm = function () {
          $fwjdcq_img.data('key', Math.random());
          $fwjdcq_img.attr('src', '/rest/getCustomerRegCode?img-key=' + $fwjdcq_img.data('key'));
          $txyzm.val('');
          $txyzm.parent().removeClass('err');
          $txyzm_vmsg.remove('cor').text('');
        };
        loadFwjdcqTxyzm();
        $fwjdcq_img.click(loadFwjdcqTxyzm);
        $sjhm.blur(function () {
          var value = $.trim($sjhm.val());
          if (value === '') {
            $sjhm.addClass('err');
            $sjhm_vmsg.text('请输入手机号');
          } else if (!/^1[3578]\d{9}$/.test(value)) {
            $sjhm.addClass('err');
            $sjhm_vmsg.text('手机号格式不正确');
          } else {
            $sjhm.removeClass('err');
            $sjhm_vmsg.text('');
          }
        });
        $txyzm.blur(function () {
          setTimeout(function () {
            var value = $.trim($txyzm.val());
            if (value === '') {
              $txyzm.parent().addClass('err');
              $txyzm_vmsg.removeClass('cor').text('请输入验证码');
              return ;
            }
            $http.post({
              url: '/tclcustomerregist/checkValidateCode',
              data: {
                'img-key': $fwjdcq_img.data('key'),
                inputcode: value
              },
              success: function (res) {
                if (res.code === '0') {
                  $txyzm.parent().removeClass('err');
                  $txyzm_vmsg.addClass('cor').text('验证码正确');
                } else {
                  $txyzm.parent().addClass('err');
                  $txyzm_vmsg.removeClass('cor').text('验证码错误');

                  $fwjdcq_img.data('key', Math.random());
                  $fwjdcq_img.attr('src', '/rest/getCustomerRegCode?img-key=' + $fwjdcq_img.data('key'));
                }
              }
            });
          }, 100);
        });
        $('.service-home-wrapper > .query-wrapper > .fwjdcq-rq > .btn').click(function () {
          var $this = $(this);
          if ($this.data('submitting')) return;
          $this.data('submitting', true);
          setTimeout(function () {
            var sjhm = $.trim($sjhm.val());
            var txyzm = $.trim($txyzm.val());
            if (sjhm === '' || txyzm === '' || $sjhm.hasClass('err') || $txyzm.parent().hasClass('err')) {
              $this.removeData('submitting');
              alert.open('请输入查询条件');
              return;
            }
            var img_key = $fwjdcq_img.data('key');
            $http.post({
              url: '/servicecenter/serviceDemandDealProcessKuyu',
              data: {
                mobile: sjhm,
                captchakey: img_key,
                captchadata: txyzm
              },
              success: function (res) {
                var alert_open = function (msg) {
                  alert.open(msg, null, function () {
                    $fwjdcq_img.trigger('click');
                    $this.removeData('submitting');
                  });
                };
                if (res.code !== '0') {
                  alert_open(res.msg);
                  return ;
                }
                if (!res.data.serviceDemandModelList  || (res.data.serviceDemandModelList && !res.data.serviceDemandModelList.length)) {
                  alert_open('未找到对应记录');
                  return;
                }
                $fwjdcq_img.trigger('click');
                $Store.set('serviceDemandDealProcessKuyu', JSON.stringify(res.data))
                window.sessionStorage.setItem('jdcxhc', sjhm);
                window.sessionStorage.setItem('jdcx_img_key', img_key);
                window.sessionStorage.setItem('jdcx_img_vcode', txyzm);
                window.open('/pages/service/serviceDemandDealProcessKuyu.html');
                $this.removeData('submitting');
              }
            });
          }, 100);
        });
      })();
      // ] 服务进度查询

      // [ 电子保单查询
      (function () {
        var $dzbdcq_img = $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .txyzm > img');
        var $sjhm = $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .sjhm');
        var $sjhm_vmsg = $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .sjhm-vmsg');
        var $txyzm = $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .txyzm > input');
        var $txyzm_vmsg = $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .txyzm-vmsg');
        var loadDzbdcqTxyzm = function () {
          $dzbdcq_img.data('key', Math.random());
          $dzbdcq_img.attr('src', '/rest/getCustomerRegCode?img-key=' + $dzbdcq_img.data('key'));
          $txyzm.val('');
          $txyzm.parent().removeClass('err');
          $txyzm_vmsg.remove('cor').text('');
        };
        loadDzbdcqTxyzm();
        $dzbdcq_img.click(loadDzbdcqTxyzm);
        $sjhm.blur(function () {
          var value = $.trim($sjhm.val());
          if (value === '') {
            $sjhm.addClass('err');
            $sjhm_vmsg.text('请输入手机号');
          } else if (!/^1[3578]\d{9}$/.test(value)) {
            $sjhm.addClass('err');
            $sjhm_vmsg.text('手机号格式不正确');
          } else {
            $sjhm.removeClass('err');
            $sjhm_vmsg.text('');
          }
        });
        $txyzm.blur(function () {
          setTimeout(function () {
            var value = $.trim($txyzm.val());
            if (value === '') {
              $txyzm.parent().addClass('err');
              $txyzm_vmsg.removeClass('cor').text('请输入验证码');
              return ;
            }
            $http.post({
              url: '/tclcustomerregist/checkValidateCode',
              data: {
                'img-key': $dzbdcq_img.data('key'),
                inputcode: value
              },
              success: function (res) {
                if (res.code === '0') {
                  $txyzm.parent().removeClass('err');
                  $txyzm_vmsg.addClass('cor').text('验证码正确');
                } else {
                  $txyzm.parent().addClass('err');
                  $txyzm_vmsg.removeClass('cor').text('验证码错误');
                }
              }
            });
          }, 100);
        });
        $('.service-home-wrapper > .query-wrapper > .dzbdcq-rq > .btn').click(function () {
          var $this = $(this);
          if ($this.data('submitting')) return;
          $this.data('submitting', true);
          setTimeout(function () {
            var sjhm = $.trim($sjhm.val());
            var txyzm = $.trim($txyzm.val());
            if (sjhm === '' || txyzm === '' || $sjhm.hasClass('err') || $txyzm.parent().hasClass('err')) {
              $this.removeData('submitting');
              return;
            }
            var img_key = $dzbdcq_img.data('key');
            $http.post({
              url: '/servicecenter/queryKeyinElecPolicy',
              data: {
                mobile: sjhm,
                captchakey: img_key,
                captchadata: txyzm
              },
              success: function (res) {
                var alert_open = function (msg) {
                  alert.open(msg, null, function () {
                    $dzbdcq_img.trigger('click');
                    $this.removeData('submitting');
                  });
                };
                if (res.code !== '1') {
                  alert_open(res.message);
                  return ;
                }
                if (res.data.length === 0) {
                  alert_open('未找到对应记录');
                  return;
                }
                window.sessionStorage.setItem('dzbdhc', sjhm);
                window.sessionStorage.setItem('dzbd_img_key', img_key);
                window.sessionStorage.setItem('dzbd_img_vcode', txyzm);
                window.open('/pages/service/toElecPolicy.html');
                $this.removeData('submitting');
              }
            });
          }, 100);
        });
      })();
      // ] 电子保单查询

      // [ 获取常见问题
      (function () {
        $http.get({
          url: '/servicecenter/getCommonProblems',
          success: function (res) {
            if (res.code === '0') {
              var html = '';
              res.retData.subCotentCategorys.forEach(function (category) {
                html += '<div class="item"><span class="title">' + category.categoryName + '</span>';
                category.contentList && category.contentList.forEach(function (content) {
                  html += '<a href="/pages/serviceRevision/ProblemDetails.html?' + content.uuid + '" class="link" target="_blank">'+content.contentTitle+'</a>';
                });
                html += '</div>';
              });
              var $items = $('.service-home-wrapper > .common-question-wrapper > .items');
              $items.html(html);
            }
          }
        });
      })();
      // ] 获取常见问题

      // [ 服务政策和收费标准 链接处理
      (function () {
        $http.get({
          url: '/servicecenter/getPolicy',
          success: function (res) {
            if (res && res.length) {
              var $fwzc = $('.service-home-wrapper .fwzc');
              $fwzc.attr('href', $fwzc.attr('href') + '?' + res[0].uuid);
            }
          }
        });
        $http.get({
          url: '/servicecenter/getStandard',
          success: function (res) {
            if (res && res.length) {
              var $sfbz = $('.service-home-wrapper .sfbz');
              $sfbz.attr('href', $sfbz.attr('href') + '?' + res[0].uuid);
            }
          }
        });
      })();
      // ] 服务政策和收费标准 链接处理

     

      // [ scroll top
      (function () {
        $('.JS-scrollTop').click(function () {
          var $this = $(this), selector = $this.data('scroll-top-selector');
          $('body,html').animate({scrollTop: $(selector).offset().top}, 500);
        });
      })();
      // ] scroll top

    }
  };
  return obj;
});
