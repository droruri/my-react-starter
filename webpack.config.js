const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const commonSettings = require('./webpack.common');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

function insertIf(condition, ...elements) {
    return condition ? elements : [];
}

const mainScript = (env) => {
    const isShowBundleMap = env.SHOW_BUNDLE_MAP === undefined ? false : JSON.parse(env.SHOW_BUNDLE_MAP);
    const isProductionBundle = false;
    const nversion = env.NVERSION || '[contenthash]';

    return {
        mode: isProductionBundle ? "production" : 'development',
        devtool: isProductionBundle ? false : "inline-source-map",
        entry: commonSettings.entry,
        output: commonSettings.output(nversion),
        cache: {
            // Set cache type to filesystem
            type: 'filesystem',

            buildDependencies: {
                // This makes all dependencies of this file - build dependencies
                config: [__filename],
                // By default webpack and loaders are build dependencies
            },
        },
        plugins: [
            ...commonSettings.plugins,
            // this plugin cleans the output folder when we want to re-build the app
            ...insertIf(isProductionBundle, new CleanWebpackPlugin()),
            // this plugin is producing a map with the size of each file and package
            ...insertIf(isShowBundleMap, new BundleAnalyzerPlugin()),
            // this plugin defines how to create source map files if source-map option is on
            ...insertIf(!isProductionBundle, new webpack.SourceMapDevToolPlugin({
                filename: `[name].${nversion}.js.map`,
                exclude: ['node_modules']
            })),
        ],
        resolve: {
            alias: {
                ...commonSettings.resolve.alias,
            },
            extensions: commonSettings.resolve.extensions,
        },
        devServer: commonSettings.devServer,
        module: {
            rules: [
                ...commonSettings.module.rules,
            ]
        },
        ignoreWarnings: [/Failed to parse source map/],
    }
};

module.exports = mainScript;
