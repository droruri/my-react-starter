const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonSettings = {
    // First, let's define an entry point for webpack to start its crawling.
    entry: ['./src/index.tsx'],
    // Second, we define where the files webpack produce, are placed
    output: function output(version){
        return {
            sourceMapFilename: "./bundle.js.map",
            pathinfo: true,
            path: path.resolve(__dirname, 'static'),
            filename: `[name].${version}.js`,
            chunkFilename: `[name].${version}.bundle.js`,
        }
    },
    plugins: [
        // this plugin checks if there are duplicate packages
        new DuplicatePackageCheckerPlugin(),
        // this plugin is responsible to reload changed files for live reload
        new webpack.HotModuleReplacementPlugin(),
        // this plugin takes an HTML file and joins to this file the final bundle
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
            filename: "index.html",
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    resolve: {
        alias: {
            // this rule handles vue files
            'vue$': 'vue/dist/vue.esm.js',
            'angular': path.resolve(path.join(__dirname, 'node_modules', 'angular')),
            'codemirror': path.resolve(path.join(__dirname, 'node_modules', 'codemirror')),
            /* These are path aliases, the goal of using them is that you wnat have to mention the full path
            * when you import files from these directories*/
            third_party: path.resolve(__dirname, 'app/third_party/')
        },
        extensions: ['*', '.js', '.json', '.ts', '.tsx']
    },
    // these are the configurations for running the webpack bundle in the localhost environment
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './static'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    module: {
        rules: [
            //this rule compiles the helper files of our project into the main bundle
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: {loader: 'url-loader?limit=100000'}},
            //this rule compiles all less files into the main bundle
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
            },
            //this rule compiles css/sass/scss files into the main bundle
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            //this rule compiles html files into the main bundle as js variables
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            // this rule compiles ts/tsx files formatted to JS into the main bundle
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
            },

        ]
    }
};

module.exports = commonSettings;
