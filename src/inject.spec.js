import some from '@mindhive/some'

import { sinon, should } from './mocha'
import { mockAppContext } from './mockAppContext'

import inject from './inject'


describe('inject', () => {

  const context = some.object()
  const args = some.array()

  it('should add the appContext as the first parameter, and original params',
    mockAppContext(context, () => {
      const injectedIntoFunc = sinon.spy()
      const injected = inject(injectedIntoFunc)
      injected(...args)
      injectedIntoFunc.should.have.been.calledWith(context, ...args)
    })
  )

  it('should return result',
    mockAppContext(context, () => {
      const expected = some.object()
      const injectedIntoFunc = () =>
        expected
      const injected = inject(injectedIntoFunc)
      const actual = injected()
      actual.should.equal(expected)
    })
  )

  it('should keep this',
    mockAppContext(context, () => {
      const injectedIntoFunc = sinon.spy()
      const injected = inject(injectedIntoFunc)
      const thisContext = some.object()
      injected.call(thisContext)
      injectedIntoFunc.should.have.been.calledOn(thisContext)
    })
  )

  it('should fail fast when passed undefined', () => {
    should.throw(() => {
      inject(undefined)
    }, ReferenceError)
  })

  it('should fail fast when passed null', () => {
    should.throw(() => {
      inject(null)
    }, ReferenceError)
  })

  it('should fail fast when passed something that is not a function', () => {
    should.throw(() => {
      inject(some.object())
    }, TypeError)
  })
})
