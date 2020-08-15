const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
);

module.exports = {
  entry: {
    main: './src/index.ts',
    sign3d: './src/sign3d.ts',
    draw: './src/draw.ts',
    barrage: './src/barrage.ts',
    lottery3d: './src/lottery3d.ts'
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
      template: 'template/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      template: 'template/template.html',
      filename: 'lottery3d.html',
      chunks: ['lottery3d']
    }),
    new HtmlWebpackPlugin({
      template: 'template/template.html',
      filename: 'sign3d.html',
      chunks: ['sign3d']
    }),
    new HtmlWebpackPlugin({
      template: 'template/draw.html',
      filename: 'draw.html',
      chunks: ['draw']
    }),
    new HtmlWebpackPlugin({
      template: 'template/template.html',
      filename: 'barrage.html',
      chunks: ['barrage']
    })
  ],
  devtool: 'source-map'
};
