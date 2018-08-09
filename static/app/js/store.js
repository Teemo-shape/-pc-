/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/7
 */
define('KUYU.Store', [], function(){
    var Store = {},
        LSG = window.localStorage;

    Store.forEach = function (cb) {
        for (var i=0; i < LSG.length; i++) {
            var key = LSG.key(i);
            cb(key, Store.get(key));
        }
    };

    if(LSG) {
        Store.set = function (key, val) {
            if(val === undefined) {
                return Store.remove(key);
            };

            if(navigator.userAgent.indexOf('Trident') <0  ) {
                var setItemEvent = new Event ("setItemEvent");
                setItemEvent.val = val;
                setItemEvent.key = key;
                window.dispatchEvent(setItemEvent);
			}

            LSG.setItem(key, val);

            return val;
        };
        Store.get = function (key) {
            var val = LSG.getItem(key);
            return val;
        };
        Store.remove = function (key) {
            LSG.removeItem(key);
        };
        Store.clearAll = function () {
            LSG.clear();
        };
        Store.getAll = function () {
            var tmp = {};
            Store.forEach(function (key, val) {
                tmp[key] = val;
            });
            return tmp;
        };
    } else {
        Store.get = function (key) {
            var cookies = document.cookie; //存储的cookie
            var _key; //cookie的key
            var keyValue;
            if(!key){
                return false;
            }

            cookies = cookies ? cookies.split(";") : [];

            for(var i=0; i<cookies.length; i++){
                keyValue = cookies[i].split("=");
                _key = keyValue[0].replace(/^\s+/, "");
                if(decodeURIComponent(_key) === key){
                    return decodeURIComponent(keyValue[1]);
                }
            }
            return false;
        };
        Store.set = function (key, val, options) {
            var expiresDate = new Date(); //过期时间
            var cookieItem = ""; //最终设置的cookie字符串
            var options = options || {};

            if(!key || typeof val === "undefined"){
                return false;
            }

            if(typeof key === "object"){
                options = val;
                for(var i in key){
                    if(key.hasOwnProperty(i)){
                        Store.set(i, key[i], options);
                    }
                }
            }else{
                expiresDate.setTime(expiresDate.getTime() + 24*60*60*1000);
                cookieItem += encodeURIComponent(key) + "=" + encodeURIComponent(val);

                if(options.domain){
                    cookieItem += "; domain=" + options.domain;
                }
                if(options.path){
                    cookieItem += "; path=" + options.path;
                }
                if(options.expires){
                    expiresDate.setTime(expiresDate.getTime() + options.expires);
                    cookieItem += "; expires=" + expiresDate.toUTCString();
                }
                if(options.secure){
                    cookieItem += "; secure";
                }
                document.cookie = cookieItem;
            }
            return true;
        };
        Store.remove = function (key) {
            if(!key){
                return false;
            }
            return Store.set(key, "", {
                expires: -1
            });
        };

    }

    _APP.inject("KUYU.Store", Store);
});
