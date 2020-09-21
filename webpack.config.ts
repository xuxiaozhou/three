const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (pathName) => (
  path.resolve(__dirname, pathName)
);
// , 'danmu', 'draw',
const entry = ['barrage', 'index', 'lottery3d', 'sign3d'];

const htmlPlugins = entry.map(name => {
  return new HtmlWebpackPlugin({
    template: `./template/${name}.html`,
    filename: `${name}.html`,
    chunks: [name]
  });
});

const entries = entry.reduce((obj, name) => ({
  ...obj,
  [name]: `./src/view/${name}.ts`
}), {});

module.exports = {
  entry: entries,
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
