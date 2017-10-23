const Promise = require('bluebird')
const pdfService = require('../services/pdf')
const path = require('path');
const fs = require('fs');

exports.getListPdf = () => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(__dirname, '../public/pdf')

    fs.readdir(pdfPath, (err, pdfs) => {
      if (err) return reject(err)

      return resolve(pdfs)
    })
  })
}

exports.getPdf = getPdf = (pdfName) => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(__dirname, `../public/pdf/${pdfName}`);

    if (fs.existsSync(pdfPath)) {
      return resolve(pdfPath)
    } else {
      return reject()
    }
  })
}

exports.buildPdf = (req) => {
  const { html, title } = req.body;

  return pdfService({ html, title });
}

exports.deletePdf = (req) => {
  const { pdfs } = req.body;

  return Promise.all(pdfs.map(file => {
    return getPdf(file)
      .then(pdfPath => fs.unlink(pdfPath))
  }))
}