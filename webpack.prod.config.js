var webpack = require('webpack');
var OptimizeJsPlugin = require('optimize-js-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var cloneDeep = require('lodash.clonedeep');

var baseConfig = {
	entry: {
		sdk: './src/sdk.ts'
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
browserConfig.plugins.push(
	new UglifyJSPlugin({
		uglifyOptions: {
			ecma: 5
		}
	})
);

var nodeConfig = cloneDeep(baseConfig);
nodeConfig.output.filename = 'SygicTravelSDK.node.js';
nodeConfig.target = 'node';
nodeConfig.node = { process: false };
nodeConfig.plugins.push(new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}));
nodeConfig.plugins.push(
	new UglifyJSPlugin({
		uglifyOptions: {
			ecma: 6
		}
	})
);

module.exports = [browserConfig, nodeConfig];
