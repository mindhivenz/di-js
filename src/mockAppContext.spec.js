import some from '@mindhive/some'

import { sinon } from './mocha'

import { appContext } from './appContext'
import initModules from './initModules'
import mockAppContext from './mockAppContext'


describe('mockAppContext', () => {

  it('should call func with appContext', async () => {
    const func = sinon.spy()
    await mockAppContext(func)()
    func.should.have.been.calledWith(appContext)
  })

  it('should return result of func', async () => {
    const expected = some.object()
    const func = () => expected
    await mockAppContext({}, func)()
      .should.eventually.equal(expected)
  })

  it('should bubble exception of func', async () => {
    const expected = new Error()
    const func = () => { throw expected }
    await mockAppContext({}, func)()
      .should.be.rejectedWith(expected)
  })

  it('should handle func returning a promise that fulfills', async () => {
    const expected = some.object()
    const func = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(expected), 100)
      })
    await mockAppContext({}, func)()
      .should.eventually.equal(expected)
  })

  it('should handle func returning a promise that rejects', async () => {
    const expected = new Error()
    const func = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => reject(expected), 100)
      })
    await mockAppContext({}, func)()
      .should.be.rejectedWith(expected)
  })

  it('should clear any context left over from previous tests', async () => {
    appContext.someObject = some.object()
    await mockAppContext(() => {
      appContext.should.be.empty
    })()
  })

  it('should apply plain object into appContext', async () => {
    await mockAppContext({ a: 1, b: 2 }, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
  })

  it('should not cleanup appContext at end so timing out tests do not step on others', async () => {
    await mockAppContext({ a: 1, b: 2 }, () => {
    })()
    appContext.should.have.property('a', 1)
    appContext.should.have.property('b', 2)
  })

  it('should call context if it is a function and apply the result', async () => {
    const contextFunc = () => ({ a: 1, b: 2 })
    await mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
  })

  it('should use context if context function returns promise', async () => {
    const contextFunc = async () => ({ a: 1, b: 2 })
    await mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
  })

  it('should work with initModules inside context function', async () => {
    const module = () => ({ a: 1, b: 2 })
    const contextFunc = () => { initModules([module]) }
    await mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
  })

  it('should handle context function throwing after modifying context', async () => {
    const goodModule = () => ({ a: 1, b: 2 })
    const badModule = () => { throw new Error() }
    const contextFunc = () => { initModules([goodModule, badModule]) }
    await mockAppContext(contextFunc, () => {})()
      .should.be.rejected
  })

  it('should allow context to be optional', async () => {
    const func = sinon.spy()
    await mockAppContext(func)()
    func.should.have.been.called
  })

  it('should allow nested calls', async () => {
    const func = sinon.spy(() => {
      appContext.should.have.keys('firstContext', 'secondContext')
    })
    await mockAppContext({ firstContext: some.object() }, () =>
      mockAppContext({ secondContext: some.object() }, func)()
    )()
    func.should.have.been.calledOnce
  })

})
