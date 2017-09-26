/*
 Contains all the services, etc. that need to be injected (i.e. Dependency Injection)

 Only exported to enable testing. You shouldn't be accessing this normally.
 */

/* eslint-disable no-undef */

const chooseGlobalNamespace = () => {
  if (typeof window !== 'undefined') {
    return window
  } else if (typeof global !== 'undefined') {
    return global
  } else if (typeof self !== 'undefined') {
    return self
  }
  return {}
}

const globalNamespace = chooseGlobalNamespace()

if (typeof globalNamespace.appContext === 'undefined') {
  globalNamespace.appContext = {}
}

export const appContext = globalNamespace.appContext

// Use a function to give us more possibilities in future
export default () => appContext
