var webpack = require('webpack');

var baseConfig = {
	entry: {
		sdk: './src/StSDK.ts'
	},
	target: 'web',
	output: {
		path: __dirname + '/dist',
		library: 'SygicTravelSDK',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		filename: 'SygicTravelSDK.js'
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
		new webpack.LoaderOptionsPlugin({
			minimize: false,
			debug: true
		})
	]
};

module.exports = baseConfig;
