/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/4
 */
var _APP = {
    inject: function (name, _obj) {
        var parts = name.split('.'),
            root = window,
            i;
        for( i=0; i<parts.length; i++) {
            var part = parts[i];
            if(!root[part]) {
                root[part] = {}
            }
            if( i == (parts.length-1) && _obj !== undefined) {
                if($.isFunction(_obj)) {
                    root[part] = _obj;
                }else{
                    if(root[part] !== undefined) {
                        root[part] = $.extend(true, {} , root[part] , _obj);
                    } else {
                        root[part] = _obj;
                    }
                }
            }else{
                root = root[part];
            }
        }
    }
};
(function() {
    var MAPS = function() {
        this.elements = new Array();

        //获取MAPSS元素个数
        this.size = function() {
            return this.elements.length;
        };

        //判断MAPS是否为空
        this.isEmpty = function() {
            return (this.elements.length < 1);
        };

        //删除MAPS所有元素
        this.clear = function() {
            this.elements = new Array();
        };

        //向MAPS中增加元素（key, value)
        this.put = function(_key, _value) {
            var v = this.get(_key);
            if( v == undefined ){
                this.elements.push( {
                    key : _key,
                    value : _value
                });
            }else{
                this.set(_key, _value);
            }

        };
        this.set = function( _key, _value ) {
            for ( var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements[i].value = _value;
                    break;
                }
            }
        };
        //删除指定KEY的元素，成功返回True，失败返回False
        this.removeByKey = function(_key) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //删除指定VALUE的元素，成功返回True，失败返回False
        this.removeByValue = function(_value) {//removeByValueAndKey
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //删除指定VALUE的元素，成功返回True，失败返回False
        this.removeByValueAndKey = function(_key,_value) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value && this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //获取指定KEY的元素值VALUE，失败返回NULL
        this.get = function(_key) {
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch (e) {
                return undefined;
            }
            return undefined;
        };

        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
        this.element = function(_index) {
            if (_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        };

        //判断MAPS中是否含有指定KEY的元素
        this.containsKey = function(_key) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //判断MAPS中是否含有指定VALUE的元素
        this.containsValue = function(_value) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //判断MAPS中是否含有指定VALUE的元素
        this.containsObj = function(_key,_value) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value && this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };

        //获取MAPS中所有VALUE的数组（ARRAY）
        this.values = function() {
            var arr = new Array();
            for (var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        };

        //获取MAPS中所有VALUE的数组（ARRAY）
        this.valuesByKey = function(_key) {
            var arr = new Array();
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    arr.push(this.elements[i].value);
                }
            }
            return arr;
        };

        //获取MAPS中所有KEY的数组（ARRAY）
        this.keys = function() {
            var arr = new Array();
            for (var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        };

        //获取key通过value
        this.keysByValue = function(_value) {
            var arr = new Array();
            for (var i = 0; i < this.elements.length; i++) {
                if(_value == this.elements[i].value){
                    arr.push(this.elements[i].key);
                }
            }
            return arr;
        };

        //获取MAP中所有KEY的数组（ARRAY）
        this.keysRemoveDuplicate = function() {
            var arr = new Array();
            for (var i = 0; i < this.elements.length; i++) {
                var flag = true;
                for(var j=0;j<arr.length;j++){
                    if(arr[j] == this.elements[i].key){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    arr.push(this.elements[i].key);
                }
            }
            return arr;
        };
    };
    var requestParaMap = function() {
        var id = location.search;
        if (id === "" || id === null || typeof id === "undefined") {
            id = "";
        }
        var arrayObj = id.match(/([^?=&]+)(=([^&]*))?/g);
        var returnMap = {};
        if (arrayObj === null) return returnMap;
        for (var i = 0; i < arrayObj.length; i++) {
            var conment = arrayObj[i];
            var key = decodeURIComponent(conment.substring(0, conment.indexOf("=")));
            var value = decodeURIComponent(conment.substring(conment.indexOf("=") + 1, conment.length));
            returnMap[key] = value;
        };
        if(id == "undefined") {
            return null;
        }else{
            return returnMap;
        }
    };

    (function($) {
        var o = $({});
        $._on = function () {
            o.on.apply(o, arguments);
        };

        $._fire = function () {
            o.trigger.apply(o, arguments);
        };

        $._off = function () {
            o.off.apply(o, arguments);
        };
    })(jQuery);
    var  guid = function () {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    var ev = null ,
        sev = null ,
        configObj = null ,
        componentMap = new MAPS(),
        time = Date.parse(new Date()) ,
        pageId = time;

    window[time] = {};
    var $scope = window[time];
    var config = function( obj ) {
        require(obj);
    };

    var initPage = function( cb ) {
        var includes = $("include");
        var len = includes.length;
        var index = 0;
        var __loadTemp = function() {
            var pInclude = $(includes[index]).parent();
            var src = $(includes[index]).attr("src");
            if( index < len ) {
                $.ajax({
                    url : src,
                    dataType : 'html',
                    success : function( txt ) {
                        $(includes[index]).replaceWith(txt);
                        index++;
                        __loadTemp();
                    },
                    error : function() {
                        index++;
                        __loadTemp();
                    }
                });
            }else{
                initComponent(cb);
            }
        };
        __loadTemp();
    };
    var initComponent = function( cb ) {
        var keys = componentMap.keys();
        var len = keys.length;
        var index = 0;
        var __getTemplate = function( op, _cb ) {
            var template = null;
            if( op.template != null ) {
                template = op.template;
                _cb(template);
            }else{
                $.ajax({
                    url : op.templateUrl,
                    dataType : 'html',
                    success : function( txt ) {
                        _cb( txt );
                    },
                    error : function() {
                        _cb()
                    }
                });
            }
        };
        var __loadComponent = function() {
            if( index < len ) {
                var key = keys[index];
                var dom = componentMap.get(key).doms;
                var op = componentMap.get(key).op;
                __getTemplate(op, function( txt ){
                    for( var i = 0; i < dom.length; i++ ) {
                        var obj = resolveCustomerAttr(dom[i], txt);
                        $(dom[i]).html(obj.h);
                        op.render($(dom[i]), obj);
                    }
                    index++;
                    __loadComponent();
                });
            }else{
                cb();
            }
        };
        __loadComponent();
    };
    var ready = function( cb ) {
        if( !$.isFunction( cb ) ) {
            return;
        }
        if( configObj.env.runev == 'pc' ) {
            $(function(){
                initPage(cb)
            });
        }else{
            document.addEventListener("deviceready", function(){
                initPage(cb);
            }, false);
        }
    };
    var Init = {
        getParam : function() {
            var param = requestParaMap();
            return param;
        },
        Map: function () {
            return new MAPS();
        },
        parseParam: function (url, param) {
            var strings = url.split("?");
            var _url = strings[0];
            if( strings.length > 1 ) {
                var temp = strings[1];
                var par = temp.split("&");
                _url += "?";
                for( var i = 0; i < par.length; i++ ) {
                    var key = par[i];
                    if( i > 0 ) {
                        _url += "&" + key + "=" + param[key];
                    }else{
                        _url += key + "=" + param[key];
                    }
                }
            }
            return _url;
        },
        cookie: function () {
            var pluses = /\+/g;

            function encode(s) {
                return config.raw ? s : encodeURIComponent(s);
            }

            function decode(s) {
                return config.raw ? s : decodeURIComponent(s);
            }

            function stringifyCookieValue(value) {
                return encode(config.json ? JSON.stringify(value) : String(value));
            }

            function parseCookieValue(s) {
                if (s.indexOf('"') === 0) {
                    // This is a quoted cookie as according to RFC2068, unescape...
                    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }

                try {
                    // Replace server-side written pluses with spaces.
                    // If we can't decode the cookie, ignore it, it's unusable.
                    s = decodeURIComponent(s.replace(pluses, ' '));
                } catch(e) {
                    return;
                }

                try {
                    // If we can't parse the cookie, ignore it, it's unusable.
                    return config.json ? JSON.parse(s) : s;
                } catch(e) {}
            }

            function read(s, converter) {
                var value = config.raw ? s : parseCookieValue(s);
                return $.isFunction(converter) ? converter(value) : value;
            }

            var config = $.cookie = function (key, value, options) {

                // Write
                if (value !== undefined && !$.isFunction(value)) {
                    options = $.extend({}, config.defaults, options);

                    if (typeof options.expires === 'number') {
                        var days = options.expires, t = options.expires = new Date();
                        t.setDate(t.getDate() + days);
                    }

                    return (document.cookie = [
                        encode(key), '=', stringifyCookieValue(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                        options.path    ? '; path=' + options.path : '',
                        options.domain  ? '; domain=' + options.domain : '',
                        options.secure  ? '; secure' : ''
                    ].join(''));
                }

                // Read

                var result = key ? undefined : {};

                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling $.cookie().
                var cookies = document.cookie ? document.cookie.split('; ') : [];

                for (var i = 0, l = cookies.length; i < l; i++) {
                    var parts = cookies[i].split('=');
                    var name = decode(parts.shift());
                    var cookie = parts.join('=');

                    if (key && key === name) {
                        // If second argument (value) is a function it's a converter...
                        result = read(cookie, value);
                        break;
                    }

                    // Prevent storing a cookie that we couldn't decode.
                    if (!key && (cookie = read(cookie)) !== undefined) {
                        result[name] = cookie;
                    }
                }

                return result;
            };

            config.defaults = {};

            $.removeCookie = function (key, options) {
                if ($.cookie(key) !== undefined) {
                    // Must not alter options, thus extending a fresh object...
                    $.cookie(key, '', $.extend({}, options, { expires: -1 }));
                    return true;
                }
                return false;
            };
        },
        nextPage : function( str, param ) {
            var $bridge = KUYU.netBridge, nextUrl = '';
            var route = configObj.route;
            if( route == undefined || route[str] == undefined ) {
                if( param == "" || param == undefined ) {
                    //window.location.href = url;
                    nextUrl = str;
                }else{
                    var ustr = '?';
                    var index = 0;
                    for( var key in param ) {
                        if( index > 0 ) {
                            ustr += "&"+key;
                            ustr += "=" + param[key];
                        }else{
                            ustr += key;
                            ustr += "=" + param[key];
                        }
                        index++;
                    }
                    nextUrl += ustr;
                    //window.location.href = url;
                    // nextUrl = url;
                }
            }else{
                var url = route[str];
                if(param) {
                    nextUrl = this.parseParam(url, param);
                }else{
                    nextUrl = url;
                }
            }
            // var url = parseParam(url, param);
            $bridge.go(nextUrl);
        },
        config: function (obj) {
            configObj = obj;
            config(obj.load);
        },
        getService: function (obj) {
            return configObj.services;
        },
        getBasePath: function (obj) {
            return configObj.load
        },
        getEnv: function () {
            return configObj.env;
        },
        getApi: function () {
            return configObj.apiConfig;
        },
        getApiVersion: function () {
            return configObj.version;
        },
        getHeaders: function () {
            return configObj.headers;
        },
        createUid: function () {
            return guid();
        },
        Ready:function( cb ) {
            ready(cb);
        },
        enCode: function(s) {
            // rsa公钥
            var publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJCOtfDgtXPNhHBwF926WFLkquAms+F50g0j04Sgh2eq8Bv09qb14KCYMtJCFF/kk0TZQ9aXwtSMIPBMElr/9TMCAwEAAQ==';
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            return encodeURIComponent(encrypt.encrypt(s));
        }
    }
    _APP.inject('KUYU.RootScope', $scope);
    _APP.inject('KUYU.Init', Init);
})()
