define('KUYU.plugins.alert!CSS',[], function() {
      Msg = {
            Alert: function (title, msg, callback) {
                this.GenerateHtml("alert", title, msg);
                this.btnOk(callback); //alert只是弹出消息，因此没必要用到回调函数callback
                this.btnNo();
                //this.clickMask();
            },
            Confirm: function (title, msg, callback) {
                this.GenerateHtml("confirm", title, msg);
                this.btnOk(callback);
                this.btnNo();
                //this.clickMask();
            },
            // 生成HTML
            GenerateHtml:function (type, title, msg) {

                var _html = "";

                _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">'+(title? title: "温馨提示")+'</span>';

                _html += '<div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';


                if (type == "alert") {
                    _html += '<input id="mb_btn_ok" type="button" value="确定" />';
                }
                if (type == "confirm") {
                    _html += '<input id="mb_btn_ok" type="button" value="确定" />'+
                        '<input id="mb_btn_no" type="button" value="取消" />';
                    // _html += '<input id="mb_btn_no" type="button" value="取消" />'+
                    //     '<input id="mb_btn_ok" type="button" value="确定" />';
                }
                _html += '</div></div>';

                //必须先将_html添加到body，再设置Css样式
                $("body").append(_html);
                this.GenerateCss();
            },
            //生成Css
            GenerateCss:function () {
                var _widht = document.documentElement.clientWidth; //屏幕宽
                var _height = document.documentElement.clientHeight; //屏幕高

                var boxWidth = $("#mb_con").width();
                var boxHeight = $("#mb_con").height();

                //让提示框居中
                $("#mb_con").css({
                    top: (_height - boxHeight) / 2.6 + "px",
                    left: (_widht - boxWidth) / 2 + "px"
                });
            },
            //确定按钮事件
            btnOk : function (callback) {
                $("#mb_btn_ok").click(function () {
                    if (typeof (callback) == 'function') {
                        if(callback() == 'false') {
                            return;
                        }else{
                            setTimeout(function () {
                                $("#mb_box,#mb_con").remove();
                            },300)
                        };
                    }
                });
            },
            //取消按钮事件
            btnNo : function () {
                $("#mb_btn_no").click(function () {
                    $("#mb_box,#mb_con").remove();
                });
            }
           /* clickMask :function () {
                $("#mb_box").click(function () {
                    $("#mb_box,#mb_con").remove();
                })
            }*/
        }
    return Msg;
})