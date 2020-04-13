const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
  entry: path.resolve(__dirname, 'client/index.js'),
  // target: 'electron-renderer',
  // devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
  // Not using this now, since we need to require the 'renderer' file from dist/index.html when running the electron app
  // (The renderer file isn't needed in the client index.html file when running webpack-dev-server!)
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'client/index.html'),
      filename: 'index.html',
    }),
  ],
};
