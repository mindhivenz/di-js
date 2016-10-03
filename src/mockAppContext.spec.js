import some from '@mindhive/some'

import { sinon, should } from './mocha'

import { appContext } from './appContext'
import { initModules } from './init'
import { mockAppContext } from './mockAppContext'


describe('mockAppContext', () => {

  it('should call func with appContext and passed arguments', () => {
    const func = sinon.spy()
    const args = some.array()
    mockAppContext(func)(...args)
    func.should.have.been.calledWith(appContext, ...args)
  })

  it('should return result of original func', () => {
    const expected = some.object()
    const func = () => expected
    const actual = mockAppContext({}, func)()
    actual.should.equal(expected)
  })

  it('should restore any changes made to appContext', () => {
    mockAppContext(() => {
      appContext.someObject = some.object()
    })()
    appContext.should.be.empty
  })

  it('should apply plain object into appContext and restore afterwards', () => {
    mockAppContext({ a: 1, b: 2 }, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
    appContext.should.be.empty
  })

  it('should call context if it is a function and apply the result', () => {
    const contextFunc = () => ({ a: 1, b: 2 })
    mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
    appContext.should.be.empty
  })

  it('should work with initModules inside context function', () => {
    const module = () => ({ a: 1, b: 2 })
    const contextFunc = () => { initModules([module]) }
    mockAppContext(contextFunc, () => {
      appContext.should.have.property('a', 1)
      appContext.should.have.property('b', 2)
    })()
    appContext.should.be.empty
  })

  it('should handle context function throwing after modifying context', () => {
    const goodModule = () => ({ a: 1, b: 2 })
    const badModule = () => { throw new Error() }
    const contextFunc = () => { initModules([goodModule, badModule]) }
    should.throw(() => {
      mockAppContext(contextFunc, () => {})()
    })
    appContext.should.be.empty
  })

  it('should allow context to be optional', () => {
    const func = sinon.spy()
    mockAppContext(func)()
    func.should.have.been.called
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
    mockAppContext({ firstContext: some.object() }, () => {
      mockAppContext({ secondContext: some.object() }, func)()
    })()
    func.should.have.been.calledOnce
  })

  it('should restore intermediate context in nested calls', () => {
    const func = sinon.spy()
    mockAppContext({ firstContext: some.object() }, () => {
      mockAppContext({ secondContext: some.object() }, func)()
      appContext.should.have.keys('firstContext')
      appContext.should.not.have.keys('secondContext')
    })()
    func.should.have.been.calledOnce
  })

})
