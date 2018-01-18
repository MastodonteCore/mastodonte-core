const Core = require('../src/core')
const { expect } = require('chai');
const request = require('supertest')

describe('Class Core', () => {
  const core = new Core();

  describe('initialize', () => {
    it('should initialize', (done) => {
      expect(core).to.be.a('object')
      expect(core).to.have.property('app')
      expect(core).to.have.property('settings')
      expect(core).to.have.property('modules')
      expect(core).to.have.property('routes')
      done()
    })
  })

  describe('addRoute', () => {
    it('should return 200 OK', (done) => {
      core.addRoute('get', '/', (req, res) => res.status(200).end())
      core.run()

      request(core.app)
        .get('/')
        .expect(200, done)
    })
  })
})