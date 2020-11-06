// 生产环境打包项目
const path = require('path');
const webpack = require('webpack');
const colors = require('colors');

exports.desc = 'pack the project';
exports.aliases = 'p';
exports.command = 'pack [params]';

exports.handler = async argv => {
    const {params} = argv;
    const cwd = process.cwd();
    const singleItemPath = path.join(cwd, 'src', params);
    const cliConf = require(path.join(cwd, './cli.config.js'));


    const dllConf = require('../webpackconf/webpack.config.dll')(cliConf.vendor, cwd);

    const dllCompiler = webpack(dllConf);

    // dllPack
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

    const conf = require('../webpackconf/webpack.config.pro')(cwd, singleItemPath, params);
    const compiler = webpack(conf);
    compiler.hooks.done.tap('clientCompile', () => {
        console.log();
        console.log(`webpack pack done`);
    });
    compiler.run((err, stats) => {
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
};
