'use strict'

var init = require('./dist/init')
var appContext = require('./dist/appContext')
var mockAppContext = require('./dist/mockAppContext')

module.exports = {
  initModules: init.initModules,
  app: appContext.app,
  mockAppContext: mockAppContext.mockAppContext,
}
