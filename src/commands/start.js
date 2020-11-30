// 开发环境启动项目
const path = require('path');
const webpack = require('webpack');
const startWebpackDevServer = require('../utils/startWebpackDevServer')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('WebpackBar');
const colors = require('colors');

exports.desc = 'start with dev server';
exports.aliases = 's';
exports.command = 'start [params]';

exports.handler = async argv => {
    const {params} = argv;
    const cwd = process.cwd();
    const singleItemPath = path.join(cwd, 'src', params);
    const cliConf = require(path.join(cwd, './cli.config.js'));
    const dllConf = require('../webpackconf/webpack.config.dll')(cliConf.vendor, cwd);
    const dllCompiler = webpack(dllConf);

    await new Promise(resolve => {
        dllCompiler.run((err, stats) => {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }
        });
        dllCompiler.hooks.done.tap('clientCompile', () => {
            console.log(colors.green('webpack pack dll success'));
            resolve();
        });
    });

    const conf = require('../webpackconf/webpack.config.dev')(cwd, singleItemPath, params);

    conf.devServer = {
        contentBase: path.join(process.cwd(), `./dist`),
        compress: true,
        host: '127.0.0.1',
        disableHostCheck: true,
        progress: true,
        overlay: true,
        stats: {
            colors: true
        },
        socket: false,
        noInfo: true,
        after(app, server, complier) {
            console.log('webserver is running.');
        },
    };

    const server = startWebpackDevServer(conf);
    server.compiler.hooks.done.tap('clientCompile', (function () {
            let firstClientCompile = false;

            return stats => {
                if (!firstClientCompile) {
                    console.log();
                    console.log(`Csr Page is running at http://${cliConf.host ? cliConf.host : 'localhost'}/` + `${params}.html`);
                    firstClientCompile = true;
                }
            };
        }())
    );
    server.listen(80);
};
