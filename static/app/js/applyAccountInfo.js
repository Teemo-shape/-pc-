require(['KUYU.Service', 'KUYU.plugins.alert', 'placeholder','KUYU.Store','base64'], function() {
    var $http = KUYU.Service,
        $init = KUYU.Init,
        $Store = KUYU.Store,
        _env = KUYU.Init.getEnv(),
        $param = KUYU.Init.getParam(),
        _sever = KUYU.Init.getService();
    var path = _sever[_env.sever];
    var UUID = $init.createUid();

function selectway(id){
    if(id=="phone"){
        for(var i=0;i<$(".j-way").length;i++){
            $(".j-way").eq(i).addClass('hide');
        }
        $(".j-phone").eq(0).removeClass('hide');
    }
    if(id=="workid"){
        for(var i=0;i<$(".j-way").length;i++){
            $(".j-way").eq(i).addClass('hide');
        }
        $(".j-workid").eq(0).removeClass('hide');
    }
    if(id=="email"){
        for(var i=0;i<$(".j-way").length;i++){
            $(".j-way").eq(i).addClass('hide');
        }
        $(".j-email").eq(0).removeClass('hide');
    }
}
    function getValidateCode(){
        $("#imgcode").eq(0).attr("src","/rest/login/staff/getImageValidateCode?img-key="+UUID);
    }
    $init.Ready(function (){
        getValidateCode();
    });
});
