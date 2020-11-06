const path = require('path');
const WebpackBar = require('webpackbar');

module.exports = (cwd, singleItemPath, params) => {
    return {
        entry: path.join(singleItemPath, './main.jsx'),
        output: {
            filename: '[name].[hash].js',
            path: path.join(cwd, `./dist`, './scripts/')
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
            new WebpackBar()
        ]
    };
};