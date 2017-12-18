const { expect } = require('chai');
const index = require('../index');

describe('mastodonte', () => {
  it('should be an object', () => {
    expect(typeof index).to.be.an('object');
  })
})