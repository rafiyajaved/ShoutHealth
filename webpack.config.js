/* jslint node: true, esnext: true */
'use strict';

const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
var PouchDB = require('pouchdb');

PouchDB.plugin(require('pouchdb-quick-search'));

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
};

process.env.BABEL_ENV = ENV;

const common = {
  entry: [
    //'webpack-dev-server/client?http://0.0.0.0:80',
    PATHS.src,
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css?url=false'],
      include: PATHS.src,
    }, {
      test: /\.(jpg|jpeg|png|svg)$/,
      loader: 'file-loader',
    }, {
      test: /\.jsx?$/,
      loader: 'babel?cacheDirectory',
      include: PATHS.src,
    }]
  }
};

if (ENV === 'development') {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      host: '0.0.0.0',
      disableHostCheck: true,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
} else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {});
}
