import { initModules } from './init'
import inject, { appContext } from './inject'
import { mockAppContext } from './test'


module.exports = {
  initModules,
  inject,
  test: {
    appContext,
    mockAppContext,
  },
}
