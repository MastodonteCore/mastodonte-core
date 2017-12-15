const { expect } = require('chai');
const runSafely = require('../../utils/runSafely');

describe('runSafely', () => {
  it('should return undefined when function return an error', () => {
    const cb = () => {
      throw new Error('foo');
    }
    expect(runSafely(cb)).to.be.equal(undefined);
  });
  it('should run function', () => {
    const cb = () => 1 + 1;
    expect(runSafely(cb)).to.be.equal(2);
  })
});