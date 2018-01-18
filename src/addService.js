function addService (serviceName, fn) {
  const { settings } = this

  if (settings && settings.services) {
    const { services } = settings

    Object.defineProperty(services, serviceName, {
      value: fn,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }
}
module.exports = addService
