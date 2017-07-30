'use strict';
//
// const NODE_ENV = process.env.NODE_ENV || 'development';
// const webpack = require('webpack');
// const path = require('path');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
//
// module.exports = {
//
//     entry: {
//         script: './index.js',
//     },
//
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         publicPath: '/',
//         filename: "[name].js"
//     },
//
//     watch: NODE_ENV == 'development',
//
//     watchOptions: {
//         aggregateTimeout: 100
//     },
//
//     devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,
//
//     resolve: {
//         modulesDirectories: ['node_modules'],
//         extensions: ['', '.js']
//     },
//
//     resolveLoader: {
//         modulesDirectories: ['node_modules'],
//         moduleTemplates: ['*-loader', '*'],
//         extensions: ['', '.js']
//     },
//
//     // node: {
//     //   __dirname: true
//     // },
//
//     module: {
//         loaders: [{
//             test: /\.js$/,
//             loader: "babel",
//             exclude: [/node_modules/, /public/]
//         }, {
//             test: /\.css$/,
//             loader: "style!css!autoprefixer",
//             exclude: [/node_modules/, /public/]
//         }, {
//             test: /\.less$/,
//             loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less'),
//             exclude: [/node_modules/, /public/]
//         }, {
//             test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
//             loader: 'url?limit=4096'
//         }]
//     },
//
//     plugins: [
//         new ExtractTextPlugin('[name].css'),
//         new webpack.DefinePlugin({
//             NODE_ENV: JSON.stringify(NODE_ENV),
//             LANG: JSON.stringify('en'),
//             BASE: JSON.stringify(__dirname + '/'),
//             BLOCKS: JSON.stringify(__dirname + '/frontend/blocks/'),
//             LIBS: JSON.stringify(__dirname + '/libs/'),
//             PUBLIC: JSON.stringify(__dirname + '/public/'),
//             PRELOAD_IMAGE_COUNT: JSON.stringify(config.get('image:preloadEntityCount'))
//         }),
//
//         // new webpack.optimize.CommonsChunkPlugin({
//         //     name: 'common-user',
//         //     chunks: ['user', 'logged-user']
//         // })
//     ]
//
// };
//
// if (NODE_ENV == 'production') {
//     module.exports.plugins.push(
//         new webpack.optimize.UglifyJsPlugin({
//             compress: {
//                 // don't show unreachable variables etc
//                 warnings: false,
//                 drop_console: true
//             }
//         })
//     );
// }

import path from 'path';
//import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

export default () => ({
    entry: {
        'popup': path.join(__dirname, 'popup.js'),
        'background': path.join(__dirname, 'background.js'),
        'unison-spy': path.join(__dirname, 'unison-spy.js')
    },
    output: {
        path: path.join(__dirname, 'extension', 'bundle'),
        filename: '[name].js'
    },
    plugins: [
        //        new ExtractTextPlugin('[name].css'),
        // new webpack.DefinePlugin({
        //     LIBS: JSON.stringify(__dirname + '/libs/')
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['script', 'popup']
        })
    ],

    watch: true,
    module: {
        rules: [{
                test: /.js?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['es2015', {
                                modules: false
                            }],
                            'react',
                        ],
                    }
                }]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/]
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader',
                // loader: ExtractTextPlugin.extract({
                //     fallback: 'style-loader',
                //     use: 'css-loader!autoprefixer-loader!less-loader'
                // }),
                exclude: [/node_modules/]
            }, {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'url-loader?limit=4096'
            }
        ]
    },
});
