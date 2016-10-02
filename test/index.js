'use strict'

var appContext = require('../dist/appContext')
var test = require('../dist/mockAppContext')

module.exports = {
  appContext: appContext.appContext,
  mockAppContext: test.mockAppContext,
}
