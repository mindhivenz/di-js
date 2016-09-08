import { appContext } from './inject'


let recursiveDepth = 0

/*
Add to appContext for func and clean it up at the end

Arguments are: ([context,] func)

Context is optional, so you can just pass: (func)

Note: this can't be called wrapping a 'describe' function. It only works on 'it'.
 */
export const mockAppContext = (...contextAndFunc) =>
  (...args) => {
    if (recursiveDepth === 0) {
      const existingKeys = Object.keys(appContext)
      if (existingKeys.length) {
        throw new Error(
          `appContext appears to have objects leftover from a previous test: ${existingKeys}\n` +
          'Did you forget to use mockAppContext() around code that modified the context?'
        )
      }
    }
    const [contextObjOrFunc, func] = (contextAndFunc.length <= 1) ?
      [{}, contextAndFunc] :
      contextAndFunc
    const originalAppContext = { ...appContext }
    recursiveDepth++
    try {
      const context = (typeof contextObjOrFunc === 'function') ? contextObjOrFunc() : contextObjOrFunc
      if (context) {
        Object.assign(appContext, context)
      }
      return func(...args)
    } finally {
      // REVISIT: If the return from func is a promise should we wait until the
      // promise is resolved before setting appContext back?
      // Mocha it() can handle a promise return.
      recursiveDepth--
      Object.keys(appContext).forEach(key => {
        delete appContext[key]
      })
      Object.assign(appContext, originalAppContext)
    }
  }
