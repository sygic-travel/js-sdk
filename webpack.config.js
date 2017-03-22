var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './src/sdk.ts'
    ],
    output: {
        filename: 'sdk.js',
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
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        inline: false,
        contentBase: './dist'
    }
};
