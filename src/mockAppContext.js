import { appContext } from './appContext'


let recursiveDepth = 0

// REVISIT: why do tests timeout when I make mockAppContext return an async function?

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
        return Promise.reject(new Error(
          `appContext appears to have objects leftover from a previous test: ${existingKeys}\n` +
          'Did you forget to use mockAppContext() around code that modified the context?'
        ))
      }
    }
    const [contextObjOrFunc, func] = (contextAndFunc.length <= 1) ?
      [{}, ...contextAndFunc] :
      contextAndFunc
    const originalAppContext = { ...appContext }
    recursiveDepth += 1
    const cleanup = () => {
      recursiveDepth -= 1
      Object.keys(appContext).forEach((key) => {
        delete appContext[key]
      })
      Object.assign(appContext, originalAppContext)
    }
    return new Promise((resolve) => {
      const context = (typeof contextObjOrFunc === 'function') ? contextObjOrFunc() : contextObjOrFunc
      if (context) {
        Object.assign(appContext, context)
      }
      resolve(func(appContext, ...args))
    })
      .then(
        (result) => {
          cleanup()
          return result
        },
        (error) => {
          cleanup()
          throw error
        }
      )
  }
