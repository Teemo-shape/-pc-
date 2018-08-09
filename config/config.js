const development = require('./dev.env.config') 
const test = require('./test.env.config')
const production = require('./prod.env.config')
const release = require('./release.env.config')

module.exports = {
    development:development,
    test: test,
    production: production,
    release: release,
}[(process.env.NODE_ENV ? process.env.NODE_ENV.trim(): '') || 'development'];
