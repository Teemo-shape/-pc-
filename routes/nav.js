const nav = require('./nav');
const $http = require('../modules/http');



var navs = {
    getBars: function (token) {
        var params={
            "terminalType":"PC",
        }
        var headers={
            'ihome-token' : token,
            'platform' : 'platform_tcl_staff',
        }
        return $http.get('/homePage/topNavigation/getActiveTopNavigation',params,headers)
    },
    products() {
        return $http.get('/platTopCart/products')
    }
}
module.exports = navs;
