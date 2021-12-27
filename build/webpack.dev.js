const path = require('path');
const common = require("./webpack.common");
const {merge}= require("webpack-merge");

module.exports = merge(common, {

    mode: "development",
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
        path: path.resolve(__dirname, '../test-dist'),
        filename: '[name].js',
        assetModuleFilename: "images/[name][ext]",
    },
    devServer: {
        port: 3000,
    },

});