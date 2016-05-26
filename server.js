const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
}).listen(3000, process.env.DEV_HOST, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(`Listening at ${process.env.DEV_HOST}:3000`);
});
