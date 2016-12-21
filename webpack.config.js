
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function() {
  var config = {};

  config.entry = isTest ? {} : {
    app: './app.js'
  };

  config.output = isTest ? {} : {
    path: __dirname + '/dist',
    publicPath: isProd ? '/' : 'http://localhost:8080/',
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  config.loaders = [{
      test: /\app.js$/,
      loader: 'webpack-append',
      query: 'require("angular")'
    }
  ]

  config.plugins = config.plugins || []
  if (!isTest) {
    config.plugins.push(
        new HtmlWebpackPlugin({
          template: './index.html',
          inject: 'body'
        }),
        new ExtractTextPlugin('[name].[hash].css', {disable: !isProd}))
  }


  return config;
  }();
