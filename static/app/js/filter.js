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
