var webpack = require('webpack');
var OptimizeJsPlugin = require('optimize-js-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var cloneDeep = require('lodash.clonedeep');

var baseConfig = {
	mode: 'production',
	entry: {
		sdk: './src/StSDK.ts'
	},
	output: {
		path: __dirname + '/dist',
		library: 'SygicTravelSDK',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	plugins: [
		new OptimizeJsPlugin({
			sourceMap: false
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		})
	]
};

var browserConfig = cloneDeep(baseConfig);
browserConfig.output.filename = 'SygicTravelSDK.js';
browserConfig.target = 'web';
browserConfig.optimization = {
	minimizer: [new TerserPlugin({
		terserOptions: {
			ecma: 5,
			extractComments: true,
		},
	})],
};

var nodeConfig = cloneDeep(baseConfig);
nodeConfig.output.filename = 'SygicTravelSDK.node.js';
nodeConfig.target = 'node';
nodeConfig.node = { process: false };
nodeConfig.plugins.push(new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}));
nodeConfig.optimization = {
	minimizer: [new TerserPlugin({
		terserOptions: {
			ecma: 6,
			extractComments: true,
		},
	})],
};

module.exports = [browserConfig, nodeConfig];
