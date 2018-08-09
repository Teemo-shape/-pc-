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