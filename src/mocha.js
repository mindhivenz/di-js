import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

const should = chai.should()

chai.use(sinonChai)
chai.use(chaiAsPromised)

export { sinon, should }
