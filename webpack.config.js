
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const dependencies = Object.keys(require('./package.json').dependencies);

const parts = require('./webpack/webpack.parts.js');

const PATHS = {
	app: path.join(__dirname, 'src', 'app'),
	styles: path.join(__dirname, 'src', 'styles', 'style.css'),
	build: path.join(__dirname, 'dist'),
	pub: path.join(__dirname, 'src', 'public')
}

const getEnv = function() {
	let env = process.env.npm_lifecycle_event;
	switch(env) {
		case 'build':
			return 'production';
		case 'test':
		case 'test-watch':
			return 'test';
		default:
			return 'dev'
	}
}

const common = merge({
	entry: {
		app: PATHS.app,
		styles: PATHS.styles,
    vendor: dependencies
	}
}, parts.setupJS());

module.exports = function(env) {
	console.log('Building in Environment: '+ env)

	switch (env) {
		case 'production':
			return merge(common, {
				devtool: 'source-map',
				output: {
					path: PATHS.build,
					filename: '[name].[chunkhash:8].js'
				}
			},
			parts.html({
				template: './src/index.html',
				inject: 'body'
			}),
			parts.extractCSS(PATHS.styles),
			parts.copy([PATHS.pub]),
			parts.minify()
			);
		case 'dev':
			return merge(common, {
				devtool: 'eval-source-map',
				output: {
					path: PATHS.build,
					filename: '[name].js'
				}
			},
			parts.html({
				template: './src/index.html',
				inject: 'body'
			}),
			parts.loadCSS(PATHS.styles),
			parts.progress(),
			parts.devServer({})
			);
	}
	return config;
}(getEnv());
