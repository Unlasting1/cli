/**
 * @file devServer启动 参考(其实是copy+注释,手动狗头)webpack-dev-server cli启动的方式进行封装
 * @author zhanghao64@baidu.com
 */

const net = require('net');
const fs = require('fs');
const ExpressServer = require('../server/expressServer');
const setupExitSignals = require('webpack-dev-server/lib/utils/setupExitSignals');
const createLogger = require('webpack-dev-server/lib/utils/createLogger');
const colors = require('webpack-dev-server/lib/utils/colors');
const webpack = require('webpack');
const serverData = {
    server: null
};
let server = null;

// 通过闭包和process.on 优雅的处理容器中 ctrl+c无法结束服务器的问题
setupExitSignals(serverData);

const startWebPackDevServer = (config, options) => {
    const log = createLogger(options);

    let compiler;

    try {
        compiler = webpack(config);
    } catch (err) {
        // 红色文字展示错误
        if (err instanceof webpack.WebpackOptionsValidationError) {
            log.error(colors.error(options.stats.colors, err.message));
            process.exit(1);
        }
        throw err;
    }

    try {
        server = new ExpressServer(compiler, options, log);
        serverData.server = server;
    } catch (err) {
        if (err.name === 'ValidationError') {
            log.error(colors.error(options.stats.colors, err.message));
            process.exit(1);
        }

        throw err;
    }

    if (options.socket) {
        server.listeningApp.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                const clientSocket = new net.Socket();

                clientSocket.on('error', (err) => {
                    if (err.code === 'ECONNREFUSED') {
                        // No other server listening on this socket so it can be safely removed
                        fs.unlinkSync(options.socket);

                        server.listen(options.socket, options.host, (error) => {
                            if (error) {
                                throw error;
                            }
                        });
                    }
                });

                clientSocket.connect({path: options.socket}, () => {
                    throw new Error('This socket is already used');
                });
            }
        });

        server.listen(options.socket, options.host, (err) => {
            if (err) {
                throw err;
            }

            // chmod 666 (rw rw rw) 0o代表8进制 0o666转换成10进制为 438
            const READ_WRITE = 0o666;

            fs.chmod(options.socket, READ_WRITE, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
    else {
        server.listen(options.port, options.host, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    return server;
};

module.exports = (option) => startWebPackDevServer(option, option.devServer);
