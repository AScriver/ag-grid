const merge = require('webpack-merge');
const common = require('./common');

const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

let homepage = './src/_assets/homepage/main.ts';

if (require('minimist')(process.argv.slice(2)).hmr) {
    homepage = ['./src/_assets/homepage/main.ts', 'webpack-hot-middleware/client?path=/dist/__webpack_hmr&reload=true'];
}

module.exports = {
    entry: {
        homepage: homepage
    },
    output: {
        publicPath: '/',
        hotUpdateChunkFilename: 'dist/[hash].hot-update.js',
        hotUpdateMainFilename: 'dist/[hash].hot-update.json'
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                use: [
                    {loader: 'cache-loader'},
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: require('os').cpus().length - 1
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            configFile: path.resolve('./tsconfig.json')
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?sourceMap=true',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [require('precss'), require('autoprefixer')]
                            }
                        },
                        'sass-loader?sourceMap=true'
                    ]
                })
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {limit: 8192}
                    }
                ]
            },
            {
                test: /\.(svg)$/,
                use: [
                    {loader: 'url-loader', options: {limit: 20000}},
                    {
                        loader: 'svg-colorize-loader',
                        options: {color1: '#000000'}
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({filename: '[name].css'}),


        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
            // In case you imported plugins individually, you must also require them here:
            // Util: 'exports-loader?Util!bootstrap/js/dist/util',
            // Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown'
        }),

        new webpack.DefinePlugin({MAX_ACTIVE_EXAMPLES: JSON.stringify(3)}),
    ]
};
