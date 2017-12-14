const path = require('path');

function runSafeApplication(name, apps, args) {
  if(typeof name !== 'string' || typeof apps !== 'object' || !apps[name]) return;

  let expressInstance;

  try {
    /* eslint-disable global-require, import/no-dynamic-require */
    expressInstance = require(path.join(__dirname, '..', apps[name]));
  } catch(e) {
    /* eslint-disable no-console */
    return console.error(
      `[!] ${name} must be a function who return an instance app`,
    );
  }

  return expressInstance;
}

module.exports = runSafeApplication;
