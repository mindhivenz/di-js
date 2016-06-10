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
      [{}, ...contextAndFunc] :
      contextAndFunc
    const context = (typeof contextObjOrFunc === 'function') ? contextObjOrFunc() : contextObjOrFunc
    const originalAppContext = { ...appContext }
    Object.assign(appContext, context)
    recursiveDepth++
    try {
      return func(...args)
    } finally {
      // REVISIT: If the return from func us a promise should we wait until the
      // promise is resolved before setting appContext back?
      // Mocha it() can handle a promise return.
      recursiveDepth--
      Object.keys(appContext).forEach(key => {
        delete appContext[key]
      })
      Object.assign(appContext, originalAppContext)
    }
  }