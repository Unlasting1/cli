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
            library: 'dll__[name]__library'
        },
        plugins: [
            new WebpackBar({
            }),
            new Webpack.DllPlugin({
                name: 'dll__[name]__library',
                path: path.join(cwd, './dist', 'vendor-manifest.json'),
            }),
        ]
    };
};
