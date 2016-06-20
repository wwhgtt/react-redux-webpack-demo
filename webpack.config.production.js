const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index_bundle: [
      // 'webpack-dev-server/client?http://192.168.200.17:3000', // WebpackDevServer host and port
      // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      // 'babel-polyfill',
      './src/dish-menu.jsx',
    ],
  },
  resolve: {
    fallback: '/usr/local/lib/node_modules',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: `http://${process.env.PROD_HOST}/`,
  },
  module: {
    loaders: [
      {
        test: /\.jsx|js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015,presets[]=stage-0'], // 'babel-loader' is also a legal name to reference
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css',
          'sass?includePaths[]=./node_modules/compass-mixins/lib&includePaths[]=./src/asset/style',
        ],
      },
      {
        test: /\.png$/,
        loaders: ['url?limit=8192&name=asset/img/[hash].[ext]'],
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ inject: 'body', template: './src/helper/html-webpack-plugin-template.html' }),
    new webpack.EnvironmentPlugin(['DEV_HOST']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
