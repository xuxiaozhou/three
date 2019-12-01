const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
)

module.exports = {
  entry: {
    main: './src/index.js',
    lottery: './src/lottery.js'
  },
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  devServer: {
    contentBase: './dist'
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
    new CopyWebpackPlugin([{
      from: './public',
      to: resolve('./dist')
    }])
  ],
  devtool: 'source-map'
}