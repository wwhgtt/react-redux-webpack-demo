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
    'dish-menu-zc-entry': [
      './src/dish-menu-zc.jsx',
    ],
    'order-entry': [
      './src/order.jsx',
    ],
    'order-dinner-statement-entry': [
      './src/order-dinner-statement.jsx',
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
    'mine-vip-card-entry': [
      './src/mine-vip-card.jsx',
    ],
    'mine-vip-level-entry': [
      './src/mine-vip-level.jsx',
    ],
    'mine-coupon-list-entry': [
      './src/mine-coupon-list.jsx',
    ],
    'address-list-entry': [
      './src/address-list.jsx',
    ],
    'order-in-line-entry': [
      './src/order-in-line.jsx',
    ],
    'place-order-entry': [
      './src/place-order.jsx',
    ],
    'bind-phone-entry': [
      './src/bind-phone.jsx',
    ],
    'bind-wx-entry': [
      './src/bind-wx.jsx',
    ],
    'register-member-entry': [
      './src/register-member.jsx',
    ],
    'user-login-entry': [
      './src/user-login.jsx',
    ],
    'exception-device-entry': [
      './src/exception-device.jsx',
    ],
    'exception-link-entry': [
      './src/exception-link.jsx',
    ],
    'exception-dish-entry': [
      './src/exception-dish.jsx',
    ],
    'exception-dish-current-entry': [
      './src/exception-dish-current.jsx',
    ],
    'order-detail-uncheck-entry': [
      './src/order-detail-uncheck.jsx',
    ],
    'order-dinner-cart-entry': [
      './src/order-dinner-cart.jsx',
    ],
    'register-validate-entry': [
      './src/register-validate.jsx',
    ],
    'activate-card-entry': [
      './src/activate-card.jsx',
    ],
    'activate-validate-entry': [
      './src/activate-validate.jsx',
    ],
    'mine-balance-entry': [
      './src/mine-balance.jsx',
    ],
    'mine-accumulation-entry': [
      './src/mine-accumulation.jsx',
    ],
    'mine-growup-entry': [
      './src/mine-growup.jsx',
    ],
    'mine-recharge-entry': [
      './src/mine-recharge.jsx',
    ],
    'mine-modify-password-entry': [
      './src/mine-modify-password.jsx',
    ],
    'mine-reset-password-entry': [
      './src/mine-reset-password.jsx',
    ],
    'queue-detail-entry': [
      './src/queue-detail.jsx',
    ],
    'book-detail-entry': [
      './src/book-detail.jsx',
    ],
    'order-list-entry': [
      './src/order-list.jsx',
    ],
    'dinner-detail-entry': [
      './src/dinner-detail.jsx',
    ],
    'takeout-detail-entry': [
      './src/takeout-detail.jsx',
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
        loaders: ['style', 'css', 'postcss', 'sass?includePaths[]=./src/asset/style'],
      },
      {
        test: /\.(gif|png|svg|jpg)$/,
        loaders: ['url?limit=8192&name=asset/img/[hash].[ext]'],
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
    ],
  },
  postcss() {
    return [autoprefixer({ browsers: ['Safari > 1'] })];
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'PROD_HOST']),
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
        title: 'DishMenuZcApplication',
        filename: 'dish-menu-zc.html',
        chunks: ['common', 'dish-menu-zc-entry'],
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
        title: 'OrderDinnerStateMentApplication',
        filename: 'order-dinner-statement.html',
        chunks: ['common', 'order-dinner-statement-entry'],
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
        filename: 'mineIndex.html',
        chunks: ['common', 'mine-index-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineVipCardApplication',
        filename: 'mineVipCard.html',
        chunks: ['common', 'mine-vip-card-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineVipLevelApplication',
        filename: 'mineVipLevel.html',
        chunks: ['common', 'mine-vip-level-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineSettingApplication',
        filename: 'mineSetting.html',
        chunks: ['common', 'mine-setting-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineCouponListApplication',
        filename: 'mineCouponList.html',
        chunks: ['common', 'mine-coupon-list-entry'],
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
        filename: 'order-in-line.html',
        chunks: ['common', 'order-in-line-entry'],
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
        chunks: ['common', 'place-order-entry'],
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
    new HtmlWebpackPlugin(
      {
        title: 'exceptionDeviceApplication',
        filename: 'exception-device.html',
        chunks: ['common', 'exception-device-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'exceptionLinkApplication',
        filename: 'exception-link.html',
        chunks: ['common', 'exception-link-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'exceptionDishApplication',
        filename: 'exception-dish.html',
        chunks: ['common', 'exception-dish-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'exceptionDishCurrentApplication',
        filename: 'exception-dish-current.html',
        chunks: ['common', 'exception-dish-current-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'OrderDetailInApplication',
        filename: 'order-detail-uncheck.html',
        chunks: ['common', 'order-detail-uncheck-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'OrderTSCartApplication',
        filename: 'order-dinner-cart.html',
        chunks: ['common', 'order-dinner-cart-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'RegisterValidateApplication',
        filename: 'register-validate.html',
        chunks: ['common', 'register-validate-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'ActivateCardApplication',
        filename: 'activate-card.html',
        chunks: ['common', 'activate-card-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'ActivateValidateApplication',
        filename: 'activate-validate.html',
        chunks: ['common', 'activate-validate-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineBalanceApplication',
        filename: 'mine-balance.html',
        chunks: ['common', 'mine-balance-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineAccumulationApplication',
        filename: 'mine-accumulation.html',
        chunks: ['common', 'mine-accumulation-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineGrowupApplication',
        filename: 'mine-growup.html',
        chunks: ['common', 'mine-growup-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineRechargeApplication',
        filename: 'mine-recharge.html',
        chunks: ['common', 'mine-recharge-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineModifyPasswordApplication',
        filename: 'mine-modify-password.html',
        chunks: ['common', 'mine-modify-password-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'MineResetPasswordApplication',
        filename: 'mine-reset-password.html',
        chunks: ['common', 'mine-reset-password-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'QueueDetailApplication',
        filename: 'queue-detail.html',
        chunks: ['common', 'queue-detail-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'BookDetailApplication',
        filename: 'book-detail.html',
        chunks: ['common', 'book-detail-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'OrderListApplication',
        filename: 'order-list.html',
        chunks: ['common', 'order-list-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'DinnerDetailApplication',
        filename: 'dinner-detail.html',
        chunks: ['common', 'dinner-detail-entry'],
        inject: 'body', template: './src/helper/html-webpack-plugin-template.html',
      }
    ),
    new HtmlWebpackPlugin(
      {
        title: 'TakeoutDetailApplication',
        filename: 'takeout-detail.html',
        chunks: ['common', 'takeout-detail-entry'],
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
