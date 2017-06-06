import global from 'global'

/*
 Contains all the services, etc. that need to be injected (i.e. Dependency Injection)

 Only exported to enable testing. You shouldn't be accessing this normally.
 */

if (typeof global.appContext === 'undefined') {
  global.appContext = {}
}

export const appContext = global.appContext

// Use a function to give us more possibilities in future
export default () => appContext
