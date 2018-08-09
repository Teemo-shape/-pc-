const router = require('koa-router')();
const log4js = require('koa-log4')
require('../config/logs')
const logger = log4js.getLogger('routerIndex')
const $http = require('../modules/http');


var sysError = {};

async function __main__(ctx, next) {

    await ctx.render('/components/login/login',{'__result__':""})
}

router.get('/', async(ctx, next) => {
    await __main__(ctx, next)
});

module.exports = router;
