const path = require('path')

module.exports = {
  // Source files
  src: path.resolve(__dirname, '../src/'),

  //Nunjunks files
  pages: path.resolve(__dirname, '../src/nunjucks/'),
  njk: path.resolve(__dirname, '../src/nunjucks/*.njk'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),
}
