import { appContext } from './inject'

/*
 A module should be defined as the index.js in a directory with a default export of
 a function (appContext).

 A module can add to the appContext by returning an object from this function where
 the properties are the names and objects to add to the appContext. For example:

 export default ({ existingService }) => { newService: new Service(existingService) }

 The order is important as each module adds new services into the context, and then
 the context is passed into the next module. Also, the module functions will be called
 honoring Meteor.startup().
 */

const sanityCheckDuplicateContextName = (newNames) => {
  const existingContextNames = new Set(Object.keys(appContext))
  newNames.forEach(newName => {
    if (existingContextNames.has(newName)) {
      throw new ReferenceError(
        `initModules() with more than one context member called "${newName}"`
      )
    }
  })
}

export const initModules = (modules) => {
  modules.forEach(module => {
    const context = module(appContext)
    if (context) {
      sanityCheckDuplicateContextName(Object.keys(context))
      Object.assign(appContext, context)
    }
  })
}
