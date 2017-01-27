import { appContext } from './appContext'


let recursiveDepth = 0

/*
Add to appContext for func and clean it up at the end

Arguments are: ([context,] func)

Context is optional, so you can just pass: (func)

Note: this can't be called wrapping a 'describe' function. It only works on 'it'.
 */
const clearAppContext = () => {
  Object.keys(appContext).forEach((key) => {
    delete appContext[key]
  })
}

export default (...contextAndFunc) =>
  async () => {
    if (recursiveDepth === 0) {
      const existingKeys = Object.keys(appContext)
      if (existingKeys.length) {
        clearAppContext()
        throw new Error(
          `appContext appears to have objects leftover from a previous test: ${existingKeys}\n` +
          'Did you forget to use mockAppContext() around code that modified the context?'
        )
      }
    }
    const [contextObjOrFunc, func] = (contextAndFunc.length <= 1) ?
      [{}, ...contextAndFunc] :
      contextAndFunc
    const originalAppContext = { ...appContext }
    recursiveDepth += 1
    try {
      const context = (typeof contextObjOrFunc === 'function') ? contextObjOrFunc() : contextObjOrFunc
      if (context) {
        Object.assign(appContext, context)
      }
      return await func(appContext)
    } finally {
      recursiveDepth -= 1
      clearAppContext()
      Object.assign(appContext, originalAppContext)
    }
  }
