import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const WebpackConfig: webpack.Configuration = {
    context: path.resolve(__dirname, './'),
    entry: {
        app: './src/script/app.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'module.[name]',
        libraryTarget: 'umd'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                },
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            },
            {
                test: /\.ts$/,
                loader: 'lodash-ts-webpack-plugin',
                exclude: /node_modules/,
                enforce: 'pre'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ]
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'sass-loader', options: {outputStyle: 'compressed'}}
                    ]
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './src/app.html'
        }),
        new ExtractTextPlugin({
            filename: 'css/app.css',
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'lodash',
            lodash: 'lodash'
        })
    ],
    devtool: 'source-map',
    // devServer: {
    //     contentBase: './dist'
    // },
    target: 'web',
    // externals: {
    //     jquery: 'jQuery',
    //     lodash: 'lodash'
    // },
    optimization: {
        splitChunks: {
            name: 'vendor'
        }
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
        ],
        extensions: ['.ts', '.tsx', '.js', '.json']
    }
};

export default WebpackConfig;
