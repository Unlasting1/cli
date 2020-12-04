const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        mode: 'development',
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(singleItemPath, `index.html`),
                filename: path.join(cwd, './dist', `./index.html`),
            })
        ],
        performance: {
            hints: 'error'
        }
    };

    return merge(baseConf, proConf);
};
