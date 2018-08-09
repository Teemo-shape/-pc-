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