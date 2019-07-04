const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        "/common/index": "./public/src/common/index.js"
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: '[name].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    // devtool: '#eval-source-map',
    resolve: {
        /**
         * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本
         */
        alias: {
            vue: 'vue/dist/vue.js'
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ],
    // optimization: {
    //     namedModules: false,
    //     namedChunks: false,
    //     nodeEnv: 'production',
    //     flagIncludedChunks: true,
    //     occurrenceOrder: true,
    //     sideEffects: true,
    //     usedExports: true,
    //     concatenateModules: true,
    //     splitChunks: {
    //         hidePathInfo: true,
    //         minSize: 30000,
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 3,
    //     },
    //     noEmitOnErrors: true,
    //     checkWasmTypes: true,
    //     minimize: true,
    // },
};