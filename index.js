const Core = require('./src/core')

const core = new Core()

core.settings.addService('stringify', (arg) => JSON.stringify(arg))
core.settings.addService('test', () => console.log('test'))

core.addRoute('get', '/', (req, res) => res.send('Hello World').end())

core.run()
