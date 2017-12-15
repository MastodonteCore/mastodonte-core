const path = require('path');
const run = require('../utils/run');
const runSafely = require('../utils/runSafely');

function runSafeModule(name, apps, args) {
  if (typeof name === 'string' && typeof apps === 'object' && apps[name]) {
    const modPath = path.join(__dirname, '..', apps[name]);
    /* eslint-disable global-require, import/no-dynamic-require */
    const mod = runSafely(() => require(modPath));

    return run(mod, args);
  }
  return undefined;
}

module.exports = runSafeModule;
