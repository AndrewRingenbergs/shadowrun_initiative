
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return userRequest.indexOf('bower_components') >= 0 ||
    userRequest.indexOf('node_modules') >= 0 ||
    userRequest.indexOf('libraries') >= 0;
}

module.exports = function() {
  var config = {};

  config.entry = isTest ? {} : {
    app: './src/app.js',
    styles: './src/styles/style.css'
  };

  config.output = isTest ? {} : {
    path: __dirname + '/dist',
    publicPath: isProd ? '/' : 'http://localhost:8080/',
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  config.module = {}
  config.module.loaders = [{
    test: /\.css$/,
    loader: ExtractTextPlugin.extract("style-loader", "css-loader"  )
  }];

  config.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return isExternal(module);
      }
    })
  ];

  if (!isTest) {
    config.plugins.push(
        new HtmlWebpackPlugin({
          template: './src/index.html',
          inject: 'body'
        }),
        new ExtractTextPlugin('[name].[hash].css', {disable: !isProd}))
  }

  if(isProd) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new CopyWebpackPlugin([{ from: __dirname + '/src/public' }])
        );
  }

  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
  };

  return config;
}();
