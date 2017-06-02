import { appContext } from './appContext'


/*
Add to appContext for testFunc and clean it up at the end

Arguments are: [contextGeneratingFunc | contextObj], testFunc

Most commonly generate the context using a function so it's fresh each test.
It can either return the context object directly or use initModules internally.

Note: this can't be called wrapping a 'describe' function. It only works on 'it'.
 */

const resetAppContext = () => {
  Object.keys(appContext).forEach((key) => {
    delete appContext[key]
  })
}

let recursiveDepth = 0

export default (...contextAndFunc) =>
  async () => {
    if (recursiveDepth === 0) {
      resetAppContext()  // Because timed out tests don't have a chance to cleanup
    }
    const [contextObjOrFunc, testFunc] = (contextAndFunc.length <= 1) ?
      [{}, ...contextAndFunc] :
      contextAndFunc
    // const originalAppContextKeys = Object.keys(appContext)
    recursiveDepth += 1
    try {
      let context = (typeof contextObjOrFunc === 'function') ? contextObjOrFunc() : contextObjOrFunc
      if (context && typeof context.then === 'function') {
        // Don't await if we don't need to because if being called from a fiber, then code after await is run outside
        // the fiber meaning the actual testFunc will run outside of the fiber.
        // Fibers are used by @mindhive/meteor/test/mockServerContext
        context = await context
      }
      if (context) {
        Object.assign(appContext, context)
      }
      return await testFunc(appContext)
    } finally {
      recursiveDepth -= 1
      // Object.keys(appContext).forEach(k => {
      //   if (originalAppContextKeys.indexOf(k) === -1) {
      //     delete appContext[k]
      //   }
      // })
    }
  }

