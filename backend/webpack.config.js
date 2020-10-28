const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  externals: [webpackNodeExternals()],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  target: 'node',
};
