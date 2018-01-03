// https://github.com/zinserjan/mocha-webpack/blob/master/docs/installation/webpack-configuration.md
var nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: [
		'./src/sdk.ts'
	],
	output: {
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
	},
	target: 'node',
	externals: [nodeExternals()],
	devtool: "inline-cheap-module-source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				enforce: 'pre',
				loader: 'tslint-loader',
				options: {
					configFile: 'tslint.json',
					tsConfigFile: 'tsconfig.json'
				}
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				enforce: 'pre',
				test: /\.ts$/,
				use: "source-map-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};
