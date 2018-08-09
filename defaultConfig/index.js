const env = process.env.NODE_ENV.trim();
module.exports = {
    reg: "/applyAccount",
    login: "/sign",
    userCenterBar:'../../app/plugins/userCenterBar/unfiyCenterBar.html',
    uthome:"/pages/usercenterindex/usercenter.html",
    jfindex:'http://hy.tcl.com/', 
    jfHTML:'<p class="zqstate2 tab-switch"><a href="#" class="active all">全部订单</a><b>|</b><a href="#" class="waitpay">待付款<span id="waitpaycount">(0)</span></a><b>|</b><a href="#" class="waitship">待发货<span id="waitshippingcount">(0)</span></a><b>|</b><a href="#" class="shipping">待收货 <span id="shippingcount">(0)</span></a><b>|</b><a href="#" class="waitcomment">待评价 <span id="waitcommentcount">(0)</span></a><b>|</b><a href="#" class="succeed">已完成<span id="succeedorder">(0)</span></a><b>|</b><a href="javascript:;" class="delete"><span href="javascript:;" class="del-order"><i class="icon iconfont-tcl"> &#xe63c;</i></span>订单回收站</a></p>',
    jforder:'',
    fapiao:'',
    wodejf:'',
    wodequanyi:'',
    wodeshoucang: '/pages/collect/collects.html#collects',
    wodezuji:'',
    myproduct:'',
    fuwujilu:'',
    shequzhongxin: 'http://fans.tcl.com/',
    shequtongzhi:'',
    woderenzheng:'',
    account:'',
    address:'',
    accountsafe: '/pages/userimg/userimg.html',
    integral: '/pages/IntegralDetail/IntegralDetail.html',
    manageuser: '/pages/manageuser/manageuser.html',
    equityHTML:'',
    sso: (env == 'production' || env == 'release' ) ? 'https://login.tclclouds.com/account/verifyUsernameToken?clientId=14046695&funcName=cb' : 'https://logintest.tclclouds.com/account/verifyUsernameToken?clientId=14046695&funcName=cb',
    regBulk:'notLogin',
}
