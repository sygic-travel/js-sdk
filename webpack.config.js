var webpack = require('webpack');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:8080',
		'webpack/hot/dev-server',
		'./src/sdk.ts'
	],
	output: {
		filename: 'SygicTravelSDK.js',
		path: __dirname + '/dist',
		library: 'SygicTravelSDK',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
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
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				enforce: 'pre',
				test: /\.ts$/,
				use: "source-map-loader"
			}
]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devtool: 'inline-source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		})
	],
	devServer: {
		hot: true,
		inline: false,
		contentBase: './build'
	}
};
