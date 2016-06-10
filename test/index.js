'use strict'

var inject = require('../dist/inject')
var test = require('../dist/mockAppContext')

module.exports = {
  appContext: inject.appContext,
  mockAppContext: test.mockAppContext,
}
