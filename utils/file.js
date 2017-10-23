const { kebabCase } = require('lodash');

exports.formatFileName = (name) => {
  return kebabCase(name)
}