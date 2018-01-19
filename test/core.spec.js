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

  describe('addService', () => {
    it('should add a property in core.settings.services', (done) => {
      core.settings.addService('stringify', (arg) => JSON.stringify(arg))

      expect(core.settings.services).to.have.property('stringify')     
      done()
    })

    it('should be stringify service usable', (done) => {
      const { services } = core.settings;

      expect(services.stringify([1])).to.equal('[1]')
      done()
    })
  })

  describe('addRoute', () => {
    it('should add an item in core.routes', (done) => {
      core.addRoute('get', '/', (req, res) => res.status(200).end())

      expect(core.routes.length).to.equal(1)
      done()
    })

    it('should return 200 OK', (done) => {    
      core.run()

      request(core.server)
        .get('/')
        .expect(200, done)
    })
  })
})