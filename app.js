const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const render = require('koa-ejs');
const router = require('./routes');
const cors = require('koa2-cors');
const compress = require("koa-compress");
const onerror = require('koa-onerror');
const convert = require('koa-convert');
const json = require('koa-json');
const config = require('./config/config');
const log4js = require('koa-log4');
const Router = require('koa-router')();
require('./config/logs')
const logger = log4js.getLogger('app') //将当前文件日志命名为 app

const app = new Koa();
app.use(cors());
app.use(json());
// app.use(compress({
//     threshold: 2048,
// //    flush: require("zlib").Z_SYNC_FLUSH
// }));

const opts = {
  maxage: 1000 * 60 * 60 * 24,
  defer: false,
};

app.use(static(config.static));
// app.use(log4js.koaLogger(log4js.getLogger("access"), { level: log4js.levels.INFO }))

render(app, {
  root: path.join(__dirname, config.view),
  layout: 'layout',
  viewExt: 'html',
  cache: true,
  debug: false
});

app.use(async (ctx, next) => {

  try{
      const start = new Date();
      await next();
      ctx.set("X-Powered-By", "TCL");
      const ms = new Date() - start;
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  } catch (err) {
      logger.error(config.env, err);
      console.log(err)
      if(err.errno != 'ETIME') {
         await ctx.render('./update', {'msg': err})
      }else{
         console.log(err)
      }
      
  }

});


app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(3008)
