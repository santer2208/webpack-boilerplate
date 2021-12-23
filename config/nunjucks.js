const Nunjucks = require('nunjucks')

const paths = require('./paths')

const env = Nunjucks.configure(paths.pages, {
  noCache: true,
})

env.addGlobal('projectName', process.env.NODE_PROJECT)

module.exports = Nunjucks
