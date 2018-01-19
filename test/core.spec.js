const Core = require('../src/core')
const { expect } = require('chai')
const request = require('supertest')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

describe('Class Core', () => {
  const core = new Core();

  after((done) => {
    if (mongoose.connection.db) {
      mongoose.connection.close()
    }
    done()
  })

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

  describe('add', () => {
    it('should add a module in core.modules', (done) => {
      core.add('foo', () => {
        router.get('/', (req, res) => res.send('bar').end())
        router.get('/bar', (req, res) => res.send('foo bar').end())
        return router
      })
      expect(core.modules.length).to.equal(1)
      expect(core.modules[0]).to.have.property('appRoute')
      expect(core.modules[0]).to.have.property('appModule')
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
  })

  describe('GET /', () => { 
    it('should return 200 OK', (done) => {
      core.run()
      
      request(core.server)
        .get('/')
        .expect(200, done)
    })
  })

  describe('GET /foo', () => {
    it('should return 200 OK', (done) => {
      request(core.server)
        .get('/foo')
        .expect(200, done)
    })
  })

  describe('GET /foo/bar', () => {
    it('should return 200 OK', (done) => {
      request(core.server)
        .get('/foo/bar')
        .expect(200, done)
    })
  })
})