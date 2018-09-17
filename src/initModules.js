import { appContext } from './appContext'

/*
 A module should be defined as default export as a function the takes (appContext).

 A module can add to the appContext by returning an object from this function where
 the properties are the names and objects to add to the appContext. For example:

 export default ({ existingService }) => { newService: new Service(existingService) }

 The order is important as each module adds new services into the context, and then
 the context is passed into the next module.
 */

const sanityCheckModules = (modules) => {
  modules.forEach((m, i) => {
    if (typeof m !== 'function') {
      throw new Error(`initModules() module index ${i} (of ${modules.length}) is ${typeof m}, should be function`)
    }
  })
}

const sanityCheckDuplicateContextName = (newNames) => {
  const existingContextNames = new Set(Object.keys(appContext))
  newNames.forEach((newName) => {
    if (existingContextNames.has(newName)) {
      throw new ReferenceError(
        `initModules() with more than one context member called "${newName}"`
      )
    }
  })
}

export default (modules) => {
  sanityCheckModules(modules)
  modules.forEach((module, i) => {
    try {
      const moduleContext = module(appContext)
      if (moduleContext) {
        sanityCheckDuplicateContextName(Object.keys(moduleContext))
        Object.assign(appContext, moduleContext)
      }
    } catch (e) {
      console.info(`initModules() module index ${i} (of ${modules.length}) threw`, e) // eslint-disable-line no-console
      throw e
    }
  })
}
