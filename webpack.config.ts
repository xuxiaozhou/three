const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
);

const entry = ['index', 'lottery', 'danmu', 'draw'];

const htmlPlugins = entry.map(name => {
  return new HtmlWebpackPlugin({
    template: `./template/${name}.html`,
    filename: `${name}.html`,
    chunks: [name]
  });
});

module.exports = {
  entry: entry.reduce((obj, name) => ({
    ...obj,
    [name]: `./src/${name}.js`
  }), {}),
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
    ...htmlPlugins,
  ],
  devtool: 'source-map'
};
