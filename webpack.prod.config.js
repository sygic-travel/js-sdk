var webpack = require('webpack');
var path = require("path");
var OptimizeJsPlugin = require('optimize-js-plugin');

module.exports = {
	entry: {
		sdk: './src/sdk.ts'
	},
	output: {
		filename: 'web-sdk.js',
		path: __dirname + '/dist',
		library: 'sdk',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	plugins: [
		new OptimizeJsPlugin({
			sourceMap: false
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			mangle: {
				screw_ie8: true,
				keep_fnames: true
			},
			compress: {
				screw_ie8: true,
				warnings: false,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				negate_iife: false
			},
			comments: false,
			sourceMap: false
		})
	]
};
