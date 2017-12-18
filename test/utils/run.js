const { expect } = require('chai');
const run = require('../../dist/utils/run').default;

describe('run', () => {
  it('should return undefined when not function', () => {
    expect(run(null)).to.be.equal(undefined);
    expect(run('')).to.be.equal(undefined);
    expect(run({})).to.be.equal(undefined);
  });
  it('should run function', () => {
    const fn = () => 1 + 1;
    expect(run(fn)).to.be.equal(2)
  });

  it('should accept arguments', () => {
    const fn = (arg) => `foo ${arg}`;
    expect(run(fn, 'bar')).to.be.equal('foo bar')
  });
});