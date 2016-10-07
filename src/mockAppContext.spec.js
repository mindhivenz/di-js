import some from '@mindhive/some'

import { sinon, should } from './mocha'

import { appContext } from './appContext'
import { initModules } from './init'
import { mockAppContext } from './mockAppContext'

/* eslint-disable arrow-body-style */

// REVISIT: would love to get this working with async/await instead by IDEA & Wallaby won't compile it

describe('mockAppContext', () => {

  it('should call func with appContext and passed arguments', () => {
    const func = sinon.spy()
    const args = some.array()
    return mockAppContext(func)(...args)
      .then(() => {
        func.should.have.been.calledWith(appContext, ...args)
      })
  })

  it('should return result of original func', () => {
    const expected = some.object()
    const func = () => expected
    const actual = mockAppContext({}, func)()
    return actual.should.eventually.equal(expected)
  })

  it('should handle func returning a promise', () => {
    const expected = some.object()
    const func = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(expected), 100)
      })
    const actual = mockAppContext({}, func)()
    return actual.should.eventually.equal(expected)
  })

  it('should restore any changes made to appContext', () => {
    return mockAppContext(() => {
      appContext.someObject = some.object()
    })()
      .then(() => {
        appContext.should.be.empty
      })
  })

  it('should apply plain object into appContext and restore afterwards', () => {
    return mockAppContext({ a: 1, b: 2 }, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
      .then(() => {
        appContext.should.be.empty
      })
  })

  it('should call context if it is a function and apply the result', () => {
    const contextFunc = () => ({ a: 1, b: 2 })
    return mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
      .then(() => {
        appContext.should.be.empty
      })
  })

  it('should work with initModules inside context function', () => {
    const module = () => ({ a: 1, b: 2 })
    const contextFunc = () => { initModules([module]) }
    return mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
      .then(() => {
        appContext.should.be.empty
      })
  })

  it('should handle context function throwing after modifying context', () => {
    const goodModule = () => ({ a: 1, b: 2 })
    const badModule = () => { throw new Error() }
    const contextFunc = () => { initModules([goodModule, badModule]) }
    return mockAppContext(contextFunc, () => {})()
      .catch(e => {
        appContext.should.be.empty
        throw e
      })
      .should.be.rejected
  })

  it('should allow context to be optional', () => {
    const func = sinon.spy()
    return mockAppContext(func)()
      .then(() => {
        func.should.have.been.called
      })
  })

  it('should throw if appContext is not initially empty', () => {
    appContext.someContext = some.object()
    should.throw(() => {
      mockAppContext(
        sinon.spy()
      )()
    })
    delete appContext.someContext
  })

  it('should allow nested calls', () => {
    const func = sinon.spy(() => {
      appContext.should.have.keys('firstContext', 'secondContext')
    })
    return mockAppContext({ firstContext: some.object() }, () =>
      mockAppContext({ secondContext: some.object() }, func)()
    )()
      .then(() => {
        func.should.have.been.calledOnce
      })
  })

  it('should restore intermediate context in nested calls', () => {
    const func = sinon.spy()
    return mockAppContext({ firstContext: some.object() }, () =>
      mockAppContext({ secondContext: some.object() }, func)()
        .then(() => {
          appContext.should.have.keys('firstContext')
          appContext.should.not.have.keys('secondContext')
        })
    )()
      .then(() => {
        func.should.have.been.calledOnce
      })
  })

})
