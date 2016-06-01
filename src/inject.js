
/*
 Contains all the services, etc. that need to be injected (i.e. Dependency Injection)

 Only exported to enable testing. You shouldn't be accessing this normally.
 */
export const appContext = {}

/*
 Dependency injection

 Wrap any function with an additional first parameter of appContext which can be easily
 destructured.

 For example: when a function takes a single parameter foo but that function also needs to
 use the Meteor service and Bar collection it can be constructed as so:

 const func = ({ Meteor, Bar }, foo) => {
 ...function here...
 })

 export default inject(func)

 The exported function can then be called (passing 1234 as foo) as follows:

 fooFunc(1234)

 This way most of the app becomes pure functions which are easier to understand and test.
 */
export default injectedIntoFunc => {
  if (injectedIntoFunc == null) {
    throw new ReferenceError(`${injectedIntoFunc} passed to inject`)
  }
  if (typeof(injectedIntoFunc) !== 'function') {
    throw new TypeError(`inject called with ${injectedIntoFunc} which is not a function`)
  }
  return (...args) =>
    injectedIntoFunc(appContext, ...args)
}

