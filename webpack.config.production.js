const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'dish-menu-entry': [
      './src/dish-menu.jsx',
    ],
    'order-entry': [
      './src/order.jsx',
    ],
    'customer-address-entry': [
      './src/customer-address.jsx',
    ],
    'address-list-entry': [
      './src/address-list.jsx',
    ],
    'order-inLine': [
      './src/order-inLine.jsx',
    ],
    'place-order': [
      './src/place-order.jsx',
    ],
    'mine-index-entry': [
      './src/mine-index.jsx',
    ],
    'mine-setting-entry': [
      './src/mine-setting.jsx',
    ],
    'bind-phone-entry': [
      './src/bind-phone.jsx',
    ],
    'bind-wx-entry': [
      './src/bind-wx.jsx',
    ],
    'register-member-entry' :[
      './src/register-member.jsx',
    ],
    'user-login-entry': [
      './src/user-login.jsx',
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
        test: /\.(gif|png)$/,
        loaders: ['url?limit=8192&name=asset/img/[hash].[ext]'],
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'PROD_HOST']),
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
        title: 'MineIndexApplication',
        filename: 'mine-index.html',
        chunks: ['common', 'mine-index-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineSettingApplication',
        filename: 'mine-setting.html',
        chunks: ['common', 'mine-setting-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
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
        title: 'OrderInLineApplication',
        filename: 'order-inLine.html',
        chunks: ['common', 'order-inLine'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'BindWXApplication',
        filename: 'bind-wx.html',
        chunks: ['common', 'bind-wx-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'PlaceOrderApplication',
        filename: 'place-order.html',
        chunks: ['common', 'place-order'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'BindPhoneApplication',
        filename: 'bind-phone.html',
        chunks: ['common', 'bind-phone-entry'],
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
    new HtmlWebpackPlugin(
      {
        title: 'UserLoginApplication',
        filename: 'user-login.html',
        chunks: ['common', 'user-login-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
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
