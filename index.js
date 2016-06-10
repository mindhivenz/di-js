'use strict'

var init = require('./dist/init')
var inject = require('./dist/inject')

module.exports = {
  initModules: init.initModules,
  inject: inject.default,
}
