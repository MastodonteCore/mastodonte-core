const express = require('express');
const { expect } = require('chai');
const runSafeModule = require('../../lib/runSafeModule');

const apps = {
  goodApp: 'test/fixtures/expressModule',
  wrongApp: './foo'
}

describe('runSafeModule', () => {
  it('should undefined on wrong properties', () => {
    expect(runSafeModule([], [])).to.be.an('undefined');
    expect(runSafeModule('', '')).to.be.an('undefined');
    expect(runSafeModule('foo', apps)).to.be.an('undefined');
    expect(runSafeModule('wrongApp', apps)).to.be.an('undefined');
  });
  it('should return an function', () => {
    expect(typeof runSafeModule('goodApp', apps)).to.be.equal('function');
  });
});