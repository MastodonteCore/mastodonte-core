const Promise = require('bluebird')
const pdfService = require('../services/pdf')

exports.buildPdf = (req) => {
  const { html, title } = req.body;

  return pdfService({ html, title });
}