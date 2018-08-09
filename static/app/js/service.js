/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/4
 */
define('KUYU.Service', ['KUYU.netBridge','KUYU.Util', 'KUYU.Store'], function () {
    var bridge = KUYU.netBridge,
        timer = new Date(),
        ajaxCount = 0,
        util = KUYU.Util,
        $init = KUYU.Init,
        Store = KUYU.Store,
        $param = KUYU.Init.getParam(),
        apiConfig = $init.getApi();
        $init.cookie()
    var getDeviceTokenInfo = function (cb) {
        bridge.getDeviceInfo( cb )
    };
    if($param.fanliCookie) {
        $.cookie('fanliCookie', $param.fanliCookie,{ expires: 30, path: '/' })
    };
    if($param["istaff_token"]) {
        $.cookie('istaff_token', $param["istaff_token"],{ expires: 1, path: '/' })
    };
    var getStore = function(name) {
        if( localStorage && localStorage.getItem('istaff_token') ) {
            return localStorage.getItem('istaff_token');
        }else if($.cookie('istaff_token')){
            return $.cookie('istaff_token')
        } else {
            return null;
        }
    };
    var setStore = function (value) {
        if( localStorage ) {
            localStorage.setItem('istaff_token', value);
        }else if($.cookie){
            $.cookie('istaff_token', value, { expires: 1 });
        } else {
            if(Array.of){
                console.warn("can't store");
            }
        }
    };
    var Adapter = {
        param : function( obj ) {
            return {
                limit : obj.size,
                page : obj.page,
                isMobile : "1"
            }
        },
        result : function(obj) {
            var data = {code: 1};
            var result = obj.result;
            if (obj.success && result) {
                data = {
                    code: 0,
                    list: result
                };
            }
            return data;
        }
    };
    var formatURL = function( url ) {
        var urls = url.split('|');
        var param = null;
        var result = null;
        if( urls.length > 1 ) {
            var temp = urls[1];
            var temps = temp.split('&');
            for( var i = 0; i < temps.length; i++ ) {
                var _t = temps[i];
                var _ts = _t.split(':');
                var _k = _ts[0];
                var _f = _ts[1];
                if( _k == 'param' ) {
                    param = Adapter.param[_f];
                }
                if( _k == 'result' ) {
                    result = Adapter.result[_f];
                }
            }
        }
        url = urls[0];
        return {
            u : url,
            p : param,
            r : result
        };
    };
    var ajax = function (obj) {
        var env = $init.getEnv();
        var sev = env.sever.toLocaleLowerCase();
        var serve = $init.getService();
        if (obj.showLoading && ajaxCount === 0) {
            bridge.showLoading();
            timer = new Date();
        }
        ajaxCount++;
        obj.complete = function () {
            ajaxCount--;
            if (ajaxCount <= 0) {
                bridge.removeLoading();
            }
        };
        var url = obj.url;
        var security = false;
        if( url.split("http").length > 1 ) {
            url = obj.url;
        }else if (apiConfig != undefined && apiConfig[url] != undefined) {
            var urlConfig = apiConfig[url];
            var _ajaxUrl = urlConfig.url;
            security = urlConfig.security;

            var arr = _ajaxUrl.split("%");
            if (arr.length > 1) {
                var _temp = (sev + arr[0]).toLocaleLowerCase();
                obj.url = serve[_temp] + arr[1];
            } else if(_ajaxUrl.split("http").length > 1){
                obj.url = _ajaxUrl;
            }else {
                var sev = env.sever.toLocaleLowerCase();
                if (serve[sev] == '' && window.location.origin != 'file://') {
                    serve[sev] = window.location.origin + "/";
                }
                obj.url = serve[sev] + _ajaxUrl;
            }
        } else {
            var sev = env.sever.toLocaleLowerCase();
            if (serve[sev] == '') {
                serve[sev] = window.location.origin + "/";
            }
            obj.url = serve[sev] + url;
        }
        var oo = formatURL(obj.url);
        obj.url = oo.u;
        var paramFn = oo.p;
        var resultFn = oo.r;
        if( $.isFunction(paramFn) ) {
            obj.data = paramFn(obj.data);
        }
        obj.security = security;
        if( $.isFunction(resultFn) ) {
            var nobj = $.extend(true, {}, {}, obj);
            if( nobj.Cache === true ) {
                var data = Store.get(nobj);
                if( data != undefined ) {
                    // var dt = resultFn(data);
                    nobj.success( data );
                }
            }
            obj.success = function( data ){
                if(data.code !=0 && data.transId) {
                    if(Array.of) {
                        console.info("transId:"+data.transId)
                    }
                }
                bridge.removeLoading();
                var dt = resultFn(data);

                if( dt && dt.status == 0 && dt.data.token ) {
                    Store.set( 'istaff_token' ,dt.token);
                }
                if( nobj.Cache === true ) {
                    if( dt.code == 0 ) {
                        Store.set(nobj, dt);
                    }
                }


                nobj.success( dt );
            };
        }else{

            var nobj = $.extend(true, {}, {}, obj);
            if( nobj.Cache === true ) {
                var data = Store.get(nobj);
                if( data != undefined ) {
                    nobj.success( data );
                }
            }
            obj.success = function( data ){
                if(data.code !=0 && data.transId) {
                    if(Array.of) {
                        console.info("transId:"+data.transId)
                    }
                }
                bridge.removeLoading();

                if( data && data.code == 0 &&  data.token ) {
                    Store.set( 'istaff_token', data.token)
                }
                if( nobj.Cache === true ) {
                    if( data.code == 0 ) {
                        Store.set(nobj, data);
                    }
                }
                nobj.success( data );
            };
        }
        bridge.fetch(obj);
    },
    formatHeader = function (obj, type) {
        obj.type = type;
        obj.contentType = obj.contentType?obj.contentType:'application/x-www-form-urlencoded';
        if( $.cookie('istaff_token') ) {
            Store.set("istaff_token", $.cookie('istaff_token') );
        }
        var token =  Store.get("istaff_token");

        var defaultHeaders = $.extend(true, {}, {
            'ihome-timestamp': util.cTimestamp(),
            'uid': util.cTimestamp() + "-" + util.generateUUID(),
            'ihome-version': $init.getApiVersion(),
            'appversion': $init.getApiVersion(),
            'platform' : 'platform_tcl_staff',
            'ihome-token' : token,
        }, $init.getHeaders());

        var _o = $.extend(true, {}, {headers : defaultHeaders}, obj);
        return _o;
    };
    var $http = {
        get: function (obj, loginFlg) {
            var _o = formatHeader (obj, 'GET');
            getDeviceTokenInfo(function (obj) {
                // _o.headers['ihome-deviceFinger'] = obj.deviceFinger;
                // _o.headers['deviceFinger'] = obj.deviceFinger;
                _o.headers['deviceToken'] = obj.deviceToken;
                ajax(_o);
            })
        },
        post: function (obj, loginFlg) {
            var _o = formatHeader (obj, 'POST');
            bridge.getEnv(function ( e ) {
                getDeviceTokenInfo(function (obj) {
                    // _o.headers['ihome-deviceFinger'] = obj.deviceFinger;
                    // _o.headers['deviceFinger'] = obj.deviceFinger;
                    _o.headers['deviceToken'] = obj.deviceToken;
                    ajax(_o);
                })
            });

        }
    };

    _APP.inject("KUYU.Service", $http);
});
