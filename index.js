const core = require('./src/core')

core.addService('stringify', (arg) => JSON.stringify(arg))
core.addService('test', () => console.log('test'))

core.add('test', (c) => c.addService('toto', () => 'toto'))

core.run()
