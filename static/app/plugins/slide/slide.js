/**
 * Created by yumx on 2016/10/31.
 */
define('KUYU.plugins.slide!CSS',[], function () {
    $.fn.Slide = function(configs) {
        var options = $.extend({
            box : this
        }, configs)
        configs.slideshow?slide.init(options):slideItem.init(options);

    };
    var slide = {
        init: function (op) {
        var     banner = op.box,  // banner
                slides = op.eles,  // slide集合
                dotContainer = op.dots,  // 导航小圆点的包含块
                dotTpl = '<span></span>',  // 要插入的导航小圆点
                dots,  // 导航小圆点集合
                total = slides.length,  // slide总数
                index = -1,  // slide索引
                interval = 5000,  // 轮播间隔时间
                timer = null;  // 定时器
            // 一张图 不执行轮播
            if (total == 1) {
                next();
                $(".prev").hide();
                $(".next").hide();
                return;
            }

            // 根据slide个数添加导航小圆点
            $.each(slides, function(i, el) {
                dotContainer.append(dotTpl);
            });

            dots = dotContainer.find('span');
            function show(i) {
                var cur = slides.filter('.slide-active');
                // 停掉所有slide动画序列
                slides.stop(true, true);
                // 隐藏当前激活的slide
                cur.removeClass('slide-active').fadeOut(600);
                // 激活传入i对应的slide
                slides.eq(i).addClass('slide-active').fadeIn(800);
                // 激活slide对应的导航小圆点
                dots && dots.removeClass('active').eq(i).addClass('active');
            }
            function prev() {
                index--;
                // 判断当前是不是第一个slide
                index = index < 0 ? total - 1 : index;
                // 激活对应的slide
                show(index);
            }
            function next() {
                index++;
                // 判断当前是不是最后一个slide
                index = index > total - 1 ? 0 : index;
                // 激活对应的slide
                show(index);
            }
            function autoPlay() {
                // 停掉已有定时器
                if (timer) clearInterval(timer);
                // 开启定时器，定时滚动到下一张
                timer = setInterval(function() {
                    next();
                }, interval);
            }
            // 监听上一页、下一页、导航小圆点点击事件
            banner.on('click', '.prev', function(e) {
                prev();
            }).on('click', '.next', function(e) {
                next();
            }).on('click', '.banner-dots span', function(e) {
                // 如果对应的slide已经激活，return
                if ($(this).hasClass('active')) return;
                // 否则激活对应的slide
                var i = $(this).index();
                index = i;
                show(i);
            });
            // 监听鼠标移入banner区域停止自动轮播
            banner.on('mouseenter', function(e) {
                if (timer) clearInterval(timer);
            }).on('mouseleave', function(e) {
                if(!op.stop){
                    autoPlay();
                }
            });

            // 因为初始index为-1，调用next显示第一个slide，并启用自动轮播
            next();
            if(!op.stop){
                autoPlay();
            }
        }
    };
    var slideItem = {
        init: function (op) {
            var banner = op.box,
                ul = op.eles;
                ul.append(ul.html()); //拷贝UL内容
            var li = ul.find('li'),
                dd = op.eles.find('dd'),
                dw = dd.width(), //单个DD的宽度
                postion = 0,  //UL左边的位置
                ddlen = dd.length, //所有DD的size
                total = li.length; //所有LI的size
                li.width(ddlen/total*dw) //设置li的宽度
            var lw = li.width();

            ul.css({
                width:ddlen*dw,
                left: -total*lw/2
            });

            function show(postion) {
                if(ul.is(':animated')) {
                    return;
                }
                ul.animate({
                    left: postion
                }, 500, function() {
                    if(postion == 0) {
                        ul.css({
                            left: -total*lw/2
                        })
                    } else if (postion == (1-total)*lw) {
                        ul.css({
                            left: (1-total/2)*lw
                        })
                    }
                })
            }

            banner.on('click', '.flex-next', function (e) {
                postion = parseInt(ul.css('left'))-lw;
                show(postion)
            });

            banner.on('click', '.flex-prev', function (e) {
                postion = parseInt(ul.css('left'))+lw;
                show(postion)
            });
        }
    };
})
