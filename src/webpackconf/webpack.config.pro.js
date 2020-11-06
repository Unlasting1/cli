const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const {merge} = require('webpack-merge');

module.exports = (cwd, singleItemPath, params) => {
    const baseConf = require('./webpack.config.base')(cwd, singleItemPath, params);
    const scripts = fs.readdirSync(path.join(cwd, './dist', './scripts'));
    let name;
    scripts.forEach(v => {
        if(v.includes('dll')) {
            name = v;
        }
    })
    const proConf = {
        mode: 'production',
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(singleItemPath, `index.html`),
                filename: path.join(cwd, './dist', `./index.html`),
            }),
            new Webpack.DllReferencePlugin({
                manifest: require(path.join(cwd, './dist', `./vendor-manifest.json`)),
                context: cwd
            }),
            new HtmlWebpackTagsPlugin({
                append: false,
                scripts: [
                    { path: name },
                ]
            }),
        ]
    };

    return merge(baseConf, proConf);
};
