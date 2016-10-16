
/*
 Contains all the services, etc. that need to be injected (i.e. Dependency Injection)

 Only exported to enable testing. You shouldn't be accessing this normally.
 */

if (! global.appContext) {
  global.appContext = {}
}

export const appContext = global.appContext

export const app = () =>
  appContext

