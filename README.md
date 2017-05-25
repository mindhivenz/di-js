# Dependency injection

We have built our own super simple DI. 

## Install

`npm install @mindhive/di`

## Motivations and benefits

- Prefer pure functions
- Avoid ES6 imports as they are difficult to test
- Especially avoid Meteor package imports as most test runners don't understand Meteor's packaging
	(they can be accessed through Meteor globals but that's not a great idea either)
  	
## Lifecycle

1. Main file for the app should import all of it's modules using `initModules()` 

2. Modules should export a default function

	- For example: `export default () => { ...; return { serviceName: new Service(), ... } }`	
	- Return an object where the keys map service names to the service objects/functions to be 
		put into the app context
	- Modules further down thru the array passed to `initModules()` can use services added to the 
		appContext by earlier modules. The module function is passed the current appContext 
		(destructing works a treat), for example: 
		`export default ({ Meteor, Mongo }) => { ... }`
    - Modules don't have to return anything, you can use them to perform other initialization
    - Modules are called inside `Meteor.startup` so there is no need to manage that yourself

3. To access services in the appContext call `app()` to get the appContext

## Testing

In the example below `service` will be the only object in the appContext and available to any
code that calls `app()`. 

```javascript
import { mockAppContext } from '@mindhive/di'
const modules = () => ({ 
  service: { foo: sinon.spy() }  
}) 
it('should call service.foo()', 
  mockAppContext(modules, () => { 
    funcUnderTest()
    service.foo.should.have.been.calledOnce      	
  })
)
````

`modules` is a function so that the spys and dummy values used in it 
are recreated every test, avoiding any contamination to the next test.

However, if your test runner doesn't teardown the tests properly it 
may be necessary to use `resetAppContext`. 

You can also use `initModules` within the 'modules' function, it operates
exactly as it would in production code.
