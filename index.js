'use strict'

var initModules = require('./dist/initModules')
var appContext = require('./dist/appContext')
var mockAppContext = require('./dist/mockAppContext')

module.exports = {
  initModules: initModules.default,
  app: appContext.default,
  mockAppContext: mockAppContext.default,
  resetAppContext: mockAppContext.resetAppContext,
}
