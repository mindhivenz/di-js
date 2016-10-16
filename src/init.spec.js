import some from '@mindhive/some'

import { sinon, should } from './mocha'
import { mockAppContext } from './mockAppContext'

import { appContext } from './appContext'
import { initModules } from './init'


describe('initModules', () => {

  it('should call the module', () => {
    const module = sinon.spy()
    initModules([module])
    module.should.have.been.calledOnce
  })

  it('should handle the module function returning undefined', () => {
    initModules([() => undefined])
  })

  it('should handle the module function returning an empty object', () => {
    initModules([() => ({})])
  })

  it('should add into the context',
    mockAppContext(() => {
      const expected = {}
      initModules([
        () => ({
          someContext: expected,
        }),
      ])
      appContext.should.have.property('someContext', expected)
    })
  )

  it('should make the context of earlier modules available to later',
    mockAppContext(() => {
      const expected = some.object()
      initModules([
        () => ({
          someContext: expected,
        }),
        ({ someContext }) => {
          someContext.should.equal(expected)
        },
      ])
    })
  )

  it('should not allow duplicate names in context',
    mockAppContext(() => {
      should.throw(() => {
        initModules([
          () => ({
            someContext: some.object(),
          }),
          () => ({
            someContext: some.object(),
          }),
        ])
      }, ReferenceError)
    })
  )

  it('should be callable multiple times',
    mockAppContext(() => {
      initModules([
        () => ({
          firstContext: some.object(),
        }),
      ])
      initModules([
        () => ({
          secondContext: some.object(),
        }),
      ])
      appContext.should.have.property('firstContext')
      appContext.should.have.property('secondContext')
    })
  )

  it('should report which module index is not a function',
    mockAppContext(() => {
      should.throw(() => {
        initModules([
          () => {
          },
          undefined,
          () => {
          },
        ])
      }, /module index 1 \(3 total\) is undefined/)
    })
  )

})
