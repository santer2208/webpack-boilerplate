const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const paths = require('./paths')

const common = require('./webpack.common')

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // context: paths.src,

  // Spin up a server for quick development
  devServer: {
    // historyApiFallback: true,
    // static: paths.build,
    static: {
      directory: paths.src,
      watch: true,
    },
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  target: 'web',

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
})
