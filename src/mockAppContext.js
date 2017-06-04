import { appContext } from './appContext'


/*
Add to appContext for testFunc and clean it up at the end

Arguments are: [contextFactory], testFunc

contextFactory can either return a context object directly or use initModules internally.

Note: this can't be called wrapping a 'describe' function. It only works on 'it'.
 */

const resetAppContext = () => {
  Object.keys(appContext).forEach((key) => {
    delete appContext[key]
  })
}

export default (...contextFactoryAndFunc) =>
  async () => {
    resetAppContext()  // Because when mocha kills timed out tests, they don't have a chance to cleanup
    const [contextFactory, testFunc] = (contextFactoryAndFunc.length <= 1) ?
      [null, ...contextFactoryAndFunc] :
      contextFactoryAndFunc
    let context = contextFactory && contextFactory()
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
  }
