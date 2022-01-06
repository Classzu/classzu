const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

    context: path.resolve(__dirname, '../test'), 

    entry: './test.ts',

    plugins:[new HtmlWebpackPlugin({
        template:"./index.html"
    })],

    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    },

    resolve: {
        // 拡張子を配列で指定
        extensions: ['.ts','.tsx','.js','jsx'],
        alias: {
            ts: path.resolve(__dirname, 'src/ts/'),
        },

    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
            },
            {
                // Babel 用のローダー
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [ '@babel/preset-env' ],
                        }
                    }
                ],
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, "../postcss.config.js"),
                            },
                        }
                    },
                ]
            },
            {
                test: /\.(svg|jpg|png)$/,
                type: "asset/resource",
            },
        ],
    },
};