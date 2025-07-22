const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge (common, {
    mode: 'development',
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        port: 8080,
        open: true,
        hot: true,
    },
    devtool: 'inline-source-map',
});