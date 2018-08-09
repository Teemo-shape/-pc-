require(['KUYU.Service', 'KUYU.HeaderTwo','KUYU.navHeader', 'KUYU.navFooterLink','KUYU.Binder','KUYU.Store', 'KUYU.SlideBarLogin'],function(){
    var $http = KUYU.Service,
         $init = KUYU.Init,
        $binder = KUYU.Binder,
        $header = KUYU.HeaderTwo,
        $Store = KUYU.Store,
        navFooterLink = KUYU.navFooterLink,
        navHeader = KUYU.navHeader,

        $scope = KUYU.RootScope;
        $header.menuHover();
        $header.topSearch();
        navFooterLink();
        navHeader();

    $(function(){
        var u = location.search;
        if(u){
            u = u.substr(1);
            var arr = u.split("&");
            //获取订单号和状态
            var orderId = arr[0];
            var state = arr[1];
        }
       
        

        var html ="";
        html += '<span class="pay-img"></span>'+
                '<p class="pay-text">';
        if(state == "8"){
            html += '您的订单已经关闭。';
        }else{
            html += '您的订单已经支付成功，请勿重复支付';
        }
        html += '<p class="pri-text red">订单号：'+orderId +'</p>';

        $(".succ-l").prepend(html);


        $http.get({
            url:"/tclcustomer/userInfo",
            data:{
                ranNum:Math.random()
            },
            success:function(res){
                if(res){
                    if(res.data){
                        if(res.data.bindMail){
                            $("div.order-num span").html(res.data.bindMail);
                        }
                    }
                }
            }
        })


    })
   
});
