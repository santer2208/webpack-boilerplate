const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const { isDev, projectName } = require('./helpers')
const Glob = require('glob')

const paths = require('./paths')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: '/',
    // filename: 'js/[name].[contenthash].bundle.js',
    filename: 'js/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: false,
              modules: false,
            },
          },
          // 'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              additionalData: `$isDev: ${isDev}; $projectName: '${projectName}';`,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      // filename: 'styles/[name].[contenthash].css',
      filename: 'styles/[name].css',
      chunkFilename: '[id].css',
    }),
    new PurgeCSSPlugin({
      paths: Glob.sync(`${paths.src}/**/*`, { nodir: true }),
      safelist: {
        standard: [
          'collapsing',
          'modal-backdrop',
          ':before',
          ':after',
          'promo-data',
          'visually-hidden',
          'tingle-adult',
        ],
        deep: [/gl-star-rating/, /icon-/, /toast/, /is-active/],
        // deep: [/\.(active|open|show|collapsing|modal-backdrop|modal-open|fade|gl-star-rating)/], lazyloaded
      },
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin({ parallel: true }), '...'],
    // minimizer: [
    //   new CssMinimizerPlugin({
    //     parallel: true,
    //     minimizerOptions: {
    //       preset: [
    //         'default',
    //         {
    //           discardComments: { removeAll: true },
    //         },
    //       ],
    //     },
    //   }),
    // ],
    // runtimeChunk: {
    //   name: 'runtime',
    // },
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})
