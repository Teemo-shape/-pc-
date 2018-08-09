/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/7
 */
define('KUYU.Binder', ['KUYU.Filter','KUYU.Control'], function () {
    var filter = KUYU.Filter,
        $scope = KUYU.RootScope,
        binders = [];
    var attrOptions = {
            data : 'binder-data',
            cls : 'binder-class',
            attr : 'binder-attr',
            show : 'binder-show',
            hide : 'binder-hide',
            model : "binder-model"
        },
        cacheDoms = {};

    var init = function() {
        var dataDoms = $('[binder-data]')
            , clsDoms = $('[binder-class]')
            , attrDoms = $('[binder-attr]')
            , showDoms = $('[binder-show]')
            , hideDoms = $('[binder-hide]')
            , modelDoms = $('[binder-model]')
            ;
        cacheDoms = {
            data : dataDoms,
            cls : clsDoms,
            attr : attrDoms,
            show : showDoms,
            hide : hideDoms,
            model : modelDoms
        }
        eventInit();
        initModel();
    };
    var initModel = function() {
        var mDoms = cacheDoms.model;
        for( var i = 0; i < mDoms.length; i++ ) {
            var dom = $(mDoms[i])[0];
            var key = $(dom).attr("binder-model");
            if( $scope[key] != undefined ) {
                if( dom.nodeName.toLowerCase()==="input" || dom.nodeName.toLowerCase()=="textarea" || dom.nodeName.toLowerCase()=="select") {
                    $(dom).val($scope[key]);
                }else{
                    $(dom).html($scope[key]);
                }
            }else{
                $scope[key] = "";
            }
            var binder = null;
            binder = new Control( dom, key, function(e, key ,value){
                if( key != undefined ) {
                    $scope[key] = value;
                }
            });
            binders.push(binder);
        }
    };
    var formatEvent = function( dom ) {
        var eventName =  $(dom).attr("binder-event");
        var arrL = eventName.split("|");
        var type = arrL[0];
        var temp = arrL[1];
        var tArr = temp.split(":");
        return {
            evtType : type,
            evtFn : tArr[0],
            pDom : dom,
            cDom : tArr[1] ? tArr[1] : ""
        }
    };
    var eventInit = function() {
        var doms = $("[binder-event]");
        for( var i = 0; i < doms.length; i++ ) {
            var __dom = doms[i];
            var obj = formatEvent($(__dom));
            if( obj.cDom == "" ) {
               obj.pDom.on(obj.evtType, "" ,function (evt) {
                   var dom = this;
                   var tempdObj = formatEvent(dom);
                   var evtFn = tempdObj.evtFn;

                   if( $.isFunction($scope[evtFn]) ) {
                       $scope[evtFn](dom, evt);
                   }
               })
            }else{
                obj.pDom.on(obj.evtType, obj.cDom ,function (evt) {
                    var dom = this;
                    var pdom = $(evt.delegateTarget);
                    var tempdObj = formatEvent(pdom);
                    var evtFn = tempdObj.evtFn;
                    if( $.isFunction($scope[evtFn]) ) {
                        $scope[evtFn](dom, evt);
                    }
                })
            }
        }
    };
    var _syncShow = function( data ) {
        var sDoms = cacheDoms.show;
        var vm = data;
        var boolEval;
        for( var i = 0; i < sDoms.length; i++ ) {
            var dom = $(sDoms[i]);
            var showD = dom.attr("binder-show");
            try{
                boolEval = eval(showD);
                if( !!boolEval ||boolEval == true ) {
                    dom.show();
                }else{
                    dom.hide();
                }
            }catch( e ){
                if(Array.of) {
                    console.log(e);
                }
            }
        }
    };
    var _syncHide = function( data ) {
        var sDoms = cacheDoms.hide;
        var vm = data;
        var boolEval;
        for( var i = 0; i < sDoms.length; i++ ) {
            var dom = $(sDoms[i]);
            var showD = dom.attr("binder-hide");
            try{
                boolEval = eval(showD);
                if( !!boolEval ||boolEval == true ) {
                    dom.hide();
                }else{
                    dom.show();
                }
            }catch( e ){
                if(Array.of) {
                    console.log(e);
                }
            }
        }
    };
    var _syncData = function( data ) {
        var dDoms = cacheDoms.data;
        var vm = data;
        for( var i = 0; i < dDoms.length; i++ ) {
            var dom = $(dDoms[i]);
            var att = dom.attr("binder-data");
            var arr = att.split("|");
            var file = arr[0];
            var str = '';
            var addValueFn = "text";
            var regExp1 = /([^\{'|"]+)(?=\'|"})/g;
            var regExp2 = /([^|\}]+)(?=\{|$)/g;
            try{
                var arr1 = file.match(regExp1);
                var arr2 = file.match(regExp2);
                for( var j = 0; j < arr2.length; j++ ) {
                    str += eval(arr2[j]);
                    if( str != 'undefined' ) {
                        if( arr1 != null && arr1[j] != undefined ) {
                            str += arr1[j];
                        }
                    }else{
                        break;
                    }
                }
                if( arr.length > 1 && str != 'undefined' && str != 'NaN' ) {
                    var filter = arr[1];
                    var _f = filter.split("{");
                    var fun = _f[0].trim();
                    if( fun == "html" ) {
                        addValueFn = "html";
                    }else{
                        if( _f.length > 1 ) {
                            var _format = _f[1].split("}")[0];
                            str = fFun[fun](str, _format);
                        }else{
                            str = fFun[fun](str);
                        }
                    }

                }
                // str = escape(str);
            }catch( e ){
                if(Array.of) {
                    console.log(e);
                }
            }
            if( dom[0].nodeName == "IMG" ) {
                if( str != undefined && str != "undefined" ) {
                    dom.attr('src', str);
                }
            }else if( dom[0].nodeName == "INPUT" || dom[0].nodeName == "TEXTAREA"  || dom[0].nodeName == "SELECT" ){
                if( str != undefined && str != "undefined"  && str != 'NaN'  ) {
                    dom.val(str);
                }
            }else{
                if( str != undefined && str != "undefined"  && str != 'NaN' ) {
                    if( addValueFn == "text" ) {
                        dom.text(str);
                    }else{
                        dom.html(str);
                    }
                }
            }
            if( dom.attr("binder-model") != "" && dom.attr("binder-model") != undefined ) {
                var key = dom.attr("binder-model");
                if( str != undefined && str != "undefined"  && str != 'NaN' ) {
                    $scope[key] = str;
                }
            }
        }
    };

    /**
     * binder-attr="rights-no:rightsNo,rights-type:rightsType"
     * @param data
     * @private
     */
    var _syncAttr = function (data) {
        var sDoms = cacheDoms.attr;
        var vm = data, dom, showD, objList, arr, result, rs;
        for (var i = 0; i < sDoms.length; i++) {
            dom = $(sDoms[i]);
            showD = dom.attr("binder-attr");
            if( showD == undefined || showD == '' ) {
                continue;
            }
            objList = showD.split('|');
            rs = objList[0];
            arr = objList[1].split(':');

            try {
                if(eval(rs)) {
                    for (var k = 0; k < arr.length; k++) {
                        result = arr[0].trim();
                        dom.attr(result, arr[1]);
                    }
                    dom.removeAttr("binder-attr");
                }

            } catch (e) {
                if(Array.of) {
                    console.log(e);
                }
            }
        }
    };

    var _syncCls = function (data) {
        var cDoms = cacheDoms.cls;
        var vm = data;
        for( var i = 0; i < cDoms.length; i++ ) {
            var dom = $(cDoms[i]);
            var cls = dom.attr("binder-class");
            try{
                var str = eval(cls);
                dom.addClass(str);
            }catch( e ){
                if(Array.of) {
                    console.log(e);
                }
            }
        }
    };

    var sync = function (data) {
        _syncData(data);
        _syncShow(data);
        _syncAttr(data);
        _syncCls(data);
        _syncHide(data);
    };
    var setData = function( obj ) {
        for( var i = 0; i < binders.length; i++ ) {
            var binder = binders[i];
            for( var key in obj ) {
                if( binder.propoties.key == key ) {
                    var value = obj[key];
                    binder.setData(key, value);
                }
            }
        }
    }
    var Binder = {
        init : init,
        sync : sync,
        setData : setData
    };

    _APP.inject('KUYU.Binder', Binder);
});
/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/7
 */
define("KUYU.Control", [], function(){
    var win = window;
    var doc = win.document,
        _bind_key = "data-bind-" ,
        _event_prefix = "message-",
        _types = {},
        _data = {};//存放数据的空间
    /*生成唯一的gid*/

    var gid = (function(){
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    })();

    /*事件存放的容器*/
    var publisher = {
        callbacks : {},
        on : function( type , callback ){
            this.callbacks[type] = this.callbacks[type]||[];
            this.callbacks[type].push(callback);
        },
        fire : function( type ){
            var callback = this.callbacks[type]||[];
            for(var i=0,len= callback.length;i<len;i++){
                callback[i].apply( this , arguments );
            }
        }
    };
    var user = {
        set : function( id, key , value){
            var type = _types[id];
            if(arguments<3){
                return _data[object_id];
            }
            this.setData( id,key,value );
            publisher.fire(type, key, value);
        },
        setData : function( id, key , value ){
            _data[id][key] = value;
        }
    };
    /**
     * @param {Node} : elem  it can be a nodeList or one item
     * @param {Function} callback : //数据层，view层改变后会触发此函数
     */
    var Control = function( elem , key, callback){
        var id = gid();
        this.attr(elem ,_bind_key+id , true);
        this.propoties = {
            "id" : id,
            "data-attr" : _bind_key+id,
            "type" : "message-"+id,
            "key" : key
        }

        this.init( callback );
    };
    Control.prototype = {
        set : function(key , value){
            this.propoties[key] = value;
        },
        get : function(key){
            return this.propoties[key];
        },
        attr : function( elems , key, value ){
            //为elem元素设置相关属性
            if(!elems){return;}
            if(elems.nodeName || elems.nodeType===1){
                elems = [elems];
            }
            for(var i =0 , len = elems.length;i<len;i++){
                if( value ){
                    elems[i].setAttribute(key,value);
                }else{
                    return elems[i].getAttribute(key);
                }
            }
        },
        /**
         * @description 次函数用于外层调用，以实现改变数据的时候能监听器里面的函数
         */
        setData : function( key , value ){
            if(arguments.length<2){
                return;
            }
            user.set( this.get('id'),key, value );
        },
        /*初始化*/
        init : function( callback ){
            var id = this.get('id');
            this.domBinder();
            this.dataBinder();
            if(callback){
                publisher.on(this.get('type'), callback);
            }
        },
        domBinder : function(){
            var self = this;
            var object_id = this.get('id'),
                data_attr = this.get('data-attr');
            /*view监听的事件*/
            var handler = function( evt ){
                console.info(self.get('type'));
                var target = evt.target || evt.srcElement,
                    prop_name = target.getAttribute(data_attr);

                if( prop_name ){
                    publisher.fire(self.get('type'), self.get('key'), target.value);
                }
            }

            if(doc.addEventListener){
                doc.addEventListener('change' , handler , false );
            }else{
                doc.attachEvent('change' , handler);
            }
            /*dom触发事件*/
            publisher.on(this.get('type') , function( evt , prop_name ,newValue , current ){
                if(!evt){ return; }//如果触发此事件的目标不是一个元素//则不执行下面的代码
                var elems = doc.querySelectorAll("["+data_attr+"]");
                for(var i=0,len= elems.length;i<len;i++){
                    elem = elems[i];
                    if(elem.nodeName.toLowerCase()==="input" || elem.nodeName.toLowerCase()=="textarea" || elem.nodeName.toLowerCase()=="select"){
                        elem.value = newValue;
                    }else{
                        elem.innerHTML = newValue;
                    }
                }
            });
        },
        dataBinder : function(){
            var object_id = this.get('id');
            _data[object_id] = _data[object_id] || {};
            var data_attr = _bind_key+object_id;
            var type = "message-"+object_id;
            _types[object_id] = type;
            /*dom触发事件*/
            publisher.on(this.get('type') , function( evt , key ,value , isDataChange ){
                user.setData(object_id,key,value);
            });
        }
    }
    _APP.inject("KUYU.Control", Control);
});
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
                nextUrl = this.parseParam(url, param);
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
        }
    }
    _APP.inject('KUYU.RootScope', $scope);
    _APP.inject('KUYU.Init', Init);
})()

/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/7
 */
define("KUYU.Filter", [], function (){
    var Filter = {
        price : function( val ) {
            return Number((val/100).toFixed(2));
        },
        toFiexd: function (val) {
            return Number(val).toFixed(2);
        },
        date : function( dt, format ) {
            dt = new Date(dt);
            var o = {
                "M+" : dt.getMonth()+1, //month
                "D+" : dt.getDate(),    //day
                "h+" : dt.getHours(),   //hour
                "m+" : dt.getMinutes(), //minute
                "s+" : dt.getSeconds(), //second
                "w" : dt.getDay(),
                "q+" : Math.floor((dt.getMonth()+3)/3),
                "S" : dt.getMilliseconds() //millisecond
            }
            if(/(Y+)/.test(format)){
                format=format.replace(RegExp.$1, (dt.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(format)){
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        },
        currency : function( val ) {

        },
        phonenum : function( val ) {
            if( val == undefined ) {
                return "";
            }
            var str = "";
            for( var i = 0; i < val.length; i++ ) {
                if( i > 2 && i < 7 ) {
                    str += "*";
                }else{
                    str += val[i];
                }
            }
            return str;
        },
        formatCardNo : function( str ) {
            return str.substr(str.length-4);
        },
        formatBankImg : function() {
            var baseUrl = '../../';
            var str = baseUrl + 'images/icon/';
            var code = val.toLocaleLowerCase();
            var imgurl = str+code+".png";
            return imgurl;
        }
    };
    _APP.inject("KUYU.Filter", Filter);
});

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
/**
 * Created With TCL-PC.
 * User: yumx - yumx@kuyumall.com
 * Date: 2016/11/4
 */
define("KUYU.Util", [], function (){
    var Util = {
        cTimestamp : function() {
            //201508061018417065
            var dt = new Date();
            var y = dt.getFullYear();
            var M = dt.getMonth()+1;
            var d = dt.getDate();
            var h = dt.getHours();
            var m = dt.getMinutes();
            var sec = dt.getSeconds();
            var minsec = dt.getMilliseconds();
            var str = y + "";
            if( M < 10 ) {
                str += "0"+M;
            }else{
                str += M;
            }
            if( d < 10 ) {
                str += "0"+d;
            }else{
                str += d;
            }
            if( h < 10 ) {
                str += "0"+h;
            }else{
                str += h;
            }
            if( m < 10 ) {
                str += "0"+m;
            }else{
                str += m;
            }
            if( sec < 10 ) {
                str += "0"+sec;
            }else{
                str += sec;
            }
            if( minsec < 1000 ) {
                str += "0"+minsec;
            }else{
                str += minsec;
            }
            return str;
        },
        //减法函数
        accSub : function(arg1,arg2){

            var r1,r2,m,n;

            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}

            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}

            m=Math.pow(10,Math.max(r1,r2));

            //last modify by deeka

            //动态控制精度长度

            // n=(r1>=r2)?r1:r2;
            return ((arg2*m-arg1*m)/m).toFixed(2);

        },
        accAdd : function(arg1,arg2){

            var r1,r2,m;

            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}

            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}

            m=Math.pow(10,Math.max(r1,r2));

            return (arg1*m+arg2*m)/m;

        },
        generateUUID : function(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },
        createId : function() {
            var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ];
            var res = "";
            for (var i = 0; i < 10; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += jschars[id];
            }
            return res;
        },
        findLastChild : function( dom ) {
            var ldom = null;
            var _find = function(_dom) {
                var _l = _dom.children().last();
                if( _l.length > 0 ) {
                    _find(_l);
                }else{
                    ldom = _dom;
                }
            };
            _find(dom);
            return ldom;
        },
        inputChange : function( ele, cb ) {
            var dom = $("#"+ele)[0];
            if( "\v" == "v" ) {
                dom.onpropertychange = cb;
            }else{
                dom.addEventListener("input", cb, false);
            }
            return cb;
        },
        inputBlur : function(ele, cb){
            $("#"+ele).blur(cb);
        },
        isInt : function( val ) {
            var patrn = /^[1-9]\d*$/;
            if (!patrn.exec(val)) return false;
            return true;
        },
        isIDCard : function( val ) {
            var patrn = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
            if (!patrn.exec(val)) return false;
            return true;
        },
        isPhone : function( val ) {
            var patrn = /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/;
            if (!patrn.exec(val)) return false;
            return true;
        },
        isMobile : function( val ) {
            var patrn = /^0?1[2|3|4|5|8][0-9]\d{8}$/;
            if (!patrn.exec(val)) return false;
            return true;
        },
        numberFormat : function( value ) {
            value = value.replace(/[^\d.]/g, "");
            value = value.replace(/^\./g, "").replace(/\.{2,}/g, ".");
            value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d)*$/, '$1$2');
            return value;
        },
        floatFormat : function( value ) {
            value = value.replace(/[^\d.]/g, "");
            value = value.replace(/^\./g, "").replace(/\.{2,}/g, ".");
            value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            return value;
        },
        /*检查是否合法持卡人名字：只能纯中文或者英文 */
        isValidName : function( value ){
            var patrn = /[^\u4e00-\u9fa5a-zA-Z]/gm;
            return !patrn.exec(value);
        },
        /*动态加载文件
         * file: Object {type, container, filePath}*/
        loadFile : function(file){
            if(file.type.toLowerCase() === 'css'){
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = baseUrl + file.filePath;
                document.getElementsByTagName("head")[0].appendChild(link);
            } else if(file.type.toLowerCase() === 'js'){
                var link = document.createElement('script');
                link.type = 'text/script';
                link.src = baseUrl + file.filePath;
                document.getElementsByTagName("head")[0].appendChild(link);
            } else if(file.type.toLowerCase() === 'html'){
                $(file.container).load(baseUrl+file.filePath);
            }
        },
        getUrl : function(u){
            var url = u.substring(0,u.indexOf('?')+1);
            url+="appId=";
            url+=$('#hiddenDiv > input[name="appId"]').val(),
                url+="&urlKey=",
                url+=$('#hiddenDiv > input[name="urlKey"]').val(),
                url+="&loginName=",
                url+=$('#hiddenDiv > input[name="loginName"]').val(),
                url+="&sourceNo=",
                url+=$('#hiddenDiv > input[name="sourceNo"]').val(),
                url+="&customerId=",
                url+=$('#hiddenDiv > input[name="customerId"]').val(),
                url+="&accessToken=",
                url+=$('#hiddenDiv > input[name="accessToken"]').val(),
                url+="&token=",
                url+=$('#hiddenDiv > input[name="token"]').val(),
                url+="&randomNum=",
                url+=$('#hiddenDiv > input[name="randomNum"]').val();
            return url;
        },
        getHiddenVal : function( id ) {
            var doms = $("#"+id).find("input[type='hidden']");
            var obj = {};
            for( var i = 0; i < doms.length; i++ ) {
                var dom = $(doms[i]);
                var key = dom.attr("name");
                var val = dom.val();
                obj[key] = val;
            }
            return obj;
        },
        // 获取几分钟前、几小时前、几天前等时间差
        timeDifference : function(publishTime){
            var d_seconds
                , d_minutes
                , d_hours
                , d_days
                , timeNow = Date.parse(new Date())
                , d = (timeNow - publishTime)/1000
                ;
            d_days = parseInt(d/86400);   // 天
            d_hours = parseInt(d/3600);   // 时
            d_minutes = parseInt(d/60);   // 分
            d_seconds = parseInt(d);      // 秒

            if(d_days > 0 && d_days < 4) {
                return d_days+"天前";
            }
            else if(d_days <= 0 && d_hours > 0) {
                return d_hours + "小时前";
            }
            else if(d_hours <= 0 && d_minutes > 0) {
                return d_minutes+"分钟前";
            }
            else if(d_minutes <= 0 && d_seconds >= 0) {
                // return d_seconds+"秒前";
                return "刚刚之前";
            }
            else{
                var s = new Date(publishTime);
                return s.getFullYear() + '年' + (s.getMonth() + 1) + "月" + s.getDate() + "日 " + s.getHours() + ':' + ':' + s.getMinutes() + ':' + s.getSeconds();
            }
        },
        formatDate: function (date) {
            var newTime = Util.getStringDate(date, true);

            var str = newTime.year + '.' + newTime.month + '.' + newTime.day + ' ' +
                newTime.hour + ':' + newTime.minute + ':' + newTime.second;
            return str;
        },
        // 返回年月日单独字符串 可以自由组合 time为时间戳; 月、日、时、分、秒小于10是否前面补0
        getStringDate: function(time, flg){
            var newDate = new Date(time);
            var  obj = {
                year: newDate.getFullYear(),             // 年
                month: newDate.getMonth() + 1,           // 月
                day: newDate.getDate(),                  // 日
                hour: newDate.getHours(),                // 时
                minute: newDate.getMinutes(),            // 分
                second: newDate.getSeconds(),            // 秒
                milliseconds: newDate.getMilliseconds()  // 毫秒
            };
            //  月、日、时、分、秒小于10是否前面补0
            if(flg){
                // 月
                if (obj.month < 10) {
                    obj.month = "0" + obj.month;
                }
                // 日
                if (obj.day < 10) {
                    obj.day = "0" + obj.day;
                }
                // 时
                if (obj.hour < 10) {
                    obj.hour = "0" + obj.hour;
                }
                // 分
                if (obj.minute < 10) {
                    obj.minute = "0" + obj.minute;
                }
                // 秒
                if (obj.second < 10) {
                    obj.second = "0" + obj.second;
                }
            }
            return obj;
        },
        // 秒转成 天 时 分 秒
        dhms: function(second) {
            var z = function(n) {
                if (n < 10) {
                    return '0' + n;
                } else {
                    return n;
                };
            };
            var d = 0,
                h = 0,
                m = 0,
                s = 0;
            d = Math.floor(second / (24 * 60 * 60));
            s = second - d * 24 * 60 * 60;
            h = Math.floor(s / (60 * 60));
            s = s - h * 60 * 60;
            m = Math.floor(s / 60);
            s = s - m * 60;
            return {
                d: z(d),
                h: z(h),
                m: z(m),
                s: z(s)
            };
        },
        // 不用四舍五入 截取字符串2位数
        toFixed: function (val) {
            val = val.toString();
            if (val.indexOf('.') === -1) {
                val = val + '.00';
            } else {
                val = val.substring(0, val.lastIndexOf('.') + 3);
            }
            var str = val.split('.');
            if (str[1].length === 1) {
                val = val + '0';
            }
            return val;
        }
    };
    _APP.inject("KUYU.Util", Util);
});