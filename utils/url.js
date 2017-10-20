const { URL } = require('url');

exports.getBaseUrl = (url) => {
  const u = new URL(url);

  return u.origin;
}

exports.resolveUrl = (url, baseUrl) => {
  return new URL(url, baseUrl)
}