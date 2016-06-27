const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    'dish-menu-entry': [
      './src/dish-menu.jsx',
    ],
    'order-entry': [
      './src/order.jsx',
    ],
  },
  resolve: {
    fallback: '/usr/local/lib/node_modules',
  },
  output: {
    path: path.join(__dirname, 'dist-[hash]'),
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
    new webpack.EnvironmentPlugin(['DEV_HOST']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
