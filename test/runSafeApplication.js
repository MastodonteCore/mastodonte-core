const express = require('express');
const { expect } = require('chai');
const runSafeApplication = require('../lib/runSafeApplication');

const apps = {
  goodApp: 'test/fixtures/expressModule',
  wrongApp: './foo'
}

describe('runSafeApplication', () => {
  it('should undefined on wrong properties', () => {
    expect(runSafeApplication([], [])).to.be.an('undefined');
    expect(runSafeApplication('', '')).to.be.an('undefined');
    expect(runSafeApplication('foo', apps)).to.be.an('undefined');
  });
  it('should error if express module no exist', () => {
    expect(runSafeApplication('wrongApp', apps)).to.Throw;
  })
  it('should return an function', () => {
    expect(typeof runSafeApplication('goodApp', apps)).to.be.equal('function');
  });
});