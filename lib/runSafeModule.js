const path = require('path');

function runSafeModule(name, apps, args) {
  if (typeof name !== 'string' || typeof apps !== 'object' || !apps[name]) return;

  let instanceApp;

  try {
    /* eslint-disable global-require, import/no-dynamic-require */
    instanceApp = require(path.join(__dirname, '..', apps[name]));
  } catch (e) {
    /* eslint-disable no-console, consistent-return */
    return console.error(
      `[!] ${name} must be a function who return an instance app`,
    );
  }

  return instanceApp(args) || instanceApp;
}

module.exports = runSafeModule;