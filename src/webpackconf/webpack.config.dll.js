const path = require('path');
const WebpackBar = require('webpackbar');
const Webpack = require('webpack');
const shellJs = require('shelljs');

module.exports = (vendor, cwd) => {
    shellJs.rm('-rf', path.join(cwd, './dist'));
    return {
        mode: 'development',
        entry: {
            vendor
        },
        output: {
            filename: 'dll.[name].[hash].js',
            path: path.join(cwd, './dist', './scripts'),
            library: 'dll_[name]_[hash]_js'
        },
        plugins: [
            new WebpackBar({
            }),
            new Webpack.DllPlugin({
                name: 'dll_[name]_[hash]_js',
                path: path.join(cwd, './dist', 'vendor-manifest.json')
            }),
        ]
    };
};
