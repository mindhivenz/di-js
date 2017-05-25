import { appContext } from './appContext'


let recursiveDepth = 0

/*
Add to appContext for testFunc and clean it up at the end

Arguments are: ([contextGeneratingFunc | contextObj], testFunc)

Most commonly generate the context using a function. It can either return the context object
directly or use initModules internally.

Note: this can't be called wrapping a 'describe' function. It only works on 'it'.
 */

export const resetAppContext = () => {
  Object.keys(appContext).forEach((key) => {
    delete appContext[key]
  })
}

export default (...contextAndFunc) =>
  async () => {
    if (recursiveDepth === 0) {
      const existingKeys = Object.keys(appContext)
      if (existingKeys.length) {
        resetAppContext()
        throw new Error(
          `appContext appears to have objects leftover from a previous test: ${existingKeys}\n` +
          'Did you forget to use mockAppContext() around code that modified the context?'
        )
      }
    }
    const [contextObjOrFunc, testFunc] = (contextAndFunc.length <= 1) ?
      [{}, ...contextAndFunc] :
      contextAndFunc
    const originalAppContext = { ...appContext }
    recursiveDepth += 1
    try {
      const context = (typeof contextObjOrFunc === 'function') ? await contextObjOrFunc() : contextObjOrFunc
      if (context) {
        Object.assign(appContext, context)
      }
      return await testFunc(appContext)
    } finally {
      recursiveDepth -= 1
      resetAppContext()
      Object.assign(appContext, originalAppContext)
    }
  }

