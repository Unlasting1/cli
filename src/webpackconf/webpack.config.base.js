const path = require('path');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const AddDllToHtmlPlugin = require('../webpack/plugin/addDllToHtmlPlugin');

module.exports = (cwd, singleItemPath, params) => {
    return {
        entry: path.join(singleItemPath, './main.jsx'),
        output: {
            filename: 'scripts/[name].[hash].js',
            path: path.join(cwd, `./dist`),
            chunkFilename: "scripts/[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.?js|\.?jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {
                                        targets: {
                                            chrome: "58",
                                            ie: "11"
                                        }
                                    }],
                                    ["@babel/preset-react"]
                                ],
                                plugins: [
                                    ["@babel/plugin-transform-runtime", {
                                        corejs: 3
                                    }]
                                ]
                            }
                        },
                        "thread-loader",
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ],
        },
        plugins: [
            new WebpackBar(),
            new webpack.DllReferencePlugin({
                manifest: require(path.join(cwd, './dist', `./vendor-manifest.json`)),
            }),
            new AddDllToHtmlPlugin()
        ],
        // loader解析先从项目中找 找不到就从脚手架中的node_modules找
        resolveLoader: {
            modules: [ path.join(__dirname, '../../node_modules'), 'node_modules' ],
        }
    };
};
