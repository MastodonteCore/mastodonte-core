const path = require('path');
import run from '../utils/run';
const runSafely = require('../utils/runSafely');

export default function runSafeModule(name, apps, args) {
  if (typeof name === 'string' && typeof apps === 'object' && apps[name]) {
    const modPath = path.join(__dirname, '..', apps[name]);
    /* eslint-disable global-require, import/no-dynamic-require */
    const mod = runSafely(() => require(modPath));

    return run(mod, args);
  }
  return undefined;
}
