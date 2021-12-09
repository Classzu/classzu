const path = require('path');
const common = require("./webpack.common");
const {merge}= require("webpack-merge");

module.exports = merge(common, {

    mode: "development",
    output: {
        path: path.resolve(__dirname, '../test-dist'),
        filename: '[name].js',
        assetModuleFilename: "images/[name][ext]",
    },
    devServer: {
        port: 3000,
    },

});