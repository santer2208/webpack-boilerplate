const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { isDev, projectName } = require('./helpers')
const webpack = require('webpack')

const PostHTML = require('posthtml')
const PostHTMLBeautify = require('posthtml-beautify')
const Nunjucks = require('./nunjucks')

const Path = require('path')
const Glob = require('glob')

const paths = require('./paths')

const generateHtmlWebpackPlugins = (templateDir) =>
  Glob.sync(templateDir).map(
    (dir) =>
      new HtmlWebpackPlugin({
        filename: `${Path.basename(dir, '.njk')}.html`,
        template: dir,
        // inject: false, //Убрал дефолтное встраивание в шапку
        inject: 'body',
        minify: false,
        // head: {
        //   cssChunks: true, //  marker for webpack application styles
        // },
        // body: {
        //   jsChunks: true, //  marker for webpack application scripts
        // },
      })
  )

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/index.js'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].js',
    publicPath: '/',
    clean: true,
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Project Variables
    new webpack.DefinePlugin({
      isDev: JSON.stringify(isDev),
      projectName: JSON.stringify(projectName),
    }),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    // new HtmlWebpackPlugin({
    //   title: 'webpack Boilerplate',
    //   favicon: paths.src + '/images/favicon.png',
    //   template: paths.src + '/template.html', // template file
    //   filename: 'index.html', // output file
    // }),

    ...generateHtmlWebpackPlugins(paths.njk),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      //Nunjunks Files
      // {
      //   test: /\.njk$/,
      //   use: [
      //     {
      //       loader: 'simple-nunjucks-loader',
      //       options: {},
      //     },
      //   ],
      // },
      {
        test: /\.njk$/,
        use: {
          loader: 'html-loader',
          options: {
            preprocessor: (content, loaderContext) => {
              let result

              try {
                if (isDev) {
                  loaderContext.addContextDependency(loaderContext.context)

                  result = Nunjucks.renderString(content) // or `Nunjucks.render(loaderContext.resourcePath)`
                } else {
                  result = PostHTML()
                    .use(PostHTMLBeautify({ rules: { blankLines: false } }))
                    .process(Nunjucks.renderString(content), { sync: true }).html
                }
              } catch (error) {
                loaderContext.emitError(error)

                return content
              }

              return result
            },
            minimize: false,
          },
        },
      },

      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, exclude: /[\\/]node_modules[\\/]/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
}
