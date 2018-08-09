##  如果是第一次运行本代码则先执行: npm i
                                    node app.js

#   如果程序已经运行, 则先停止程序运行: pm2 stop tcl-seo
#   重启服务： pm2 restart tcl-seo

##  执行测试: npm test
##  执行预发布: npm run release
##  执行生产: npm run build

注意：默认linux 如果是window环境运行 要修改package scripts 中如： export NODE_ENV  改成 set  NODE_ENV; linux 反之;