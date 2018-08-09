(function($){
      $.fn.Page = function(configs) {
          var options = $.extend({
              countPages: 10,
              current : 1,
              cb : function(){}
          }, configs);
          _page.init(this, options)
      }
      var _page = {
          init: function(dom, config){
            var self = this;
            this.getData(dom, config).done(function(res){
              var obj = typeof res ? res.data: JSON.parse(res).data;
              config.first = obj;
              config.countPages = Math.ceil(obj[config.param.dataTotal]/config.pageSize)
              self.createHtml(dom, config);
              self.bindEvent(dom, config);
            })
          },
          getData: function(dom, config) {
            var keys = config.param.keys;
            var kstr = '';
            $.each(keys, function (i, o) {
                kstr+='&'+i+'='+o;
            });
            var search = (config.param.size?config.param.size:'size')+'='+config.current+'&'+(config.param.page?config.param.page:'page')+'='+config.pageSize+kstr;
            return $.ajax({
                url:config.url+'?'+search,
            })
          },
          createHtml: function(dom, config) {
              dom.empty().hide();
              if(config.current > 1) {
                  dom.append('<a href="javascript:;" class="prevePage">'+config.prev+'</a>');
              }else{
                  dom.remove('.prevPage');
                  dom.append('<span class="disabled">'+config.prev+'</span>');
              }
              if(config.current !=1 && config.current >=4 && config.countPages !=4) {
                  dom.append('<a href="javascript:;" class="tcdNumber">'+1+'</a> ')
              }
              if(config.current - 2 > 2 && config.current <= config.countPages && config.countPages > 5 ) {
                  dom.append('<span class="dot">...</span>')
              }
              var start = config.current -2, end = config.current+2
  
              if((start>1 && config.current<4) || config.current ==1) {
                  end++;
              }
              if(config.current >config.countPages-4 && config.current >= config.countPages ){
                  start--;
              }
              for(;start<=end; start++ ){
                  if(start>=1 && start<=config.countPages) {
                      if(start !=config.current) {
                        dom.append('<a href="javascript:;" class="tcdNumber">'+start+'</a> ')
                      }else{
                        dom.append('<span href="javascript:;" class="current">'+start+'</span> ')
                      }
                  }
              }
  
              if(config.current+2 < config.countPages-1 && config.current >=1 && config.countPages >5) {
                  dom.append('<span class="dot">...</span>')
              }
  
              if(config.current !=config.countPages && config.current<config.countPages-2 && config.countPages !=4){
                  dom.append('<a href="javascript:;" class="tcdNumber">'+config.countPages+'</a>')
              }
  
              if(config.current < config.countPages) {
                  dom.append('<a href="javascript:;" class="nextPage">'+config.next+'</a>')
              } else {
                  dom.remove('.nextPage');
                  dom.append('<span href="javascript:;" class="disabled">'+config.next+'</span>')
              }
              if(config.skin) {
                  dom.append("<span class='jump'>转到<input id='jpnum' type='number' min='1'>页<button id='jpbtn'>确定</button></span>")
              }
              this.render(dom, config)
          },
          render: function(dom, config) {
              if(config.first) {
                  config.cb(config.first, config.pageCur||config.current);
                  config.first = false;
              }else{
                  this.getData(dom, config).done(function(res) {
                    var obj = typeof res ?res:JSON.parse(res)
                    if(typeof config.cb === 'function') {
                        config.cb(obj, config.pageCur||config.current)
                    }
                  })
              }
          },
          bindEvent: function(dom, config) {
              var self = this;
              dom.on("click", "a.tcdNumber", function() {
                  var current = parseInt($(this).text())
                  if(!current) return;
                  self.createHtml(dom,$.extend(config,{"current":current, "countPages":config.countPages}))
              });
  
              dom.on("click", "a.prevePage", function() {
                  var current = parseInt(dom.children("span.current").text());
                  if(!current) return;
                  self.createHtml(dom, $.extend(config,{"current": current-1, "countPages": config.countPages})) ;
                  config.pageCur = current - 1;
              });
  
              dom.on("click", "a.nextPage", function() {
                  var current = parseInt(dom.children("span.current").text());
                  self.createHtml(dom, $.extend(config,{"current": current+1, "countPages": config.countPages}));
                  config.pageCur = current + 1;
              })
  
              dom.on("click", "button#jpbtn", function() {
                  var current = parseInt($("#jpnum").val());
                  if(!current || current>config.countPages) return;
                  self.createHtml(dom, $.extend(config,{"current":current, "countPages": config.countPages}));
                  config.pageCur = current ;
              })
          }
      }
  })(jQuery);