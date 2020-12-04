/**
 * @file express-devserver
 * @author zhanghao64@baidu.com
 */

const Express = require('express');
const ExpressServer = require('webpack-dev-server/lib/Server.js');
class Server extends ExpressServer {
    constructor(compiler, options = {}, _log) {
        super(compiler, options, _log);
    }

    // ExpressServer类中存在setupApp方法 这里只是重写了这个方法并加上了cors
    setupApp() {
        this.app = new Express();
        let router = this.router = Express.Router();
        this.app.use(router);
        router.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By", ' 3.2.1');
            if (req.method === "OPTIONS") res.send(200); /*让options请求快速返回*/else
                next();
        });
    }
}

module.exports = Server;
