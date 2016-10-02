'use strict'

var init = require('./dist/init')
var appContext = require('./dist/appContext')

module.exports = {
  initModules: init.initModules,
  app: appContext.app,
}
