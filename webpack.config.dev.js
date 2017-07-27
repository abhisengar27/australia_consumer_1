var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');
var webpack = require('webpack');
var path=require('path');
module.exports = webpackMerge(commonConfig, {
  
  devtool: "source-map",
  output: {
    path: path.join(__dirname,'public/javascripts/app'),
    publicPath: "/js/app/",
    filename: "bundleTheme1.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.js($|\?)/i,
      minimize: true
    })
  ]
});