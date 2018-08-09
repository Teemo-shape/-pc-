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