
/*
 Contains all the services, etc. that need to be injected (i.e. Dependency Injection)

 Only exported to enable testing. You shouldn't be accessing this normally.
 */

const g = global || window || self  // eslint-disable-line no-undef

if (typeof g.appContext === 'undefined') {
  g.appContext = {}
}

export const appContext = g.appContext

export default () =>
  appContext
