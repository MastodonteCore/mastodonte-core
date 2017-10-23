const { kebabCase } = require('lodash');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

exports.formatFileName = (name) => {
  return kebabCase(name)
}

exports.isDirectory = isDirectory = source => lstatSync(source).isDirectory()

exports.getDirectories = source => 
  readdirSync(source).map(name => ({
    name,
    source: join(source, name)
  })).filter(dir => isDirectory(dir.source))