const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
)

module.exports = {
  entry: {
    main: './src/index.ts',
    lottery: './src/lottery.ts'
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
    })
  ],
  devtool: 'source-map'
}