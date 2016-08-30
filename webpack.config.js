const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'dish-menu-entry': [
      // `webpack-dev-server/client?http://${process.env.DEV_HOST}:3000`, // WebpackDevServer host and port
      // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      // 'babel-polyfill',
      './src/dish-menu.jsx',
    ],
    'order-entry': [
      './src/order.jsx',
    ],
    'storyboard-entry':'./src/storyboard.jsx',
    'customer-address-entry': [
      './src/customer-address.jsx',
    ],
    'mine-index-entry': [
      './src/mine-index.jsx',
    ],
    'mine-setting-entry': [
      './src/mine-setting.jsx',
    ],
    'address-list-entry': [
      './src/address-list.jsx',
    ],
    'bind-account-entry': './src/bind-account.jsx',
    'register-member-entry' : './src/register-member.jsx',
  },
  resolve: {
    fallback: '/usr/local/lib/node_modules',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: `http://${process.env.DEV_HOST}:3000/`,
  },
  devtool: ['source-map'],
  module: {
    loaders: [
      {
        test: /\.jsx|js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0'], // 'babel-loader' is also a legal name to reference
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'postcss', 'sass?&sourceMap&includePaths[]=./src/asset/style'],
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
  postcss() {
    return [autoprefixer({ browsers: ['last 5 versions'] })];
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'DishMenuApplication',
        filename: 'dish-menu.html',
        chunks: ['common', 'dish-menu-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'OrderApplication',
        filename: 'order.html',
        chunks: ['common', 'order-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'StoryboardApplication',
        filename: 'storyboard.html',
        chunks: ['common', 'storyboard-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'CustomerAddressApplication',
        filename: 'customer-address.html',
        chunks: ['common', 'customer-address-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template-customer-address.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: '我的',
        filename: 'mineIndex.html',
        chunks: ['common', 'mine-index-entry'],
        inject: 'body', template: './src/helper/common-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: '设置',
        filename: 'mineSetting.html',
        chunks: ['common', 'mine-setting-entry'],
        inject: 'body', template: './src/helper/common-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'AddressListApplication',
        filename: 'address-list.html',
        chunks: ['common', 'address-list-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'BindAccountApplication',
        filename: 'bind-account.html',
        chunks: ['common', 'bind-account-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'RegisterMember',
        filename: 'register-member.html',
        chunks: ['common', 'register-member-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEV_HOST']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
