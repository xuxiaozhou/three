const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
);

module.exports = {
  entry: {
    main: './src/index.js',
    lottery: './src/lottery.js',
    danmu: './src/danmu.js',
    draw: './src/draw.js',
  },
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  devServer: {
    contentBase: './dist'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: 'lottery.html',
      filename: 'lottery.html',
      chunks: ['lottery']
    }),
    new HtmlWebpackPlugin({
      template: 'danmu.html',
      filename: 'danmu.html',
      chunks: ['danmu']
    }),
    new HtmlWebpackPlugin({
      template: 'draw.html',
      filename: 'draw.html',
      chunks: ['draw']
    })
  ],
  devtool: 'source-map'
};
