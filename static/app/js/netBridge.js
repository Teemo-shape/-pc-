/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/4
 */
define('KUYU.netBridge', [], function () {
    var $init = KUYU.Init;
    var bridge = {
        go: function (url) {
            window.location.href = url;
        },
        back: function () {
            window.history.go(-1);
        },
        getEnvConfig: function( cb ) { //暂时不设置
            cb();
        },
        getEnv: function ( cb ) {
            cb();
        },
        showLoading: function(opacity) {
            var style = '';
            if (opacity) {
                style = ' style="background:rgba(242,242,242, '+ opacity +');"';
            }
            $('body').append('<div id="loading"' + style + '></div>');
        },
        removeLoading: function() {
            $('#loading, #loading-body').fadeOut('slow', function () {
                this.remove();
            });
        },
        security: function( obj ) {
            return obj;
        },
        fetch: function( obj ) {
            if( obj.security ) {
                obj.data = bridge.security(obj.data);
            };

            $.ajax(obj);

        },
        getDeviceInfo: function( cb ) {
            var deviceToken = localStorage.getItem('deviceToken');
            if (deviceToken) {
                cb({
                    deviceFinger: '',
                    deviceToken: deviceToken
                });
                return;
            }
            ;
            var env = $init.getEnv();
            var sev = env.sever.toLocaleLowerCase();
            var serve = $init.getService();
            var url = serve[sev] + serve['tk'];
            if(!serve['tk']) {
                cb({
                    deviceFinger: '',
                    deviceToken: ''
                });
                return;
            };
            $.ajax({
                type: 'post',
                url: url,
                success: function (json) {
                    var obj =  (new Function('return' + json ))();
                    var code = obj.code;
                    if (code == CODEMAP.status.success && !json.data) {
                        var deviceToken = obj.data.deviceToken || '';
                        localStorage.removeItem('deviceToken');
                        localStorage.setItem('deviceToken', deviceToken);
                        cb({
                            deviceFinger: '',
                            deviceToken: deviceToken
                        });
                    } else {
                        cb({
                            deviceFinger: '',
                            deviceToken: ''
                        });
                    }
                },
                error: function (json) {
                    cb({
                        deviceFinger: '',
                        deviceToken: ''
                    });
                }
            });
        }
    }
    _APP.inject('KUYU.netBridge', bridge)
});