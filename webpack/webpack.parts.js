const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');

exports.html = function(options) {
	return {
		plugins: [
			new HtmlWebpackPlugin(options)
		]
	}
}

exports.clean = function(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				root: process.cwd()
			})
		]
	};
}

exports.copy = function(paths) {
	return {
		plugins: [
			new CopyWebpackPlugin(paths.map(path => { return {from: path} }))
		]
	}
}

exports.extractBundle = function(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		entry: entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				names: [options.name, 'manifest']
			})
		]
	};
}

exports.minify = function() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				compress: {
					warnings: false,
					drop_console: true
				},
				mangle: false
			})
		]
	};
}

exports.loadCSS = function(paths) {
	return {
		module: {
			loaders: [{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			}]
		}
	};
}

exports.extractCSS = function(paths) {
	return {
		module: {
			loaders: [{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
			}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].[chunkhash:8].css')
		]
	};
}


exports.devServer = function(options) {
	return {
		devServer: {
			historyApiFallback: true,
			stats: 'minimal',
			hot: true,
			inline: true,
			host: options.host || '0.0.0.0',
			port: options.port || 8080
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({})
		]
	}
}

exports.progress = function() {
	return {
		plugins: [
			new NyanProgressPlugin()
		]
	}
}

