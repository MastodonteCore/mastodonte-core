function addService (serviceName, fn) {
  const { services } = this

  if (services) {
    Object.defineProperty(services, serviceName, {
      value: fn,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }
}
module.exports = addService
